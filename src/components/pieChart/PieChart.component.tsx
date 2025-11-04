import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";

interface Transaction {
  type: "Income" | "Expense";
  amount: number | string;
  currency: string;
}

interface Props {
  transactions: Transaction[];
  displayCurrency: string;
  rates: { [key: string]: number };
}

const COLORS = ["#63ca5bff", "#e73f33ff"];

const CustomPieChart: React.FC<Props> = ({ transactions, displayCurrency, rates }) => {
  const convertToDisplayCurrency = (amount: number | string, currency: string) => {
    if (!rates || !rates[currency]) return Number(amount);
    if (currency === displayCurrency) return Number(amount);
    const rateToDisplay = rates[displayCurrency] / rates[currency];
    return Number(amount) * rateToDisplay;
  };

  const totals = transactions.reduce(
    (acc, t) => {
      const converted = convertToDisplayCurrency(Number(t.amount), t.currency);
      if (t.type === "Income") acc.Income += converted;
      else if (t.type === "Expense") acc.Expenses += converted;
      return acc;
    },
    { Income: 0, Expenses: 0 }
  );

  const totalAll = totals.Income + totals.Expenses;

  const data = [
    { name: "Income", value: totals.Income },
    { name: "Expenses", value: totals.Expenses },
  ];

  const percentIncome = totalAll ? ((totals.Income / totalAll) * 100).toFixed(1) : "0";
  const percentExpenses = totalAll ? ((totals.Expenses / totalAll) * 100).toFixed(1) : "0";

  return (
    <Box width="100%">
      <Box height={300}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              dataKey="value"
              label={(entry: any) => `${Number(entry.value).toFixed(2)}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
           <Tooltip
           formatter={(value: number) => {
           const rounded = Number(value).toFixed(2);
           return [`${rounded} ${displayCurrency}`];
           }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box display="flex" justifyContent="center" gap={4} mt={2}>
        <Typography color="#63ca5bff">Income: {percentIncome}%</Typography>
        <Typography color="#b73228ff">Expenses: {percentExpenses}%</Typography>
      </Box>
    </Box>
  );
};

export default CustomPieChart;
