import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { RiSunFill, RiMoonFill } from "react-icons/ri";
import AddExpense from "./components/Addexpense";
import AddSavings from "./components/AddSavings";
import OperationsList from "./components/OperationsList";
import ExpenseChart from "./components/ExpenseChart";
import CurrencyConverter from "./components/CurrencyConverter";

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

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

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

  const cardStyle = "p-6 bg-white/90 dark:bg-zinc-900/85 backdrop-blur-md border border-white/95 dark:border-zinc-800/90 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] shadow-slate-200/60 hover:-translate-y-2.5 hover:scale-[1.015] hover:shadow-[0_30px_70px_rgba(99,102,241,0.12)] dark:hover:shadow-[0_30px_70px_rgba(99,102,241,0.22)] hover:border-indigo-100 dark:hover:border-indigo-900/60 transition-all duration-300 text-slate-800 dark:text-zinc-100";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 py-12 px-4 sm:px-6 md:px-12 font-sans relative overflow-x-hidden transition-colors duration-200">
      
      <div 
        ref={blob1Ref}
        className="absolute top-12 left-1/4 w-[450px] h-[450px] bg-indigo-400/[0.08] dark:bg-indigo-500/[0.04] rounded-full blur-[100px] pointer-events-none z-0"
      ></div>
      <div 
        ref={blob2Ref}
        className="absolute bottom-24 right-1/4 w-[450px] h-[450px] bg-pink-400/[0.07] dark:bg-pink-500/[0.03] rounded-full blur-[100px] pointer-events-none z-0"
      ></div>

      <div className="w-full max-w-5xl mx-auto space-y-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-zinc-800 pb-5 gap-4"
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
              Expense Tracker
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
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
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 11, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            
            <div className={cardStyle}>
              <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full block animate-pulse" />
                Debit Ledger
              </h2>
              <AddExpense
                expenses={expenses}
                setExpenses={setExpenses}
              />
            </div>

            <div className={cardStyle}>
              <h2 className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full block" />
                Savings Matrix
              </h2>
              <AddSavings
                savings={savings}
                setSavings={setSavings}
              />
            </div>

          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 11, delay: 0.25 }}
            className="lg:col-span-7 space-y-6"
          >
            
            <ExpenseChart 
              expenses={expenses} 
              displayCurrency={displayCurrency}
              exchangeRate={exchangeRate}
              theme={theme}
            />

            <OperationsList 
              expenses={expenses} 
              savings={savings} 
              displayCurrency={displayCurrency}
              exchangeRate={exchangeRate}
              onDeleteExpense={handleDeleteExpense}
              onDeleteSaving={handleDeleteSaving}
            />

          </motion.div>

        </div>

      </div>
    </div>
  );
}

export default App;