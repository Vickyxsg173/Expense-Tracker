import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Premium color coding for standard expense categories
const CATEGORY_COLORS = {
  Food: "#f97316",          // Amber Orange
  Entertainment: "#a855f7", // Royal Purple
  Shopping: "#f43f5e",      // Soft Rose Red
  Rent: "#3b82f6",          // Cool Blue
  Utilities: "#f59e0b",     // Amber Yellow
  Other: "#64748b",         // Warm Slate
};

// Regional Currency Symbols Lookup
const REGIONAL_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

function ExpenseChart({ expenses, displayCurrency, exchangeRate }) {
  const symbol = REGIONAL_SYMBOLS[displayCurrency] || "₹";
  
  // Dynamic aggregation: group sum of prices by Category and multiply by the exchange rate
  const chartData = useMemo(() => {
    const groups = expenses.reduce((acc, curr) => {
      const category = curr.category || "Other";
      // Convert on-the-fly using the active rate!
      acc[category] = (acc[category] || 0) + (curr.amount * exchangeRate);
      return acc;
    }, {});

    // Translate to Recharts data models
    return Object.entries(groups).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
    }));
  }, [expenses, exchangeRate]);

  // Calculate the total expenses using the converted rate
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, curr) => sum + (curr.amount * exchangeRate), 0);
  }, [expenses, exchangeRate]);

  const cardStyle = "p-6 bg-white/85 backdrop-blur-md border border-white/90 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] shadow-slate-200/60 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(99,102,241,0.09)] hover:border-indigo-100/80 transition-all duration-300";

  if (expenses.length === 0) {
    return (
      <div className={cardStyle}>
        <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-2">Category Share</h2>
        <p className="text-[11px] text-slate-400 italic">Add expenses to view category charts split.</p>
      </div>
    );
  }

  return (
    <div className={cardStyle}>
      {/* Chart Card Header */}
      <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3">
        <span className="w-1.5 h-4 bg-rose-500 rounded-full block" />
        Expense Share
      </h2>

      {/* Recharts Pie Layout */}
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
            {/* Custom styled HTML tooltip */}
            <Tooltip
              formatter={(value) => [`${symbol}${value.toFixed(2)}`, "Expenses"]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                color: "#1e293b",
                fontSize: "11px",
                boxShadow: "0 10px 15px -3px rgba(148,163,184,0.1)",
              }}
              itemStyle={{ fontWeight: "bold" }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Core Absolute text inside the donut hole */}
        <div className="absolute text-center select-none pointer-events-none">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Burn</span>
          <span className="text-sm font-black text-slate-800 mt-0.5 block">{symbol}{totalExpenses.toFixed(2)}</span>
        </div>
      </div>

      {/* Color Indexed Legend Grid */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 border-t border-slate-100 pt-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full block flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="truncate text-slate-600">{item.name}: <span className="font-mono text-slate-800 font-bold">{symbol}{item.value.toFixed(2)}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseChart;
