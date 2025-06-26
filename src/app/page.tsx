"use client";
import ProtectedRoute from "@/components/providers/protected-route";
import { useAuth } from "@/components/providers/auth-provider";
import QueryForm from "@/components/forms/query-form";
import ResponsesPanel from "../components/ui/responses-panel";

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <span className="text-lg text-black">Loading...</span>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <main
        className="w-full min-h-screen flex flex-col items-center justify-start px-2 md:px-8 pt-8 pb-4 bg-white"
        style={{ fontFamily: 'Open Sans, ui-sans-serif, sans-serif' }}
      >
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
          {/* Left: Query input, model selector, send button */}
          <div className="col-span-1 flex flex-col gap-8">
            <QueryForm />
          </div>
          {/* Right: Prompt display + AI responses */}
          <div className="col-span-2 flex flex-col gap-8">
            <ResponsesPanel />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
