import React from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion"; // <-- Import Framer Motion!

// Regional Currency Symbols Lookup
const REGIONAL_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

function OperationsList({ 
  expenses, 
  savings, 
  displayCurrency, 
  exchangeRate,
  onDeleteExpense,
  onDeleteSaving
}) {
  const symbol = REGIONAL_SYMBOLS[displayCurrency] || "₹";

  // Calculate dynamic total savings with converted rates
  const totalSavings = savings.reduce((sum, curr) => sum + (curr.amount * exchangeRate), 0);

  return (
    <div className="p-6 bg-white/85 backdrop-blur-md border border-white/90 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] shadow-slate-200/60 hover:-translate-y-2.5 hover:scale-[1.015] hover:shadow-[0_30px_70px_rgba(99,102,241,0.14)] hover:border-indigo-100 transition-all duration-300 space-y-6">
      {/* Main Ledger Header */}
      <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3">
        <span className="w-1.5 h-4 bg-indigo-500 rounded-full block" />
        Ledger Activity log
      </h2>

      <div className="space-y-6">
        
        {/* Expenses (Debits) Subsection */}
        <div className="space-y-2.5">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex justify-between">
            <span>Debits</span>
            <span className="text-rose-500 font-mono font-semibold">{expenses.length} entries</span>
          </h3>
          
          {/* Always mount the scroll container so AnimatePresence is never destroyed prematurely */}
          <div className="max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            <AnimatePresence initial={false} mode="popLayout">
              {expenses.length === 0 ? (
                <motion.p
                  key="empty-expenses"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-[11px] text-slate-400 italic pl-1"
                >
                  No debit transactions logged yet.
                </motion.p>
              ) : (
                expenses.map((expense) => (
                  <motion.div 
                    key={expense.id} 
                    initial={{ opacity: 0, height: 0, x: -60, scale: 0.9 }}
                    animate={{ opacity: 1, height: "auto", x: 0, scale: 1 }}
                    exit={{ opacity: 0, height: 0, x: 60, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    className="overflow-hidden mb-1.5 last:mb-0"
                  >
                    <div className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-100 rounded-xl group hover:bg-slate-100/30 transition duration-150">
                      <span className="text-xs font-semibold text-slate-700">{expense.title}</span>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-rose-500">
                          -{symbol}{(expense.amount * exchangeRate).toFixed(2)}
                        </span>
                        {/* Delete Expense Button */}
                        <button
                          onClick={() => onDeleteExpense(expense.id)} // Delete by unique ID!
                          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-lg transition duration-200 cursor-pointer"
                          title="Delete Entry"
                        >
                          <RiDeleteBin6Fill className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Savings Subsection */}
        <div className="space-y-2.5">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex justify-between items-center">
            <span>Savings Reserves</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-mono font-semibold">{savings.length} entries</span>
              <span className="text-emerald-500 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Total: {symbol}{totalSavings.toFixed(2)}
              </span>
            </div>
          </h3>

          {/* Always mount the scroll container so AnimatePresence is never destroyed prematurely */}
          <div className="max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            <AnimatePresence initial={false} mode="popLayout">
              {savings.length === 0 ? (
                <motion.p
                  key="empty-savings"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-[11px] text-slate-400 italic pl-1"
                >
                  No savings deposits logged yet.
                </motion.p>
              ) : (
                savings.map((saving, idx) => (
                  <motion.div 
                    key={saving.id} 
                    initial={{ opacity: 0, height: 0, x: -60, scale: 0.9 }}
                    animate={{ opacity: 1, height: "auto", x: 0, scale: 1 }}
                    exit={{ opacity: 0, height: 0, x: 60, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14 }}
                    className="overflow-hidden mb-1.5 last:mb-0"
                  >
                    <div className="flex justify-between items-center p-3 bg-slate-50/50 border border-slate-100 rounded-xl group hover:bg-slate-100/30 transition duration-150">
                      <span className="text-xs font-semibold text-slate-700">Savings Deposit #{idx + 1}</span>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-emerald-600">
                          +{symbol}{(saving.amount * exchangeRate).toFixed(2)}
                        </span>
                        {/* Delete Savings Button */}
                        <button
                          onClick={() => onDeleteSaving(saving.id)} // Delete by unique ID!
                          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-lg transition duration-200 cursor-pointer"
                          title="Delete Entry"
                        >
                          <RiDeleteBin6Fill className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OperationsList;
