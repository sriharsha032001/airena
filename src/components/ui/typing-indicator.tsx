"use client";
import { motion } from "framer-motion";

const dotVariants = {
  initial: {
    y: "0%",
  },
  animate: {
    y: "100%",
  },
};

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1.5 pl-1">
        <span className="text-gray-500 font-medium text-sm">AI is thinking</span>
        <motion.div
            className="flex h-4 items-end"
            variants={{
                initial: {
                    transition: {
                        staggerChildren: 0.2,
                    },
                },
                animate: {
                    transition: {
                        staggerChildren: 0.2,
                    },
                },
            }}
            initial="initial"
            animate="animate"
        >
            <motion.div variants={dotVariants} transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
            <motion.div variants={dotVariants} transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.1 }} className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
            <motion.div variants={dotVariants} transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }} className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
        </motion.div>
    </div>
  );
};

export default TypingIndicator; 