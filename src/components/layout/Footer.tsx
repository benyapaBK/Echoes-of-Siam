import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#2a1a0f] border-t-2 border-[#b38742]/30 text-[#d4c3b3] text-sm mt-20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png" 
                alt="Echoes of Siam Logo" 
                className="w-11 h-11 object-contain rounded-full shadow-md ring-1 ring-[#e6c12f]/40" 
              />
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#fef9f3]">
                  Echoes of Siam
                </h3>
                <p className="text-xs text-[#d4a339] font-heading font-medium tracking-wide">
                  สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์
                </p>
              </div>
            </div>
            <p className="text-xs text-[#c2ab95] max-w-md leading-relaxed font-sans">
              แพลตฟอร์มสารสนเทศระดับชาติเพื่อรวบรวม ถ่ายทอด และเชื่อมโยงข้อมูลพิพิธภัณฑ์ 1,574 แห่งทั่วประเทศไทย 
              ผ่านโครงสร้างหัวเรื่องและแผนผังองค์ความรู้ (Knowledge Graph) เสริมสร้างการศึกษา วิจัย และการสืบสานมรดกทางวัฒนธรรม
            </p>
          </div>

          {/* Quick links */}
          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#e6c12f]">
              แผนผังเว็บไซต์
            </h4>
            <ul className="space-y-1.5 text-xs text-[#d5c0aa]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#fef9f3] transition-colors cursor-pointer">
                  หน้าแรก
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('museums')} className="hover:text-[#fef9f3] transition-colors cursor-pointer">
                  สารบัญพิพิธภัณฑ์ (1,574 แห่ง)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('subjects')} className="hover:text-[#fef9f3] transition-colors cursor-pointer">
                  สำรวจหัวเรื่องภูมิปัญญา (2,460 เรื่อง)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('graph')} className="hover:text-[#fef9f3] transition-colors cursor-pointer">
                  กราฟความรู้ (Knowledge Graph)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('insights')} className="hover:text-[#fef9f3] transition-colors cursor-pointer">
                  ภาพรวมและสถิติข้อมูล
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#fef9f3] text-[#e6c12f] font-medium transition-colors cursor-pointer">
                  ติดต่อเรา & คณะผู้สร้างระบบ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('help')} className="hover:text-[#fef9f3] transition-colors cursor-pointer">
                  ศูนย์ช่วยเหลือและคู่มือการใช้งาน
                </button>
              </li>
            </ul>
          </div>

          {/* Source & Gov Data */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#e6c12f]">
              แหล่งข้อมูลอ้างอิง
            </h4>
            <p className="text-xs text-[#c2ab95] leading-relaxed">
              ชุดข้อมูลเปิดภาครัฐจาก <strong className="text-[#fef9f3]">ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน)</strong> ภายใต้สัญญาอนุญาต DGA Open Government License
            </p>
            <a
              href="https://thaigovdata.com/datasets/museum"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#e6c12f] hover:underline pt-1"
            >
              <span>thaigovdata.com/datasets/museum</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom bar with quiet Admin access link (Moved from header to footer) */}
        <div className="pt-8 border-t border-[#b38742]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#a9917d]">
          <div>
            © {new Date().getFullYear()} Echoes of Siam (สยามเล่าขาน). มรดกภูมิปัญญาไทยในพิพิธภัณฑ์ ๑,๕๗๔ แห่ง
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#fef9f3] transition-colors cursor-pointer"
            >
              ข้อจำกัดความรับผิดชอบและสิทธิ์
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('help')}
              className="hover:text-[#fef9f3] transition-colors cursor-pointer"
            >
              คู่มือผู้ใช้งาน
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 text-[#d5c0aa] hover:text-[#e6c12f] transition-colors px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
              title="เข้าสู่ระบบผู้ดูแลระบบ (Admin Access)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#e6c12f]" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
