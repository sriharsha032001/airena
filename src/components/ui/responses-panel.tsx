import { ResponseData } from "@/app/page";
import { toast } from "react-hot-toast";

interface ResponsesPanelProps {
  modelKey: "gemini" | "chatgpt";
  response: ResponseData | null;
  isLoading: boolean;
}

const MODEL_META = {
  gemini: { label: "Gemini 2.5 Flash", color: "blue" },
  chatgpt: { label: "GPT-4.1 mini", color: "purple" },
};

const ShimmeringLoader = ({ color }: { color: string }) => (
    <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 rounded-xl z-10">
        <div className="flex flex-col items-center gap-3">
            <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin border-${color}-500`}></div>
            <p className={`text-sm font-semibold text-${color}-600`}>AI is thinking...</p>
        </div>
    </div>
);

const CopyButton = ({ text }: { text: string }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        toast.success("Response copied to clipboard!");
    };
    return (
         <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all group"
            title="Copy response"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
        </button>
    )
};


export default function ResponsesPanel({ modelKey, response, isLoading }: ResponsesPanelProps) {
  const meta = MODEL_META[modelKey];

  return (
    <div className="relative w-full h-full min-h-[250px] flex flex-col">
       {isLoading && <ShimmeringLoader color={meta.color} />}
      <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col transition-shadow hover:shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full bg-${meta.color}-100 text-${meta.color}-800`}>
            {meta.label}
          </span>
           {response && (
             <span className="text-xs text-gray-400">{response.time} ms</span>
           )}
        </div>
        
        <div className="flex-grow overflow-y-auto text-gray-800 whitespace-pre-line">
            {response ? (
                response.text ? response.text : <p className="text-red-500">The model returned an empty response.</p>
            ) : (
                <p className="text-gray-400">Waiting for query...</p>
            )}
        </div>
       
        {response && response.text && <CopyButton text={response.text} />}
      </div>
    </div>
  );
} 