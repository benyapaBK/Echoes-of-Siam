import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Check, 
  Compass, 
  ExternalLink, 
  Share2, 
  Copy, 
  Sparkles, 
  Navigation,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { museumStore } from '../services/museumStore';
import type { ContactPageConfig } from '../types/museum';

interface ContactPageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<ContactPageConfig>(() => museumStore.getContactConfig());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      setConfig(museumStore.getContactConfig());
    });
    return unsub;
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] py-10 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* 1. HERO HEADER */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2a1d13] via-[#3d2a1b] to-[#1c130c] text-white p-8 sm:p-12 shadow-xl border border-[#d4af37]/30">
          {/* Subtle Decorative Background Element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none transform translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#9c7d5c]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ebdcc9] text-xs font-semibold tracking-wider">
              <Compass className="w-3.5 h-3.5 text-[#e5a93c]" />
              <span>ศูนย์ประสานงานและการติดต่อ (CONTACT & CREATORS)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#fffdf7] tracking-tight leading-tight">
              {config.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-[#d4af37] font-medium font-serif leading-snug">
              {config.heroSubtitle}
            </p>

            <p className="text-xs sm:text-sm text-[#ebdcc9]/90 leading-relaxed max-w-2xl font-light">
              {config.heroDescription}
            </p>
          </div>
        </div>

        {/* 2. DEVELOPMENT TEAM */}
        <section className="relative overflow-hidden rounded-3xl border border-[#d7c8b2] bg-white p-6 shadow-md sm:p-9">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#d4af37]/10 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)] lg:items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7c8b2] bg-[#fbf6ed] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#866747]">
                <Sparkles className="h-4 w-4 text-[#c69a2b]" />
                <span>DEVELOPMENT TEAM</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#463629] sm:text-3xl">
                ทีมผู้พัฒนา
              </h2>
              <p className="text-sm font-medium text-[#9c7d5c]">
                สาขาวิชาสารสนเทศศึกษา · รุ่นที่ 69
              </p>
            </div>
            <div className="space-y-4 border-t border-[#ece4d4] pt-5 text-sm leading-7 text-[#6f5a45] lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p>
                เว็บไซต์ <strong className="font-semibold text-[#463629]">Echoes of Siam – สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์</strong> พัฒนาโดยนิสิตสาขาวิชาสารสนเทศศึกษา คณะมนุษยศาสตร์และสังคมศาสตร์ มหาวิทยาลัยบูรพา รุ่นที่ 69 (รหัสนิสิตขึ้นต้นด้วย 66)
              </p>
              <p>
                โดยประยุกต์ใช้ความรู้ด้านการจัดการสารสนเทศและเทคโนโลยีดิจิทัล เพื่อพัฒนาแพลตฟอร์มสำหรับรวบรวม เผยแพร่ และส่งเสริมการเข้าถึงข้อมูลพิพิธภัณฑ์และองค์ความรู้ภูมิปัญญาไทยผ่านสื่อดิจิทัล
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['คณะมนุษยศาสตร์และสังคมศาสตร์', 'มหาวิทยาลัยบูรพา', 'รหัสนิสิตขึ้นต้นด้วย 66'].map(item => (
                  <span key={item} className="rounded-full bg-[#f5ede0] px-3 py-1 text-[11px] font-medium text-[#866747]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. LOCATION, CONTACT CHANNELS & FEEDBACK FORM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-6">

          {/* Location & direct channels */}
          <div className="lg:col-span-7 space-y-6">

            {/* Location Card */}
            <div className="bg-white rounded-3xl border border-[#d7c8b2] p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#ece4d4] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#9c7d5c] text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-editorial text-[#463629]">
                      สถานที่ตั้ง & ศูนย์ประสานงาน
                    </h3>
                    <p className="text-xs text-[#9c7d5c] font-medium">
                      {config.organizationName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(`${config.address} ${config.province} ${config.postalCode}`, 'address')}
                  className="px-3 py-1.5 text-xs font-medium text-[#6f5a45] hover:text-[#463629] bg-[#fbf6ed] hover:bg-[#ece4d4] border border-[#d7c8b2] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedField === 'address' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'address' ? 'คัดลอกแล้ว' : 'คัดลอกที่อยู่'}</span>
                </button>
              </div>

              <div className="text-xs text-[#6f5a45] space-y-2 leading-relaxed">
                <p className="font-medium text-[#463629] text-sm">
                  {config.address}
                </p>
                <p>
                  จังหวัด {config.province} รหัสไปรษณีย์ {config.postalCode}
                </p>
                {config.mapCoordinates && (
                  <p className="text-[11px] text-[#9c7d5c] font-mono">
                    พิกัดภูมิศาสตร์ (GPS): {config.mapCoordinates}
                  </p>
                )}
              </div>

              {/* Transportation guide */}
              {config.transportationGuide && (
                <div className="p-3.5 bg-[#fbf6ed] rounded-2xl border border-[#ece4d4] text-xs text-[#6f5a45] space-y-1">
                  <div className="font-bold text-[#463629] flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#9c7d5c]" />
                    <span>คำแนะนำการเดินทาง:</span>
                  </div>
                  <p className="leading-relaxed">{config.transportationGuide}</p>
                </div>
              )}

              {/* Working Hours */}
              <div className="flex items-center gap-3 p-3.5 bg-[#fffdf7] rounded-2xl border border-[#d7c8b2] text-xs text-[#6f5a45]">
                <Clock className="w-4 h-4 text-[#9c7d5c] shrink-0" />
                <div>
                  <span className="font-semibold text-[#463629]">เวลาทำการ: </span>
                  <span>{config.openingHours}</span>
                </div>
              </div>

              {/* Google Maps Embed or View Link */}
              {config.mapEmbedUrl && (
                <div className="rounded-2xl overflow-hidden border border-[#d7c8b2] shadow-2xs h-64 bg-[#ece4d4]/40">
                  <iframe
                    src={config.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  />
                </div>
              )}
            </div>

            {/* Direct Contact Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Telephone */}
              <div className="bg-white rounded-2xl border border-[#d7c8b2] p-4 shadow-2xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1 flex-1">
                  <div className="text-[#9c7d5c] font-medium">โทรศัพท์ / หมายเลขติดต่อ</div>
                  <a href={`tel:${config.telephone}`} className="block font-bold text-[#463629] text-sm hover:underline">
                    {config.telephone}
                  </a>
                  {config.hotline && (
                    <div className="text-[11px] text-[#6f5a45]">สายด่วน: {config.hotline}</div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl border border-[#d7c8b2] p-4 shadow-2xs flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1 flex-1">
                  <div className="text-[#9c7d5c] font-medium">อีเมลติดต่อกลาง</div>
                  <a href={`mailto:${config.email}`} className="block font-bold text-[#463629] hover:underline truncate">
                    {config.email}
                  </a>
                  {config.contactEmailSecondary && (
                    <div className="text-[11px] text-[#6f5a45] truncate">สำรอง: {config.contactEmailSecondary}</div>
                  )}
                </div>
              </div>

              {/* LINE Official */}
              {config.lineId && (
                <div className="bg-white rounded-2xl border border-[#d7c8b2] p-4 shadow-2xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
                    LINE
                  </div>
                  <div className="text-xs space-y-1 flex-1">
                    <div className="text-[#9c7d5c] font-medium">LINE Official Account</div>
                    <div className="font-bold text-[#463629] text-sm">{config.lineId}</div>
                  </div>
                </div>
              )}

              {/* Facebook Page */}
              {config.facebookUrl && (
                <div className="bg-white rounded-2xl border border-[#d7c8b2] p-4 shadow-2xs flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 flex items-center justify-center shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-1 flex-1">
                    <div className="text-[#9c7d5c] font-medium">Facebook Page</div>
                    <a href={config.facebookUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-[#463629] hover:underline flex items-center gap-1">
                      <span>{config.facebookPageName || 'Echoes of Siam'}</span>
                      <ExternalLink className="w-3 h-3 text-[#9c7d5c]" />
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>

          <section className="flex flex-col overflow-hidden rounded-3xl border border-[#d7c8b2] bg-white shadow-md lg:col-span-5">
            <div className="border-b border-[#ece4d4] bg-gradient-to-r from-[#2a1d13] to-[#46301d] px-5 py-5 text-white sm:px-6">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#f3dfb2]">
                <MessageSquare className="h-4 w-4 text-[#e6c12f]" />
                <span>ร่วมพัฒนา Echoes of Siam</span>
              </div>
              <h2 className="font-editorial text-xl font-bold text-[#fffdf7] sm:text-2xl">
                ประเมินเว็บไซต์และส่งข้อเสนอแนะ
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#e5d6c3]">
                ร่วมแบ่งปันความคิดเห็นเพื่อช่วยพัฒนาเว็บไซต์
              </p>
            </div>
            <div className="flex-1 bg-[#fcf9f5] p-2 sm:p-3">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfpaHk-Io_FU-mifG1T9x3jiViuC1d3OyP0qD3-qYZnIlcZ5g/viewform?embedded=true"
                title="แบบประเมินเว็บไซต์ Echoes of Siam"
                className="h-[850px] w-full rounded-2xl border-0 bg-white lg:h-[760px]"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              >
                กำลังโหลดแบบประเมิน...
              </iframe>
            </div>
            <div className="border-t border-[#ece4d4] px-4 py-3 text-center text-xs text-[#6f5a45]">
              หากไม่สามารถแสดงแบบฟอร์มได้{' '}
              <a
                href="https://forms.gle/taYfrMHUsiL8fB1J6"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7a5230] underline underline-offset-2 hover:text-[#382415]"
              >
                เปิดแบบประเมินในแท็บใหม่
                <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" />
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
