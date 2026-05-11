import { useState } from "react";

function AddSavings({ savings, setSavings }) {
  const [savingAmount, setSavingAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!savingAmount) return;

    const newSaving = {
      id: `sav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: parseFloat(savingAmount),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    };

    setSavings([
      ...savings,
      newSaving
    ]);

    setSavingAmount("");
  };

  const inputStyle = "w-full bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-950 transition duration-150";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
          Savings Goal amount (₹)
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={savingAmount}
          onChange={(e) => setSavingAmount(e.target.value)}
          className={inputStyle}
          required
        />
      </div>

      <button 
        type="submit"
        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition duration-150 cursor-pointer text-center"
      >
        Add Savings
      </button>
    </form>
  );
}

export default AddSavings;
