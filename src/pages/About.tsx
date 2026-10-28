import React from 'react';
import { 
  BookOpen, 
  Database, 
  Network, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-[#d7c8b2] pb-6 flex flex-col sm:flex-row sm:items-center gap-6">
        <img 
          src="/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png" 
          alt="Echoes of Siam Emblem" 
          className="w-24 h-24 object-contain rounded-xl shadow-xs shrink-0 self-start" 
        />
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-widest text-[#9c7d5c] font-semibold">
            ภารกิจและแหล่งที่มาของโครงการ (Mission & Provenance)
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-[#463629]">
            เกี่ยวกับโครงการ Echoes of Siam
          </h1>
          <p className="text-sm text-[#6f5a45] leading-relaxed font-sans">
            สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์ — แพลตฟอร์มสำรวจและเชื่อมโยงองค์ความรู้คลังข้อมูลพิพิธภัณฑ์ไทย
          </p>
        </div>
      </div>

      {/* Main Narrative Article */}
      <div className="space-y-8 text-sm text-[#463629] leading-relaxed">
        
        {/* Section 1: Objective */}
        <section className="space-y-3">
          <h2 className="text-xl font-editorial font-bold text-[#463629]">
            1. วัตถุประสงค์ของโครงการ
          </h2>
          <p>
            <strong>Echoes of Siam (สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์)</strong> ถูกสร้างขึ้นเพื่อทำหน้าที่เป็น <em>Digital Archive</em> และ <em>Knowledge Discovery Platform</em> สำรวจมรดกทางวัฒนธรรม ภูมิปัญญา ประวัติศาสตร์ และศิลปหัตถกรรมของประเทศไทย ผ่านการแปลงสารบัญรายชื่อพิพิธภัณฑ์แบบเดิม ให้กลายเป็นแผนที่องค์ความรู้ที่สามารถสืบค้นได้ลึกซึ้ง และแสดงความเชื่อมโยงของเรื่องราวจากอดีตเข้าด้วยกัน
          </p>
          <p>
            หัวใจหลักของแพลตฟอร์มคือการยึดถือคำขวัญ: <strong>“ทุกพิพิธภัณฑ์มีเรื่องราว ทุกหัวเรื่องมีความเชื่อมโยง”</strong> เพื่อเปิดโอกาสให้นักวิจัย นักเรียน นักศึกษา และประชาชนทั่วไป ได้เห็นความรุ่มรวยของวัฒนธรรมท้องถิ่นที่ไม่ถูกจำกัดอยู่เพียงพิพิธภัณฑ์ขนาดใหญ่ในเมืองหลวง
          </p>
        </section>

        {/* Section 2: Source & Provenance */}
        <section className="space-y-3 p-6 bg-[#ece4d4]/40 rounded-xl border border-[#d7c8b2]">
          <h2 className="text-lg font-editorial font-bold text-[#463629] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#9c7d5c]" />
            <span>2. แหล่งที่มาของข้อมูล (Data Provenance)</span>
          </h2>
          <p className="text-xs text-[#6f5a45] leading-relaxed">
            ชุดข้อมูลตั้งต้นทั้งหมด 1,574 ระเบียน อ้างอิงจากฐานข้อมูลพิพิธภัณฑ์ในประเทศไทย โครงการวิจัยและพัฒนาพิพิธภัณฑ์ท้องถิ่น 
            โดย <strong>ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน)</strong> หรือ <strong>ศมส. (SAC)</strong> 
            เผยแพร่ผ่านพอร์ทัลข้อมูลเปิดภาครัฐ <em>Thai Gov Data</em> ภายใต้สัญญาอนุญาต <strong>DGA Open Government License</strong>
          </p>
          <div className="pt-2">
            <a
              href="https://thaigovdata.com/datasets/museum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#9c7d5c] font-semibold hover:underline"
            >
              <span>เข้าสู่ชุดข้อมูลต้นทางที่ thaigovdata.com/datasets/museum</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* Section 3: Methodology */}
        <section className="space-y-3">
          <h2 className="text-xl font-editorial font-bold text-[#463629]">
            3. วิธีการนำเข้าและทำความสะอาดข้อมูล (Methodology)
          </h2>
          <ul className="space-y-2 list-none text-xs text-[#6f5a45]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#9c7d5c] shrink-0 mt-0.5" />
              <span><strong>รักษาข้อมูลต้นฉบับครบถ้วน (Full Fidelity):</strong> ทุกฟิลด์ต้นฉบับ เช่น `title`, `creator`, `provenance`, `subject`, `spatial`, `temporal`, `license`, และ `source.uri` ถูกเก็บบันทึกไว้โดยไม่ลบหรือเปลี่ยนความหมาย</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#9c7d5c] shrink-0 mt-0.5" />
              <span><strong>การจัดการหัวเรื่อง (Subject Extraction):</strong> สกัดข้อความในฟิลด์ `subject` แยกตามเครื่องหมายจุลภาค ตัดช่องว่างส่วนเกิน และกำจัดค่าซ้ำภายในระเบียนเดียวกัน เกิดเป็นดัชนีหัวเรื่อง 2,460 เรื่องที่มีความเสถียร</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#9c7d5c] shrink-0 mt-0.5" />
              <span><strong>การสกัดจังหวัดเชิงพื้นที่ (Spatial Extraction):</strong> สกัดชื่อจังหวัดจริง 77 จังหวัดจากที่อยู่ภาษาไทยโดยไม่สมมติพิกัด GPS เพื่อรักษาความถูกต้องตามหลักฐาน</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Knowledge Graph Philosophy */}
        <section className="space-y-3">
          <h2 className="text-xl font-editorial font-bold text-[#463629] flex items-center gap-2">
            <Network className="w-5 h-5 text-[#e6c12f]" />
            <span>4. ปรัชญาและโครงสร้าง Knowledge Graph</span>
          </h2>
          <p className="text-xs text-[#6f5a45] leading-relaxed">
            แผนผังองค์ความรู้ในระบบนี้ใช้เอนจิน <strong>Cytoscape.js</strong> สร้างความสัมพันธ์ที่มีหลักฐานรองรับจริงเท่านั้น ได้แก่:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <li className="p-3 bg-white rounded-lg border border-[#d7c8b2]">
              <strong className="text-[#9c7d5c] block mb-1">HAS_SUBJECT</strong>
              เชื่อมโยงพิพิธภัณฑ์กับหัวเรื่องที่จัดแสดงจริงตามระเบียน ศมส.
            </li>
            <li className="p-3 bg-white rounded-lg border border-[#d7c8b2]">
              <strong className="text-[#9c7d5c] block mb-1">HAS_TYPE</strong>
              เชื่อมโยงพิพิธภัณฑ์กับประเภทการบริหารจัดการจริง 9 ประเภท
            </li>
            <li className="p-3 bg-white rounded-lg border border-[#d7c8b2]">
              <strong className="text-[#9c7d5c] block mb-1">LOCATED_AT</strong>
              เชื่อมโยงพิพิธภัณฑ์กับจังหวัดที่มีการระบุในที่อยู่
            </li>
            <li className="p-3 bg-white rounded-lg border border-[#d7c8b2]">
              <strong className="text-[#9c7d5c] block mb-1">CREATED_BY</strong>
              เชื่อมโยงกับผู้สร้างข้อมูลหรือองค์กรผู้ก่อตั้งเมื่อมีระบุชัดเจน
            </li>
          </ul>
          <p className="text-[11px] text-[#6f5a45]/80 italic">
            *ระบบปฏิบัติตามหลักการไม่สร้างข้อสันนิษฐานหรือความสัมพันธ์ทางประวัติศาสตร์ขึ้นเองโดยปราศจากหลักฐานเอกสาร
          </p>
        </section>

        {/* Section 5: Limitations */}
        <section className="space-y-3 p-5 bg-[#fffdf7] rounded-xl border border-[#d7c8b2]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#9c7d5c]">
            5. ข้อจำกัดของข้อมูล (Data Limitations)
          </h2>
          <p className="text-xs text-[#6f5a45] leading-relaxed">
            ข้อมูลในชุดนี้ได้รับการสำรวจและบันทึกในโครงการวิจัยช่วงปี พ.ศ. 2546–2554 บางระเบียนอาจมีการเปลี่ยนแปลงเวลาเปิดทำการ หรือสถานะการบริหารจัดการในปัจจุบัน ทางแพลตฟอร์มได้จัดทำลิงก์ตรงไปยังฐานข้อมูล ศมส. เพื่อให้ผู้ใช้สามารถตรวจสอบข้อมูลล่าสุด หรือติดต่อพิพิธภัณฑ์โดยตรงก่อนเดินทาง
          </p>
        </section>

      </div>

    </div>
  );
};
