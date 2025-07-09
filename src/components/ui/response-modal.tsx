"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clipboard, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface ResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  responseText: string;
  modelName: string;
}

const ResponseModal = ({ isOpen, onClose, responseText, modelName }: ResponseModalProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(responseText);
    setCopied(true);
    toast.success('Response copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">{modelName} - Full Response</h3>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="text-gray-500 hover:text-gray-800 p-1.5 rounded-md transition-colors">
                        {copied ? <Check size={18} className="text-green-500"/> : <Clipboard size={18} />}
                    </button>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1.5 rounded-md transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {responseText}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponseModal;