import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Save, 
  X, 
  Plus, 
  Trash, 
  Eye, 
  MessageSquare, 
  ExternalLink 
} from 'lucide-react';
import { getMascotSizePixels, museumStore } from '../../services/museumStore';
import type { MascotConfig, MascotFaq } from '../../types/museum';

interface AdminMascotViewProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const AdminMascotView: React.FC<AdminMascotViewProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<MascotConfig>(() => museumStore.getMascotConfig());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [enabled, setEnabled] = useState(config.enabled);
  const [name, setName] = useState(config.name);
  const [subtitle, setSubtitle] = useState(config.subtitle);
  const [greeting, setGreeting] = useState(config.greeting);
  const [currentPose, setCurrentPose] = useState(config.currentPose || '/assets/mascot/IMG_8169.PNG');
  const [size, setSize] = useState<number>(() => getMascotSizePixels(config.size));
  const [prompts, setPrompts] = useState<string[]>(config.suggestedPrompts || []);
  const [newPromptText, setNewPromptText] = useState('');
  const [faqs, setFaqs] = useState<MascotFaq[]>(config.customFaqs || []);

  // New FAQ form
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [faqTab, setFaqTab] = useState('graph');

  // List of all 21 available mascot poses from unzipped assets
  const ALL_MASCOT_POSES = [
    { id: '8169', pose: '/assets/mascot/IMG_8169.PNG', label: 'ถือธงสยาม ยิ้มร่าเริง (Flag Bearer)' },
    { id: '8170', pose: '/assets/mascot/IMG_8170.PNG', label: 'อธิบายยิ้มแย้ม (Explaining)' },
    { id: '8171', pose: '/assets/mascot/IMG_8171.PNG', label: 'ยืนสดใส ทักทาย (Cheerful)' },
    { id: '8172', pose: '/assets/mascot/IMG_8172.PNG', label: 'อ้าแขนต้อนรับ ประกายวิบวับ (Welcoming)' },
    { id: '8173', pose: '/assets/mascot/IMG_8173.PNG', label: 'ยืนชี้นิ้วแนะนำ (Pointing)' },
    { id: '8174', pose: '/assets/mascot/IMG_8174.PNG', label: 'มือทาบอก ซาบซึ้ง (Touched)' },
    { id: '8175', pose: '/assets/mascot/IMG_8175.PNG', label: 'ยิ้มปรบมือ ชื่นชม (Clapping)' },
    { id: '8176', pose: '/assets/mascot/IMG_8176.PNG', label: 'ครุ่นคิด แนะนำความรู้ (Thinking)' },
    { id: '8177', pose: '/assets/mascot/IMG_8177.PNG', label: 'กอดอก มั่นใจ (Confident)' },
    { id: '8178', pose: '/assets/mascot/IMG_8178.PNG', label: 'ท่าไหว้ สุภาพเรียบร้อย (Wai Greeting)' },
    { id: '8179', pose: '/assets/mascot/IMG_8179.PNG', label: 'ถือสมุดบันทึก จดค้นคว้า (Journaling)' },
    { id: '8180', pose: '/assets/mascot/IMG_8180.PNG', label: 'ถือแผนที่สำรวจ ๗๗ จังหวัด (Map Explorer)' },
    { id: '8181', pose: '/assets/mascot/IMG_8181.PNG', label: 'ถือกุญแจมรดก (Heritage Key)' },
    { id: '8182', pose: '/assets/mascot/IMG_8182.PNG', label: 'ถือโคมไฟส่องประวัติศาสตร์ (Lantern Search)' },
    { id: '8183', pose: '/assets/mascot/IMG_8183.PNG', label: 'ถือช่อดอกจำปา ถวายความเคารพ (Jasmine Champa)' },
    { id: '8184', pose: '/assets/mascot/IMG_8184.PNG', label: 'อุ้มโบราณวัตถุ ทะนุถนอม (Artifact Care)' },
    { id: '8185', pose: '/assets/mascot/IMG_8185.PNG', label: 'ถือคัมภีร์ใบลาน โบราณคดี (Ancient Scroll)' },
    { id: '8186', pose: '/assets/mascot/IMG_8186.PNG', label: 'ถือแว่นขยาย ค้นหาระเบียน (Magnifying Glass)' },
    { id: '8187', pose: '/assets/mascot/IMG_8187.PNG', label: 'ดวงตาเปล่งประกาย ตื่นตาตื่นใจ (Starry Eyes)' },
    { id: '8188', pose: '/assets/mascot/IMG_8188.PNG', label: 'ท่าโบกมือลา แล้วพบกันใหม่ (Waving)' },
    { id: '8189', pose: '/assets/mascot/IMG_8189.PNG', label: 'ท่านั่งจิบน้ำชา เล่าขาน (Storyteller)' }
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    museumStore.updateMascotConfig({
      enabled,
      name: name.trim(),
      subtitle: subtitle.trim(),
      greeting: greeting.trim(),
      currentPose,
      size,
      suggestedPrompts: prompts,
      customFaqs: faqs
    });
    showToast('บันทึกการตั้งค่ามาสคอตน้องมิวมิวสำเร็จ — ระบบทำงานสดทันที!');
  };

  const handleAddPrompt = () => {
    if (!newPromptText.trim()) return;
    setPrompts(prev => [...prev, newPromptText.trim()]);
    setNewPromptText('');
  };

  const handleRemovePrompt = (idx: number) => {
    setPrompts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddFaq = () => {
    if (!faqQ.trim() || !faqA.trim()) return;
    const newFaq: MascotFaq = {
      id: `faq_${Date.now()}`,
      question: faqQ.trim(),
      answer: faqA.trim(),
      category: 'ทั่วไป',
      targetTab: faqTab
    };
    setFaqs(prev => [...prev, newFaq]);
    setFaqQ('');
    setFaqA('');
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d7c8b2]/60 pb-4">
        <div>
          <h2 className="text-lg font-bold font-editorial text-[#463629] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e6c12f]" />
            <span>จัดการระบบมาสคอตแชทบอท "น้องมิวมิว" (Heritage Chatbot System)</span>
          </h2>
          <p className="text-xs text-[#6f5a45] mt-0.5">
            ปรับแต่งบุคลิก ข้อความต้อนรับ ภาพประจำตัวจากคอลเลกชัน ๒๑ ท่าทาง ปุ่มค้นหาด่วน และฐานความรู้ถาม-ตอบอัตโนมัติ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#d7c8b2] bg-[#fffdf7] cursor-pointer text-xs font-semibold">
            <input
              type="checkbox"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              className="accent-[#9c7d5c] w-4 h-4"
            />
            <span className={enabled ? 'text-emerald-700' : 'text-zinc-500'}>
              {enabled ? 'เปิดแสดงผลน้องมิวมิว (Live)' : 'ปิดการแสดงผล'}
            </span>
          </label>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="space-y-6 text-xs">
        
        {/* Section 1: Character Pose Gallery Picker */}
        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#463629] font-editorial flex items-center gap-2">
                <span>เลือกภาพประจำตัวมาสคอต (Visual Avatar Pose)</span>
                <span className="text-[11px] font-sans font-normal text-[#9c7d5c]">
                  (๒๑ ท่าทางอย่างเป็นทางการ)
                </span>
              </h3>
              <p className="text-[#6f5a45] text-xs">คลิกเลือกภาพท่าทางที่ต้องการให้แสดงผลเป็นไอคอนลอยและในกล่องสนทนา</p>
            </div>
            
            {/* Live Mascot Avatar Preview Card */}
            <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-[#d7c8b2] shadow-2xs">
              <img src={currentPose} alt="Current" className="w-12 h-12 object-contain" />
              <div className="text-[11px] leading-tight">
                <div className="font-bold text-[#463629]">ภาพปัจจุบัน</div>
                <div className="text-[10px] text-[#9c7d5c]">{name}</div>
              </div>
            </div>
          </div>

          {/* 21 Poses Thumbnail Gallery */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
            {ALL_MASCOT_POSES.map(item => {
              const isSelected = currentPose === item.pose;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentPose(item.pose)}
                  className={`relative p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#9c7d5c]/10 border-[#9c7d5c] ring-2 ring-[#9c7d5c]/50 shadow-xs scale-102'
                      : 'bg-white hover:bg-[#fffdf7] border-[#d7c8b2]'
                  }`}
                >
                  <img src={item.pose} alt={item.label} className="w-12 h-12 object-contain" />
                  <span className="text-[9px] text-[#463629] text-center line-clamp-1 font-medium">
                    {item.label}
                  </span>
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#9c7d5c]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Identity & Dialogue Texts */}
        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-[#463629] font-editorial">
            ข้อมูลตัวตนและข้อความเริ่มต้น (Identity & Greeting)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-[#463629]">ชื่อมาสคอต</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#463629]">บทบาทและคำบรรยายใต้ชื่อ</label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
              />
            </div>
          </div>

          {/* Mascot Size Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-[#463629] flex items-center justify-between">
              <span>ขนาดการแสดงผลของมาสคอตบนหน้าเว็บ (Mascot Avatar Size)</span>
              <output className="text-xs font-bold text-[#9c7d5c]">{size} px</output>
            </label>
            <div className="space-y-1">
              <input
                type="range"
                min={48}
                max={280}
                step={2}
                value={size}
                onChange={e => setSize(getMascotSizePixels(Number(e.target.value)))}
                aria-label="ขนาดมาสคอต"
                className="w-full accent-[#9c7d5c] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#6f5a45]">
                <span>48 px — เล็กที่สุด</span>
                <span>280 px — ใหญ่ที่สุด</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#463629]">ข้อความต้อนรับและบอลลูนคำพูด (Greeting Message)</label>
            <textarea
              rows={3}
              value={greeting}
              onChange={e => setGreeting(e.target.value)}
              className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg leading-relaxed"
            />
          </div>
        </div>

        {/* Section 3: Suggested Quick Prompts Manager */}
        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#463629] font-editorial">
              ปุ่มคำถามแนะนำด่วน (Suggested Prompt Chips)
            </h3>
            <span className="text-[11px] text-[#6f5a45]">{prompts.length} คำถาม</span>
          </div>

          {/* Current chips */}
          <div className="flex flex-wrap gap-2">
            {prompts.map((p, pIdx) => (
              <span
                key={pIdx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ece4d4] text-[#463629] rounded-full text-xs font-medium border border-[#d7c8b2]"
              >
                <span>{p}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePrompt(pIdx)}
                  className="p-0.5 hover:text-red-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add prompt input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newPromptText}
              onChange={e => setNewPromptText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPrompt();
                }
              }}
              placeholder="พิมพ์คำถามด่วนใหม่ เช่น สำรวจผ้าทอพื้นถิ่น แล้วกดเพิ่ม"
              className="flex-1 p-2 bg-white border border-[#d7c8b2] rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddPrompt}
              className="px-3 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>เพิ่มปุ่ม</span>
            </button>
          </div>
        </div>

        {/* Section 4: Custom Knowledge FAQs */}
        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#463629] font-editorial">
              ฐานความรู้ถาม-ตอบเฉพาะทาง (Custom Knowledge FAQs)
            </h3>
            <span className="text-[11px] text-[#6f5a45]">{faqs.length} รายการ</span>
          </div>

          <div className="space-y-2">
            {faqs.map(f => (
              <div key={f.id} className="p-3 bg-white border border-[#d7c8b2] rounded-xl flex items-start justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="font-bold text-[#463629] text-xs">คำถาม: {f.question}</div>
                  <div className="text-[11px] text-[#6f5a45] leading-relaxed line-clamp-2">คำตอบ: {f.answer}</div>
                  {f.targetTab && (
                    <div className="text-[10px] text-[#9c7d5c]">นำทางไป: /{f.targetTab}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(f.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer shrink-0"
                  title="ลบคำถามนี้"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new FAQ */}
          <div className="p-3 bg-[#ece4d4]/30 rounded-xl border border-[#d7c8b2] space-y-2 mt-2">
            <div className="font-semibold text-[#463629]">เพิ่มข้อคำถาม-คำตอบใหม่:</div>
            <input
              type="text"
              value={faqQ}
              onChange={e => setFaqQ(e.target.value)}
              placeholder="ข้อความคำถามที่ผู้ใช้มักถาม..."
              className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
            />
            <textarea
              rows={2}
              value={faqA}
              onChange={e => setFaqA(e.target.value)}
              placeholder="คำตอบที่น้องมิวมิวจะใช้ตอบอย่างสุภาพและรอบรู้..."
              className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#6f5a45]">หน้าปลายทางเมื่อคลิกการ์ด:</span>
                <select
                  value={faqTab}
                  onChange={e => setFaqTab(e.target.value)}
                  className="p-1.5 bg-white border border-[#d7c8b2] rounded-lg text-xs"
                >
                  <option value="graph">กราฟความรู้ (Graph)</option>
                  <option value="museums">สารบัญพิพิธภัณฑ์ (Museums)</option>
                  <option value="subjects">สำรวจหัวเรื่อง (Subjects)</option>
                  <option value="about">เกี่ยวกับโครงการ (About)</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-3 py-1.5 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>บันทึก FAQ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d7c8b2]">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่ามาสคอตทั้งหมด</span>
          </button>
        </div>

      </form>

    </div>
  );
};
