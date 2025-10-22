"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  return (
    <main className="flex flex-col min-h-screen max-w-3xl mx-auto py-10 px-4">
      <motion.h1
        className="text-center text-4xl md:text-5xl font-bold mb-10 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Delligram AI 🤖
      </motion.h1>

      <div className="flex-1 overflow-y-auto border border-gray-800 rounded-2xl p-5 bg-[#0b0b1d]/60 shadow-lg space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl ${
              m.role === "user"
                ? "bg-gradient-to-r from-blue-600/50 to-purple-600/50 self-end text-right"
                : "bg-[#101028]/70 text-gray-100"
            }`}
          >
            <p className="font-semibold mb-1 text-sm">
              {m.role === "user" ? "You" : "Delligram AI"}
            </p>
            <p className="leading-relaxed">{m.content}</p>
          </motion.div>
        ))}
        {loading && (
          <p className="text-gray-400 italic text-sm">Delligram AI is thinking...</p>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-6 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about Aztec Network, Noir, or zk proofs..."
          className="flex-1 bg-[#111122] border border-gray-800 rounded-xl p-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:scale-105 transition-transform"
        >
          <Send size={20} />
        </button>
      </div>

      <p className="text-center text-sm mt-8 text-gray-500">
        powered by <span className="text-purple-400">OpenAI GPT-4o</span> | built for{" "}
        <span className="text-blue-400">Aztec Network</span>
      </p>
    </main>
  );
}
