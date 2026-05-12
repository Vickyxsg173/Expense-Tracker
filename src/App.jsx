import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { 
  RiSunFill, 
  RiMoonFill, 
  RiDashboardLine, 
  RiFileList3Line,
  RiMenuFill,
  RiCloseFill
} from "react-icons/ri";
import AddExpense from "./components/Addexpense";
import AddSavings from "./components/AddSavings";
import OperationsList from "./components/OperationsList";
import ExpenseChart from "./components/ExpenseChart";
import CurrencyConverter from "./components/CurrencyConverter";
import BudgetSystem from "./components/BudgetSystem";

const INR_FALLBACK_RATES = {
  INR: 1.0,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0094,
  JPY: 1.87,
};

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expensestore");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [savings, setSavings] = useState(() => {
    const saved = localStorage.getItem("savingsstore");
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem("budgetstore");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.createdAt === undefined) {
        parsed.createdAt = 0;
      }
      return parsed;
    }
    return { amount: 50000, enabled: true, createdAt: 0 };
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("expensestore", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("savingsstore", JSON.stringify(savings));
  }, [savings]);

  useEffect(() => {
    localStorage.setItem("budgetstore", JSON.stringify(budget));
  }, [budget]);

  const [displayCurrency, setDisplayCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isOffline, setIsOffline] = useState(false);

  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blob1Ref.current, {
        x: "random(-150, 150)",
        y: "random(-120, 120)",
        scale: "random(0.75, 1.3)",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(blob2Ref.current, {
        x: "random(-150, 150)",
        y: "random(-120, 120)",
        scale: "random(0.75, 1.3)",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (displayCurrency === "INR") {
      setExchangeRate(1);
      setIsOffline(false);
      return;
    }

    const fetchRate = async () => {
      setIsOffline(false);
      try {
        const response = await fetch(
          `https://open.er-api.com/v6/latest/INR`
        );
        
        if (!response.ok) {
          throw new Error("API response was not ok");
        }

        const data = await response.json();
        const rate = data.rates[displayCurrency];

        if (rate) {
          setExchangeRate(rate);
        } else {
          throw new Error(`Rate for ${displayCurrency} not found`);
        }
      } catch (err) {
        console.warn("Using offline rates for " + displayCurrency, err);
        setIsOffline(true);
        setExchangeRate(INR_FALLBACK_RATES[displayCurrency] || 1);
      }
    };

    fetchRate();
  }, [displayCurrency]);

  const handleDeleteExpense = (idToDelete) => {
    setExpenses(expenses.filter((expense) => expense.id !== idToDelete));
  };

  const handleDeleteSaving = (idToDelete) => {
    setSavings(savings.filter((saving) => saving.id !== idToDelete));
  };

  const cardStyle = "p-4 sm:p-6 bg-white/70 dark:bg-zinc-900 border border-indigo-100/80 dark:border-zinc-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-none hover:shadow-[0_20px_50px_rgba(99,102,241,0.25),0_0_15px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_20px_50px_rgba(99,102,241,0.15),0_0_15px_rgba(99,102,241,0.1)] dark:hover:border-indigo-500/30 hover:-translate-y-1 hover:border-indigo-400 transition-all duration-300 text-slate-800 dark:text-zinc-100";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:to-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col md:flex-row relative overflow-x-hidden transition-colors duration-200">
      
      <div 
        ref={blob1Ref}
        className="absolute top-12 left-1/4 w-96 h-96 bg-indigo-400/12 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0"
      ></div>
      <div 
        ref={blob2Ref}
        className="absolute bottom-24 right-1/4 w-96 h-96 bg-pink-400/12 dark:bg-pink-500/5 rounded-full blur-3xl pointer-events-none z-0"
      ></div>

      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-zinc-900 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md p-4 md:p-6 flex flex-col justify-between gap-6 z-20 flex-shrink-0 relative">
        <div>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-sm md:text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-50">
              Expense Tracker
            </h1>
            
            <div className="flex items-center gap-2 md:hidden">
              <CurrencyConverter 
                displayCurrency={displayCurrency}
                setDisplayCurrency={setDisplayCurrency}
                isOffline={isOffline}
              />
              
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-1.5 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg text-slate-500 dark:text-zinc-400 cursor-pointer"
                title="Toggle Theme"
              >
                {theme === "light" ? (
                  <RiMoonFill className="w-3.5 h-3.5" />
                ) : (
                  <RiSunFill className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 text-slate-500 dark:text-zinc-400 hover:bg-slate-100/60 dark:hover:bg-zinc-900/50 rounded-lg transition duration-150 cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <RiCloseFill className="w-5 h-5" />
                ) : (
                  <RiMenuFill className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="hidden md:block mt-8">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition duration-150 cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-indigo-50/60 dark:bg-zinc-900 text-indigo-600 dark:text-zinc-100 shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900/30"
                }`}
              >
                <RiDashboardLine className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab("activity")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition duration-150 cursor-pointer ${
                  activeTab === "activity"
                    ? "bg-indigo-50/60 dark:bg-zinc-900 text-indigo-600 dark:text-zinc-100 shadow-sm"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900/30"
                }`}
              >
                <RiFileList3Line className="w-4 h-4" />
                Activity Logs
              </button>
            </nav>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-16 left-4 right-4 bg-white/95 dark:bg-zinc-900 border border-white dark:border-zinc-850 rounded-2xl shadow-xl p-4 z-30 md:hidden"
            >
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition duration-150 cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-indigo-50/60 dark:bg-zinc-900 text-indigo-600 dark:text-zinc-100 shadow-sm"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900/30"
                  }`}
                >
                  <RiDashboardLine className="w-4 h-4" />
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    setActiveTab("activity");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition duration-150 cursor-pointer ${
                    activeTab === "activity"
                      ? "bg-indigo-50/60 dark:bg-zinc-900 text-indigo-600 dark:text-zinc-100 shadow-sm"
                      : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-900/30"
                  }`}
                >
                  <RiFileList3Line className="w-4 h-4" />
                  Activity Logs
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="hidden md:block pt-4 border-t border-slate-100 dark:border-zinc-900">
        </div>
      </aside>

      <main className="flex-1 p-3.5 sm:p-6 md:p-12 z-10 overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          
          <div className="hidden md:flex md:items-center md:justify-between border-b border-slate-100 dark:border-zinc-900 pb-5 gap-4">
            <div>
              <h2 className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                {activeTab === "dashboard" ? "Overview Dashboard" : "Logs"}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <CurrencyConverter 
                displayCurrency={displayCurrency}
                setDisplayCurrency={setDisplayCurrency}
                isOffline={isOffline}
              />
              
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition duration-150 cursor-pointer text-slate-500 dark:text-zinc-400"
                title="Toggle Theme"
              >
                {theme === "light" ? (
                  <RiMoonFill className="w-4 h-4" />
                ) : (
                  <RiSunFill className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "dashboard" ? (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
              >
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className={cardStyle}>
                    <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full block animate-pulse" />
                      Debit
                    </h2>
                    <AddExpense
                      expenses={expenses}
                      setExpenses={setExpenses}
                      budget={budget}
                      displayCurrency={displayCurrency}
                      exchangeRate={exchangeRate}
                    />
                  </div>

                  <div className={cardStyle}>
                    <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full block" />
                      Savings
                    </h2>
                    <AddSavings
                      savings={savings}
                      setSavings={setSavings}
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                  <BudgetSystem
                    budget={budget}
                    setBudget={setBudget}
                    expenses={expenses}
                    displayCurrency={displayCurrency}
                    exchangeRate={exchangeRate}
                    theme={theme}
                  />
                  <ExpenseChart 
                    expenses={expenses} 
                    displayCurrency={displayCurrency}
                    exchangeRate={exchangeRate}
                    theme={theme}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="activity-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <OperationsList 
                  expenses={expenses} 
                  savings={savings} 
                  displayCurrency={displayCurrency}
                  exchangeRate={exchangeRate}
                  onDeleteExpense={handleDeleteExpense}
                  onDeleteSaving={handleDeleteSaving}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}

export default App;