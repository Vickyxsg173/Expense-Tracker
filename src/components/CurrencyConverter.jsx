import React from "react";

function CurrencyConverter({ displayCurrency, setDisplayCurrency, isOffline }) {
  return (
    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl px-4 py-2 shadow-sm shadow-slate-100/50 self-start sm:self-center">
      {/* Offline Status indicator badge */}
      {isOffline && (
        <span className="text-[8px] bg-amber-500/10 text-amber-600 font-black uppercase tracking-wider py-1 px-2.5 rounded-full border border-amber-500/20 animate-pulse">
          Offline Mode
        </span>
      )}
      
      {/* Selector Label */}
      <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
        Currency
      </span>

      {/* Select Dropdown */}
      <select
        value={displayCurrency}
        onChange={(e) => setDisplayCurrency(e.target.value)}
        className="bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-bold focus:outline-none focus:border-indigo-400 transition duration-200 cursor-pointer"
      >
        <option value="INR">INR (₹)</option>
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
        <option value="JPY">JPY (¥)</option>
      </select>
    </div>
  );
}

export default CurrencyConverter;