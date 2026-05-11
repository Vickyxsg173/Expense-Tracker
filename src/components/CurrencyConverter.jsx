import React from "react";

function CurrencyConverter({ displayCurrency, setDisplayCurrency, isOffline }) {
  return (
    <div className="flex items-center gap-1.5">
      {isOffline && (
        <span className="text-[9px] font-bold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-100 dark:border-zinc-800/80 uppercase tracking-wider animate-pulse">
          Offline
        </span>
      )}
      
      <span className="hidden sm:inline text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
        Currency
      </span>

      <select
        value={displayCurrency}
        onChange={(e) => setDisplayCurrency(e.target.value)}
        className="bg-slate-50/50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-zinc-200 font-medium focus:outline-none focus:border-indigo-400 dark:focus:border-zinc-700 transition duration-150 cursor-pointer"
      >
        <option value="INR" className="dark:bg-zinc-950">INR</option>
        <option value="USD" className="dark:bg-zinc-950">USD</option>
        <option value="EUR" className="dark:bg-zinc-950">EUR</option>
        <option value="GBP" className="dark:bg-zinc-950">GBP</option>
        <option value="JPY" className="dark:bg-zinc-950">JPY</option>
      </select>
    </div>
  );
}

export default CurrencyConverter;