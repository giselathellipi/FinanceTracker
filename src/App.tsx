import { FC, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

const App: FC<{}> = () => {
const [transactions, setTransactions] = useState<Transaction[]>([]);
const rates: { [key: string]: number } = {}; 

const convertToEUR = (amount: number | string, currency: string) => {
  if (!rates || !currency || currency === "EUR") return Number(amount).toFixed(2);
  const rate = rates[currency];
  if (!rate) return "N/A";
  return (Number(amount) / rate).toFixed(2);
};

  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) setTransactions(JSON.parse(stored));
  }, []);
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path="/" element={<AddTransactionPage/>}/>
    <Route path="/transactionPage" element={<TransactionsPage/>}/>
    <Route
          path="/pieChart"
          element={<CustomPieChart
            transactions={transactions.map((t) => ({
              ...t,
              amount_eur: Number(convertToEUR(t.amount, t.currency))
            }))}
          />}
        />
    </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;


