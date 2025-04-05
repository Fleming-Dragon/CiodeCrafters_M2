import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Award, HelpCircle, RefreshCw, BookOpen } from "lucide-react";

interface QuizGameProps {
  darkMode: boolean;
  onFinish?: (score: number) => void;
}

// Quiz questions about financial literacy
const QUIZ_QUESTIONS = [
  {
    question: "What is the recommended percentage of income to save?",
    options: ["5%", "10-15%", "20%", "50%"],
    correctAnswer: "20%",
    explanation:
      "Financial experts recommend saving at least 20% of your income for long-term financial security.",
  },
  {
    question:
      "Which type of investment typically has the highest long-term returns?",
    options: ["Savings accounts", "Bonds", "Stocks", "Certificates of deposit"],
    correctAnswer: "Stocks",
    explanation:
      "While stocks have higher volatility in the short term, they historically provide the highest returns over the long run.",
  },
  {
    question: "What is an emergency fund?",
    options: [
      "Money set aside for vacations",
      "Savings for 3-6 months of expenses",
      "Investment in high-risk stocks",
      "Money for impulse purchases",
    ],
    correctAnswer: "Savings for 3-6 months of expenses",
    explanation:
      "An emergency fund should cover 3-6 months of essential expenses to protect against unexpected events like job loss or medical emergencies.",
  },
  {
    question: "What is compound interest?",
    options: [
      "Interest paid only on the principal amount",
      "Interest paid on both principal and accumulated interest",
      "Interest that decreases over time",
      "A fixed interest rate for loans",
    ],
    correctAnswer: "Interest paid on both principal and accumulated interest",
    explanation:
      "Compound interest is when you earn interest on both your initial investment and on the interest you've already earned, accelerating growth over time.",
  },
  {
    question: "Which is generally NOT a good debt?",
    options: [
      "Mortgage for a home",
      "Student loan for education",
      "High-interest credit card debt",
      "Small business loan",
    ],
    correctAnswer: "High-interest credit card debt",
    explanation:
      "High-interest credit card debt is typically used for consumption rather than investments and can quickly spiral due to compounding interest rates.",
  },
  {
    question: "What is a good credit score in the US?",
    options: ["Below 600", "600-670", "670-740", "740-850"],
    correctAnswer: "740-850",
    explanation:
      "Credit scores of 740 and higher are generally considered very good to excellent, qualifying for the best terms on loans and credit.",
  },
  {
    question: "What is the best age to start saving for retirement?",
    options: ["In your 20s", "In your 30s", "In your 40s", "In your 50s"],
    correctAnswer: "In your 20s",
    explanation:
      "Starting in your 20s gives your investments the most time to compound and grow, requiring less monthly savings to reach the same retirement goals.",
  },
  {
    question: "What is diversification in investing?",
    options: [
      "Putting all money in one investment",
      "Investing only in stocks",
      "Spreading investments across different asset classes",
      "Changing investments frequently",
    ],
    correctAnswer: "Spreading investments across different asset classes",
    explanation:
      "Diversification reduces risk by spreading investments across various asset classes that may perform differently under the same market conditions.",
  },
  {
    question: "What is the primary purpose of a budget?",
    options: [
      "To limit your spending on enjoyable things",
      "To track where your money goes and plan accordingly",
      "To impress financial advisors",
      "To calculate how much you can borrow",
    ],
    correctAnswer: "To track where your money goes and plan accordingly",
    explanation:
      "A budget helps you understand your cash flow, prioritize spending, and ensure you're meeting savings goals and living within your means.",
  },
  {
    question: "What is the rule of 72 in finance?",
    options: [
      "A tax regulation",
      "A formula to estimate how long it takes to double money",
      "The retirement age in some countries",
      "Maximum debt-to-income ratio",
    ],
    correctAnswer: "A formula to estimate how long it takes to double money",
    explanation:
      "The Rule of 72 is a simple way to determine how long it'll take for your investment to double: divide 72 by the annual rate of return.",
  },
];

const FinancialQuizGame: React.FC<QuizGameProps> = ({ darkMode, onFinish }) => {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("financeQuizHighScore");
    return saved ? parseInt(saved) : 0;
  });
  const [quizQuestions, setQuizQuestions] = useState(QUIZ_QUESTIONS);

  // Start the game
  const startGame = () => {
    // Shuffle questions for each game
    const shuffledQuestions = [...QUIZ_QUESTIONS].sort(
      () => Math.random() - 0.5
    );
    setQuizQuestions(shuffledQuestions.slice(0, 5)); // Take only 5 questions per game
    setGameStarted(true);
    setGameEnded(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return; // Prevent changing answer after selection

    setSelectedAnswer(answer);
    const currentQuestion = quizQuestions[currentQuestionIndex];

    if (answer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 20); // 20 points per correct answer
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setShowExplanation(true);
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      endGame();
    }
  };

  // End the game
  const endGame = () => {
    setGameEnded(true);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("financeQuizHighScore", score.toString());
    }

    if (onFinish) {
      onFinish(score);
    }
  };

  // Calculate progress percentage
  const progressPercentage =
    ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="flex flex-col w-full">
      {!gameStarted ? (
        <div
          className={`p-6 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Financial Literacy Quiz
          </h2>

          <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Test your financial knowledge with this quick quiz! Answer questions
            about saving, investing, and money management to improve your
            financial literacy.
          </p>

          <div
            className={`mb-6 p-4 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-blue-50"
            }`}
          >
            <h3
              className={`text-lg font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Quiz Details
            </h3>
            <ul
              className={`list-disc pl-5 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <li>5 questions about personal finance</li>
              <li>Multiple choice format</li>
              <li>Explanations for each answer</li>
              <li>20 points for each correct answer</li>
              <li>Learn as you play!</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-all flex items-center"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Quiz
            </motion.button>
          </div>
        </div>
      ) : (
        <div
          className={`p-6 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          {!gameEnded ? (
            <>
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Question {currentQuestionIndex + 1} of{" "}
                    {quizQuestions.length}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Score: {score}
                  </span>
                </div>
                <div
                  className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${
                    darkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Current question */}
              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {quizQuestions[currentQuestionIndex].question}
                </h3>

                <div className="space-y-3">
                  {quizQuestions[currentQuestionIndex].options.map(
                    (option, index) => (
                      <motion.button
                        key={index}
                        whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                        whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={!!selectedAnswer}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          selectedAnswer
                            ? option ===
                              quizQuestions[currentQuestionIndex].correctAnswer
                              ? darkMode
                                ? "bg-green-900/50 border-green-700 text-green-200"
                                : "bg-green-100 border-green-500 text-green-800"
                              : option === selectedAnswer
                              ? darkMode
                                ? "bg-red-900/50 border-red-700 text-red-200"
                                : "bg-red-100 border-red-500 text-red-800"
                              : darkMode
                              ? "bg-gray-700 border-gray-600 text-gray-300"
                              : "bg-gray-50 border-gray-200 text-gray-500"
                            : darkMode
                            ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                            : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{option}</span>
                          {selectedAnswer &&
                            (option ===
                            quizQuestions[currentQuestionIndex]
                              .correctAnswer ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : option === selectedAnswer ? (
                              <X className="h-5 w-5 text-red-500" />
                            ) : null)}
                        </div>
                      </motion.button>
                    )
                  )}
                </div>
              </div>

              {/* Explanation */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg ${
                    isCorrect
                      ? darkMode
                        ? "bg-green-900/30 border border-green-800"
                        : "bg-green-50 border border-green-200"
                      : darkMode
                      ? "bg-red-900/30 border border-red-800"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-1 rounded-full ${
                        isCorrect
                          ? darkMode
                            ? "bg-green-800"
                            : "bg-green-100"
                          : darkMode
                          ? "bg-red-800"
                          : "bg-red-100"
                      } mr-3 mt-0.5 flex-shrink-0`}
                    >
                      {isCorrect ? (
                        <Check
                          className={`h-4 w-4 ${
                            darkMode ? "text-green-200" : "text-green-600"
                          }`}
                        />
                      ) : (
                        <X
                          className={`h-4 w-4 ${
                            darkMode ? "text-red-200" : "text-red-600"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          isCorrect
                            ? darkMode
                              ? "text-green-200"
                              : "text-green-800"
                            : darkMode
                            ? "text-red-200"
                            : "text-red-800"
                        }`}
                      >
                        {isCorrect ? "Correct!" : "Incorrect!"}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {quizQuestions[currentQuestionIndex].explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Next button */}
              {selectedAnswer && (
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-all"
                  >
                    {currentQuestionIndex < quizQuestions.length - 1
                      ? "Next Question"
                      : "See Results"}
                  </motion.button>
                </div>
              )}
            </>
          ) : (
            // Game results
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <h2
                className={`text-2xl font-bold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Quiz Complete!
              </h2>

              <div className="mb-8">
                <p
                  className={`text-lg ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Your Score:
                </p>
                <p
                  className={`text-5xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {score}
                </p>
                <p
                  className={`mt-2 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {score >= 80
                    ? "Financial Expert! 🌟"
                    : score >= 60
                    ? "Good Knowledge! 👍"
                    : score >= 40
                    ? "Getting There! 📈"
                    : "Keep Learning! 📚"}
                </p>

                {score === highScore && score > 0 && (
                  <div
                    className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode
                        ? "bg-indigo-900/50 text-indigo-300"
                        : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    <Award className="h-3 w-3 mr-1" /> New High Score!
                  </div>
                )}
              </div>

              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-blue-50"
                } mb-8`}
              >
                <div className="flex items-start">
                  <HelpCircle
                    className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                      darkMode ? "text-blue-400" : "text-blue-500"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Financial literacy is a journey! Regular learning and
                    practice will help you make better financial decisions.
                    Consider trying again to improve your score or check out our
                    resources section for more financial education.
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-all flex items-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameStarted(false)}
                  className={`px-6 py-2 rounded-lg font-medium shadow-md ${
                    darkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  } transition-all`}
                >
                  Main Menu
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialQuizGame;
