"use client";

const ResponseModal = ({
  content,
  isOpen,
  onClose,
  title,
}: {
  content: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
          >
            &times;
          </button>
        </header>
        <main className="p-4 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm">{content}</pre>
        </main>
      </div>
    </div>
  );
};

export default ResponseModal;
