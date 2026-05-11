import { useState } from "react";

function AddExpense({ expenses, setExpenses }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Other");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    // Generate unique ID for perfect Framer Motion exit transitions!
    const newExpense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      amount: parseFloat(amount),
      category
    };

    setExpenses([
      ...expenses,
      newExpense
    ]);

    setTitle("");
    setAmount("");
    setCategory("Other");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input */}
      <div>
        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
          Expense Name
        </label>
        <input
          type="text"
          placeholder="e.g. Groceries, Netflix, Coffee..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition duration-200"
          required
        />
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition duration-200 cursor-pointer font-medium"
        >
          <option value="Food">Food & Drink</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Rent">Rent & Housing</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Amount Input */}
      <div>
        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
          Amount (₹)
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition duration-200"
          required
        />
      </div>

      {/* Submit button */}
      <button 
        type="submit"
        className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition duration-200 active:scale-98 cursor-pointer shadow-lg shadow-rose-500/10"
      >
        Add Expense
      </button>
    </form>
  );
}

export default AddExpense;
