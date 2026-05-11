import { useState } from "react";

function AddExpense({ expenses, setExpenses }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newExpense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    };

    setExpenses([
      ...expenses,
      newExpense
    ]);

    setTitle("");
    setAmount("");
    setCategory("Food");
  };

  const inputStyle = "w-full bg-slate-50/50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-indigo-400 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-950 focus:shadow-[0_0_20px_rgba(99,102,241,0.03)] transition duration-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
          Transaction Title
        </label>
        <input
          type="text"
          placeholder="e.g., Grocery Store"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputStyle}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            Amount (₹)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputStyle} cursor-pointer`}
          >
            <option value="Food" className="dark:bg-zinc-950">Food</option>
            <option value="Entertainment" className="dark:bg-zinc-950">Entertainment</option>
            <option value="Shopping" className="dark:bg-zinc-950">Shopping</option>
            <option value="Rent" className="dark:bg-zinc-950">Rent</option>
            <option value="Utilities" className="dark:bg-zinc-950">Utilities</option>
            <option value="Other" className="dark:bg-zinc-950">Other</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium text-sm transition duration-150 cursor-pointer text-center"
      >
        Add Expense
      </button>
    </form>
  );
}

export default AddExpense;
