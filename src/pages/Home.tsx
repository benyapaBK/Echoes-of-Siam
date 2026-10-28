import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Landmark, 
  Network, 
  Tag, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  ExternalLink,
  Compass,
  MapPin,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { museumStore } from '../services/museumStore';
import { HeroBannerSlider } from '../components/home/HeroBannerSlider';
import { QuickAccessKnowledgeGraph } from '../components/home/QuickAccessKnowledgeGraph';
import type { Museum, SubjectItem, BannerSlide } from '../types/museum';

interface HomeProps {
  onNavigate: (tab: string, meta?: any) => void;
  onOpenSearch: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>(() => museumStore.getActiveBannerSlides());
  const [settings, setSettings] = useState(() => museumStore.getSiteSettings());

  useEffect(() => {
    const unsubscribe = museumStore.subscribe(() => {
      setBannerSlides(museumStore.getActiveBannerSlides());
      setSettings(museumStore.getSiteSettings());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const allMuseums = museumStore.getPublishedMuseums();
  const allSubjects = museumStore.getSubjects();
  const allProvinces = museumStore.getProvinces();
  const allTypes = museumStore.getMuseumTypes();

  // Curated featured museums
  const featuredMuseums: Museum[] = settings.featuredMuseumIds
    .map(id => museumStore.getMuseumById(id))
    .filter((m): m is Museum => m !== undefined)
    .slice(0, 6);

  // If featured is less than 6, backfill with interesting ones
  if (featuredMuseums.length < 6) {
    const additional = allMuseums
      .filter(m => !featuredMuseums.some(f => f.id === m.id) && m.subjectList.length > 2)
      .slice(0, 6 - featuredMuseums.length);
    featuredMuseums.push(...additional);
  }

  // Top wisdom subjects
  const topSubjects = allSubjects.slice(0, 8);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigate('museums', { searchQuery: searchInput.trim() });
    } else {
      onOpenSearch();
    }
  };

  return (
    <div className="space-y-14 pb-20">
      
      {/* 1. Website Cover: Interactive Full-Page Hero Banner Slider */}
      {bannerSlides.length > 0 && (
        <section aria-label="หน้าปกเว็บไซต์ แบนเนอร์สไลด์" className="w-full">
          <HeroBannerSlider slides={bannerSlides} onNavigate={onNavigate} />
        </section>
      )}

      {/* 2. Announcement banner placed UNDER the cover banner as requested */}
      {settings.announcementEnabled && settings.announcement && (
        <aside 
          id="archive-announcement-section" 
          aria-label="ประกาศคลังข้อมูล" 
          className="w-full bg-[#ece4d4]/80 border-y border-[#d7c8b2] py-3 px-4 text-center text-xs sm:text-sm text-[#463629] font-medium flex items-center justify-center gap-2.5 backdrop-blur-xs -mt-14 mb-2 shadow-2xs"
        >
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#9c7d5c] text-white text-[11px] font-heading font-bold rounded-md">
            ประกาศ
          </span>
          <span className="font-sans leading-relaxed">{settings.announcement}</span>
        </aside>
      )}

      {/* 3. Modern Marquee Exploration & Discovery Section */}
      <section id="main-explore-section" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ece4d4]/70 border border-[#d7c8b2] rounded-full text-xs font-heading font-medium text-[#463629] shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#9c7d5c]" />
            <span>Echoes of Siam — สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-bold text-[#463629] leading-tight tracking-tight text-balance">
            {settings.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-[#6f5a45] leading-relaxed max-w-2xl mx-auto font-sans">
            {settings.heroSubtitle}
          </p>

          {/* Quick Hero Search Input */}
          <form onSubmit={handleHeroSearch} className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center shadow-md rounded-xl overflow-hidden border border-[#d7c8b2] bg-white transition-all focus-within:ring-2 focus-within:ring-[#9c7d5c]/30">
              <Search className="w-5 h-5 text-[#9c7d5c] ml-4 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="ค้นหาพิพิธภัณฑ์, ของจัดแสดง, จังหวัด, หรือภูมิปัญญา..."
                className="w-full py-4 px-3 text-[#463629] placeholder-[#6f5a45]/60 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="mr-2 px-5 py-2.5 bg-[#9c7d5c] hover:bg-[#856748] text-white text-xs font-medium rounded-lg transition-colors shrink-0"
              >
                ค้นพบ
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-[#6f5a45]">
              <span>ค้นหายอดนิยม:</span>
              {['วิถีชีวิต', 'โบราณคดี', 'ผ้าทอ', 'เครื่องปั้นดินเผา', 'วัด'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onNavigate('museums', { searchQuery: tag })}
                  className="hover:text-[#463629] hover:underline cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Operational / Data Rigor Ribbon */}
        <div className="mt-14 pt-8 border-t border-[#d7c8b2]/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-bold font-editorial text-[#463629] tabular-nums">
              {allMuseums.length.toLocaleString('th-TH')}
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6f5a45]">
              พิพิธภัณฑ์ทั่วประเทศ
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold font-editorial text-[#9c7d5c] tabular-nums">
              {allSubjects.length.toLocaleString('th-TH')}
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6f5a45]">
              หัวเรื่องและภูมิปัญญา
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold font-editorial text-[#463629] tabular-nums">
              {allProvinces.length}
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6f5a45]">
              จังหวัดที่มีการบันทึก
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold font-editorial text-[#e6c12f] tabular-nums">
              {allTypes.length}
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6f5a45]">
              ประเภทสถาบันพิพิธภัณฑ์
            </div>
          </div>
        </div>
      </section>

      {/* Featured Museums Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#9c7d5c] font-semibold mb-1">
              คลังมรดกและพิพิธภัณฑ์คัดสรร (Curated Catalog)
            </div>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#463629]">
              พิพิธภัณฑ์และคลังความรู้แนะนำ
            </h2>
          </div>
          <button
            onClick={() => onNavigate('museums')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9c7d5c] hover:text-[#856748] transition-colors"
          >
            <span>ดูทั้งหมด {allMuseums.length} แห่ง</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMuseums.map(museum => (
            <article
              key={museum.id}
              onClick={() => onNavigate('museum-detail', { museumId: museum.id })}
              className="bg-white rounded-xl border border-[#d7c8b2] p-5 hover:border-[#9c7d5c] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Zero-pill metadata line */}
                <div className="flex items-center gap-2 text-xs text-[#6f5a45]">
                  <span className="font-medium text-[#9c7d5c]">{museum.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{museum.province}</span>
                  {museum.temporal && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>พ.ศ. {museum.temporal}</span>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#463629] group-hover:text-[#9c7d5c] transition-colors line-clamp-2">
                  {museum.title}
                </h3>

                {museum.spatial && (
                  <p className="text-xs text-[#6f5a45]/80 line-clamp-2 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9c7d5c] mt-0.5 shrink-0" />
                    <span>{museum.spatial}</span>
                  </p>
                )}
              </div>

              {/* Subjects and card footer */}
              <div className="mt-5 pt-4 border-t border-[#d7c8b2]/40 flex items-center justify-between">
                <div className="text-xs text-[#6f5a45] truncate max-w-[80%]">
                  {museum.subjectList.length > 0 ? (
                    <span>{museum.subjectList.slice(0, 3).join(', ')}</span>
                  ) : (
                    <span className="text-[#6f5a45]/50">ทั่วไป</span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-[#d7c8b2] group-hover:text-[#9c7d5c] shrink-0" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Quick-Access Knowledge Graph Interactive Exploration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuickAccessKnowledgeGraph onNavigate={onNavigate} />
      </section>

      {/* Popular Wisdom Subjects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-[#9c7d5c] font-semibold mb-1">
            การจัดหมวดหมู่หัวเรื่องภูมิปัญญา (Subject Classification)
          </div>
          <h2 className="text-2xl font-editorial font-bold text-[#463629]">
            หัวเรื่องภูมิปัญญาและประวัติศาสตร์ที่พบบ่อย
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {topSubjects.map(sub => (
            <button
              key={sub.id}
              onClick={() => onNavigate('subjects', { selectSubject: sub.name })}
              className="p-4 bg-white rounded-xl border border-[#d7c8b2] text-left hover:border-[#9c7d5c] hover:bg-[#fffdf7] transition-all group"
            >
              <div className="text-xs text-[#9c7d5c] font-medium mb-1">
                เชื่อมโยง {sub.count} แห่ง
              </div>
              <div className="text-sm font-bold text-[#463629] group-hover:text-[#9c7d5c] transition-colors">
                {sub.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Institutional Types Classification */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-[#ece4d4]/40 rounded-2xl border border-[#d7c8b2]">
          <div className="max-w-3xl mb-6">
            <h2 className="text-xl font-editorial font-bold text-[#463629] mb-2">
              สำรวจตามประเภทการบริหารจัดการพิพิธภัณฑ์
            </h2>
            <p className="text-xs text-[#6f5a45] leading-relaxed">
              ชุดข้อมูลแบ่งประเภทพิพิธภัณฑ์ตามองค์กรผู้ก่อตั้งและการดำเนินงานจริง 9 ประเภท
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {allTypes.map(type => {
              const count = allMuseums.filter(m => m.type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => onNavigate('museums', { filterType: type })}
                  className="px-3.5 py-2 bg-white rounded-lg border border-[#d7c8b2] hover:border-[#9c7d5c] text-xs font-medium text-[#463629] transition-all flex items-center gap-2 group"
                >
                  <span className="group-hover:text-[#9c7d5c]">{type}</span>
                  <span className="text-[11px] text-[#6f5a45] bg-[#ece4d4]/60 px-1.5 py-0.5 rounded font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
