const Loader = ({ text = "Loading..." }: { text?: string }) => {
  return (
    <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <svg
          className="animate-spin"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity=".2" />
          <path d="M22 12a10 10 0 0 1-10 10" />
        </svg>
        <span className="text-lg font-semibold">{text}</span>
      </div>
    </div>
  );
};

export default Loader;
