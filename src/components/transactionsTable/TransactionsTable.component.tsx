import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { IconsContainer } from "./TransactionsTable.style";

interface Transaction {
  description: string;
  amount: number | string;
  type: "Income" | "Expense";
  category: string;
  currency: string;
  date: string;
}

type Order = "asc" | "desc";

interface TransactionsTableProps {
  transactions: Transaction[];
  filtered: Transaction[];
  order: Order;
  orderBy: keyof Transaction;
  displayCurrency: string;
  rates: { [key: string]: number };
  page: number;
  rowsPerPage: number;
  handleSort: (property: keyof Transaction) => void;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
}

const TransactionsTable: FC<TransactionsTableProps> = ({
  filtered,
  order,
  orderBy,
  rates,
  displayCurrency,
  page,
  rowsPerPage,
  handleSort,
  handleEdit,
  handleDelete,
}) => {
  const { t } = useTranslation();

  const convert = (amount: number | string, currency: string) => {
    if (!rates[currency] || currency === displayCurrency)
      return Number(amount).toFixed(2);
    const rate = rates[displayCurrency] / rates[currency];
    return (Number(amount) * rate).toFixed(2);
  };

  const formatDate = (date: string) => date.split("-").reverse().join("/");

  const columns = [
    { key: "date", label: t("date"), sortable: true },
    { key: "description", label: t("description") },
    { key: "category", label: t("category") },
    { key: "type", label: t("type") },
    { key: "amount", label: t("amount"), sortable: true },
    { key: "amount_display", label: t("amount_eur") },
    { key: "actions", label: t("actions") },
  ];

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(({ key, label, sortable }) => (
              <TableCell key={key}>
                {sortable ? (
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : "asc"}
                    onClick={() => handleSort(key as keyof Transaction)}
                  >
                    {label}
                  </TableSortLabel>
                ) : (
                  label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginated.map((t, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(t.date)}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell>{t.type}</TableCell>
              <TableCell>
                {t.amount} {t.currency}
              </TableCell>
              <TableCell>
                {convert(t.amount, t.currency)} {displayCurrency}
              </TableCell>
              <TableCell>
                <IconsContainer style={{ display: "flex", gap: 8 }}>
                  <DeleteOutlineIcon
                    onClick={() => handleDelete(index)}
                    sx={{ cursor: "pointer" }}
                  />
                  <EditIcon
                    onClick={() => handleEdit(index)}
                    sx={{ cursor: "pointer" }}
                  />
                </IconsContainer>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionsTable;
