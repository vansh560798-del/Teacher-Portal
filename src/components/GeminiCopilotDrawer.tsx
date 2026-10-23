import React, { useState, useRef, useEffect } from 'react';
import { sounds } from '../lib/soundEffects';
import { SCHOOL_INFO } from '../lib/schoolAssets';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  model?: string;
}

interface GeminiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
}

export const GeminiCopilotDrawer: React.FC<GeminiCopilotDrawerProps> = ({
  isOpen,
  onClose,
  teacherName,
}) => {
  const [modelMode, setModelMode] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `Hello ${teacherName}! I am your St. Arnold's AI Pedagogical Partner. I can draft Gujarat Board aligned lesson plans, generate assignments and rubrics, compose sensitive parent communications, and analyze student growth trajectories for your classes. How can I assist you today?`,
      model: 'gemini-3.8-flash',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: textToSend };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    sounds.playNfcTap();

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelMode,
          messages: newHistory.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            text: m.text,
          })),
          systemInstruction: `You are the St. Arnold's High School Godhra AI Pedagogical Partner for faculty members. Assist teachers in curriculum planning, formative assessments, student growth interventions, rubric design, and school administration. Maintain an encouraging, academic tone aligned with St. Arnold's High School values.`,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.text, model: modelMode }]);
        sounds.playSuccessChime();
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            text: 'I could not process that query. Please verify server connectivity.',
            model: modelMode,
          },
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: `Service interruption: ${err?.message || 'Server error'}`,
          model: modelMode,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Draft 5 quiz questions for Physics chapter 3',
    'Write a parent progress note for an improving student',
    'Create rubric for 12th Grade Senior Capstone',
    'Generate differentiated tasks for struggling students',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-[#E8DEC8] shadow-2xl flex flex-col text-slate-900">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#E8DEC8] bg-[#FAF5EB] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#CFA442] to-[#16287A] shrink-0 shadow-sm">
            <img
              src={SCHOOL_INFO.logoEmblem}
              alt="Logo"
              className="w-full h-full object-contain rounded-full bg-white"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#16287A] flex items-center gap-1.5">
              <span>St. Arnold&apos;s AI Partner</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                PRO
              </span>
            </h3>
            <p className="text-[11px] text-stone-500 font-mono">
              Powered by Google Gemini • Godhra Faculty
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-[#F2ECE0] transition cursor-pointer text-lg font-bold"
        >
          ✕
        </button>
      </div>

      {/* Model Mode Switcher */}
      <div className="p-2.5 bg-white border-b border-[#E8DEC8] flex items-center justify-between text-xs font-mono">
        <span className="text-stone-500 text-[11px] font-bold">MODEL ACCELERATOR:</span>
        <div className="flex gap-1 bg-[#FAF5EB] p-1 rounded-xl border border-[#E8DEC8]">
          <button
            onClick={() => setModelMode('gemini-3.8-flash')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              modelMode === 'gemini-3.8-flash'
                ? 'bg-[#16287A] text-white shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            gemini-3.8-flash
          </button>
          <button
            onClick={() => setModelMode('gemini-3.1-flash-lite')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              modelMode === 'gemini-3.1-flash-lite'
                ? 'bg-[#16287A] text-white shadow-xs'
                : 'text-stone-600 hover:text-slate-900'
            }`}
          >
            flash-lite
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF5EB]/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#16287A] text-white rounded-br-none'
                  : 'bg-white text-slate-900 border border-[#E8DEC8] rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line font-sans">{m.text}</div>
            </div>
            {m.model && (
              <span className="text-[9px] font-mono text-stone-400 mt-1 px-1">
                {m.model}
              </span>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#E8DEC8] text-xs text-[#16287A] max-w-[70%]">
            <span className="animate-spin text-sm">✨</span>
            <span className="font-mono text-[11px]">Synthesizing pedagogical guidance...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-white border-t border-[#E8DEC8] overflow-x-auto flex gap-1.5 scrollbar-none">
        {quickPrompts.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="text-[10px] bg-[#FAF5EB] hover:bg-[#F2ECE0] text-[#16287A] border border-[#E8DEC8] px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer font-medium shadow-2xs"
          >
            + {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#E8DEC8] bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask St. Arnold's AI partner anything..."
            className="flex-1 bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#16287A]"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-[#16287A] hover:bg-[#1E3A8A] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
