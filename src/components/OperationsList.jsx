import React from "react";
import { 
  RiDeleteBin6Fill,
  RiRestaurantLine,
  RiFilmLine,
  RiShoppingBagLine,
  RiHomeLine,
  RiLightbulbLine,
  RiFileList3Line,
  RiWalletLine
} from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

const REGIONAL_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

const getCategoryStyles = (category) => {
  switch (category) {
    case "Food":
      return {
        icon: <RiRestaurantLine className="w-4 h-4" />,
        colorClass: "bg-orange-50 dark:bg-orange-500/10 text-orange-500"
      };
    case "Entertainment":
      return {
        icon: <RiFilmLine className="w-4 h-4" />,
        colorClass: "bg-purple-50 dark:bg-purple-500/10 text-purple-500"
      };
    case "Shopping":
      return {
        icon: <RiShoppingBagLine className="w-4 h-4" />,
        colorClass: "bg-rose-50 dark:bg-rose-500/10 text-rose-500"
      };
    case "Rent":
      return {
        icon: <RiHomeLine className="w-4 h-4" />,
        colorClass: "bg-blue-50 dark:bg-blue-500/10 text-blue-500"
      };
    case "Utilities":
      return {
        icon: <RiLightbulbLine className="w-4 h-4" />,
        colorClass: "bg-amber-50 dark:bg-amber-500/10 text-amber-500"
      };
    default:
      return {
        icon: <RiFileList3Line className="w-4 h-4" />,
        colorClass: "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400"
      };
  }
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

  const totalSavings = savings.reduce((sum, curr) => sum + (curr.amount * exchangeRate), 0);

  const cardStyle = "p-6 bg-white/90 dark:bg-zinc-900/85 backdrop-blur-md border border-white/95 dark:border-zinc-800/90 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] shadow-slate-200/60 hover:-translate-y-2.5 hover:scale-[1.015] hover:shadow-[0_30px_70px_rgba(99,102,241,0.12)] dark:hover:shadow-[0_30px_70px_rgba(99,102,241,0.22)] hover:border-indigo-100 dark:hover:border-indigo-900/60 transition-all duration-300 text-slate-800 dark:text-zinc-100 space-y-6";

  return (
    <div className={cardStyle}>
      <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 dark:border-zinc-800/80 pb-3">
        <span className="w-1.5 h-4 bg-indigo-500 rounded-full block" />
        Ledger Activity log
      </h2>

      <div className="space-y-6">
        
        <div className="space-y-2.5">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex justify-between">
            <span>Debits</span>
            <span className="text-rose-500 font-mono font-bold">{expenses.length} entries</span>
          </h3>
          
          <div className="max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            <AnimatePresence initial={false} mode="popLayout">
              {expenses.length === 0 ? (
                <motion.p
                  key="empty-expenses"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-[11px] text-slate-400 dark:text-zinc-500 italic pl-1"
                >
                  No debit transactions logged yet.
                </motion.p>
              ) : (
                expenses.map((expense) => {
                  const { icon, colorClass } = getCategoryStyles(expense.category);
                  return (
                    <motion.div 
                      key={expense.id} 
                      initial={{ opacity: 0, height: 0, x: -60, scale: 0.9 }}
                      animate={{ opacity: 1, height: "auto", x: 0, scale: 1 }}
                      exit={{ opacity: 0, height: 0, x: 60, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 120, damping: 14 }}
                      className="overflow-hidden mb-1.5 last:mb-0"
                    >
                      <div className="flex justify-between items-center p-3 bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800/50 rounded-xl group hover:bg-slate-100/30 dark:hover:bg-zinc-800/30 transition duration-150">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl flex items-center justify-center ${colorClass}`}>
                            {icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{expense.title}</span>
                            {expense.date && (
                              <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">{expense.date}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-rose-500">
                            -{symbol}{(expense.amount * exchangeRate).toFixed(2)}
                          </span>
                          <button
                            onClick={() => onDeleteExpense(expense.id)}
                            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-1 rounded-lg transition duration-200 cursor-pointer"
                            title="Delete Entry"
                          >
                            <RiDeleteBin6Fill className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex justify-between items-center">
            <span>Savings Reserves</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-500 font-mono font-bold">{savings.length} entries</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-zinc-800/80 text-[10px]">
                Total: {symbol}{totalSavings.toFixed(2)}
              </span>
            </div>
          </h3>

          <div className="max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            <AnimatePresence initial={false} mode="popLayout">
              {savings.length === 0 ? (
                <motion.p
                  key="empty-savings"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-[11px] text-slate-400 dark:text-zinc-500 italic pl-1"
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
                    <div className="flex justify-between items-center p-3 bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-800/50 rounded-xl group hover:bg-slate-100/30 dark:hover:bg-zinc-800/30 transition duration-150">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                          <RiWalletLine className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">Savings Deposit #{idx + 1}</span>
                          {saving.date && (
                            <span className="text-[9px] text-slate-400 dark:text-zinc-500 mt-0.5">{saving.date}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-500">
                          +{symbol}{(saving.amount * exchangeRate).toFixed(2)}
                        </span>
                        <button
                          onClick={() => onDeleteSaving(saving.id)}
                          className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-1 rounded-lg transition duration-200 cursor-pointer"
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
