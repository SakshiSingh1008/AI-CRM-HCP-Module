import { useState, useEffect } from "react";
import axios from "axios";
import InteractionForm from "./components/InteractionForm";
import ChatBox from "./components/ChatBox";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [formData, setFormData] = useState({});
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    fetchDashboard();
    loadInteractions();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:8000/dashboard");
      setDashboard(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  const loadInteractions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/interactions");
      if (res.data.length > 0) {
        setFormData(res.data[res.data.length - 1]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="h-screen w-screen overflow-hidden flex flex-col bg-[#F0F2F7]"
    >
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M2 8h8M2 12h10"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900 leading-tight">
              HCP Interaction CRM
            </h1>
            <p className="text-[10px] text-gray-400">
              AI-powered healthcare engagement platform
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            ● Live
          </span>
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-semibold">
            A
          </div>
        </div>
      </header>

      {/* DASHBOARD STRIP */}
      <div className="shrink-0 px-6 pt-3">
        <Dashboard data={dashboard} />
      </div>

      {/* MAIN GRID — fills remaining height */}
      <div className="flex gap-4 px-6 pb-4 pt-3 flex-1 min-h-0">
        {/* LEFT - FORM (scrolls only if content overflows, but ideally fits) */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          <InteractionForm formData={formData} />
        </div>

        {/* RIGHT - CHAT — fixed height, internal scroll */}
        <div className="w-[340px] shrink-0 flex flex-col min-h-0">
          <ChatBox
            setFormData={setFormData}
            refreshDashboard={fetchDashboard}
          />
        </div>
      </div>
    </div>
  );
}
