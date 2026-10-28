import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  Save, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Landmark, 
  GraduationCap, 
  Building2, 
  User, 
  Building, 
  Users, 
  Briefcase, 
  HeartHandshake, 
  Crown,
  Search,
  ExternalLink,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { museumStore } from '../../services/museumStore';
import type { LocalLivingCategory, LocalLivingTaxonomyConfig, SubjectItem } from '../../types/museum';

interface AdminSubjectsTaxonomyViewProps {
  onNavigate: (tab: string, meta?: any) => void;
  initialSubTab?: 'taxonomy' | 'merge';
}

const AVAILABLE_ICONS = [
  { name: 'Landmark', label: 'วัด / โบราณสถาน', icon: Landmark },
  { name: 'GraduationCap', label: 'สถานศึกษา / มหาวิทยาลัย', icon: GraduationCap },
  { name: 'Building2', label: 'หน่วยงานราชการ', icon: Building2 },
  { name: 'User', label: 'ส่วนบุคคล / เอกชน', icon: User },
  { name: 'Building', label: 'องค์กรปกครองส่วนท้องถิ่น', icon: Building },
  { name: 'Users', label: 'ชุมชน / ชาติพันธุ์', icon: Users },
  { name: 'Briefcase', label: 'องค์กรธุรกิจ / การค้า', icon: Briefcase },
  { name: 'HeartHandshake', label: 'มูลนิธิ / สมาคม', icon: HeartHandshake },
  { name: 'Crown', label: 'พิพิธภัณฑสถานแห่งชาติ', icon: Crown }
];

const AVAILABLE_COLORS = [
  { id: 'amber', label: 'ส้มทอง (Amber)', badgeClass: 'bg-amber-500 text-white' },
  { id: 'indigo', label: 'คราม (Indigo)', badgeClass: 'bg-indigo-500 text-white' },
  { id: 'teal', label: 'เขียวหัวเป็ด (Teal)', badgeClass: 'bg-teal-500 text-white' },
  { id: 'orange', label: 'ส้มอิฐ (Orange)', badgeClass: 'bg-orange-500 text-white' },
  { id: 'emerald', label: 'เขียวมรกต (Emerald)', badgeClass: 'bg-emerald-500 text-white' },
  { id: 'green', label: 'เขียวพฤกษา (Green)', badgeClass: 'bg-green-500 text-white' },
  { id: 'blue', label: 'น้ำเงิน (Blue)', badgeClass: 'bg-blue-500 text-white' },
  { id: 'purple', label: 'ม่วงหลวง (Purple)', badgeClass: 'bg-purple-500 text-white' },
  { id: 'ruby', label: 'แดงชาด (Ruby)', badgeClass: 'bg-rose-600 text-white' }
];

export const AdminSubjectsTaxonomyView: React.FC<AdminSubjectsTaxonomyViewProps> = ({ 
  onNavigate,
  initialSubTab = 'taxonomy' 
}) => {
  const [subTab, setSubTab] = useState<'taxonomy' | 'merge'>(initialSubTab);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Local Living Taxonomy State
  const [taxonomyConfig, setTaxonomyConfig] = useState<LocalLivingTaxonomyConfig>(() => 
    museumStore.getLocalLivingTaxonomy()
  );

  // Main Header Form State
  const [mainTitle, setMainTitle] = useState(taxonomyConfig.mainTitle);
  const [mainSubtitle, setMainSubtitle] = useState(taxonomyConfig.mainSubtitle);
  const [mainDescription, setMainDescription] = useState(taxonomyConfig.mainDescription);
  const [badgeText, setBadgeText] = useState(taxonomyConfig.badgeText);

  // Category Edit Modal State
  const [editingCategory, setEditingCategory] = useState<LocalLivingCategory | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catTitle, setCatTitle] = useState('');
  const [catSubtitle, setCatSubtitle] = useState('');
  const [catIconName, setCatIconName] = useState('Landmark');
  const [catColorTheme, setCatColorTheme] = useState('amber');
  const [catOrder, setCatOrder] = useState(1);
  const [catActive, setCatActive] = useState(true);
  const [catFeaturedSubjects, setCatFeaturedSubjects] = useState('');

  // 2. Subject Merge Tool State
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => museumStore.getSubjects());
  const [sourceSubject, setSourceSubject] = useState('');
  const [targetSubject, setTargetSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync with store
  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      const cfg = museumStore.getLocalLivingTaxonomy();
      setTaxonomyConfig(cfg);
      setSubjects(museumStore.getSubjects());
    });
    return () => unsub();
  }, []);

  // Update header form when config changes
  useEffect(() => {
    setMainTitle(taxonomyConfig.mainTitle);
    setMainSubtitle(taxonomyConfig.mainSubtitle);
    setMainDescription(taxonomyConfig.mainDescription);
    setBadgeText(taxonomyConfig.badgeText);
  }, [taxonomyConfig]);

  // Handle Save Main Info
  const handleSaveMainInfo = (e: React.FormEvent) => {
    e.preventDefault();
    museumStore.updateLocalLivingTaxonomy({
      mainTitle: mainTitle.trim(),
      mainSubtitle: mainSubtitle.trim(),
      mainDescription: mainDescription.trim(),
      badgeText: badgeText.trim()
    });
    showToast('บันทึกข้อมูลองค์ประกอบหลัก "วิถีชีวิตท้องถิ่น" สำเร็จแล้ว');
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (cat: LocalLivingCategory) => {
    setEditingCategory(cat);
    setIsNewCategory(false);
    setCatName(cat.name);
    setCatTitle(cat.title);
    setCatSubtitle(cat.subtitle);
    setCatIconName(cat.iconName || 'Landmark');
    setCatColorTheme(cat.colorTheme || 'amber');
    setCatOrder(cat.order || 1);
    setCatActive(cat.active);
    setCatFeaturedSubjects((cat.featuredSubjects || []).join(', '));
    setIsCategoryModalOpen(true);
  };

  // Open Add Category Modal
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsNewCategory(true);
    setCatName('');
    setCatTitle('');
    setCatSubtitle('');
    setCatIconName('Landmark');
    setCatColorTheme('amber');
    setCatOrder(taxonomyConfig.categories.length + 1);
    setCatActive(true);
    setCatFeaturedSubjects('');
    setIsCategoryModalOpen(true);
  };

  // Save Category (Create or Update)
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catTitle.trim()) {
      alert('กรุณากรอกชื่อประเภทและชื่อหัวข้อที่แสดง');
      return;
    }

    const featuredList = catFeaturedSubjects
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (isNewCategory || !editingCategory) {
      museumStore.addLocalLivingCategory({
        name: catName.trim(),
        title: catTitle.trim(),
        subtitle: catSubtitle.trim(),
        iconName: catIconName,
        colorTheme: catColorTheme,
        order: Number(catOrder),
        active: catActive,
        featuredSubjects: featuredList
      });
      showToast(`เพิ่มประเภทใหม่ "${catTitle.trim()}" สำเร็จแล้ว`);
    } else {
      museumStore.updateLocalLivingCategory(editingCategory.id, {
        name: catName.trim(),
        title: catTitle.trim(),
        subtitle: catSubtitle.trim(),
        iconName: catIconName,
        colorTheme: catColorTheme,
        order: Number(catOrder),
        active: catActive,
        featuredSubjects: featuredList
      });
      showToast(`อัปเดตข้อมูลประเภท "${catTitle.trim()}" สำเร็จแล้ว`);
    }

    setIsCategoryModalOpen(false);
  };

  // Delete Category
  const handleDeleteCategory = (cat: LocalLivingCategory) => {
    if (confirm(`คุณต้องการลบประเภท "${cat.title || cat.name}" ออกจากดัชนีหรือไม่?`)) {
      museumStore.deleteLocalLivingCategory(cat.id);
      showToast(`ลบประเภท "${cat.title || cat.name}" สำเร็จแล้ว`);
    }
  };

  // Toggle Category Active
  const handleToggleCategoryActive = (cat: LocalLivingCategory) => {
    museumStore.updateLocalLivingCategory(cat.id, {
      active: !cat.active
    });
    showToast(`${!cat.active ? 'เปิดใช้งาน' : 'ซ่อน'}ประเภท "${cat.title || cat.name}" แล้ว`);
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (confirm('คุณต้องการคืนค่าดัชนีวิถีชีวิตท้องถิ่น 9 ประเภทเริ่มต้นของระบบหรือไม่?')) {
      museumStore.resetDefaultLocalLivingTaxonomy();
      showToast('คืนค่าเริ่มต้นดัชนีวิถีชีวิตท้องถิ่น 9 ประเภทสำเร็จแล้ว');
    }
  };

  // Handle Subject Merge
  const handleMergeSubjects = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceSubject.trim() || !targetSubject.trim()) {
      alert('กรุณากรอกทั้งหัวเรื่องต้นทางและปลายทาง');
      return;
    }
    if (sourceSubject.trim() === targetSubject.trim()) {
      alert('หัวเรื่องต้นทางและปลายทางต้องไม่เป็นคำเดียวกัน');
      return;
    }

    const count = museumStore.mergeSubjects(sourceSubject.trim(), targetSubject.trim());
    showToast(`รวมหัวเรื่อง "${sourceSubject}" เข้ากับ "${targetSubject}" สำเร็จ ส่งผลต่อ ${count} พิพิธภัณฑ์`);
    setSourceSubject('');
    setTargetSubject('');
  };

  // Filtered subjects for merge tool
  const filteredSubjects = subjects.filter(s => 
    !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#382415] text-[#fffdf7] px-4 py-3 rounded-xl shadow-2xl border border-[#e6c12f]/60 text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#e6c12f]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and SubTab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d7c8b2]/60 pb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9c7d5c] font-semibold">
            ระบบจัดการดัชนีหัวเรื่องภูมิปัญญา (Subject Taxonomy Management)
          </div>
          <h2 className="text-xl font-editorial font-bold text-[#463629] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#9c7d5c]" />
            <span>จัดการหัวเรื่อง & ดัชนีวิถีชีวิตท้องถิ่น 9 ประเภท</span>
          </h2>
        </div>

        {/* View on Site Button */}
        <button
          onClick={() => onNavigate('subjects')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ece4d4] hover:bg-[#d7c8b2] text-[#463629] rounded-lg text-xs font-semibold border border-[#d7c8b2] transition-colors cursor-pointer self-start sm:self-center"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#9c7d5c]" />
          <span>ดูหน้าสำรวจหัวเรื่อง</span>
        </button>
      </div>

      {/* Sub-Tabs: 1. Local Living Taxonomy 9 Types | 2. Merge Tool */}
      <div className="flex items-center gap-2 border-b border-[#d7c8b2]">
        <button
          onClick={() => setSubTab('taxonomy')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-semibold border-b-2 transition-colors cursor-pointer ${
            subTab === 'taxonomy'
              ? 'border-[#9c7d5c] text-[#463629] bg-[#fffdf7]'
              : 'border-transparent text-[#6f5a45] hover:text-[#463629]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#9c7d5c]" />
          <span>ดัชนีวิถีชีวิตท้องถิ่น 9 ประเภท (CMS)</span>
          <span className="px-1.5 py-0.2 rounded-md bg-[#e6c12f] text-[#463629] text-[10px] font-bold">
            9 ประเภท
          </span>
        </button>

        <button
          onClick={() => setSubTab('merge')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-heading font-semibold border-b-2 transition-colors cursor-pointer ${
            subTab === 'merge'
              ? 'border-[#9c7d5c] text-[#463629] bg-[#fffdf7]'
              : 'border-transparent text-[#6f5a45] hover:text-[#463629]'
          }`}
        >
          <Tag className="w-4 h-4 text-[#9c7d5c]" />
          <span>จัดการคำศัพท์ & รวมคำพ้อง ({subjects.length.toLocaleString('th-TH')} เรื่อง)</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: LOCAL LIVING TAXONOMY 9 TYPES CMS
         ========================================================================= */}
      {subTab === 'taxonomy' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Section 1: Main Overarching Theme Information Form */}
          <div className="bg-[#fffdf7] rounded-2xl border border-[#d7c8b2] p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#d7c8b2]/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e6c12f]" />
                <h3 className="text-sm font-bold font-editorial text-[#463629]">
                  ข้อมูลหัวข้อหลัก (Overarching Main Theme Elements)
                </h3>
              </div>
              <span className="text-[11px] text-[#6f5a45]">
                กำหนดให้หัวข้อ "วิถีชีวิตท้องถิ่น" เป็นแกนนำหลักของหน้า
              </span>
            </div>

            <form onSubmit={handleSaveMainInfo} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#463629] font-semibold mb-1">
                    ชื่อหัวข้อหลัก (Main Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={mainTitle}
                    onChange={e => setMainTitle(e.target.value)}
                    placeholder="วิถีชีวิตท้องถิ่น"
                    className="w-full p-2.5 bg-white border border-[#d7c8b2] rounded-xl text-xs font-semibold text-[#463629] focus:outline-none focus:ring-1 focus:ring-[#9c7d5c]"
                  />
                  <span className="text-[10px] text-[#6f5a45] mt-1 block">
                    * ชื่อหัวข้อหลักขนาดใหญ่ที่แสดงบนสุดของหน้าหัวเรื่อง
                  </span>
                </div>

                <div>
                  <label className="block text-[#463629] font-semibold mb-1">
                    ป้ายกำกับด้านบน (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={e => setBadgeText(e.target.value)}
                    placeholder="ดัชนีวิถีชีวิตท้องถิ่น 9 ประเภท"
                    className="w-full p-2.5 bg-white border border-[#d7c8b2] rounded-xl text-xs text-[#463629] focus:outline-none focus:ring-1 focus:ring-[#9c7d5c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#463629] font-semibold mb-1">
                  คำโปรยหัวเรื่อง (Subtitle)
                </label>
                <input
                  type="text"
                  value={mainSubtitle}
                  onChange={e => setMainSubtitle(e.target.value)}
                  placeholder="ดัชนีหัวเรื่องภูมิปัญญาและวิถีชนสยาม จำแนกตาม 9 ภาคส่วนการจัดการพิพิธภัณฑ์"
                  className="w-full p-2.5 bg-white border border-[#d7c8b2] rounded-xl text-xs text-[#463629] focus:outline-none focus:ring-1 focus:ring-[#9c7d5c]"
                />
              </div>

              <div>
                <label className="block text-[#463629] font-semibold mb-1">
                  คำอธิบายรายละเอียด (Description)
                </label>
                <textarea
                  rows={2}
                  value={mainDescription}
                  onChange={e => setMainDescription(e.target.value)}
                  placeholder="คำอธิบายเชิงวิชาการสรุปภาพรวมของดัชนีวิถีชีวิตท้องถิ่น 9 ประเภท"
                  className="w-full p-2.5 bg-white border border-[#d7c8b2] rounded-xl text-xs text-[#463629] focus:outline-none focus:ring-1 focus:ring-[#9c7d5c]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกข้อมูลหลัก</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Manage the 9 Categories */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold font-editorial text-[#463629] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#9c7d5c]" />
                  <span>รายการประเภทที่แยกออกมา ({taxonomyConfig.categories.length} ประเภท)</span>
                </h3>
                <p className="text-xs text-[#6f5a45]">
                  แอดมินสามารถแก้ไขชื่อ คำอธิบาย สี ไอคอน ลำดับ หรือเปิด/ปิดการแสดงผลได้
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#ece4d4] text-[#6f5a45] rounded-xl text-xs font-semibold border border-[#d7c8b2] transition-colors cursor-pointer"
                  title="คืนค่าดัชนี 9 ประเภทดั้งเดิมของระบบ"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#9c7d5c]" />
                  <span>คืนค่าเริ่มต้น 9 ประเภท</span>
                </button>

                <button
                  onClick={handleOpenAddCategory}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#e6c12f] hover:bg-[#e8c742] text-[#463629] rounded-xl text-xs font-heading font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#463629]" />
                  <span>เพิ่มประเภทใหม่</span>
                </button>
              </div>
            </div>

            {/* Categories Table / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {taxonomyConfig.categories
                .sort((a, b) => a.order - b.order)
                .map((cat, idx) => {
                  const museumCount = museumStore.getMuseumsByCategory(cat.name).length;
                  const subjectsCount = museumStore.getSubjectsByCategory(cat.name).length;

                  return (
                    <div
                      key={cat.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 bg-white ${
                        cat.active 
                          ? 'border-[#d7c8b2] shadow-2xs hover:border-[#9c7d5c]' 
                          : 'border-dashed border-gray-300 opacity-60 bg-gray-50'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Top Row: Order, Icon, Active Toggle */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#ece4d4] text-[#463629] flex items-center justify-center font-mono font-bold text-xs">
                              0{cat.order || idx + 1}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#ece4d4]/60 text-[#5c3d26] font-mono text-[11px] font-bold">
                              {cat.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleCategoryActive(cat)}
                              className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                cat.active ? 'text-emerald-700 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-200'
                              }`}
                              title={cat.active ? 'คลิกเพื่อซ่อนประเภทนี้' : 'คลิกเพื่อเปิดแสดงประเภทนี้'}
                            >
                              {cat.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="p-1 text-[#9c7d5c] hover:bg-[#ece4d4] rounded-lg transition-colors cursor-pointer"
                              title="แก้ไขประเภทนี้"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="ลบประเภทนี้"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <h4 className="font-bold text-sm text-[#382415] font-editorial leading-snug">
                            {cat.title}
                          </h4>
                          <p className="text-xs text-[#6f5a45] line-clamp-2 mt-1 leading-relaxed">
                            {cat.subtitle}
                          </p>
                        </div>

                        {/* Featured Subjects Badges */}
                        {cat.featuredSubjects && cat.featuredSubjects.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {cat.featuredSubjects.slice(0, 3).map((sub, sIdx) => (
                              <span 
                                key={sIdx}
                                className="text-[10px] bg-[#ece4d4]/50 text-[#7a5230] px-1.5 py-0.2 rounded border border-[#d7c8b2]/40"
                              >
                                #{sub}
                              </span>
                            ))}
                            {cat.featuredSubjects.length > 3 && (
                              <span className="text-[10px] text-[#735640] font-mono">
                                +{cat.featuredSubjects.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Info: Museums & Subjects Counts */}
                      <div className="pt-2 border-t border-[#d7c8b2]/50 flex items-center justify-between text-[11px] text-[#6f5a45]">
                        <span>พิพิธภัณฑ์: <strong className="text-[#382415]">{museumCount}</strong> แห่ง</span>
                        <span>หัวเรื่องย่อย: <strong className="text-[#382415]">{subjectsCount}</strong> เรื่อง</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: SUBJECT MERGE & SYNONYM MANAGEMENT TOOL
         ========================================================================= */}
      {subTab === 'merge' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Merge Tool Form */}
          <div className="p-5 bg-[#ece4d4]/40 rounded-2xl border border-[#d7c8b2] space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#463629] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#9c7d5c]" />
              <span>เครื่องมือรวมหัวเรื่องและจัดการคำพ้อง (Subject Merge Tool)</span>
            </h3>
            <p className="text-xs text-[#6f5a45]">
              หากพบคำพ้องหรือหัวเรื่องที่ควรเป็นหมวดเดียวกัน ให้ระบุคำต้นทางและคำเป้าหมายเพื่อรวมเข้าด้วยกัน
            </p>

            <form onSubmit={handleMergeSubjects} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end pt-1">
              <div>
                <label className="block text-[#6f5a45] font-semibold mb-1">
                  หัวเรื่องต้นทาง (ที่จะถูกแทนที่) *
                </label>
                <input
                  type="text"
                  required
                  value={sourceSubject}
                  onChange={e => setSourceSubject(e.target.value)}
                  placeholder="เช่น กลุ่มชาติพันธุ์"
                  className="w-full p-2 bg-white border border-[#d7c8b2] rounded-xl text-xs text-[#463629]"
                />
              </div>

              <div>
                <label className="block text-[#6f5a45] font-semibold mb-1">
                  หัวเรื่องปลายทาง (เป้าหมาย) *
                </label>
                <input
                  type="text"
                  required
                  value={targetSubject}
                  onChange={e => setTargetSubject(e.target.value)}
                  placeholder="เช่น ชาติพันธุ์"
                  className="w-full p-2 bg-white border border-[#d7c8b2] rounded-xl text-xs text-[#463629]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
              >
                รวมหัวเรื่องทันที
              </button>
            </form>
          </div>

          {/* Subject Search & Catalog Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#9c7d5c] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาชื่อหัวเรื่องในคลัง..."
                  className="w-full pl-9 pr-3 py-2 text-xs text-[#463629] bg-white border border-[#d7c8b2] rounded-xl"
                />
              </div>

              <div className="text-xs text-[#6f5a45] font-mono">
                แสดง {Math.min(100, filteredSubjects.length)} จาก {filteredSubjects.length} หัวเรื่อง
              </div>
            </div>

            <div className="border border-[#d7c8b2] rounded-2xl overflow-hidden text-xs bg-white shadow-2xs">
              <table className="w-full text-left">
                <thead className="bg-[#ece4d4]/60 border-b border-[#d7c8b2] text-[#463629] font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">ชื่อหัวเรื่อง</th>
                    <th className="py-2.5 px-4">จำนวนพิพิธภัณฑ์ที่เชื่อมโยง</th>
                    <th className="py-2.5 px-4">สถานะ</th>
                    <th className="py-2.5 px-4 text-right">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d7c8b2]/50 text-[#6f5a45]">
                  {filteredSubjects.slice(0, 100).map(s => (
                    <tr key={s.id} className="hover:bg-[#fffdf7]">
                      <td className="py-2.5 px-4 font-semibold text-[#463629]">{s.name}</td>
                      <td className="py-2.5 px-4 font-mono tabular-nums">{s.count} แห่ง</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                          ใช้งานอยู่
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => setSourceSubject(s.name)}
                          className="text-[#9c7d5c] hover:underline font-semibold cursor-pointer"
                        >
                          เลือกเพื่อรวม
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Category Add / Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#d7c8b2] max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#d7c8b2] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#9c7d5c]" />
                <h3 className="text-base font-bold font-editorial text-[#463629]">
                  {isNewCategory ? 'เพิ่มประเภทใหม่' : `แก้ไขประเภท: ${catTitle || catName}`}
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 text-[#6f5a45] hover:text-[#463629] rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#463629] font-semibold mb-1">
                    ชื่อประเภทในฐานข้อมูล (Type Key) *
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    placeholder="เช่น วัด, สถานศึกษา, ชุมชน"
                    className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl text-xs font-semibold text-[#463629]"
                  />
                </div>

                <div>
                  <label className="block text-[#463629] font-semibold mb-1">
                    ลำดับการแสดงผล (Order)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={catOrder}
                    onChange={e => setCatOrder(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl text-xs text-[#463629]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#463629] font-semibold mb-1">
                  ชื่อหัวข้อที่แสดง (Display Title) *
                </label>
                <input
                  type="text"
                  required
                  value={catTitle}
                  onChange={e => setCatTitle(e.target.value)}
                  placeholder="เช่น พิพิธภัณฑ์วัด & มรดกพุทธศิลป์"
                  className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl text-xs font-semibold text-[#463629]"
                />
              </div>

              <div>
                <label className="block text-[#463629] font-semibold mb-1">
                  คำบรรยายสรุปประเภท (Subtitle / Summary)
                </label>
                <textarea
                  rows={2}
                  value={catSubtitle}
                  onChange={e => setCatSubtitle(e.target.value)}
                  placeholder="เช่น คลังมรดกพุทธธรรม พระพุทธรูปโบราณ คัมภีร์ใบลาน จิตรกรรมฝาผนัง..."
                  className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl text-xs text-[#463629]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#463629] font-semibold mb-1">
                    เลือกไอคอน (Icon)
                  </label>
                  <select
                    value={catIconName}
                    onChange={e => setCatIconName(e.target.value)}
                    className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl text-xs font-medium text-[#463629]"
                  >
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic.name} value={ic.name}>{ic.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#463629] font-semibold mb-1">
                    ธีมสี (Color Theme)
                  </label>
                  <select
                    value={catColorTheme}
                    onChange={e => setCatColorTheme(e.target.value)}
                    className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl text-xs font-medium text-[#463629]"
                  >
                    {AVAILABLE_COLORS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#463629] font-semibold mb-1">
                  หัวเรื่องย่อยแนะนำ (Featured Subjects, คั่นด้วยจุลภาค)
                </label>
                <input
                  type="text"
                  value={catFeaturedSubjects}
                  onChange={e => setCatFeaturedSubjects(e.target.value)}
                  placeholder="เช่น พระพุทธรูป, จิตรกรรมฝาผนัง, คัมภีร์ใบลาน"
                  className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl text-xs text-[#463629]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#463629]">
                  <input
                    type="checkbox"
                    checked={catActive}
                    onChange={e => setCatActive(e.target.checked)}
                    className="w-4 h-4 accent-[#9c7d5c] cursor-pointer"
                  />
                  <span>เปิดใช้งานประเภทนี้ในหน้าเว็บไซต์ (Active)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d7c8b2]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 border border-[#d7c8b2] rounded-xl text-[#6f5a45] hover:bg-[#ece4d4] cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  บันทึกข้อมูล
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
