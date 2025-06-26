import { useState } from "react";

const NAV_ITEMS = [
  { label: "New Query", key: "new" },
  { label: "History", key: "history" },
  { label: "Settings", key: "settings" },
];

export default function Sidebar() {
  const [active, setActive] = useState("new");
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#F5F5F5] border-r border-[#e0e0e0] p-6 gap-6 transition-all duration-200 sticky top-0 min-h-screen" style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}>
      <div className="text-xl font-bold mb-8 tracking-tight text-black">Aural</div>
      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`text-base font-semibold text-left px-3 py-2 rounded-lg transition-all ${active === item.key ? 'bg-white text-black shadow-sm border border-[#e0e0e0]' : 'text-[#444] hover:bg-[#e0e0e0] hover:text-black'}`}
            onClick={() => setActive(item.key)}
            aria-current={active === item.key ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
} 