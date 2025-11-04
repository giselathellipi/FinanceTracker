import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";

//components
import CustomPieChart from "components/pieChart/PieChart.component";
import EditTransactionModal from "components/editTransactionModal/EditTransactionModal.component";
import SummarySection from "components/summarySection/SummarySection.component";
import TransactionsTable from "components/transactionsTable/TransactionsTable.component";

//styles
import {
  FiltersContainer,
  PieChartContainer,
  SummaryAndChartContainer,
  SummarySectionContainer,
  TransactionsTableContainer,
} from "./TransactionPage.style";


interface Transaction {
  description: string;
  amount: number | string;
  type: "Income" | "Expense";
  category: string;
  currency: string;
  date: string;
}
type Order = "asc" | "desc";

const TransactionsPage: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [displayCurrency, setDisplayCurrency] = useState("EUR");
  const [openEditModal, setOpenEditModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Transaction>("date");
  const { t } = useTranslation();

  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories") || "[]");
    setCategories(storedCategories);
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get(`https://open.er-api.com/v6/latest/${displayCurrency}`);
        setRates(res.data.rates);
      } catch (err) {
        console.error("Failed to fetch rates:", err);
      }
    };
    fetchRates();
  }, [displayCurrency]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => setAlertMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleSaveEdit = (updated: Transaction) => {
    if (editingIndex === null) return;
    const updatedTransactions = [...transactions];
    updatedTransactions[editingIndex] = updated;
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setOpenEditModal(false);
  };
  const filtered = transactions
      .filter((t) => t.description.toLowerCase().includes(search.toLowerCase()))
      .filter((t) => (filterType ? t.type === filterType : true))
      .filter((t) => (filterCategory ? t.category === filterCategory : true))
      .filter((t) => (startDate ? t.date >= startDate : true))
      .filter((t) => (endDate ? t.date <= endDate : true))
      .sort((a, b) => {
        if (orderBy === "amount") {
          return order === "asc"
            ? Number(a.amount) - Number(b.amount)
            : Number(b.amount) - Number(a.amount);
        } else if (orderBy === "date") {
          return order === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });
  

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Paper style={{ padding: 16, display: "flex", flexDirection: "column", gap: 24 }}>
      <SummaryAndChartContainer>
        <PieChartContainer style={{ flex: 1 }}>
          <CustomPieChart
            transactions={transactions.map((t) => ({
              ...t,
              amount_eur: Number(t.amount),
            }))}
          />
        </PieChartContainer>
        <SummarySectionContainer>
          <SummarySection />
        </SummarySectionContainer>
      </SummaryAndChartContainer>
      <TransactionsTableContainer>
        <h1>{t("transactions")}</h1>
                <FiltersContainer>
          <TextField
            label={t("search_description")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={filterType}
            displayEmpty
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="">{t("all_types")}</MenuItem>
            <MenuItem value="Income">{t("income")}</MenuItem>
            <MenuItem value="Expense">{t("expense")}</MenuItem>
          </Select>
          <Select
            value={filterCategory}
            displayEmpty
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <MenuItem value="">{t("all_categories")}</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
          <TextField
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (endDate && e.target.value > endDate) setEndDate(e.target.value);
            }}
          />
          <TextField
            type="date"
            value={endDate}
            onChange={(e) => {
              if (startDate && e.target.value < startDate) {
                setAlertMessage("End date cannot be before start date!");
                return;
              }
              setEndDate(e.target.value);
              setAlertMessage(null);
            }}
          />
        </FiltersContainer>
      <TransactionsTable
        transactions={transactions}
        filtered={filtered}
        order={order}
        orderBy={orderBy}
        rates={rates}
        displayCurrency={displayCurrency}
        page={page}
        rowsPerPage={rowsPerPage}
        handleSort={(property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
        }}
        handleEdit={(index) => {
        setEditingIndex(index);
        setEditingTransaction({ ...transactions[index] });
        setOpenEditModal(true);
        }}
        handleDelete={(index) => {
        const updated = transactions.filter((_, i) => i !== index);
        setTransactions(updated);
        localStorage.setItem("transactions", JSON.stringify(updated));
       }}
     />
        {alertMessage && (
          <Alert
            severity="error"
            onClose={() => setAlertMessage(null)}
            sx={{ marginBottom: 2 }}
          >
            {alertMessage}
          </Alert>
        )}
        <EditTransactionModal
          open={openEditModal}
          transaction={editingTransaction}
          categories={categories}
          onClose={() => setOpenEditModal(false)}
          onSave={handleSaveEdit}
        />
        <TablePagination
          sx={{ display: "flex", justifyContent: "flex-end" }}
          rowsPerPageOptions={[5, 10]}
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t("rows_per_page")}
        />
      </TransactionsTableContainer>
    </Paper>
  );
};

export default TransactionsPage;
