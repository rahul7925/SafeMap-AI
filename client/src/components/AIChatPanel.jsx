import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  MessageSquare, X, Send, Sparkles, MapPin, Shield,
  Loader2, ChevronRight, Bot, User
} from 'lucide-react';

export default function AIChatPanel({ activeLocation = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '**Welcome to SafeMap AI Assistant.** 👋\n\nI can help you with:\n• Safety analysis for any location\n• Route recommendations\n• Crime predictions & trends\n• Emergency service information\n\nAsk me anything about location safety.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'Is this area safe after 10 PM?',
    'What is the safest route?',
    'Show crime trends this month',
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const prompt = text || input.trim();
    if (!prompt || loading) return;

    setInput('');
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: prompt, timestamp: new Date().toISOString() },
    ]);
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/ai/chat', {
        prompt,
        location: activeLocation || null,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: data.reply || 'I could not generate a response. Please try again.',
          confidence: data.confidence,
          sources: data.sources,
          timestamp: data.timestamp || new Date().toISOString(),
        },
      ]);

      if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
        setSuggestedQuestions(data.suggestedQuestions);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: 'Unable to connect to the AI service. Please check your connection and try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Simple markdown-like renderer for bold and bullets
  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const isBullet = rendered.startsWith('• ') || rendered.startsWith('- ');
      if (isBullet) {
        rendered = rendered.replace(/^[•\-]\s*/, '');
        return (
          <div key={i} className="flex items-start gap-2 ml-1">
            <span className="text-[#2563EB] mt-1.5 shrink-0">•</span>
            <span dangerouslySetInnerHTML={{ __html: rendered }} />
          </div>
        );
      }
      if (!rendered.trim()) return <div key={i} className="h-2" />;
      return <p key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
    });
  };

  return (
    <>
      {/* ── Floating Chat Toggle Button ── */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#2563EB] text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center justify-center cursor-pointer hover:bg-[#1D4ED8] transition-colors"
        >
          <Sparkles size={24} strokeWidth={1.75} />
        </motion.button>
      )}

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[560px] max-h-[80vh] bg-white/95 backdrop-blur-md rounded-[20px] border border-[#E5E7EB] shadow-[0_10px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col font-[Inter,sans-serif]"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white flex items-center justify-center">
                  <Sparkles size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0F172A]">SafeMap AI</div>
                  <div className="text-[12px] text-[#64748B] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Online
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            {/* Active Location Context Badge */}
            {activeLocation && (
              <div className="px-5 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] shrink-0">
                <div className="flex items-center gap-2 text-[12px]">
                  <MapPin size={13} className="text-[#2563EB]" />
                  <span className="font-medium text-[#0F172A] truncate">{activeLocation.name}</span>
                  <span className="text-[#64748B]">•</span>
                  <span className="font-bold text-[#2563EB]">{activeLocation.score || 86}/100</span>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === 'user'
                        ? 'bg-blue-50 text-[#2563EB]'
                        : 'bg-purple-50 text-purple-600'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User size={14} strokeWidth={1.75} />
                    ) : (
                      <Bot size={14} strokeWidth={1.75} />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#2563EB] text-white rounded-br-md'
                        : 'bg-[#F1F5F9] text-[#0F172A] rounded-bl-md'
                    }`}
                  >
                    {renderContent(msg.content)}
                    {msg.confidence && (
                      <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center gap-2 text-[11px] text-[#64748B]">
                        <Shield size={11} /> Confidence: {msg.confidence}%
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Bot size={14} strokeWidth={1.75} />
                  </div>
                  <div className="bg-[#F1F5F9] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2 text-[#64748B] text-[14px]">
                    <Loader2 size={16} className="animate-spin text-[#2563EB]" />
                    Analyzing...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {suggestedQuestions.length > 0 && messages.length <= 2 && (
              <div className="px-5 py-2 border-t border-[#F1F5F9] bg-[#FAFBFC] shrink-0">
                <div className="flex flex-wrap gap-1.5">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-[12px] font-medium text-[#0F172A] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {q}
                      <ChevronRight size={11} className="text-[#94A3B8]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#E5E7EB] bg-white shrink-0">
              <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-full border border-[#E5E7EB] focus-within:border-[#2563EB] px-4 h-[44px] transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about safety, routes, crime..."
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#0F172A] placeholder-[#94A3B8]"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    input.trim()
                      ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                      : 'bg-[#E2E8F0] text-[#94A3B8]'
                  }`}
                >
                  <Send size={15} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
