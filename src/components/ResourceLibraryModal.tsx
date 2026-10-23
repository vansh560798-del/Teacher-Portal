import React, { useState } from 'react';
import type { TeachingResource } from '../lib/types';
import { sounds } from '../lib/soundEffects';

interface ResourceLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: TeachingResource[];
  onAddResource: (resource: Omit<TeachingResource, 'id'>) => void;
  teacherId: string;
}

export const ResourceLibraryModal: React.FC<ResourceLibraryModalProps> = ({
  isOpen,
  onClose,
  resources,
  onAddResource,
  teacherId,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAiLessonModal, setShowAiLessonModal] = useState(false);

  // New resource state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'note' | 'pdf' | 'plan' | 'presentation'>('note');
  const [subject, setSubject] = useState('Physics');
  const [description, setDescription] = useState('');

  // AI Lesson Planner State
  const [aiTopic, setAiTopic] = useState('Quantum Tunneling & Wavepackets');
  const [aiGrade, setAiGrade] = useState('11th Grade / AP Physics');
  const [aiGeneratedPlan, setAiGeneratedPlan] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!isOpen) return null;

  const filteredResources = resources.filter(r => {
    const matchesFilter = filterType === 'all' || r.type === filterType;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddResource({
      teacherId,
      title,
      type,
      subject,
      description,
      fileUrl: `https://starnoldsgodhra.edu/vault/resources/${Math.random().toString(36).substring(7)}`,
      tags: `${subject}, ${type}`,
      createdAt: new Date().toLocaleDateString(),
    });
    sounds.playSuccessChime();
    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  const handleGenerateAiPlan = async () => {
    setIsGeneratingAi(true);
    setAiGeneratedPlan('');
    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.8-flash',
          messages: [
            {
              role: 'user',
              text: `Generate a structured, engaging 50-minute lesson plan for Topic: "${aiTopic}", Grade Level: "${aiGrade}" at St. Arnold's High School. Include: Learning Objectives, Hook/Warmup (5m), Direct Instruction (20m), Hands-on Group Activity (15m), and Exit Ticket Assessment (10m).`,
            },
          ],
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiGeneratedPlan(data.text);
      }
    } catch (e: any) {
      setAiGeneratedPlan(`Failed to generate lesson plan: ${e?.message}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveAiPlanToLibrary = () => {
    if (!aiGeneratedPlan) return;
    onAddResource({
      teacherId,
      title: `Lesson Plan: ${aiTopic}`,
      type: 'plan',
      subject: 'STEM / Physics',
      description: aiGeneratedPlan.substring(0, 300) + '...',
      tags: 'AI-Generated, STEM, Lesson Plan',
      createdAt: new Date().toLocaleDateString(),
    });
    sounds.playSuccessChime();
    setShowAiLessonModal(false);
    setAiGeneratedPlan('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-white border border-[#E8DEC8] rounded-3xl p-6 shadow-2xl text-slate-900 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#16287A]">Teaching Resource Library</h3>
              <p className="text-xs text-stone-500">St. Arnold&apos;s Notes, PDFs, Lesson Plans & Slide Decks</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiLessonModal(true)}
              className="text-xs bg-[#16287A] hover:bg-[#1E3A8A] text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <span>✨</span> AI Lesson Planner
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-slate-900 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search St. Arnold's resources, topics, or subjects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-[#16287A]"
          />
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'note', 'pdf', 'plan', 'presentation'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer shrink-0 ${
                  filterType === cat ? 'bg-[#16287A] text-white' : 'bg-[#FAF5EB] text-stone-700 hover:text-slate-900 border border-[#E8DEC8]'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#CFA442] hover:bg-[#E6B95C] text-[#0C1748] transition cursor-pointer shrink-0 shadow-xs"
            >
              {showAddForm ? '✕ Close Form' : '+ Upload Resource'}
            </button>
          </div>
        </div>

        {/* Upload Form */}
        {showAddForm && (
          <form onSubmit={handleCreateResource} className="p-4 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8] mb-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-bold mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gujarat Board Physics Chapter 4 Handout"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-bold mb-1">Format Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full bg-white border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-slate-900"
                >
                  <option value="note">Lecture Notes</option>
                  <option value="pdf">PDF Document</option>
                  <option value="plan">Lesson Plan</option>
                  <option value="presentation">Presentation / Slides</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Short Description & Learning Objectives</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Key concepts covered..."
                className="w-full bg-white border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-[#16287A] hover:bg-[#1E3A8A] text-white rounded-xl font-bold cursor-pointer shadow-md"
            >
              Save to Institutional Vault
            </button>
          </form>
        )}

        {/* Resource Cards Grid */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {filteredResources.length === 0 ? (
            <p className="text-center text-stone-500 py-10 text-xs">No resources found matching filter.</p>
          ) : (
            filteredResources.map((res, idx) => (
              <div
                key={res.id || idx}
                className="p-4 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8] hover:border-[#16287A] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-100 text-amber-900">
                      {res.type}
                    </span>
                    <span className="text-xs text-[#16287A] font-bold">{res.subject}</span>
                    <span className="text-[11px] text-stone-500">{res.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{res.title}</h4>
                  {res.description && (
                    <p className="text-xs text-stone-600 line-clamp-2 max-w-xl">{res.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sounds.playSuccessChime();
                      alert(`Accessing St. Arnold's Vault Resource: "${res.title}"`);
                    }}
                    className="text-xs px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#E8DEC8] text-[#16287A] font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>📥</span> Open
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI Lesson Planner Modal */}
        {showAiLessonModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-white border border-[#E8DEC8] rounded-3xl p-6 shadow-2xl text-slate-900 max-h-[88vh] flex flex-col">
              <div className="flex justify-between items-center pb-3 border-b border-[#E8DEC8] mb-4">
                <h4 className="font-bold text-base text-[#16287A] flex items-center gap-2">
                  <span>✨</span> Gemini AI Pedagogical Lesson Planner
                </h4>
                <button
                  onClick={() => setShowAiLessonModal(false)}
                  className="text-stone-400 hover:text-slate-900 cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 mb-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Lesson Topic</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={e => setAiTopic(e.target.value)}
                      className="w-full bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Target Grade & Level</label>
                    <input
                      type="text"
                      value={aiGrade}
                      onChange={e => setAiGrade(e.target.value)}
                      className="w-full bg-[#FAF5EB] border border-[#E8DEC8] rounded-xl px-3 py-1.5 text-slate-900"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateAiPlan}
                  disabled={isGeneratingAi}
                  className="w-full py-2 bg-[#16287A] hover:bg-[#1E3A8A] text-white rounded-xl font-bold transition cursor-pointer disabled:opacity-50 shadow-md"
                >
                  {isGeneratingAi ? 'Structuring 50-Min Lesson Blueprint...' : 'Generate Comprehensive Lesson Plan'}
                </button>
              </div>

              {aiGeneratedPlan && (
                <div className="flex-1 overflow-y-auto p-4 bg-[#FAF5EB] rounded-2xl border border-[#E8DEC8] text-xs text-slate-900 whitespace-pre-line leading-relaxed mb-4 shadow-inner">
                  {aiGeneratedPlan}
                </div>
              )}

              {aiGeneratedPlan && (
                <button
                  onClick={handleSaveAiPlanToLibrary}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Save this Lesson Plan to St. Arnold&apos;s Library
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
