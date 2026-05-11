import React from "react";

function CurrencyConverter({ displayCurrency, setDisplayCurrency, isOffline }) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-[#121214] border border-slate-100 dark:border-zinc-800 rounded-lg px-3 py-1.5 self-start sm:self-center">
      {isOffline && (
        <span className="text-[8px] bg-orange-500/10 text-orange-600 font-bold uppercase tracking-wider py-1 px-2.5 rounded-full border border-orange-500/20 animate-pulse">
          Offline Mode
        </span>
      )}
      
      <span className="text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
        Currency
      </span>

      <select
        value={displayCurrency}
        onChange={(e) => setDisplayCurrency(e.target.value)}
        className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md px-2 py-0.5 text-xs text-slate-800 dark:text-zinc-200 font-medium focus:outline-none focus:border-slate-400 dark:focus:border-zinc-700 transition duration-150 cursor-pointer"
      >
        <option value="INR" className="dark:bg-zinc-950">INR (₹)</option>
        <option value="USD" className="dark:bg-zinc-950">USD ($)</option>
        <option value="EUR" className="dark:bg-zinc-950">EUR (€)</option>
        <option value="GBP" className="dark:bg-zinc-950">GBP (£)</option>
        <option value="JPY" className="dark:bg-zinc-950">JPY (¥)</option>
      </select>
    </div>
  );
}

export default CurrencyConverter;