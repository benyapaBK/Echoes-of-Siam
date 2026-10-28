import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Search, 
  Network, 
  Landmark, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, meta?: any) => void;
}

const HELP_SECTIONS = [
  {
    id: 'intro',
    title: 'บทนำและภาพรวมเว็บไซต์',
    icon: Compass,
    content: (
      <div className="space-y-3">
        <h4 className="font-editorial text-base font-bold text-[#463629]">
          ยินดีต้อนรับสู่ Echoes of Siam (สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์)
        </h4>
        <p className="text-xs sm:text-sm text-[#6f5a45] leading-relaxed">
          แพลตฟอร์มนี้เป็นคลังข้อมูลดิจิทัลและแผนที่องค์ความรู้ที่รวบรวมข้อมูลพิพิธภัณฑ์ 1,574 แห่งทั่ว 77 จังหวัดในประเทศไทย จากศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน) เพื่อสนับสนุนการศึกษา วิจัย และการเรียนรู้ตลอดชีวิต
        </p>
        <div className="p-3 bg-[#ece4d4]/50 rounded-xl border border-[#d7c8b2] space-y-1.5 text-xs">
          <div className="font-bold text-[#463629]">✨ จุดเด่นสำคัญ:</div>
          <ul className="list-disc list-inside space-y-1 text-[#6f5a45]">
            <li>ค้นพบความเชื่อมโยงของ 2,460 หัวเรื่องผ่าน Knowledge Graph</li>
            <li>สำรวจแผนภาพกราฟความรู้หลัก (Image Knowledge Graph) และมุมมอง Neo4j Bloom</li>
            <li>แชทบอทมาสคอต "น้องมิวมิว" ช่วยตอบคำถามและนำทางค้นคว้าตลอด 24 ชั่วโมง</li>
            <li>ข้อมูลเปิดภาครัฐภายใต้สัญญาอนุญาต Open Government License</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'museums',
    title: 'วิธีสืบค้นคลังพิพิธภัณฑ์ 1,574 แห่ง',
    icon: Landmark,
    content: (
      <div className="space-y-3">
        <h4 className="font-editorial text-base font-bold text-[#463629]">
          การค้นหาและกรองข้อมูลพิพิธภัณฑ์
        </h4>
        <p className="text-xs sm:text-sm text-[#6f5a45] leading-relaxed">
          ผู้ใช้งานสามารถค้นหาพิพิธภัณฑ์ได้อย่างสะดวกรวดเร็วผ่านเครื่องมือสืบค้นขั้นสูง:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#d7c8b2] space-y-1">
            <div className="font-bold text-[#9c7d5c] flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>ค้นหาด่วน (⌘K หรือ Ctrl+K)</span>
            </div>
            <p className="text-[#6f5a45] text-[11px] leading-relaxed">
              กดปุ่มค้นหาบนแถบเมนูด้านบน หรือพิมพ์คีย์ลัด ⌘K เพื่อพิมพ์ชื่อพิพิธภัณฑ์ หรือหัวเรื่องที่ต้องการได้ทันที
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#d7c8b2] space-y-1">
            <div className="font-bold text-[#9c7d5c] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>ตัวกรอง 77 จังหวัด & ประเภท</span>
            </div>
            <p className="text-[#6f5a45] text-[11px] leading-relaxed">
              ในหน้า "พิพิธภัณฑ์" สามารถเลือกกรองตามภูมิภาคและประเภท เช่น โบราณคดี, วัด, ชุมชน, มหาวิทยาลัย
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'graph',
    title: 'วิธีใช้งานกราฟความรู้ (Knowledge Graph)',
    icon: Network,
    content: (
      <div className="space-y-3">
        <h4 className="font-editorial text-base font-bold text-[#463629]">
          การอ่านแผนผังและการสำรวจความเชื่อมโยง
        </h4>
        <p className="text-xs sm:text-sm text-[#6f5a45] leading-relaxed">
          ระบบจัดเตรียมกราฟความรู้ 3 รูปแบบเพื่อตอบโจทย์การเรียนรู้ทุกระดับ:
        </p>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#fffdf7] rounded-xl border border-[#d7c8b2] flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#9c7d5c] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
            <div>
              <div className="font-bold text-[#463629]">แผนภาพกราฟความรู้หลัก (Image Knowledge Graph - เมนหลัก)</div>
              <p className="text-[#6f5a45] text-[11px] leading-relaxed">
                แผนภาพมหาจักรวาลความรู้สยาม (The Living Memory Universe) พร้อมคำอธิบาย ๔ มิติหลัก (โบราณคดี, งานช่างหลวง, วิถีชน, และ ๗๗ จังหวัด) รองรับการซูมและเปิดดูเต็มจอ
              </p>
            </div>
          </div>
          <div className="p-3 bg-[#fffdf7] rounded-xl border border-[#d7c8b2] flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#e6c12f] text-[#463629] flex items-center justify-center font-bold text-xs shrink-0">2</span>
            <div>
              <div className="font-bold text-[#463629]">มุมมองบูมสำเร็จรูป (Neo4j Bloom Presets)</div>
              <p className="text-[#6f5a45] text-[11px] leading-relaxed">
                เลือกคลิกหัวข้อที่สนใจ เช่น โบราณคดีบ้านเชียง, เครือข่าย 77 จังหวัด, หรืองานช่างหลวง ระบบจะจัดกลุ่มโหนดและเส้นเชื่อมโยงให้โดยอัตโนมัติ
              </p>
            </div>
          </div>
          <div className="p-3 bg-[#fffdf7] rounded-xl border border-[#d7c8b2] flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#ece4d4] text-[#463629] flex items-center justify-center font-bold text-xs shrink-0">3</span>
            <div>
              <div className="font-bold text-[#463629]">กราฟปฏิสัมพันธ์สด (Cytoscape Network)</div>
              <p className="text-[#6f5a45] text-[11px] leading-relaxed">
                สามารถคลิกจับลากโหนดเพื่อสำรวจความสัมพันธ์รอบตัว (Ego Network) พร้อมดูรายละเอียดระดับโหนดได้ทันที
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'mascot',
    title: 'คำแนะนำการใช้งาน "น้องมิวมิว" (Mascot Chatbot)',
    icon: Sparkles,
    content: (
      <div className="space-y-3">
        <h4 className="font-editorial text-base font-bold text-[#463629]">
          คุยกับ "น้องมิวมิว" ผู้ช่วยสืบค้นมรดกสยาม
        </h4>
        <p className="text-xs sm:text-sm text-[#6f5a45] leading-relaxed">
          น้องมิวมิวคือมาสคอตประจำเว็บไซต์ที่ลอยอยู่มุมล่างขวาของหน้าจอ พร้อมคอยแนะนำและค้นหาข้อมูลให้คุณตลอดเวลา:
        </p>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1.5 text-amber-900">
          <div className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#e6c12f]" />
            <span>ตัวอย่างคำถามที่น้องมิวมิวช่วยคุณได้:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            <li>"แนะนำพิพิธภัณฑ์ที่ไม่ควรพลาดในกรุงเทพฯ"</li>
            <li>"อยากศึกษาเรื่องผ้าทอ มีพิพิธภัณฑ์ไหนบ้าง?"</li>
            <li>"กราฟความรู้ใช้งานอย่างไร?"</li>
            <li>"มีพิพิธภัณฑ์โบราณคดีที่ไหนบ้างใกล้ฉัน?"</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'sources',
    title: 'แหล่งข้อมูลและลิขสิทธิ์ (Open Data License)',
    icon: ShieldCheck,
    content: (
      <div className="space-y-3">
        <h4 className="font-editorial text-base font-bold text-[#463629]">
          ความโปร่งใสและที่มาของชุดข้อมูล
        </h4>
        <p className="text-xs sm:text-sm text-[#6f5a45] leading-relaxed">
          ข้อมูลทั้งหมดใน Echoes of Siam มาจากชุดข้อมูลเปิดภาครัฐของศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน) เผยแพร่ผ่านเว็บไซต์ thaigovdata.com
        </p>
        <div className="p-3 bg-white rounded-xl border border-[#d7c8b2] text-xs space-y-1">
          <div className="font-bold text-[#463629]">สัญญาอนุญาต:</div>
          <p className="text-[#6f5a45]">
            DGA Open Government License ประเทศไทย อนุญาตให้นำไปใช้เพื่อการศึกษา วิจัย และเผยแพร่โดยระบุที่มา
          </p>
        </div>
      </div>
    )
  }
];

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string>('intro');

  if (!isOpen) return null;

  const currentSection = HELP_SECTIONS.find(s => s.id === activeTab) || HELP_SECTIONS[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-label="คู่มือและศูนย์ช่วยเหลือผู้ใช้งาน"
    >
      <div 
        className="bg-white rounded-2xl border border-[#d7c8b2] max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#fffdf7] border-b border-[#d7c8b2] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#9c7d5c]/15 flex items-center justify-center text-[#9c7d5c] shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg font-bold text-[#463629]">
                ศูนย์ช่วยเหลือและคู่มือการใช้งาน (User Guide)
              </h3>
              <p className="text-xs text-[#6f5a45]">
                คำแนะนำการสำรวจคลังพิพิธภัณฑ์ กราฟความรู้ และการใช้งานระบบ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6f5a45] hover:text-[#463629] rounded-lg hover:bg-[#ece4d4]/60 transition-colors cursor-pointer"
            aria-label="ปิดคู่มือ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Tab Menu + Right Detail */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Menu (4 cols) */}
          <nav className="md:col-span-4 bg-[#fffdf7] border-r border-[#d7c8b2] p-3 space-y-1 overflow-y-auto">
            {HELP_SECTIONS.map(section => {
              const Icon = section.icon;
              const isActive = activeTab === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-heading transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#9c7d5c] text-white font-semibold shadow-xs'
                      : 'text-[#6f5a45] hover:bg-[#ece4d4]/50 hover:text-[#463629]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#9c7d5c]'}`} />
                  <span className="truncate">{section.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Content Area (8 cols) */}
          <div className="md:col-span-8 p-6 overflow-y-auto bg-white space-y-6">
            {currentSection.content}

            {/* Quick Navigation Footer */}
            <div className="pt-4 border-t border-[#d7c8b2]/60 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-[#6f5a45]">
                ต้องการความช่วยเหลือเพิ่มเติม สามารถสอบถาม <strong>น้องมิวมิว</strong> ได้ตลอดเวลา
              </span>
              <button
                onClick={() => {
                  onClose();
                  onNavigate('museums');
                }}
                className="px-4 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <span>เริ่มสำรวจพิพิธภัณฑ์</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
