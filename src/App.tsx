import React, { useState, useEffect } from "react";
import ParticlesBackground from "./components/particles";
import CoinCollectorGame from "./game/game";

import {
  Wallet,
  PieChart,
  Target,
  TrendingUp,
  Plus,
  X,
  Moon,
  Sun,
  ArrowRight,
  DollarSign,
  Sparkles,
  Shield,
  Gamepad2,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import QuotesLandingPage from "./components/quotes";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
};

type Budget = {
  category: string;
  limit: number;
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    description: "",
  });
  const [showGame, setShowGame] = useState(false);
  const [gameRewards, setGameRewards] = useState(0);

  // Auto-transition after 3 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000); // 3000 milliseconds = 3 seconds

      // Clear timeout if component unmounts or user clicks the button
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Load saved data
  useEffect(() => {
    const savedExpenses = localStorage.getItem("financeTrackerExpenses");
    const savedBudgets = localStorage.getItem("financeTrackerBudgets");
    const savedGameRewards = localStorage.getItem("financeGameRewards");

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }

    if (savedGameRewards) {
      setGameRewards(parseInt(savedGameRewards));
    }

    // Check user preference for dark mode
    const savedDarkMode = localStorage.getItem("financeTrackerDarkMode");
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === "true");
    } else {
      // Check system preference
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem("financeTrackerExpenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("financeTrackerBudgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("financeGameRewards", gameRewards.toString());
  }, [gameRewards]);

  useEffect(() => {
    localStorage.setItem("financeTrackerDarkMode", darkMode.toString());
  }, [darkMode]);

  const categories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Others",
  ];

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.category) return;

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      description: newExpense.description,
      date: new Date().toISOString(),
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({ amount: "", category: "", description: "" });
    setShowAddExpense(false);
  };

  const handleGameFinish = (score: number) => {
    const reward = Math.floor(score / 10);
    setGameRewards((prev) => prev + reward);

    alert(`You earned ${reward} finance points from the game!`);
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryData = categories.map((category) => {
    return expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  });

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categoryData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
      },
    ],
  };

  const barData = {
    labels: ["Last 7 Days"],
    datasets: categories.map((category, index) => ({
      label: category,
      data: [categoryData[index]],
      backgroundColor: chartData.datasets[0].backgroundColor[index],
    })),
  };

  if (showWelcome) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <ParticlesBackground darkMode={darkMode} />

        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            } shadow-lg`}
          >
            {darkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Hero Section */}
        <div
          className={`relative overflow-hidden z-10 ${
            darkMode
              ? "bg-gray-900 bg-opacity-70"
              : "bg-gradient-to-br from-indigo-50 via-white to-blue-50 bg-opacity-90"
          }`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-8">
                    <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-indigo-400" : "text-indigo-600"
                      }`}
                    >
                      Smart Finance Tracking
                    </span>
                  </div>

                  <h1
                    className={`mt-4 text-4xl tracking-tight font-extrabold sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <span className="block">Take Control of</span>
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      Your Finances
                    </span>
                  </h1>

                  <p
                    className={`mt-3 text-base sm:mt-5 sm:text-xl lg:text-lg xl:text-xl ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Track expenses, set budgets, and achieve your financial
                    goals with our intuitive finance management platform.
                  </p>

                  <div className="mt-8 sm:mt-12">
                    <button
                      onClick={() => setShowWelcome(false)}
                      className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transform transition-all duration-200 hover:scale-105"
                    >
                      Get Started
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </button>
                  </div>

                  {/* Feature List */}
                  <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                    <div
                      className={`flex items-center ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      <Shield className="h-5 w-5 text-green-500 mr-2" />
                      <span>Secure & Private</span>
                    </div>
                    <div
                      className={`flex items-center ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                      <span>Free to Use</span>
                    </div>
                    <div
                      className={`flex items-center ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      <Target className="h-5 w-5 text-green-500 mr-2" />
                      <span>Smart Goals</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                  <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                    <div
                      className={`relative block w-full ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      } rounded-lg overflow-hidden`}
                    >
                      <div className="p-8">
                        <div className="space-y-6">
                          {/* Sample Stats */}
                          <div
                            className={`flex items-center justify-between p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center">
                              <PieChart className="h-8 w-8 text-indigo-500" />
                              <div className="ml-4">
                                <p
                                  className={`text-sm font-medium ${
                                    darkMode ? "text-gray-200" : "text-gray-900"
                                  }`}
                                >
                                  Monthly Overview
                                </p>
                                <p
                                  className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  Track your spending
                                </p>
                              </div>
                            </div>
                            <TrendingUp className="h-6 w-6 text-green-500" />
                          </div>

                          <div
                            className={`flex items-center justify-between p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center">
                              <Target className="h-8 w-8 text-purple-500" />
                              <div className="ml-4">
                                <p
                                  className={`text-sm font-medium ${
                                    darkMode ? "text-gray-200" : "text-gray-900"
                                  }`}
                                >
                                  Budget Goals
                                </p>
                                <p
                                  className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  Set and achieve targets
                                </p>
                              </div>
                            </div>
                            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full w-2/3 bg-purple-500 rounded-full"></div>
                            </div>
                          </div>

                          <div
                            className={`flex items-center justify-between p-4 rounded-lg ${
                              darkMode ? "bg-gray-700" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center">
                              <Wallet className="h-8 w-8 text-blue-500" />
                              <div className="ml-4">
                                <p
                                  className={`text-sm font-medium ${
                                    darkMode ? "text-gray-200" : "text-gray-900"
                                  }`}
                                >
                                  Smart Insights
                                </p>
                                <p
                                  className={`text-xs ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  AI-powered analysis
                                </p>
                              </div>
                            </div>
                            <Sparkles className="h-6 w-6 text-yellow-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`py-16 ${
            darkMode
              ? "bg-gray-800"
              : "bg-gradient-to-br from-indigo-50 to-blue-50"
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className={`text-3xl font-extrabold text-center mb-8 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Financial Wisdom
            </h2>
            <div
              className={`p-6 ${
                darkMode ? "bg-gray-700" : "bg-white"
              } rounded-xl shadow-lg`}
            >
              <QuotesLandingPage darkMode={darkMode} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen relative ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      }`}
    >
      <ParticlesBackground darkMode={darkMode} />
      {/* Header */}
      <header
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-sm relative z-10`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet
                className={`h-8 w-8 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <h1
                className={`ml-3 text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Finance Tracker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowGame(!showGame)}
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
                title="Play Finance Game"
              >
                <Gamepad2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setShowAddExpense(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Expense
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {showGame && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Financial Decision Collector
              </h2>
              <button
                onClick={() => setShowGame(false)}
                className={`p-2 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <CoinCollectorGame
              darkMode={darkMode}
              onFinish={handleGameFinish}
            />
          </div>
        )}

        {/* Financial Rewards */}
        {gameRewards > 0 && (
          <div
            className={`mb-8 p-4 rounded-lg ${
              darkMode ? "bg-indigo-900/30" : "bg-indigo-50"
            } border ${darkMode ? "border-indigo-800" : "border-indigo-200"}`}
          >
            <div className="flex items-center">
              <DollarSign
                className={`h-6 w-6 mr-2 ${
                  darkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              />
              <div>
                <h3
                  className={`text-lg font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Financial Game Rewards
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  You've earned {gameRewards} finance points by playing the
                  financial literacy game!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } overflow-hidden shadow rounded-lg`}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp
                    className={`h-6 w-6 ${
                      darkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } truncate`}
                    >
                      Total Expenses
                    </dt>
                    <dd
                      className={`text-lg font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ${totalExpenses.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } overflow-hidden shadow rounded-lg`}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PieChart
                    className={`h-6 w-6 ${
                      darkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } truncate`}
                    >
                      Categories
                    </dt>
                    <dd
                      className={`text-lg font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {categories.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } overflow-hidden shadow rounded-lg`}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Target
                    className={`h-6 w-6 ${
                      darkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      } truncate`}
                    >
                      Active Budgets
                    </dt>
                    <dd
                      className={`text-lg font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {budgets.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow`}
          >
            <h3
              className={`text-lg font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              Expense Distribution
            </h3>
            <div className="h-64">
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow`}
          >
            <h3
              className={`text-lg font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              Category Comparison
            </h3>
            <div className="h-64">
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: darkMode ? "#fff" : "#000",
                      },
                    },
                    x: {
                      ticks: {
                        color: darkMode ? "#fff" : "#000",
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: darkMode ? "#fff" : "#000",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow rounded-lg`}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3
              className={`text-lg leading-6 font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              Recent Expenses
            </h3>
            <div className="flow-root">
              <ul
                className={`-my-5 divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {expenses.map((expense) => (
                  <li key={expense.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          } truncate`}
                        >
                          {expense.description || expense.category}
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          ${expense.amount.toFixed(2)}
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {expense.category}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
                {expenses.length === 0 && (
                  <li
                    className={`py-4 text-center ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No expenses recorded yet
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Financial Quotes */}
        <div
          className={`mt-8 p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-lg`}
        >
          <h3
            className={`text-lg font-medium ${
              darkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Today's Financial Wisdom
          </h3>
          <QuotesLandingPage darkMode={darkMode} />
        </div>
      </main>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div
              className={`inline-block align-bottom ${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6`}
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setShowAddExpense(false)}
                  className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                  } rounded-md text-gray-400 hover:text-gray-500 focus:outline-none`}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={addExpense}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="amount"
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      step="0.01"
                      required
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      className={`mt-1 block w-full border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      required
                      value={newExpense.category}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          category: e.target.value,
                        })
                      }
                      className={`mt-1 block w-full border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={newExpense.description}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          description: e.target.value,
                        })
                      }
                      className={`mt-1 block w-full border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300"
                      } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
