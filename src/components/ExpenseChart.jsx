import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CATEGORY_COLORS = {
  Food: "#f97316",          
  Entertainment: "#a855f7", 
  Shopping: "#f43f5e",      
  Rent: "#3b82f6",          
  Utilities: "#f59e0b",     
  Other: "#64748b",         
};

const REGIONAL_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

function ExpenseChart({ expenses, displayCurrency, exchangeRate, theme }) {
  const symbol = REGIONAL_SYMBOLS[displayCurrency] || "₹";
  
  const chartData = useMemo(() => {
    const groups = expenses.reduce((acc, curr) => {
      const category = curr.category || "Other";
      acc[category] = (acc[category] || 0) + (curr.amount * exchangeRate);
      return acc;
    }, {});

    return Object.entries(groups).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
    }));
  }, [expenses, exchangeRate]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, curr) => sum + (curr.amount * exchangeRate), 0);
  }, [expenses, exchangeRate]);

  const cardStyle = "p-4 sm:p-6 bg-white/70 dark:bg-zinc-900 border border-indigo-100/80 dark:border-zinc-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_20px_50px_rgba(99,102,241,0.25),0_0_15px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.15),0_0_15px_rgba(99,102,241,0.1)] dark:hover:border-indigo-500/30 hover:-translate-y-1 hover:border-indigo-400 transition-all duration-300 text-slate-800 dark:text-zinc-100 h-full flex flex-col justify-between";

  if (expenses.length === 0) {
    return (
      <div className={cardStyle}>
        <div>
          <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Category Share</h2>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">Add expenses to view category charts split.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cardStyle}>
      <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-zinc-800/80 pb-3">
        <span className="w-1.5 h-4 bg-indigo-500 rounded-full block" />
        Expense Share
      </h2>

      <div className="h-[320px] flex items-center justify-center relative my-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="outline-none" />
              ))}
            </Pie>
            
            <Tooltip
              formatter={(value) => [`${symbol}${value.toFixed(2)}`, "Expenses"]}
              contentStyle={{
                backgroundColor: theme === "dark" ? "#18181b" : "#ffffff",
                border: theme === "dark" ? "1px solid #27272a" : "1px solid #e2e8f0",
                borderRadius: "8px",
                color: theme === "dark" ? "#f4f4f5" : "#1e293b",
                fontSize: "11px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              }}
              itemStyle={{ fontWeight: "bold" }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute text-center select-none pointer-events-none">
          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Total Burn</span>
          <span className="text-xl font-bold text-slate-800 dark:text-zinc-100 mt-0.5 block">{symbol}{totalExpenses.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-bold text-slate-500 dark:text-zinc-400 border-t border-slate-50 dark:border-zinc-800/80 pt-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full block flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="truncate text-[15px] text-slate-600 dark:text-zinc-400">{item.name}: <span className="font-mono text-slate-800 dark:text-zinc-200 font-bold">{symbol}{item.value.toFixed(2)}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseChart;
