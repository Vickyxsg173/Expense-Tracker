import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // <-- Import Framer Motion!
import gsap from "gsap"; // <-- Import GSAP!
import AddExpense from "./components/Addexpense";
import AddSavings from "./components/AddSavings";
import OperationsList from "./components/OperationsList";
import ExpenseChart from "./components/ExpenseChart";
import CurrencyConverter from "./components/CurrencyConverter";

// Offline backup exchange rates (from INR Base)
const INR_FALLBACK_RATES = {
  INR: 1.0,
  USD: 0.012,   // 1 INR = ~0.012 USD
  EUR: 0.011,   // 1 INR = ~0.011 EUR
  GBP: 0.0094,  // 1 INR = ~0.0094 GBP
  JPY: 1.87,    // 1 INR = ~1.87 JPY
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);

  // Multi-Currency Global States
  const [displayCurrency, setDisplayCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isOffline, setIsOffline] = useState(false);

  // Refs for GSAP glowing blobs
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);

  // 1. GSAP Floating Context Animation Loop (Wider, more obvious drift offsets!)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gentle infinite drifting for blob 1 (Obvious lava-lamp movement)
      gsap.to(blob1Ref.current, {
        x: "random(-150, 150)",
        y: "random(-120, 120)",
        scale: "random(0.75, 1.3)",
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Gentle infinite drifting for blob 2
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

    return () => ctx.revert(); // clean up context on unmount
  }, []);

  // 2. Dynamic API Synchronizer: fetch live rates relative to INR on selection changes
  useEffect(() => {
    if (displayCurrency === "INR") {
      setExchangeRate(1);
      setIsOffline(false);
      return;
    }

    const fetchRate = async () => {
      setIsOffline(false);
      try {
        // Fetch rates relative to INR using open.er-api (Cloudflare-backed)
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
        // Instant graceful recovery
        setExchangeRate(INR_FALLBACK_RATES[displayCurrency] || 1);
      }
    };

    fetchRate();
  }, [displayCurrency]);

  // --- Deletion Handlers ---
  const handleDeleteExpense = (idToDelete) => {
    setExpenses(expenses.filter((expense) => expense.id !== idToDelete));
  };

  const handleDeleteSaving = (idToDelete) => {
    setSavings(savings.filter((saving) => saving.id !== idToDelete));
  };

  // Ultra-premium pop card styling with pronounced hover translate and active indigo bloom shadows
  const cardStyle = "p-6 bg-white/85 backdrop-blur-md border border-white/90 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] shadow-slate-200/60 hover:-translate-y-2.5 hover:scale-[1.015] hover:shadow-[0_30px_70px_rgba(99,102,241,0.14)] hover:border-indigo-100 transition-all duration-300";

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 py-12 px-4 sm:px-6 md:px-12 font-sans relative overflow-x-hidden">
      
      {/* Background Ambient Glowing Blobs (Animate floating using GSAP!) */}
      <div 
        ref={blob1Ref}
        className="absolute top-12 left-1/4 w-[450px] h-[450px] bg-indigo-400/[0.12] rounded-full blur-[100px] pointer-events-none z-0"
      ></div>
      <div 
        ref={blob2Ref}
        className="absolute bottom-24 right-1/4 w-[450px] h-[450px] bg-pink-400/[0.1] rounded-full blur-[100px] pointer-events-none z-0"
      ></div>

      <div className="w-full max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Title Header (Sleek slide-down entry with spring mechanics) */}
        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 gap-4"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              Expense Tracker
            </h1>
          </div>

          <CurrencyConverter 
            displayCurrency={displayCurrency}
            setDisplayCurrency={setDisplayCurrency}
            isOffline={isOffline}
          />
        </motion.div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1 (Left): Form Inputs - Slid in from left with heavy bounciness! */}
          <motion.div 
            initial={{ opacity: 0, x: -80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 11, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            
            {/* Add Expense Section */}
            <div className={cardStyle}>
              <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-rose-500 rounded-full block" />
                Debit Ledger
              </h2>
              <AddExpense
                expenses={expenses}
                setExpenses={setExpenses}
              />
            </div>

            {/* Add Savings Section */}
            <div className={cardStyle}>
              <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full block" />
                Savings Matrix
              </h2>
              <AddSavings
                savings={savings}
                setSavings={setSavings}
              />
            </div>

          </motion.div>

          {/* Column 2 (Right): Visualizations & History Log - Slid in from right with heavy bounciness! */}
          <motion.div 
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 11, delay: 0.25 }}
            className="lg:col-span-7 space-y-6"
          >
            
            {/* Real-time Expense Split Donut Chart */}
            <ExpenseChart 
              expenses={expenses} 
              displayCurrency={displayCurrency}
              exchangeRate={exchangeRate}
            />

            {/* Unified Operations Activity Feed */}
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