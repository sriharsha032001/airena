"use client";
import { motion } from "framer-motion";

const Loader = ({ text = "Loading..." }: { text?: string }) => (
  <div 
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
    aria-busy="true"
    aria-live="polite"
    aria-label={text}
  >
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow-xl"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-dashed border-blue-600"></div>
      <span className="text-lg font-semibold text-gray-800">{text}</span>
    </motion.div>
  </div>
);

export default Loader; 