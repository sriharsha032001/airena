"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface TimelineEntry {
  id: string;
  prompt: string;
  models: string[];
  responses: { [model: string]: { text: string; time: number } };
  createdAt: number;
}

interface TimelineContextType {
  timeline: TimelineEntry[];
  addEntry: (entry: TimelineEntry) => void;
  clearTimeline: () => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  const addEntry = (entry: TimelineEntry) => {
    setTimeline((prev) => [...prev, entry]);
  };

  const clearTimeline = () => setTimeline([]);

  // (Future) Add logic to sync with Supabase on login

  return (
    <TimelineContext.Provider value={{ timeline, addEntry, clearTimeline }}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimeline must be used within TimelineProvider");
  return ctx;
} 