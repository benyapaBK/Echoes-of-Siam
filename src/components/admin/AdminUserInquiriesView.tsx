import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  CheckCircle, 
  Plus, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  Filter, 
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';
import { museumStore } from '../../services/museumStore';
import type { UserInquiry } from '../../types/museum';

interface AdminUserInquiriesViewProps {
  onNavigate?: (tab: string, meta?: any) => void;
}

export const AdminUserInquiriesView: React.FC<AdminUserInquiriesViewProps> = () => {
  const [inquiries, setInquiries] = useState<UserInquiry[]>(() => museumStore.getUserInquiries());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'converted'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Convert to FAQ modal state
  const [convertingInquiry, setConvertingInquiry] = useState<UserInquiry | null>(null);
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('ทั่วไป');
  const [faqTargetTab, setFaqTargetTab] = useState('museums');

  const refreshInquiries = () => {
    setInquiries(museumStore.getUserInquiries());
  };

  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      refreshInquiries();
    });
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.query.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (inq.note && inq.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkReviewed = (inq: UserInquiry) => {
    museumStore.updateUserInquiry(inq.id, { status: 'reviewed' });
    showToast(`อัปเดตสถานะเป็น "ตรวจสอบแล้ว"`);
    refreshInquiries();
  };

  const handleDelete = (id: string) => {
    if (confirm('ต้องการลบรายการคำถามนี้หรือไม่?')) {
      museumStore.deleteUserInquiry(id);
      showToast('ลบรายการคำถามเรียบร้อยแล้ว');
      refreshInquiries();
    }
  };

  const handleClearAll = () => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติคำถามจากผู้ใช้ทั้งหมด?')) {
      museumStore.clearUserInquiries();
      showToast('ล้างรายการคำถามทั้งหมดแล้ว');
      refreshInquiries();
    }
  };

  const openConvertModal = (inq: UserInquiry) => {
    setConvertingInquiry(inq);
    setFaqAnswer('');
    setFaqCategory('ทั่วไป');
    setFaqTargetTab('museums');
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingInquiry || !faqAnswer.trim()) return;

    const mascotConfig = museumStore.getMascotConfig();
    const newFaq = {
      id: `faq_${Date.now()}`,
      question: convertingInquiry.query,
      answer: faqAnswer.trim(),
      category: faqCategory,
      targetTab: faqTargetTab
    };

    const updatedFaqs = [...(mascotConfig.customFaqs || []), newFaq];
    museumStore.updateMascotConfig({ customFaqs: updatedFaqs });
    museumStore.updateUserInquiry(convertingInquiry.id, { status: 'converted' });

    showToast(`แปลงเป็นคำถามที่พบบ่อย (FAQ) ของน้องมิวมิวสำเร็จ! ระบบจะตอบคำถามนี้ได้ทันที`);
    setConvertingInquiry(null);
    refreshInquiries();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d7c8b2]/60 pb-4">
        <div>
          <h2 className="text-lg font-bold font-editorial text-[#463629] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#9c7d5c]" />
            <span>ข้อความและคำถามจากผู้ใช้งาน (User Inquiries & Questions)</span>
          </h2>
          <p className="text-xs text-[#6f5a45] mt-0.5">
            บันทึกคำถามจริงจากผู้ใช้งานที่น้องมิวมิวไม่พบข้อมูลในระบบ หรือต้องการค้นคว้าเพิ่มเติม เพื่อให้ Admin ตรวจสอบและแปลงเป็นความรู้ใหม่
          </p>
        </div>

        <div className="flex items-center gap-2">
          {inquiries.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 border border-[#d7c8b2] text-xs text-[#6f5a45] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              ล้างทั้งหมด
            </button>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[#6f5a45]">คำถามทั้งหมด</div>
            <div className="text-lg font-bold font-editorial text-[#463629] mt-0.5">{inquiries.length} รายการ</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#ece4d4] flex items-center justify-center text-[#9c7d5c]">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[#6f5a45]">รอตรวจสอบ (Pending)</div>
            <div className="text-lg font-bold font-editorial text-amber-700 mt-0.5">
              {inquiries.filter(i => i.status === 'pending').length} รายการ
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-[#6f5a45]">แปลงเป็น FAQ สำเร็จ</div>
            <div className="text-lg font-bold font-editorial text-emerald-700 mt-0.5">
              {inquiries.filter(i => i.status === 'converted').length} รายการ
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9c7d5c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหาข้อความคำถาม..."
            className="w-full pl-9 pr-3 py-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg text-xs text-[#463629] focus:outline-none focus:ring-1 focus:ring-[#9c7d5c]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'pending', label: 'รอตรวจสอบ' },
            { id: 'reviewed', label: 'ตรวจแล้ว' },
            { id: 'converted', label: 'แปลงเป็น FAQ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-[#9c7d5c] text-white shadow-2xs'
                  : 'bg-[#ece4d4]/60 text-[#6f5a45] hover:bg-[#ece4d4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List of inquiries */}
      <div className="space-y-3">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#d7c8b2] rounded-2xl bg-[#fffdf7] space-y-2">
            <MessageSquare className="w-8 h-8 text-[#9c7d5c]/50 mx-auto" />
            <p className="text-sm font-semibold text-[#463629]">ไม่พบข้อความคำถามตามเงื่อนไข</p>
            <p className="text-xs text-[#6f5a45]">เมื่อผู้ใช้ถามคำถามที่ไม่มีในระบบ คำถามจะถูกบันทึกมาที่นี่อัตโนมัติ</p>
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const timeFormatted = new Date(inq.timestamp).toLocaleString('th-TH', {
              dateStyle: 'medium',
              timeStyle: 'short'
            });

            return (
              <div
                key={inq.id}
                className={`p-4 rounded-xl border transition-all ${
                  inq.status === 'pending'
                    ? 'bg-amber-50/40 border-amber-200 shadow-2xs'
                    : inq.status === 'converted'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-[#d7c8b2]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inq.status === 'pending'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : inq.status === 'converted'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {inq.status === 'pending' ? 'รอตรวจสอบ' : inq.status === 'converted' ? 'แปลงเป็น FAQ แล้ว' : 'ตรวจสอบแล้ว'}
                      </span>

                      <span className="text-[10px] text-[#6f5a45] flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{timeFormatted}</span>
                      </span>
                    </div>

                    <p className="text-sm font-bold text-[#463629] leading-relaxed">
                      "{inq.query}"
                    </p>

                    {inq.note && (
                      <p className="text-xs text-[#6f5a45] italic">
                        บันทึก: {inq.note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Google research button */}
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(inq.query + ' พิพิธภัณฑ์ ภูมิปัญญาไทย')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#9c7d5c] hover:bg-[#ece4d4] rounded-lg transition-colors"
                      title="ค้นหาข้อมูลบน Google"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Convert to FAQ */}
                    <button
                      onClick={() => openConvertModal(inq)}
                      className="px-2.5 py-1.5 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                      title="เพิ่มคำถามนี้เป็น FAQ ให้น้องมิวมิวตอบได้ทันที"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>แปลงเป็น FAQ</span>
                    </button>

                    {/* Mark Reviewed */}
                    {inq.status === 'pending' && (
                      <button
                        onClick={() => handleMarkReviewed(inq)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                        title="ทำเครื่องหมายว่าตรวจสอบแล้ว"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="ลบคำถามนี้"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Convert to FAQ Modal */}
      {convertingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#d7c8b2] shadow-2xl max-w-lg w-full p-6 space-y-4 my-8 animate-in zoom-in-95 text-xs">
            
            <div className="border-b border-[#d7c8b2]/60 pb-3">
              <h3 className="font-editorial font-bold text-base text-[#463629] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e6c12f]" />
                <span>แปลงคำถามเป็น FAQ ของน้องมิวมิว</span>
              </h3>
              <p className="text-[#6f5a45] text-xs mt-0.5">
                เขียนคำตอบที่ถูกต้องเพื่อให้น้องมิวมิวตอบคำถามนี้ได้อย่างชาญฉลาดในอนาคต
              </p>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">คำถามของผู้ใช้:</label>
                <div className="p-2.5 bg-[#ece4d4]/40 rounded-lg text-xs font-bold text-[#463629] border border-[#d7c8b2]">
                  {convertingInquiry.query}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">คำตอบที่น้องมิวมิวจะใช้ตอบ *</label>
                <textarea
                  rows={4}
                  required
                  value={faqAnswer}
                  onChange={e => setFaqAnswer(e.target.value)}
                  placeholder="พิมพ์คำตอบที่สุภาพ อ้างอิงข้อมูลจริงจากพิพิธภัณฑ์หรือประวัติศาสตร์..."
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">หมวดหมู่</label>
                  <input
                    type="text"
                    value={faqCategory}
                    onChange={e => setFaqCategory(e.target.value)}
                    placeholder="เช่น โบราณคดี, การเยี่ยมชม"
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">ปุ่มนำทางไปยังหน้า</label>
                  <select
                    value={faqTargetTab}
                    onChange={e => setFaqTargetTab(e.target.value)}
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  >
                    <option value="museums">พิพิธภัณฑ์ (Museums)</option>
                    <option value="subjects">สำรวจหัวเรื่อง (Subjects)</option>
                    <option value="graph">กราฟความรู้ (Graph)</option>
                    <option value="about">เกี่ยวกับโครงการ (About)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d7c8b2]/60">
                <button
                  type="button"
                  onClick={() => setConvertingInquiry(null)}
                  className="px-4 py-2 border border-[#d7c8b2] rounded-lg text-[#6f5a45]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกเป็น FAQ</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
