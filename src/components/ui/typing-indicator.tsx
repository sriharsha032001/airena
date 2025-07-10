const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 p-2">
      <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-0"></span>
      <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-150"></span>
      <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400 delay-300"></span>
    </div>
  );
};

export default TypingIndicator; 