import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const financialQuotes = [
  "The art is not in making money, but in keeping it.",
  "Beware of little expenses; a small leak will sink a great ship.",
  "A budget is telling your money where to go instead of wondering where it went.",
  "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.",
  "Never spend your money before you have it.",
  "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, and shows the value of money.",
  "Don't save what is left after spending, spend what is left after saving.",
  "It's not your salary that makes you rich, it's your spending habits.",
  "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
  "Know what you own, and know why you own it.",
  "The only thing worse than being broke is being broke and not knowing why.",
];

interface QuotesLandingPageProps {
  darkMode: boolean;
}

const QuotesLandingPage = ({ darkMode }: QuotesLandingPageProps) => {
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * financialQuotes.length);
    setCurrentQuote(financialQuotes[randomIndex]);
  }, []);

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center p-8">
        <blockquote
          className={`text-2xl italic font-light ${
            darkMode ? "text-gray-300" : "text-gray-700"
          } mb-6`}
        >
          "{currentQuote}"
        </blockquote>
        <div
          className={`mt-4 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          — Financial Wisdom
        </div>
      </div>
    </motion.div>
  );
};

export default QuotesLandingPage;
