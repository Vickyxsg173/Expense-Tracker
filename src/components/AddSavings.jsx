import { useState } from "react";

function AddSavings({ savings, setSavings }) {
  const [savingAmount, setSavingAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!savingAmount) return;

    // Generate unique ID for perfect Framer Motion exit transitions!
    const newSaving = {
      id: `sav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: parseFloat(savingAmount)
    };

    setSavings([
      ...savings,
      newSaving
    ]);

    setSavingAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Savings Input */}
      <div>
        <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">
          Savings Goal amount (₹)
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="e.g. 500.00"
          value={savingAmount}
          onChange={(e) => setSavingAmount(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition duration-200"
          required
        />
      </div>

      {/* Submit button */}
      <button 
        type="submit"
        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition duration-200 active:scale-98 cursor-pointer shadow-lg shadow-emerald-500/10"
      >
        Add Savings
      </button>
    </form>
  );
}

export default AddSavings;
