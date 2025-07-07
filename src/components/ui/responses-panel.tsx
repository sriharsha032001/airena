"use client";
import { ResponseData } from "@/app/query/page";
import Image from 'next/image';
import { Bot, Clipboard, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import TypingIndicator from './typing-indicator';
import { motion, AnimatePresence } from "framer-motion";

interface ResponsesPanelProps {
  modelKey: "gemini" | "chatgpt";
  response: ResponseData | null;
  isLoading: boolean;
}

const ResponsesPanel = ({ modelKey, response, isLoading }: ResponsesPanelProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const TRUNCATE_LENGTH = 300;
  const shouldTruncate = response && response.text.length > TRUNCATE_LENGTH;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
            <Image src={icon} alt={`${name} logo`} width={24} height={24} />
            <h2 className="text-lg font-bold text-gray-800">{name}</h2>
        </div>
        {response && (
           <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{response.time.toFixed(2)}s</span>
            <button 
              onClick={handleCopy} 
              className="text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-md"
              aria-label="Copy response"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Clipboard size={16} />}
            </button>
           </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        <motion.div 
            key={isExpanded ? 'expanded' : 'collapsed'}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-gray-700 whitespace-pre-line overflow-hidden prose prose-sm max-w-none"
        >
            {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[100px]">
                <TypingIndicator />
            </div>
            ) : response ? (
                <div className={isExpanded ? "max-h-96 overflow-y-auto pr-2" : ""}>
                    {shouldTruncate && !isExpanded
                        ? `${response.text.substring(0, TRUNCATE_LENGTH)}...`
                        : response.text
                    }
                </div>
            ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 min-h-[100px]">
                <Bot size={32} className="mb-2" />
                <p>AI response will appear here.</p>
            </div>
            )}
        </motion.div>
      </AnimatePresence>
      
      {shouldTruncate && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 self-start"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
      )}
    </div>
  );
};

export default ResponsesPanel; 