import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

function CountUp({ end, duration = 0.8, decimals = 0, suffix = "", formattingFn }) {
  const count = useMotionValue(end);
  const rounded = useTransform(count, (latest) => {
    if (formattingFn) {
      return formattingFn(latest);
    }
    return `${latest.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(count, end, {
      duration: duration,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [end, duration]);

  return <motion.span>{rounded}</motion.span>;
}

import { 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp, 
  X,
  Check,
} from "lucide-react";

const REGIONAL_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

const PRESET_LIMITS_INR = [10000, 25000, 50000, 100000, 250000];

function BudgetSystem({ 
  budget, 
  setBudget, 
  expenses, 
  displayCurrency, 
  exchangeRate, 
  theme 
}) {
  const symbol = REGIONAL_SYMBOLS[displayCurrency] || "₹";
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState("");

  const formatValue = (val) => {
    return `${symbol}${val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const totalSpentInBase = useMemo(() => {
    return expenses
      .filter((expense) => {
        const expenseTime = expense.timestamp || 0;
        const budgetTime = budget.createdAt || 0;
        return expenseTime >= budgetTime;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses, budget.createdAt]);

  const displayBudgetLimit = useMemo(() => {
    return budget.amount * exchangeRate;
  }, [budget.amount, exchangeRate]);

  const displaySpent = useMemo(() => {
    return totalSpentInBase * exchangeRate;
  }, [totalSpentInBase, exchangeRate]);

  const displayRemaining = displayBudgetLimit - displaySpent;
  
  const usagePercent = useMemo(() => {
    if (displayBudgetLimit <= 0) return 0;
    return (displaySpent / displayBudgetLimit) * 100;
  }, [displaySpent, displayBudgetLimit]);

  const statusDetails = useMemo(() => {
    if (usagePercent < 50) {
      return {
        status: "Safe",
        colorClass: "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
        barColor: "bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
        message: "All clear! You are well within your budget limit. Keep up the smart spending!",
        icon: CheckCircle2,
      };
    } else if (usagePercent <= 80) {
      return {
        status: "Warning",
        colorClass: "text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20",
        barColor: "bg-gradient-to-r from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
        message: "Heads up! You have crossed 50% of your budget. Think twice before your next purchase.",
        icon: AlertTriangle,
      };
    } else if (usagePercent < 100) {
      return {
        status: "Danger",
        colorClass: "text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20",
        barColor: "bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.25)]",
        message: "Caution! You are approaching your budget limit. Freeze non-essential spending!",
        icon: AlertCircle,
      };
    } else {
      return {
        status: "Over Budget",
        colorClass: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20",
        barColor: "bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 shadow-[0_0_16px_rgba(168,85,247,0.3)]",
        message: `Limit exceeded! You have blown past your budget limit by ${formatValue(Math.abs(displayRemaining))}!`,
        icon: TrendingUp,
      };
    }
  }, [usagePercent, displayRemaining, symbol]);

  const handleInputChange = (valStr) => {
    setEditAmount(valStr);
    const numericAmount = parseFloat(valStr);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      setBudget({
        amount: numericAmount / exchangeRate,
        enabled: true,
        createdAt: Date.now(),
      });
    }
  };

  const handlePresetClick = (baseInr) => {
    const inDisplay = (baseInr * exchangeRate).toFixed(2);
    setEditAmount(inDisplay);
    setBudget({
      amount: baseInr,
      enabled: true,
      createdAt: Date.now(),
    });
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const cardStyle = "p-4 sm:p-6 bg-white/70 dark:bg-zinc-900 border border-indigo-100/80 dark:border-zinc-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_20px_50px_rgba(99,102,241,0.25),0_0_15px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.15),0_0_15px_rgba(99,102,241,0.1)] dark:hover:border-indigo-500/30 hover:-translate-y-1 hover:border-indigo-400 transition-all duration-300 text-slate-800 dark:text-zinc-100 relative overflow-hidden flex flex-col justify-between";

  const StatusIcon = statusDetails.icon;

  return (
    <div className={cardStyle}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-3xl pointer-events-none opacity-20 transition-all duration-500 ${
        usagePercent < 50 ? "bg-emerald-400" :
        usagePercent <= 80 ? "bg-amber-400" :
        usagePercent < 100 ? "bg-rose-400" : "bg-purple-500"
      }`} />

      <div className="flex items-center justify-between border-b border-slate-50 dark:border-zinc-800/80 pb-3 z-10">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-4 rounded-full block ${
            usagePercent < 50 ? "bg-emerald-500" :
            usagePercent <= 80 ? "bg-amber-500" :
            usagePercent < 100 ? "bg-rose-500" : "bg-purple-500"
          }`} />
          <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            Budget
          </h2>
        </div>

        <button
          onClick={() => {
            if (!isEditing) {
              setEditAmount((budget.amount * exchangeRate).toFixed(2));
            }
            setIsEditing(!isEditing);
          }}
          className="text-[11px] font-bold text-indigo-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-zinc-800 hover:bg-indigo-50/60 dark:hover:bg-zinc-700 rounded-lg border border-slate-100 dark:border-zinc-850 cursor-pointer transition-colors"
        >
          {isEditing ? <X className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
          {isEditing ? "Close" : "Edit Budget"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="display-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4 z-10"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
                  Remaining Balance
                </span>
                <span className={`text-2xl font-black font-sans tracking-tight block mt-0.5 ${
                  displayRemaining >= 0 
                    ? "text-slate-800 dark:text-zinc-100" 
                    : "text-rose-500 dark:text-rose-400 font-mono"
                }`}>
                  {displayRemaining >= 0 ? (
                    <CountUp
                      end={displayRemaining}
                      duration={0.8}
                      preserveValue={true}
                      formattingFn={formatValue}
                    />
                  ) : (
                    <span>
                      Over by{" "}
                      <CountUp
                        end={Math.abs(displayRemaining)}
                        duration={0.8}
                        preserveValue={true}
                        formattingFn={formatValue}
                      />
                    </span>
                  )}
                </span>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-extrabold tracking-wide uppercase ${statusDetails.colorClass}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusDetails.status}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                <span>
                  <CountUp
                    end={displaySpent}
                    duration={0.8}
                    preserveValue={true}
                    formattingFn={formatValue}
                  /> spent
                </span>
                <span className="text-slate-600 dark:text-zinc-300 font-mono text-xs font-black bg-slate-50 dark:bg-zinc-850 px-1.5 py-0.5 rounded">
                  <CountUp
                    end={usagePercent}
                    duration={0.8}
                    preserveValue={true}
                    decimals={1}
                    suffix="%"
                  />
                </span>
                <span>
                  <CountUp
                    end={displayBudgetLimit}
                    duration={0.8}
                    preserveValue={true}
                    formattingFn={formatValue}
                  /> limit
                </span>
              </div>
              
              <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full relative">
                <motion.div
                  className={`h-full rounded-full ${statusDetails.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(usagePercent, 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-[11px] leading-relaxed font-medium transition-colors duration-300 ${statusDetails.colorClass}`}>
              {statusDetails.message}
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="edit-mode"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSaveSubmit}
            className="mt-4 space-y-4 z-10 overflow-hidden"
          >
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Budget Limit ({symbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm font-bold text-slate-400">
                  {symbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editAmount}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full bg-slate-50/50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-indigo-400 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-950 transition duration-200"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                Quick Limit Presets (INR Base)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_LIMITS_INR.map((inrVal) => {
                  const displayEquivalent = inrVal * exchangeRate;
                  return (
                    <button
                      key={inrVal}
                      type="button"
                      onClick={() => handlePresetClick(inrVal)}
                      className="px-2.5 py-1 text-[10px] font-extrabold bg-slate-50 hover:bg-indigo-50/60 dark:bg-zinc-850 dark:hover:bg-zinc-800 border border-slate-100 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-zinc-700 rounded-lg text-slate-600 dark:text-zinc-300 cursor-pointer transition-all duration-150"
                    >
                      {symbol}{displayEquivalent >= 1000 ? `${(displayEquivalent / 1000).toFixed(0)}k` : displayEquivalent.toFixed(0)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-50 dark:border-zinc-850 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-750 rounded-lg text-slate-500 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BudgetSystem;
