"use client";
import { ResponseData } from "@/app/query/page";
import Image from 'next/image';
import { Bot, Clipboard, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import TypingIndicator from './typing-indicator';
import { motion, AnimatePresence } from "framer-motion";
import ResponseModal from "./response-modal"; // Import the modal

interface ResponsesPanelProps {
  modelKey: "gemini" | "chatgpt";
  response: ResponseData | null;
  isLoading: boolean;
}

const ResponsesPanel = ({ modelKey, response, isLoading }: ResponsesPanelProps) => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  const handleCopy = () => {
    if (response?.text) {
      navigator.clipboard.writeText(response.text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const modelDetails = {
    gemini: { name: 'Gemini 2.5 Flash', icon: '/globe.svg' },
    chatgpt: { name: 'GPT-4.1 mini', icon: '/window.svg' },
  };

  const { name, icon } = modelDetails[modelKey as keyof typeof modelDetails];

  const TRUNCATE_LENGTH = 400;
  const shouldTruncate = response && response.text.length > TRUNCATE_LENGTH;

  return (
    <>
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-2xl flex flex-col h-full p-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-200/80">
            <div className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                    <Image src={icon} alt={`${name} logo`} width={22} height={22} className="opacity-70" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900">{name}</h2>
            </div>
            {response && (
               <div className="flex items-center gap-3">
                 <span className="text-xs text-gray-400 font-medium">
                    {response.time.toFixed(2)}s
                 </span>
                 <button 
                    onClick={handleCopy} 
                    className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md"
                    aria-label="Copy response"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
                  </button>
               </div>
            )}
        </div>

        {/* Body */}
        <div className="pt-8 flex-grow">
            <AnimatePresence initial={false}>
                <motion.div 
                    key="response-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap max-w-[700px]"
                >
                    {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-gray-400">
                        <TypingIndicator />
                        <span className="text-sm mt-4">Generating response...</span>
                    </div>
                    ) : response ? (
                        <div>
                            {shouldTruncate
                                ? `${response.text.substring(0, TRUNCATE_LENGTH)}...`
                                : response.text
                            }
                        </div>
                    ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 min-h-[150px]">
                        <Bot size={40} className="mb-4 opacity-50" />
                        <p className="font-medium">The AI&apos;s response will appear here.</p>
                        <p className="text-sm">Ready when you are.</p>
                    </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
        
        {/* Footer / Actions */}
        <div className="pt-6 mt-auto">
            {shouldTruncate && (
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 self-start transition-colors"
                >
                  View Full Response
                </button>
            )}
        </div>
        
        {/* Watermark */}
        <div className="absolute bottom-6 right-8 text-gray-900/5 font-bold text-2xl select-none">
            AIrena
        </div>
      </motion.div>

      {response && (
        <ResponseModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          responseText={response.text}
          modelName={name}
        />
      )}
    </>
  );
};

export default ResponsesPanel; 