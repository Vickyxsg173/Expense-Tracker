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

  const cardStyle = "p-6 bg-white/90 dark:bg-zinc-900/85 backdrop-blur-md border border-white/95 dark:border-zinc-800/90 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] shadow-slate-200/60 hover:-translate-y-2.5 hover:scale-[1.015] hover:shadow-[0_30px_70px_rgba(99,102,241,0.12)] dark:hover:shadow-[0_30px_70px_rgba(99,102,241,0.22)] hover:border-indigo-100 dark:hover:border-indigo-900/60 transition-all duration-300 text-slate-800 dark:text-zinc-100";

  if (expenses.length === 0) {
    return (
      <div className={cardStyle}>
        <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Category Share</h2>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">Add expenses to view category charts split.</p>
      </div>
    );
  }

  return (
    <div className={cardStyle}>
      <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-zinc-800/80 pb-3">
        <span className="w-1.5 h-4 bg-indigo-500 rounded-full block" />
        Expense Share
      </h2>

      <div className="h-[180px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
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
                backgroundColor: theme === "dark" ? "#121214" : "#ffffff",
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
          <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">Total Burn</span>
          <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 mt-0.5 block">{symbol}{totalExpenses.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 dark:text-zinc-400 border-t border-slate-50 dark:border-zinc-800/80 pt-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full block flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="truncate text-slate-600 dark:text-zinc-400">{item.name}: <span className="font-mono text-slate-800 dark:text-zinc-200 font-bold">{symbol}{item.value.toFixed(2)}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseChart;
