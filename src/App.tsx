import { FC, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

//components
import AddTransactionPage from "pages/addTransactionPage/AddTransactionPage.component";
import TransactionsPage from "pages/transactionPage/TransactionPage.component";
import Navbar from "components/navbar/Navbar.component";
import CustomPieChart from "components/pieChart/PieChart.component";

interface Transaction {
  type: "Income" | "Expense";
  amount: number | string;
  currency: string;
  amount_eur?: number;
}

const App: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [displayCurrency, setDisplayCurrency] = useState("EUR");

  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  useEffect(() => {
    axios
      .get(`https://open.er-api.com/v6/latest/${displayCurrency}`)
      .then((res) => setRates(res.data.rates))
      .catch((err) => console.error("Error fetching currency rates:", err));
  }, [displayCurrency]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<AddTransactionPage />} />
        <Route path="/transactionPage" element={<TransactionsPage />} />
        <Route
          path="/pieChart"
          element={
            <CustomPieChart
              transactions={transactions}
              displayCurrency={displayCurrency}
              rates={rates}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
