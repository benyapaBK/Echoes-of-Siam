import React, { useState } from 'react';
import { 
  HelpCircle, 
  Compass, 
  Search, 
  Network, 
  Landmark, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface HelpCenterProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#ece4d4]/70 border border-[#d7c8b2] rounded-full text-xs font-heading font-medium text-[#463629] shadow-2xs">
          <HelpCircle className="w-3.5 h-3.5 text-[#9c7d5c]" />
          <span>ศูนย์ช่วยเหลือและคู่มือการใช้งาน • User Support & Knowledge Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#463629]">
          ศูนย์ช่วยเหลือผู้ใช้งาน
        </h1>
        <p className="text-xs sm:text-sm text-[#6f5a45] leading-relaxed">
          คู่มือการใช้งานระบบคลังข้อมูลพิพิธภัณฑ์ 1,574 แห่ง การสำรวจหัวเรื่อง และการทำความเข้าใจสถาปัตยกรรมกราฟความรู้สยามเล่าขาน
        </p>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Museum Explorer */}
        <div className="p-6 bg-white rounded-2xl border border-[#d7c8b2] shadow-2xs hover:border-[#9c7d5c] transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#9c7d5c]/10 flex items-center justify-center text-[#9c7d5c]">
            <Landmark className="w-5 h-5" />
          </div>
          <h2 className="font-editorial text-lg font-bold text-[#463629]">
            ๑. การสืบค้นคลังพิพิธภัณฑ์ (1,574 แห่ง)
          </h2>
          <p className="text-xs text-[#6f5a45] leading-relaxed">
            ค้นหาพิพิธภัณฑ์ด้วยชื่อ สถานที่ตั้ง 77 จังหวัด หรือคำสำคัญ พร้อมตัวกรองประเภทอย่างละเอียด เช่น พิพิธภัณฑ์ชุมชน โบราณคดี ศิลปะ วัด และมหาวิทยาลัย
          </p>
          <button
            onClick={() => onNavigate('museums')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9c7d5c] hover:text-[#856748] pt-1"
          >
            <span>ไปที่หน้าสารบัญพิพิธภัณฑ์</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Knowledge Graph */}
        <div className="p-6 bg-white rounded-2xl border border-[#d7c8b2] shadow-2xs hover:border-[#9c7d5c] transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e6c12f]/20 flex items-center justify-center text-[#9c7d5c]">
            <Network className="w-5 h-5" />
          </div>
          <h2 className="font-editorial text-lg font-bold text-[#463629]">
            ๒. การใช้งานกราฟความรู้ (Knowledge Graph)
          </h2>
          <p className="text-xs text-[#6f5a45] leading-relaxed">
            เริ่มต้นด้วย <strong>แผนภาพกราฟความรู้หลัก (Image Knowledge Graph)</strong> ที่สรุป ๔ มิติสำคัญของสยาม หรือสลับไปดู <strong>มุมมองบูมสำเร็จรูป Neo4j Bloom</strong> และกราฟสดแบบมีปฏิสัมพันธ์
          </p>
          <button
            onClick={() => onNavigate('graph')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9c7d5c] hover:text-[#856748] pt-1"
          >
            <span>เปิดสำรวจกราฟความรู้</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Mascot Nong Miu Miu */}
        <div className="p-6 bg-white rounded-2xl border border-[#d7c8b2] shadow-2xs hover:border-[#9c7d5c] transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
            <Sparkles className="w-5 h-5 text-[#e6c12f]" />
          </div>
          <h2 className="font-editorial text-lg font-bold text-[#463629]">
            ๓. ผู้ช่วยอัจฉริยะ "น้องมิวมิว"
          </h2>
          <p className="text-xs text-[#6f5a45] leading-relaxed">
            คลิกที่ตัวละครน้องมิวมิวที่ลอยอยู่มุมล่างขวา เพื่อสอบถามข้อมูลพิพิธภัณฑ์ แนะนำสถานที่ท่องเที่ยวเชิงประวัติศาสตร์ หรือสอบถามวิธีใช้งานระบบได้ตลอด 24 ชั่วโมง
          </p>
          <div className="text-[11px] text-[#9c7d5c] font-medium pt-1">
            พร้อมตอบคำถาม 1,574 พิพิธภัณฑ์และ 2,460 หัวเรื่อง
          </div>
        </div>

        {/* Card 4: Open Data License */}
        <div className="p-6 bg-white rounded-2xl border border-[#d7c8b2] shadow-2xs hover:border-[#9c7d5c] transition-all space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <h2 className="font-editorial text-lg font-bold text-[#463629]">
            ๔. แหล่งข้อมูลเปิดภาครัฐและลิขสิทธิ์
          </h2>
          <p className="text-xs text-[#6f5a45] leading-relaxed">
            จัดทำขึ้นโดยอ้างอิงชุดข้อมูลเปิดจากศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน) ภายใต้ DGA Open Government License สนับสนุนการศึกษา ค้นคว้า และวิจัย
          </p>
          <button
            onClick={() => onNavigate('about')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9c7d5c] hover:text-[#856748] pt-1"
          >
            <span>อ่านรายละเอียดเกี่ยวกับโครงการ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
