import  { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useTranslation } from "react-i18next";

//components
import GenericButton from "components/genericButton/GenericButton.component";

interface Transaction {
  description: string;
  amount: number | string;
  type: "Income" | "Expense";
  category: string;
  currency: string;
  date: string;
}

interface EditTransactionModalProps {
  open: boolean;
  transaction: Transaction | null;
  categories: string[]; 
  onClose: () => void;
  onSave: (updated: Transaction) => void;
}

const EditTransactionModal: FC<EditTransactionModalProps> = ({
  open,
  transaction,
  categories,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Transaction>({
    description: "",
    amount: "",
    type: "Expense",
    category: "",
    currency: "EUR",
    date: "",
  });

  const { t } = useTranslation();
  const [currencies, setCurrencies] = useState<{ code: string; name: string }[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoadingCurrencies(true);
      try {
        const res = await axios.get("https://open.er-api.com/v6/latest/EUR");
        if (res.data?.rates) {
          const data = Object.keys(res.data.rates).map((key) => ({
            code: key,
            name: key,
          }));
          setCurrencies(data);
        }
      } catch (err) {
        console.error("Failed to load currencies:", err);
      } finally {
        setLoadingCurrencies(false);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
    }
  }, [transaction]);

  const handleChange = (field: keyof Transaction, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const allCategories = Array.from(
    new Set([...categories, formData.category].filter(Boolean))
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("edit_transaction")}</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          minWidth: 340,
          marginTop: 8,
        }}
      >
        <TextField
          type="date"
          label={t("date")}
          value={formData.date || ""}
          onChange={(e) => handleChange("date", e.target.value)}
          // InputLabelProps={{ shrink: true }}
        />
        <TextField
          label={t("description")}
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <TextField
        select
        label={t("category")}
        value={formData.category || ""}
        onChange={(e) => handleChange("category", e.target.value)}
        fullWidth
        variant="outlined"
        >
        <MenuItem value="">{t("select_category")}</MenuItem>
        {allCategories.map((cat) => (
        <MenuItem key={cat} value={cat}>
        {cat}
        </MenuItem>
        ))}
       </TextField>
       <TextField
       select
       label={t("type")}
       value={formData.type || ""}
       onChange={(e) => handleChange("type", e.target.value)}
       fullWidth
       variant="outlined"
       >
       <MenuItem value="Income">{t("income")}</MenuItem>
      <MenuItem value="Expense">{t("expense")}</MenuItem>
      </TextField>
        <TextField
          label={t("amount")}
          type="number"
          value={formData.amount || ""}
          onChange={(e) => handleChange("amount", Number(e.target.value))}
        />
        {loadingCurrencies ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CircularProgress size={20} /> <span>{t("loading_currencies")}</span>
          </div>
        ) : (
          <TextField
          select
          label={t("Currency")}
          value={formData.currency || ""}
          onChange={(e) => handleChange("currency", e.target.value)}
          fullWidth
          variant="outlined"
          >
         <MenuItem value="">{t("select_currency")}</MenuItem>
         {currencies.map((c) => (
         <MenuItem key={c.code} value={c.code}>
         {c.code}
         </MenuItem>
         ))}
         </TextField>
         )}
         </DialogContent>
         <DialogActions>
         <GenericButton name={t("save")} onClick={handleSave} />
         <GenericButton name={t("cancel")} onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
};

export default EditTransactionModal;
