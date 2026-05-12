# 💸 Expense Tracker

A smart, animated personal finance tracker built with React 19 — featuring real-time currency conversion, budget alerts, and a polished dark/light UI.

**🔗 Live Demo:** [spendwise-vikrant.vercel.app](https://spendwise-vikrant.vercel.app)
**📦 Repository:** [github.com/Vickyxsg173/Expense-Tracker](https://github.com/Vickyxsg173/Expense-Tracker)

---

## ✨ Features

### 💳 Expense & Savings Management (CRUD)
Add, edit, and delete expenses (debits) and savings goal entries (credits) with custom categories and descriptions.

### 🌍 Dynamic Multi-Currency Support
Switch display currency on the fly — **INR, USD, EUR, GBP, JPY** — and all values update instantly using live exchange rates fetched via Axios.

### 🎯 Smart Budget System
- **Instant Reset** — Setting a new budget starts fresh immediately.
- **History Preserved** — Old expenses are excluded from the new budget balance but remain visible in activity logs and charts.

### 🔢 Smooth Number Tickers
All key values — remaining balance, total spent, budget limit, usage percentage — animate smoothly using Framer Motion instead of jumping abruptly.

### ⚠️ Real-Time Overspending Alerts
A sliding warning banner appears *while you type* an expense, alerting you before you even submit if you're about to exceed your budget.

### ✨ Double-Layer Hover Glow Effects
Cards on the dashboard lift and cast a glowing colored highlight on hover, powered by Framer Motion.

### 🌗 Responsive Dark / Light Mode
Fully responsive across desktop, tablet, and mobile. Toggle between dark and light mode with a single click.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Core UI library and component architecture |
| **Vite** | Fast development server and build tool |
| **Framer Motion** | Animations — number tickers, sliding alerts, card lifts |
| **TailwindCSS** | Styling — layouts, glass cards, borders, dark mode |
| **Recharts** | Circular burn percentage charts |
| **Axios** | Live currency exchange rate fetching |
| **GSAP** | Animated floating background color bubbles |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Vickyxsg173/Expense-Tracker.git

# 2. Navigate into the project directory
cd Expense-Tracker

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
expensetracker/
├── dist/                        # Production build output
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images and static resources
│   ├── components/
│   │   ├── Addexpense.jsx       # Add expense (debit) form
│   │   ├── AddSavings.jsx       # Add savings goal (credit) form
│   │   ├── BudgetSystem.jsx     # Budget management & reset logic
│   │   ├── CurrencyConverter.jsx# Live currency switcher (INR/USD/EUR/GBP/JPY)
│   │   ├── ExpenseChart.jsx     # Recharts burn percentage chart
│   │   └── OperationsList.jsx   # Activity log (CRUD list of transactions)
│   ├── App.jsx                  # Root component & global state
│   ├── index.css                # Global styles
│   └── main.jsx                 # App entry point
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 📸 Screenshots

> <img width="1670" height="995" alt="image" src="https://github.com/user-attachments/assets/2718c816-0d68-426c-932e-b119fa41ca19" />
> <img width="1665" height="992" alt="image" src="https://github.com/user-attachments/assets/ea8d3cb4-3f97-491c-9d0e-e28e565cdb6d" />
> <img width="1659" height="987" alt="image" src="https://github.com/user-attachments/assets/4a5ab997-a119-4072-a5dd-bc59638aebe9" />
> <img width="1661" height="961" alt="image" src="https://github.com/user-attachments/assets/bf5cb00b-cc0c-4f30-9312-a9318963d3c7" />


---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

<p align="center">Made by <a href="https://github.com/Vickyxsg173">Vikrant</a></p>
