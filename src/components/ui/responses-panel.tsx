"use client";
import { ResponseData } from "@/app/query/page";
import Image from 'next/image';
import { Bot, Zap, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import TypingIndicator from './typing-indicator';
import { motion, AnimatePresence } from "framer-motion";
import ResponseModal from "./response-modal";

interface ResponsesPanelProps {
  modelKey: "gemini" | "chatgpt";
  response: ResponseData | null;
  isLoading: boolean;
}

const ResponsesPanel = ({ modelKey, response, isLoading }: ResponsesPanelProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modelDetails = {
    gemini: { name: 'Gemini 2.5 Flash', icon: '/globe.svg', color: 'from-blue-400 to-purple-500' },
    chatgpt: { name: 'GPT-4.1 mini', icon: '/window.svg', color: 'from-green-400 to-teal-500' },
  };

  const { name, icon, color } = modelDetails[modelKey];

  const TRUNCATE_LENGTH = 500;
  const shouldTruncate = response && response.text.length > TRUNCATE_LENGTH;

  return (
    <>
      <motion.div
        layout
        className="bg-[#fafafd] rounded-2xl shadow-lg border border-gray-200/60 flex flex-col h-full relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.015, boxShadow: "0px 10px 30px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200/80">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${color}`}>
              <Image src={icon} alt={`${name} logo`} width={18} height={18} className="opacity-90" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">{name}</h2>
          </div>
          {response && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-500">
                <Zap size={12} className="text-gray-400"/>
                <span>{response.time.toFixed(2)}s</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 flex-grow relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400"
              >
                <TypingIndicator />
                <span className="text-sm mt-4">Generating response...</span>
              </motion.div>
            ) : response ? (
              <motion.div
                key="response"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap relative"
              >
                <p>{shouldTruncate ? `${response.text.substring(0, TRUNCATE_LENGTH)}` : response.text}</p>
                {shouldTruncate && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fafafd] to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pt-10">
                      <motion.button
                        onClick={() => setIsModalOpen(true)}
                        className="group text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        whileHover="hover"
                      >
                        View Full Response
                        <motion.div
                          className="h-0.5 bg-blue-600 mt-0.5"
                          variants={{
                            initial: { width: "0%" },
                            hover: { width: "100%" },
                          }}
                          initial="initial"
                          transition={{ duration: 0.3 }}
                        ></motion.div>
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center text-gray-400 min-h-[200px]"
              >
                <Bot size={40} className="mb-4 opacity-50" />
                <p className="font-medium">The AI&apos;s response will appear here.</p>
                <p className="text-sm">Ready when you are.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {response && (
          <div className="px-6 pb-6 mt-auto border-t border-gray-200/80 pt-4">
            <div className="flex justify-end items-center gap-2">
                <p className="text-xs text-gray-400 mr-2">Was this response helpful?</p>
                <motion.button whileTap={{ scale: 0.9 }} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <ThumbsUp size={16} className="text-gray-400" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.9 }} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                    <ThumbsDown size={16} className="text-gray-400" />
                </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {response && (
        <ResponseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={name}
          content={response.text}
        />
      )}
    </>
  );
};

export default ResponsesPanel; 