import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

//styles
import { SummaryContainer, SummaryBox } from "./SummarySection.style";

interface Transaction {
  description: string;
  amount: number | string;
  type: "Income" | "Expense";
  category: string;
  currency: string;
}

interface Currency {
  code: string;
  name: string;
}

const SummarySection: FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [displayCurrency, setDisplayCurrency] = useState("EUR");
  const [currencies, setCurrencies] = useState<Currency[]>([]);

 useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

 useEffect(() => {
  const handleStorageChange = () => {
    const stored = localStorage.getItem("transactions");
    if (stored) setTransactions(JSON.parse(stored));
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

useEffect(() => {
  if (!displayCurrency) return;

  axios
    .get(`https://open.er-api.com/v6/latest/${displayCurrency}`)
    .then((res) => {
      setRates(res.data.rates);
      const data = Object.keys(res.data.rates).map((key) => ({
        code: key,
        name: key,
      }));
      setCurrencies(data);
    })
    .catch((err) => console.error("Error fetching currency rates:", err));
}, [displayCurrency]);


const convertToDisplayCurrency = (amount: number | string, currency: string) => {
  if (!rates || !rates[currency]) return Number(amount);
  if (currency === displayCurrency) return Number(amount);
  const rateToDisplay = rates[displayCurrency] / rates[currency];
  return Number(amount) * rateToDisplay;
};


  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, t) => acc + convertToDisplayCurrency(Number(t.amount), t.currency), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => acc + convertToDisplayCurrency(Number(t.amount), t.currency), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <SummaryContainer>
      <SummaryBox>
        <h1>{t("title")}</h1>
        <p><strong>{t("total_income")}:</strong> {totalIncome.toFixed(2)} {displayCurrency}</p>
        <p><strong>{t("total_expenses")}:</strong> {totalExpenses.toFixed(2)} {displayCurrency}</p>
        <p>
        <strong>{t("balance")}:</strong>  <span style={{ color: balance >= 0 ? "#63ca5bff" : "#e73f33ff", fontWeight: "bold" }}>
        {balance.toFixed(2)} {displayCurrency}
        </span>
        </p>
        <label>
         <p><strong>{t("displayCurrency")}:</strong> <select
            value={displayCurrency}
            onChange={(e) => setDisplayCurrency(e.target.value)}
          >
            {currencies.length > 0 ? (
              currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}
                </option>
              ))
            ) : (
              <option>Loading...</option>
            )}
          </select>
          </p>
        </label>
      </SummaryBox>
    </SummaryContainer>
  );
};

export default SummarySection;
