import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Landmark, Tag, ArrowRight } from 'lucide-react';
import { museumStore } from '../../services/museumStore';
import type { Museum, SubjectItem } from '../../types/museum';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMuseum: (museumId: string) => void;
  onSelectSubject: (subjectName: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMuseum,
  onSelectSubject
}) => {
  const [query, setQuery] = useState('');
  const [museumResults, setMuseumResults] = useState<Museum[]>([]);
  const [subjectResults, setSubjectResults] = useState<SubjectItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live search
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setMuseumResults([]);
      setSubjectResults([]);
      return;
    }

    const allMuseums = museumStore.getPublishedMuseums();
    const allSubjects = museumStore.getSubjects();

    const matchedMuseums = allMuseums.filter(m => 
      m.title.toLowerCase().includes(trimmed) ||
      m.province.toLowerCase().includes(trimmed) ||
      (m.creator && m.creator.toLowerCase().includes(trimmed)) ||
      (m.type && m.type.toLowerCase().includes(trimmed))
    ).slice(0, 6);

    const matchedSubjects = allSubjects.filter(s =>
      s.name.toLowerCase().includes(trimmed)
    ).slice(0, 6);

    setMuseumResults(matchedMuseums);
    setSubjectResults(matchedSubjects);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#fffdf7] rounded-xl shadow-2xl border border-[#d7c8b2] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="relative flex items-center px-4 border-b border-[#d7c8b2] bg-white">
          <Search className="w-5 h-5 text-[#9c7d5c] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อพิพิธภัณฑ์, จังหวัด, หัวเรื่องภูมิปัญญา, หรือประเภท..."
            className="w-full py-4 px-3 text-[#463629] placeholder-[#6f5a45]/50 bg-transparent text-sm focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-[#6f5a45] hover:text-[#463629] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="text-center py-8 text-xs text-[#6f5a45]">
              <p className="font-medium text-sm text-[#463629] mb-1">
                พิมพ์คำค้นหาเพื่อสำรวจ 1,574 พิพิธภัณฑ์ทั่วไทย
              </p>
              <p>ตัวอย่าง: วิถีชีวิต, ผ้าทอ, พระพุทธรูป, นครปฐม, ชุมชน, โบราณคดี</p>
            </div>
          )}

          {query && museumResults.length === 0 && subjectResults.length === 0 && (
            <div className="text-center py-8 text-xs text-[#6f5a45]">
              ไม่พบผลลัพธ์สำหรับ "{query}"
            </div>
          )}

          {/* Subjects results */}
          {subjectResults.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-[#9c7d5c] mb-2 px-2">
                หัวเรื่องภูมิปัญญาที่เกี่ยวข้อง
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {subjectResults.map(subj => (
                  <button
                    key={subj.id}
                    onClick={() => {
                      onSelectSubject(subj.name);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#ece4d4]/60 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-[#e6c12f]" />
                      <span className="text-xs font-medium text-[#463629] group-hover:text-[#9c7d5c]">
                        {subj.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#6f5a45] tabular-nums">
                      {subj.count} แห่ง
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Museum results */}
          {museumResults.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-[#9c7d5c] mb-2 px-2">
                พิพิธภัณฑ์
              </div>
              <div className="space-y-1.5">
                {museumResults.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectMuseum(m.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#ece4d4]/60 text-left transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <Landmark className="w-4 h-4 text-[#9c7d5c] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-[#463629] group-hover:text-[#9c7d5c]">
                          {m.title}
                        </div>
                        <div className="text-[11px] text-[#6f5a45]">
                          <span>{m.type}</span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span>{m.province}</span>
                          {m.subjectList.length > 0 && (
                            <>
                              <span className="mx-1.5" aria-hidden="true">·</span>
                              <span>{m.subjectList.slice(0, 2).join(', ')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#d7c8b2] group-hover:text-[#9c7d5c] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal footer shortcut tips */}
        <div className="px-4 py-2 bg-[#ece4d4]/40 border-t border-[#d7c8b2] flex items-center justify-between text-[11px] text-[#6f5a45]">
          <span>กด <kbd className="px-1 bg-white border border-[#d7c8b2] rounded">ESC</kbd> เพื่อปิด</span>
          <span>ค้นหาจากชุดข้อมูลทางการ ศมส. (SAC)</span>
        </div>
      </div>
    </div>
  );
};
