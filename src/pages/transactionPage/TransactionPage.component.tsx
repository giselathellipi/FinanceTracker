import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";

//components
import CustomPieChart from "components/pieChart/PieChart.component";
import EditTransactionModal from "components/editTransactionModal/EditTransactionModal.component";
import SummarySection from "components/summarySection/SummarySection.component";

//styles
import { FiltersContainer, IconsContainer, PieChartContainer, SummaryAndChartContainer, SummarySectionContainer, TransactionsTableContainer } from "./TransactionPage.style";

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
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Transaction>("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { t } = useTranslation();

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingTransaction({ ...transactions[index] });
    setOpenEditModal(true);
  };

  const handleSaveEdit = (updated: Transaction) => {
    if (editingIndex === null) return;
    const updatedTransactions = [...transactions];
    updatedTransactions[editingIndex] = updated;
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setOpenEditModal(false);
  };

  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await axios.get("https://api.exchangerate.host/latest?base=EUR");
        setRates(res.data.rates);
      } catch (err) {
        console.error("Failed to fetch rates:", err);
      }
    };
    fetchRates();
  }, []);

  const handleDelete = (index: number) => {
    const updated = transactions.filter((_, i) => i !== index);
    setTransactions(updated);
    localStorage.setItem("transactions", JSON.stringify(updated));
  };

  const handleSort = (property: keyof Transaction) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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

  const convertToEUR = (amount: number | string, currency: string) => {
    if (!rates || !currency || currency === "EUR") return Number(amount).toFixed(2);
    const rate = rates[currency];
    if (!rate) return "N/A";
    return (Number(amount) / rate).toFixed(2);
  };

  const formatDateForTable = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-");
  return `${month}/${day}/${year}`;
  };

  return (
    <Paper style={{ padding: 16, display: "flex", flexDirection: "column", gap: 24 }}>
      <SummaryAndChartContainer>
        <PieChartContainer style={{ flex: 1 }} ><CustomPieChart
        transactions={transactions.map((t) => ({
        ...t,
        amount_eur: Number(t.amount)
      }))}
      />
      </PieChartContainer>
      <SummarySectionContainer><SummarySection /></SummarySectionContainer>
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
          {Array.from(new Set(transactions.map((t) => t.category))).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
        <TextField
          type="date"
          // label={t("start_date")}
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            if (endDate && e.target.value > endDate) setEndDate(e.target.value);
          }}
          // InputLabelProps={{
          // shrink: !!endDate,
          // }}
        />
        <TextField
          type="date"
          // label={t("end_date")}
          value={endDate}
          onChange={(e) => {
            if (startDate && e.target.value < startDate) {
              alert(t("end_date_alert"));
              return;
            }
            setEndDate(e.target.value);
          }}
  //         InputLabelProps={{
  //         shrink: !!endDate,
  // }}
        />
      </FiltersContainer>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { key: "date", label: t("date") },
                { key: "description", label: t("description") },
                { key: "category", label: t("category") },
                { key: "type", label: t("type") },
                { key: "amount", label: t("amount") },
                { key: "amount_eur", label: t("amount_eur") },
                { key: "actions", label: t("actions") },
              ].map((col) => (
                <TableCell key={col.key}>
                  {col.key === "date" || col.key === "amount" ? (
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? order : "asc"}
                      onClick={() => handleSort(col.key as keyof Transaction)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((t, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDateForTable(t.date)}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell>
                    {t.amount} {t.currency}
                  </TableCell>
                  <TableCell>{convertToEUR(t.amount, t.currency)} EUR</TableCell>
                  <TableCell>
                    <IconsContainer>
                      <DeleteOutlineIcon
                        onClick={() => handleDelete(index)}
                        style={{ cursor: "pointer" }}
                      />
                      <EditIcon
                        onClick={() => handleEdit(index)}
                        style={{ cursor: "pointer" }}
                      />
                    </IconsContainer>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditTransactionModal
        open={openEditModal}
        transaction={editingTransaction}
        categories={Array.from(new Set(transactions.map((t) => t.category)))}
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
