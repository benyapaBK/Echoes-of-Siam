import React, { useState, useMemo, useEffect } from 'react';
import { 
  Tag, 
  Search, 
  Network, 
  ArrowRight, 
  Landmark, 
  MapPin, 
  ChevronRight, 
  BookOpen,
  Filter,
  Sparkles,
  GraduationCap,
  Building2,
  User,
  Building,
  Users,
  Briefcase,
  HeartHandshake,
  Crown,
  Layers,
  ArrowLeft,
  SlidersHorizontal,
  Compass,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { museumStore } from '../services/museumStore';
import type { SubjectItem, Museum, LocalLivingCategory, LocalLivingTaxonomyConfig } from '../types/museum';

interface SubjectExplorerProps {
  onNavigate: (tab: string, meta?: any) => void;
  initialSubject?: string;
}

// Icon mapper for dynamic category icons
const getCategoryIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName) {
    case 'Landmark':
      return <Landmark className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'User':
      return <User className={className} />;
    case 'Building':
      return <Building className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Crown':
      return <Crown className={className} />;
    default:
      return <Tag className={className} />;
  }
};

// Vibrant color theme mapper for categories
const getCategoryColorTheme = (theme: string) => {
  switch (theme) {
    case 'amber':
      return {
        bgLight: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-800',
        badgeBg: 'bg-amber-600',
        badgeText: 'text-white',
        accentBg: 'bg-amber-500',
        ringColor: 'ring-amber-500/60',
        gradient: 'from-amber-600 to-amber-700'
      };
    case 'indigo':
      return {
        bgLight: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        text: 'text-indigo-800',
        badgeBg: 'bg-indigo-600',
        badgeText: 'text-white',
        accentBg: 'bg-indigo-500',
        ringColor: 'ring-indigo-500/60',
        gradient: 'from-indigo-600 to-indigo-700'
      };
    case 'teal':
      return {
        bgLight: 'bg-teal-500/10',
        border: 'border-teal-500/30',
        text: 'text-teal-800',
        badgeBg: 'bg-teal-600',
        badgeText: 'text-white',
        accentBg: 'bg-teal-500',
        ringColor: 'ring-teal-500/60',
        gradient: 'from-teal-600 to-teal-700'
      };
    case 'orange':
      return {
        bgLight: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-800',
        badgeBg: 'bg-orange-600',
        badgeText: 'text-white',
        accentBg: 'bg-orange-500',
        ringColor: 'ring-orange-500/60',
        gradient: 'from-orange-600 to-orange-700'
      };
    case 'emerald':
      return {
        bgLight: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-800',
        badgeBg: 'bg-emerald-600',
        badgeText: 'text-white',
        accentBg: 'bg-emerald-500',
        ringColor: 'ring-emerald-500/60',
        gradient: 'from-emerald-600 to-emerald-700'
      };
    case 'green':
      return {
        bgLight: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-800',
        badgeBg: 'bg-green-600',
        badgeText: 'text-white',
        accentBg: 'bg-green-500',
        ringColor: 'ring-green-500/60',
        gradient: 'from-green-600 to-green-700'
      };
    case 'blue':
      return {
        bgLight: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-800',
        badgeBg: 'bg-blue-600',
        badgeText: 'text-white',
        accentBg: 'bg-blue-500',
        ringColor: 'ring-blue-500/60',
        gradient: 'from-blue-600 to-blue-700'
      };
    case 'purple':
      return {
        bgLight: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-800',
        badgeBg: 'bg-purple-600',
        badgeText: 'text-white',
        accentBg: 'bg-purple-500',
        ringColor: 'ring-purple-500/60',
        gradient: 'from-purple-600 to-purple-700'
      };
    case 'ruby':
    default:
      return {
        bgLight: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-800',
        badgeBg: 'bg-rose-600',
        badgeText: 'text-white',
        accentBg: 'bg-rose-500',
        ringColor: 'ring-rose-500/60',
        gradient: 'from-rose-600 to-rose-700'
      };
  }
};

export const SubjectExplorer: React.FC<SubjectExplorerProps> = ({ 
  onNavigate, 
  initialSubject = '' 
}) => {
  // 1. Reactive Taxonomy Config from museumStore
  const [taxonomyConfig, setTaxonomyConfig] = useState<LocalLivingTaxonomyConfig>(() => 
    museumStore.getLocalLivingTaxonomy()
  );
  const localLivingMuseumCount = museumStore.getLocalLivingMuseums().length;

  // Subscribe to store updates (so any admin edits sync immediately)
  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      setTaxonomyConfig(museumStore.getLocalLivingTaxonomy());
    });
    return () => unsub();
  }, []);

  // Active categories
  const activeCategories = useMemo(() => {
    return taxonomyConfig.categories
      .filter(c => c.active)
      .sort((a, b) => a.order - b.order);
  }, [taxonomyConfig]);

  // 2. Selection states
  // User selects one of the 9 categories (default: first category 'วัด')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    return activeCategories.length > 0 ? activeCategories[0].id : 'type_temple';
  });

  // Selected sub-subject under the chosen category (optional filter)
  const [selectedSubSubject, setSelectedSubSubject] = useState<string>(initialSubject || '');

  // Search & Filter within category
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'province'>('title');

  // Currently active category object
  const currentCategory = useMemo(() => {
    return activeCategories.find(c => c.id === selectedCategoryId) || activeCategories[0] || null;
  }, [activeCategories, selectedCategoryId]);

  // All published museums in this category
  const categoryMuseums = useMemo(() => {
    if (!currentCategory) return [];
    return museumStore.getMuseumsByCategory(currentCategory.name);
  }, [currentCategory]);

  // Aggregated wisdom sub-subjects specific to this category
  const categorySubjects = useMemo(() => {
    if (!currentCategory) return [];
    return museumStore.getSubjectsByCategory(currentCategory.name);
  }, [currentCategory]);

  // Filtered museums list under this category based on search, sub-subject, and province
  const filteredMuseums = useMemo(() => {
    let result = categoryMuseums;

    // Filter by selected sub-subject if any
    if (selectedSubSubject) {
      result = result.filter(m => m.subjectList && m.subjectList.includes(selectedSubSubject));
    }

    // Filter by province
    if (selectedProvince !== 'all') {
      result = result.filter(m => (m.provinces || [m.province]).includes(selectedProvince));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(m => 
        m.title.toLowerCase().includes(q) ||
        (m.spatial && m.spatial.toLowerCase().includes(q)) ||
        (m.province && m.province.toLowerCase().includes(q)) ||
        (m.subjectList && m.subjectList.some(s => s.toLowerCase().includes(q)))
      );
    }

    // Sort
    return result.sort((a, b) => {
      if (sortBy === 'province') {
        return (a.province || '').localeCompare(b.province || '', 'th');
      }
      return a.title.localeCompare(b.title, 'th');
    });
  }, [categoryMuseums, selectedSubSubject, selectedProvince, searchQuery, sortBy]);

  // Available provinces within this category for the dropdown
  const categoryProvinces = useMemo(() => {
    const set = new Set<string>();
    categoryMuseums.forEach(m => {
      (m.provinces || [m.province]).forEach(province => {
        if (province && province !== 'ไม่ระบุ') set.add(province);
      });
    });
    return Array.from(set).sort();
  }, [categoryMuseums]);

  // If initialSubject is passed, find if it belongs to any category
  useEffect(() => {
    if (initialSubject) {
      setSelectedSubSubject(initialSubject);
      // Find which category has this subject
      for (const cat of activeCategories) {
        const subs = museumStore.getSubjectsByCategory(cat.name);
        if (subs.some(s => s.name === initialSubject)) {
          setSelectedCategoryId(cat.id);
          break;
        }
      }
    }
  }, [initialSubject, activeCategories]);

  // When changing category, clear sub-subject filter unless it matches
  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubSubject('');
    setSearchQuery('');
    setSelectedProvince('all');
  };

  const currentColors = currentCategory 
    ? getCategoryColorTheme(currentCategory.colorTheme)
    : getCategoryColorTheme('amber');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. Primary Page Header: Focused Exclusively on 'วิถีชีวิตท้องถิ่น' */}
      <div className="bg-[#fffdf7] rounded-3xl border border-[#d7c8b2] p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
        
        {/* Subtle decorative heritage background watermark */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none bg-contain bg-right bg-no-repeat"
          style={{ backgroundImage: `url('/assets/optimized/parchment-background.webp')` }}
        />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10 border-b border-[#d7c8b2]/60 pb-6">
          <div className="space-y-2 max-w-3xl">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ece4d4]/70 border border-[#d7c8b2] text-xs font-heading font-semibold text-[#5c3d26] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#e6c12f]" />
              <span>{taxonomyConfig.badgeText || 'ดัชนีวิถีชีวิตท้องถิ่น 9 ประเภท'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-[#382415] tracking-tight">
              {taxonomyConfig.mainTitle || 'วิถีชีวิตท้องถิ่น'}
            </h1>

            <p className="text-sm sm:text-base font-heading font-medium text-[#7a5230] leading-relaxed">
              {taxonomyConfig.mainSubtitle || 'ดัชนีหัวเรื่องภูมิปัญญาและวิถีชนสยาม จำแนกตาม 9 ภาคส่วนการจัดการพิพิธภัณฑ์'}
            </p>

            <p className="text-xs sm:text-sm text-[#5c3d26] font-sans leading-relaxed pt-1">
              {(taxonomyConfig.mainDescription || `สำรวจพิพิธภัณฑ์ ${localLivingMuseumCount} แห่งที่เกี่ยวข้องกับวิถีชีวิตท้องถิ่น จำแนกตาม 9 ประเภทจากชุดข้อมูลที่คัดกรองแล้ว`).replace(/1,574/g, localLivingMuseumCount.toLocaleString('en-US'))}
            </p>
          </div>

          {/* Header Stats Counter */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
            <div className="flex items-center gap-2.5">
              <div className="px-3.5 py-2 rounded-xl bg-white border border-[#d7c8b2] text-center shadow-2xs">
                <span className="text-[10px] text-[#735640] uppercase tracking-wider block font-heading">หมวดหลัก</span>
                <span className="text-lg font-bold font-editorial text-[#5c3d26]">9 ประเภท</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-white border border-[#d7c8b2] text-center shadow-2xs">
                <span className="text-[10px] text-[#735640] uppercase tracking-wider block font-heading">พิพิธภัณฑ์รวม</span>
                <span className="text-lg font-bold font-editorial text-[#e6c12f]">{localLivingMuseumCount.toLocaleString('th-TH')} แห่ง</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. The 9 Categories Navigation Bar (แยกออกมาเป็น 9 ประเภท ตามข้อมูลที่มีในเว็บ) */}
        <div className="pt-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#463629] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#9c7d5c]" />
              <span>เลือกประเภทเพื่อดูรายชื่อข้อมูลใต้ประเภทนั้น (9 ภาคส่วนการจัดการ):</span>
            </span>
            <span className="text-xs text-[#735640] font-sans hidden sm:inline">
              คลิกที่ประเภทเพื่อเปิดดูรายชื่อพิพิธภัณฑ์และหัวเรื่องย่อย
            </span>
          </div>

          {/* 9 Category Interactive Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {activeCategories.map((cat, idx) => {
              const isSelected = cat.id === selectedCategoryId;
              const catColors = getCategoryColorTheme(cat.colorTheme);
              const count = museumStore.getMuseumsByCategory(cat.name).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? `bg-gradient-to-br from-[#463629] to-[#2c221a] text-white shadow-xl ring-3 ring-[#e6c12f]/80 scale-[1.02] border-transparent`
                      : 'bg-white hover:bg-[#ece4d4]/50 border border-[#d7c8b2] hover:border-[#9c7d5c] text-[#463629]'
                  }`}
                >
                  {/* Top Bar: Icon & Count Badge */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isSelected 
                        ? 'bg-[#e6c12f] text-[#463629]' 
                        : `${catColors.bgLight} ${catColors.text}`
                    }`}>
                      {getCategoryIcon(cat.iconName, "w-4 h-4")}
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                      isSelected 
                        ? 'bg-white/20 text-[#fff9c4]' 
                        : 'bg-[#ece4d4]/70 text-[#6f5a45]'
                    }`}>
                      {count} แห่ง
                    </span>
                  </div>

                  {/* Title & Type Name */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-mono opacity-70">
                      0{idx + 1}
                    </div>
                    <div className={`font-bold text-xs sm:text-sm font-heading leading-tight truncate ${
                      isSelected ? 'text-[#fffdf7]' : 'text-[#382415]'
                    }`}>
                      {cat.name}
                    </div>
                    <div className={`text-[10px] leading-snug line-clamp-1 ${
                      isSelected ? 'text-white/70' : 'text-[#6f5a45]'
                    }`}>
                      {cat.title}
                    </div>
                  </div>

                  {/* Bottom selection indicator */}
                  {isSelected && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#e6c12f] rounded-full shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. Detail View of the Selected Category (ข้อมูลใต้ประเภทนั้นๆ) */}
      {currentCategory && (
        <div className="space-y-6">
          
          {/* Active Category Hero Card */}
          <div className="bg-[#fffdf7] rounded-3xl border-2 border-[#d7c8b2] p-6 sm:p-7 shadow-sm space-y-5">
            
            {/* Header: Title, Description, and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d7c8b2]/60 pb-5">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md shrink-0 bg-gradient-to-br ${currentColors.gradient} text-white`}>
                  {getCategoryIcon(currentCategory.iconName, "w-7 h-7")}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#e6c12f] text-[#463629]">
                      ประเภท: {currentCategory.name}
                    </span>
                    <span className="text-xs font-mono text-[#6f5a45]">
                      {categoryMuseums.length} พิพิธภัณฑ์ • {categorySubjects.length} หัวเรื่องย่อยที่พบ
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#382415]">
                    {currentCategory.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5c3d26] leading-relaxed max-w-3xl">
                    {currentCategory.subtitle}
                  </p>
                </div>
              </div>

              {/* Action: Open Knowledge Graph for this Category */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
                <button
                  onClick={() => onNavigate('graph', { focusSubject: currentCategory.name })}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#5c3d26] to-[#432818] hover:brightness-110 text-white rounded-xl text-xs font-heading font-semibold shadow-md transition-all cursor-pointer border border-[#e6c12f]/40"
                  title="เปิดดูโครงข่ายความสัมพันธ์ของประเภทนี้ใน Knowledge Graph"
                >
                  <Network className="w-4 h-4 text-[#e6c12f]" />
                  <span>เปิดดูใน Knowledge Graph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sub-Subjects (หัวเรื่องย่อยที่มีการจัดแสดงใต้ประเภทนี้) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#9c7d5c]" />
                  <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-[#382415]">
                    หัวเรื่องย่อยใต้ประเภท "{currentCategory.name}" ({categorySubjects.length} หัวเรื่อง):
                  </h3>
                </div>

                {selectedSubSubject && (
                  <button
                    onClick={() => setSelectedSubSubject('')}
                    className="text-xs text-[#9c7d5c] hover:underline font-semibold cursor-pointer"
                  >
                    ล้างตัวกรองหัวเรื่อง (แสดงทั้งหมด)
                  </button>
                )}
              </div>

              {/* Subject Chips Horizontal Scroll / Wrap */}
              <div className="flex flex-wrap items-center gap-2 max-h-36 overflow-y-auto p-1">
                {/* "ทั้งหมด" Pill */}
                <button
                  onClick={() => setSelectedSubSubject('')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer ${
                    !selectedSubSubject
                      ? 'bg-[#463629] text-white shadow-md ring-2 ring-[#e6c12f]/70'
                      : 'bg-white hover:bg-[#ece4d4] text-[#6f5a45] border border-[#d7c8b2]'
                  }`}
                >
                  ทั้งหมด ({categoryMuseums.length} แห่ง)
                </button>

                {/* Sub-subjects from data */}
                {categorySubjects.slice(0, 35).map(subj => {
                  const isCur = subj.name === selectedSubSubject;
                  return (
                    <button
                      key={subj.name}
                      onClick={() => setSelectedSubSubject(isCur ? '' : subj.name)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading transition-all cursor-pointer ${
                        isCur
                          ? 'bg-gradient-to-r from-[#9c7d5c] to-[#856748] text-white shadow-md ring-2 ring-[#e6c12f] font-semibold'
                          : 'bg-white hover:bg-[#ece4d4]/60 text-[#463629] border border-[#d7c8b2]/70'
                      }`}
                    >
                      <span>{subj.name}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                        isCur ? 'bg-white/20 text-white' : 'bg-[#ece4d4]/80 text-[#6f5a45]'
                      }`}>
                        {subj.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {categorySubjects.length > 35 && (
                <div className="text-[11px] text-[#735640] font-sans">
                  * แสดง 35 หัวเรื่องที่มีความถี่สูงสุด จากทั้งหมด {categorySubjects.length} หัวเรื่องใต้ประเภทนี้
                </div>
              )}
            </div>

          </div>

          {/* 4. Museums List Under This Category (รายชื่อข้อมูลใต้ประเภทนั้นๆ) */}
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="p-4 bg-white rounded-2xl border border-[#d7c8b2] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              
              {/* Left: Active Search and Province Filter */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Search in this category */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#9c7d5c] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={`ค้นหาในพิพิธภัณฑ์ ${currentCategory.name}...`}
                    className="w-full pl-8.5 pr-3 py-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl text-xs text-[#463629] focus:outline-none focus:ring-1 focus:ring-[#9c7d5c]"
                  />
                </div>

                {/* Province Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#6f5a45]">จังหวัด:</span>
                  <select
                    value={selectedProvince}
                    onChange={e => setSelectedProvince(e.target.value)}
                    className="px-2.5 py-1.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl font-medium text-[#463629] cursor-pointer"
                  >
                    <option value="all">ทุกจังหวัด ({categoryProvinces.length} จังหวัด)</option>
                    {categoryProvinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#6f5a45]">เรียงตาม:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl font-medium text-[#463629] cursor-pointer"
                  >
                    <option value="title">ชื่อ ก-ฮ</option>
                    <option value="province">จังหวัด</option>
                  </select>
                </div>
              </div>

              {/* Right: Results Count */}
              <div className="text-xs text-[#735640] flex items-center gap-1.5 self-end sm:self-center font-heading">
                <span>แสดงผล:</span>
                <strong className="text-[#382415] font-bold text-sm tabular-nums">
                  {filteredMuseums.length}
                </strong>
                <span>จาก {categoryMuseums.length} แห่ง</span>
              </div>
            </div>

            {/* Museums Grid / Cards List */}
            {filteredMuseums.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMuseums.map(museum => (
                  <article
                    key={museum.id}
                    className="bg-white rounded-2xl border border-[#d7c8b2] p-5 shadow-2xs hover:shadow-md hover:border-[#9c7d5c] transition-all flex flex-col justify-between group space-y-4"
                  >
                    <div className="space-y-2.5">
                      {/* Meta Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#ece4d4] text-[#5c3d26] text-[11px] font-mono font-semibold">
                          {museum.type}
                        </span>
                        <span className="text-xs text-[#735640] font-sans flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#9c7d5c]" />
                          <span>{museum.province}</span>
                        </span>
                      </div>

                      {/* Museum Title */}
                      <h4 
                        onClick={() => onNavigate('museum-detail', { museumId: museum.id, localLiving: true })}
                        className="text-base font-editorial font-bold text-[#382415] group-hover:text-[#9c7d5c] transition-colors cursor-pointer leading-snug"
                      >
                        {museum.title}
                      </h4>

                      {/* Address / Spatial */}
                      {museum.spatial && (
                        <p className="text-xs text-[#6f5a45] line-clamp-2 leading-relaxed">
                          {museum.spatial}
                        </p>
                      )}

                      {/* Subject Tags */}
                      {museum.subjectList && museum.subjectList.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {museum.subjectList.slice(0, 4).map((tag, tIdx) => {
                            const isMatch = tag === selectedSubSubject;
                            return (
                              <button
                                key={tIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSubSubject(isMatch ? '' : tag);
                                }}
                                className={`text-[10px] px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                                  isMatch 
                                    ? 'bg-[#e6c12f] text-[#463629] font-bold' 
                                    : 'bg-[#fffdf7] text-[#6f5a45] border border-[#d7c8b2]/60 hover:bg-[#ece4d4]'
                                }`}
                              >
                                #{tag}
                              </button>
                            );
                          })}
                          {museum.subjectList.length > 4 && (
                            <span className="text-[10px] text-[#735640] font-mono">
                              +{museum.subjectList.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-[#d7c8b2]/50 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onNavigate('museum-detail', { museumId: museum.id })}
                        className="text-xs font-heading font-semibold text-[#5c3d26] hover:text-[#382415] flex items-center gap-1 cursor-pointer"
                      >
                        <span>เปิดดูรายละเอียด</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onNavigate('graph', { focusMuseumId: museum.id })}
                        className="p-1.5 rounded-lg bg-[#ece4d4]/60 hover:bg-[#ece4d4] text-[#463629] transition-colors cursor-pointer"
                        title="ดูความเชื่อมโยงในกราฟความรู้"
                      >
                        <Network className="w-3.5 h-3.5 text-[#9c7d5c]" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#d7c8b2] p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#ece4d4] text-[#9c7d5c] flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#382415] font-editorial">
                  ไม่พบข้อมูลพิพิธภัณฑ์ตามเงื่อนไขที่ค้นหา
                </h4>
                <p className="text-xs text-[#6f5a45] max-w-md mx-auto">
                  ลองล้างคำค้นหาหรือเลือกหัวเรื่องย่อยอื่นเพื่อดูรายการข้อมูล
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubSubject('');
                    setSelectedProvince('all');
                  }}
                  className="px-4 py-2 bg-[#9c7d5c] text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
