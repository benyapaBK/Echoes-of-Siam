import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Check, 
  Globe, 
  MessageSquare, 
  Compass, 
  ExternalLink, 
  Share2, 
  Copy, 
  Sparkles, 
  UserCheck, 
  Award, 
  ShieldCheck, 
  Layers, 
  Navigation
} from 'lucide-react';
import { museumStore } from '../services/museumStore';
import type { ContactPageConfig, CreatorProfile } from '../types/museum';

interface ContactPageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<ContactPageConfig>(() => museumStore.getContactConfig());
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.senderName.trim() || !formData.message.trim()) {
      alert('กรุณากรอกชื่อและข้อความที่ต้องการส่ง');
      return;
    }

    setIsSubmitting(true);
    
    // Package query string for Admin User Inquiry Store
    const formattedQuery = `[แบบฟอร์มติดต่อ] เรื่อง: ${formData.subject || 'ทั่วไป'} | ผู้ส่ง: ${formData.senderName} (${formData.senderEmail || 'ไม่ระบุอีเมล'}, โทร: ${formData.senderPhone || '-'}) | ข้อความ: ${formData.message}`;

    setTimeout(() => {
      museumStore.addUserInquiry(formattedQuery);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        senderName: '',
        senderEmail: '',
        senderPhone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSubmitSuccess(false), 6000);
    }, 600);
  };

  const activeCreators = (config.creators || [])
    .filter(c => c.active)
    .sort((a, b) => a.order - b.order);

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

        {/* 2. CREATORS SECTION (คณะผู้สร้างและพัฒนาระบบ - รูปภาพกรอบวงกลมและข้อมูลอิสระ) */}
        <section className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9c7d5c]">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>THE ARCHITECTS & CREATIVE MINDS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#463629]">
              {config.creatorsSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#9c7d5c] font-medium">
              {config.creatorsSectionSubtitle}
            </p>
            {config.creatorsSectionDescription && (
              <p className="text-xs text-[#6f5a45] leading-relaxed max-w-2xl mx-auto pt-1">
                {config.creatorsSectionDescription}
              </p>
            )}
          </div>

          {/* Creators Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center pt-4">
            {activeCreators.map((creator) => (
              <div
                key={creator.id}
                className="bg-white rounded-3xl border border-[#d7c8b2] p-7 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center relative group hover:-translate-y-1"
              >
                {/* Decorative subtle ring backdrop */}
                <div className="absolute top-6 w-36 h-36 rounded-full bg-[#fbf6ed] -z-0 group-hover:scale-105 transition-transform duration-300" />

                {/* CIRCULAR IMAGE FRAME (กรอบวงกลมของผู้สร้างระบบ) */}
                <div className="relative z-10 mb-5">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-tr from-[#9c7d5c] via-[#d4af37] to-[#e6c12f] shadow-lg ring-4 ring-[#fffdf7]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#2a1d13] flex items-center justify-center">
                      <img
                        src={creator.imageUrl || '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png'}
                        alt={creator.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to emblem if image load fails
                          (e.target as HTMLImageElement).src = '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png';
                        }}
                      />
                    </div>
                  </div>
                  {/* Verified / Role Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-[#d4af37] text-[#1c130c] p-1.5 rounded-full shadow-md border-2 border-white" title="ผู้สร้างที่ได้รับการยืนยัน">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Creator Details */}
                <div className="space-y-2 relative z-10 w-full flex-1 flex flex-col">
                  <h3 className="text-xl font-bold font-editorial text-[#463629]">
                    {creator.name}
                  </h3>

                  <div className="inline-block px-3 py-1 bg-[#f5ede0] text-[#866747] rounded-full text-xs font-semibold tracking-wide border border-[#d7c8b2]/60 mx-auto">
                    {creator.role}
                  </div>

                  {creator.affiliation && (
                    <p className="text-xs text-[#9c7d5c] font-medium">
                      {creator.affiliation}
                    </p>
                  )}

                  {creator.bio && (
                    <p className="text-xs text-[#6f5a45] leading-relaxed pt-2 pb-3 px-2 flex-1">
                      {creator.bio}
                    </p>
                  )}

                  {/* Contact / Social links */}
                  <div className="pt-4 border-t border-[#ece4d4] flex flex-wrap items-center justify-center gap-2 mt-auto">
                    {creator.email && (
                      <a
                        href={`mailto:${creator.email}`}
                        className="px-3 py-1.5 bg-[#fbf6ed] hover:bg-[#9c7d5c] hover:text-white text-[#6f5a45] rounded-xl text-xs font-medium border border-[#d7c8b2] transition-colors flex items-center gap-1.5"
                        title={creator.email}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>อีเมล</span>
                      </a>
                    )}

                    {creator.phone && (
                      <a
                        href={`tel:${creator.phone}`}
                        className="px-3 py-1.5 bg-[#fbf6ed] hover:bg-[#9c7d5c] hover:text-white text-[#6f5a45] rounded-xl text-xs font-medium border border-[#d7c8b2] transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>โทร</span>
                      </a>
                    )}

                    {creator.websiteUrl && (
                      <a
                        href={creator.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#fbf6ed] hover:bg-[#9c7d5c] hover:text-white text-[#6f5a45] rounded-xl text-xs font-medium border border-[#d7c8b2] transition-colors flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>เว็บไซต์</span>
                      </a>
                    )}

                    {creator.socialLinks?.github && (
                      <a
                        href={creator.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-[#fbf6ed] hover:bg-[#463629] hover:text-white text-[#6f5a45] rounded-xl border border-[#d7c8b2] transition-colors"
                        title="GitHub Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* 3. LOCATION & CONTACT CHANNELS & FORM (สถานที่ ช่องทางติดต่อ และแบบฟอร์ม) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">

          {/* Left Column (7 cols): Location & Direct Channels */}
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

          {/* Right Column (5 cols): Interactive Contact Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#d7c8b2] p-7 shadow-md space-y-5">
              <div className="border-b border-[#ece4d4] pb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f5ede0] text-[#866747] text-[11px] font-semibold mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span>DIRECT INQUIRY</span>
                </div>
                <h3 className="text-xl font-bold font-editorial text-[#463629]">
                  {config.formTitle}
                </h3>
                <p className="text-xs text-[#6f5a45] mt-1 leading-relaxed">
                  {config.formSubtitle}
                </p>
              </div>

              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-start gap-3 animate-slideDown">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold">ส่งข้อความเรียบร้อยแล้ว!</div>
                    <div>{config.formSuccessMessage}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    ชื่อ-นามสกุล / หน่วยงาน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fbf6ed]/50 border border-[#d7c8b2] rounded-xl focus:outline-hidden focus:border-[#9c7d5c] focus:bg-white text-[#463629] transition-colors"
                    placeholder="เช่น สมชาย ใจดี หรือ พิพิธภัณฑ์ท้องถิ่นบ้าน..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-[#463629] mb-1">
                      อีเมลสำหรับติดต่อกลับ
                    </label>
                    <input
                      type="email"
                      value={formData.senderEmail}
                      onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#fbf6ed]/50 border border-[#d7c8b2] rounded-xl focus:outline-hidden focus:border-[#9c7d5c] focus:bg-white text-[#463629] transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#463629] mb-1">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="tel"
                      value={formData.senderPhone}
                      onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#fbf6ed]/50 border border-[#d7c8b2] rounded-xl focus:outline-hidden focus:border-[#9c7d5c] focus:bg-white text-[#463629] transition-colors"
                      placeholder="08X-XXX-XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    หัวข้อเรื่องที่ต้องการติดต่อ
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fbf6ed]/50 border border-[#d7c8b2] rounded-xl focus:outline-hidden focus:border-[#9c7d5c] focus:bg-white text-[#463629] transition-colors"
                  >
                    <option value="">เลือกหัวข้อเรื่อง...</option>
                    <option value="ร่วมเป็นเครือข่ายพิพิธภัณฑ์">แจ้งข้อมูล / ร่วมเป็นเครือข่ายพิพิธภัณฑ์</option>
                    <option value="แจ้งแก้ไขข้อมูลพิพิธภัณฑ์หรือหัวเรื่อง">แจ้งแก้ไขข้อมูลพิพิธภัณฑ์หรือหัวเรื่อง</option>
                    <option value="การนำข้อมูลไปใช้งานวิจัย">ขออนุญาตนำข้อมูลไปใช้งานวิจัยหรือการศึกษา</option>
                    <option value="สอบถามการทำงานกราฟความรู้">สอบถามการทำงานของกราฟความรู้ & ระบบค้นหา</option>
                    <option value="อื่นๆ">ข้อเสนอแนะทั่วไป / อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    ข้อความ / รายละเอียด <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fbf6ed]/50 border border-[#d7c8b2] rounded-xl focus:outline-hidden focus:border-[#9c7d5c] focus:bg-white text-[#463629] transition-colors resize-none"
                    placeholder="พิมพ์รายละเอียดที่ท่านต้องการสื่อสารหรือสอบถามกับทีมงาน..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งข้อความถึงทีมงาน'}</span>
                </button>

                <p className="text-[11px] text-center text-[#9c7d5c]">
                  ข้อความของท่านจะถูกส่งเข้าสู่ระบบจัดการของผู้ดูแลเพื่อการตรวจสอบและประสานงานโดยเร็ว
                </p>
              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
