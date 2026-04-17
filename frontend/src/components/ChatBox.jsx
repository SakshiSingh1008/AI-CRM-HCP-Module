import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatBox({ setFormData, refreshDashboard }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your AI CRM assistant. Describe a doctor interaction and I'll extract and log the structured data for you.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: userMessage,
      });
      refreshDashboard();
     const d = res.data.structured_data;
     const s = res.data.suggestion;
     const summary = res.data.summary;

     setFormData(d);

     const botMessage = `
      Interaction Logged Successfully 

Doctor: ${d?.doctor_name || "-"}
 Date: ${d?.date || "-"}  
Time: ${d?.time || "-"}

 Interaction Type: ${d?.interaction_type || "-"}  
 Attendees: ${d?.attendees || "-"}

🧠Summary:
${summary?.text || "No summary generated"}

 Topics Discussed:
${d?.topics_discussed || "-"}
Outcome: ${d?.outcome || "-"}  
Sentiment: ${d?.sentiment || "-"}

🔁 Follow-up:
${d?.follow_up || "No follow-up"}

💡 AI Suggestion:
${s?.text || "No suggestion generated"}
`;

     setMessages((prev) => [...prev, { role: "bot", text: botMessage }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5 shrink-0 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5" />
            <path
              d="M4.5 7.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="5" cy="5.5" r="0.8" fill="white" />
            <circle cx="9" cy="5.5" r="0.8" fill="white" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-white leading-tight">
            AI Assistant
          </p>
          <p className="text-[10px] text-blue-100">HCP Interaction Logger</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
      </div>

      {/* Messages — only this section scrolls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-bold mr-2 shrink-0 mt-0.5">
                AI
              </div>
            )}
            <div
              className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-bold mr-2 shrink-0 mt-0.5">
              AI
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
              <span
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 bg-white shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            rows={1}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Log an interaction... (Enter to send)"
            style={{ minHeight: "36px", maxHeight: "80px" }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12 7L2 2l2.5 5L2 12l10-5z" fill="white" />
            </svg>
          </button>
        </div>
        <p className="text-[9px] text-gray-300 mt-1.5 text-center">
          Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
