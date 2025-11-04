import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";

interface Transaction {
  type: "Income" | "Expense";
  amount: number | string;
  currency: string;
  amount_eur?: number;
}

interface Props {
  transactions: Transaction[];
}

const COLORS = ["#63ca5bff", "#e73f33ff"];

const CustomPieChart: React.FC<Props> = ({ transactions }) => {
  const totals = transactions.reduce(
    (acc, t) => {
      const amount = t.amount_eur ?? Number(t.amount);
      console.log(amount)
      if (t.type === "Income") acc.Income += amount;
      else if (t.type === "Expense") acc.Expenses += amount;
      return acc;
    },
    { Income: 0, Expenses: 0 }
  );
console.log(totals)
  const totalAll = totals.Income + totals.Expenses;

  const data = [
    { name: "Income", value: totals.Income },
    { name: "Expenses", value: totals.Expenses },
  ];
console.log("Pie Chart Data:", data);
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
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(2)}€`} />
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
