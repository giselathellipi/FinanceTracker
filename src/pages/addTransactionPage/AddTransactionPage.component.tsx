import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

//styles
import {
  AddTransactionContainer,
  AddTransactionFormHolder,
  TransactionTitle,
} from "./AddTransactionPage.style";

//components
import GenericInput from "components/genericInput/GenericInput.component";
import GenericDropdown from "components/genericDropdown/GenericDropdown.component";
import GenericButton from "components/genericButton/GenericButton.component";

interface Transaction {
  date?: string;
  description: string;
  amount: number | string;
  type: "Income" | "Expense" | "";
  category: string;
  currency: string;
}

interface Currency {
  code: string;
  name: string;
}

const AddTransactionPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [transaction, setTransaction] = useState<Transaction>({
    description: "",
    amount: "",
    type: "",
    category: "",
    currency: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Load categories from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("categories");
    if (stored) {
      setCategories(JSON.parse(stored));
    } else {
      const defaults = ["Food", "Rent", "Salary"];
      setCategories(defaults);
      localStorage.setItem("categories", JSON.stringify(defaults));
    }
  }, []);

  // Add new category
  const handleAddCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (trimmed && !categories.includes(trimmed)) {
      const updated = [...categories, trimmed];
      setCategories(updated);
      localStorage.setItem("categories", JSON.stringify(updated));
    }
  };

  // Get currencies from API
  useEffect(() => {
    axios.get("https://open.er-api.com/v6/latest/EUR").then((res) => {
      const data = Object.keys(res.data.rates).map((key) => ({
        code: key,
        name: key,
      }));
      setCurrencies(data);
    });
  }, []);

  // Handle input change
  const handleChange = (field: keyof Transaction, value: any) => {
    setTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction.description || !transaction.amount || !transaction.type || !transaction.currency) {
      alert(t("please_fill_all_fields"));
      return;
    }

    const stored = JSON.parse(localStorage.getItem("transactions") || "[]");
    const updated = [...stored, transaction];
    localStorage.setItem("transactions", JSON.stringify(updated));
    alert(t("transaction_submitted"));
    navigate("/transactionPage");
    setTransaction({
      description: "",
      amount: "",
      type: "",
      category: "",
      currency: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const typeOptions = [
    { label: t("income"), value: "Income" },
    { label: t("expense"), value: "Expense" },
  ];

  const categoryOptions = categories.map((c) => ({ label: c, value: c }));

  const currencyOptions = currencies.map((c) => ({
    label: c.code,
    value: c.code,
  }));

  return (
    <AddTransactionContainer>
      <AddTransactionFormHolder onSubmit={handleSubmit}>
        <TransactionTitle>{t("add_transaction")}</TransactionTitle>
        <GenericInput
          value={transaction.description}
          onChange={(v) => handleChange("description", v)}
          placeholder={t("enter_description")}
        />
        <GenericInput
          type="number"
          value={transaction.amount.toString()}
          onChange={(v) => handleChange("amount", Number(v))}
          placeholder={t("enter_amount")}
        />
        <GenericDropdown
          value={transaction.type}
          options={typeOptions}
          placeholder={t("select_type")}
          onChange={(v) => handleChange("type", v)}
        />
        <GenericDropdown
          value={transaction.category}
          options={categoryOptions}
          placeholder={t("select_category")}
          allowAddNew={true}
          onAddNew={handleAddCategory}
          onChange={(v) => handleChange("category", v)}
        />
        <GenericDropdown
          value={transaction.currency}
          options={currencyOptions}
          placeholder={t("select_currency")}
          onChange={(v) => handleChange("currency", v)}
        />
        <GenericButton name={t("submit")} onClick={()=>handleSubmit} />
      </AddTransactionFormHolder>
    </AddTransactionContainer>
  );
};

export default AddTransactionPage;
