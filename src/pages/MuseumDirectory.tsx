import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Tag,
  Landmark,
  RotateCcw
} from 'lucide-react';
import { museumStore } from '../services/museumStore';
import type { Museum } from '../types/museum';

interface MuseumDirectoryProps {
  onNavigate: (tab: string, meta?: any) => void;
  initialQuery?: string;
  initialType?: string;
}

export const MuseumDirectory: React.FC<MuseumDirectoryProps> = ({ 
  onNavigate, 
  initialQuery = '',
  initialType = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'id-asc' | 'temporal'>('id-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 18;

  const allMuseums = museumStore.getPublishedMuseums();
  const allProvinces = museumStore.getProvinces();
  const allTypes = museumStore.getMuseumTypes();
  const allSubjects = museumStore.getSubjects();

  useEffect(() => {
    if (initialQuery) setSearchTerm(initialQuery);
    if (initialType) setSelectedType(initialType);
  }, [initialQuery, initialType]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedProvince, selectedSubject, sortBy]);

  // Filtered and sorted dataset
  const filteredMuseums = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return allMuseums.filter(m => {
      if (q) {
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchSpatial = m.spatial && m.spatial.toLowerCase().includes(q);
        const matchCreator = m.creator && m.creator.toLowerCase().includes(q);
        const matchSubject = m.subjectList.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchSpatial && !matchCreator && !matchSubject) return false;
      }
      if (selectedType && m.type !== selectedType) return false;
      if (selectedProvince && m.province !== selectedProvince) return false;
      if (selectedSubject && !m.subjectList.includes(selectedSubject)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title, 'th');
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title, 'th');
      if (sortBy === 'temporal') {
        const tA = parseInt(a.temporal || '0') || 0;
        const tB = parseInt(b.temporal || '0') || 0;
        return tB - tA;
      }
      // default id-asc
      const idA = parseInt(a.sourceId || '0') || 0;
      const idB = parseInt(b.sourceId || '0') || 0;
      return idA - idB;
    });
  }, [allMuseums, searchTerm, selectedType, selectedProvince, selectedSubject, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredMuseums.length / pageSize) || 1;
  const paginatedMuseums = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMuseums.slice(start, start + pageSize);
  }, [filteredMuseums, currentPage, pageSize]);

  const hasActiveFilters = Boolean(searchTerm || selectedType || selectedProvince || selectedSubject);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedProvince('');
    setSelectedSubject('');
    setSortBy('id-asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header and Title */}
      <div className="border-b border-[#d7c8b2] pb-6">
        <div className="text-xs uppercase tracking-widest text-[#9c7d5c] font-semibold mb-1">
          สารบัญพิพิธภัณฑ์แห่งชาติ (National Museum Directory)
        </div>
        <h1 className="text-3xl font-editorial font-bold text-[#463629]">
          สารบัญพิพิธภัณฑ์ในประเทศไทย
        </h1>
        <p className="text-xs text-[#6f5a45] mt-1 font-sans">
          สำรวจข้อมูลพิพิธภัณฑ์และคลังความรู้ 1,574 แห่ง ค้นหาและกรองตามประเภท ที่ตั้ง และหัวเรื่องที่จัดแสดง
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#d7c8b2] shadow-2xs space-y-4">
        
        {/* Top search & quick clear */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9c7d5c] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อพิพิธภัณฑ์, ผู้ก่อตั้ง, ที่ตั้ง, หรือหัวเรื่อง..."
              className="w-full pl-10 pr-4 py-2.5 text-xs text-[#463629] placeholder-[#6f5a45]/60 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg focus:outline-none focus:border-[#9c7d5c]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f5a45] hover:text-[#463629]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              aria-label="เรียงลำดับผลลัพธ์"
              className="py-2.5 px-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg text-xs text-[#463629] focus:outline-none focus:border-[#9c7d5c]"
            >
              <option value="id-asc">เรียงตาม: ลำดับฐานข้อมูล</option>
              <option value="title-asc">เรียงตาม: ชื่อ ก-ฮ</option>
              <option value="title-desc">เรียงตาม: ชื่อ ฮ-ก</option>
              <option value="temporal">เรียงตาม: พ.ศ. ก่อตั้ง</option>
            </select>

            <div className="flex items-center bg-[#ece4d4]/50 border border-[#d7c8b2] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-2xs text-[#463629]' : 'text-[#6f5a45]'}`}
                title="มุมมองแบบการ์ด"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white shadow-2xs text-[#463629]' : 'text-[#6f5a45]'}`}
                title="มุมมองแบบตาราง"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#d7c8b2]/40">
          
          {/* Type filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6f5a45] mb-1">
              ประเภทสถาบันพิพิธภัณฑ์
            </label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg text-xs text-[#463629] focus:outline-none focus:border-[#9c7d5c]"
            >
              <option value="">ทุกประเภท ({allTypes.length} ประเภท)</option>
              {allTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Province filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6f5a45] mb-1">
              จังหวัดที่ตั้ง
            </label>
            <select
              value={selectedProvince}
              onChange={e => setSelectedProvince(e.target.value)}
              className="w-full py-2 px-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg text-xs text-[#463629] focus:outline-none focus:border-[#9c7d5c]"
            >
              <option value="">ทุกจังหวัด ({allProvinces.length} จังหวัด)</option>
              {allProvinces.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Subject filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6f5a45] mb-1">
              หัวเรื่องสำคัญ
            </label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full py-2 px-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg text-xs text-[#463629] focus:outline-none focus:border-[#9c7d5c]"
            >
              <option value="">ทุกหัวเรื่อง</option>
              {allSubjects.slice(0, 50).map(s => (
                <option key={s.id} value={s.name}>{s.name} ({s.count})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary & Active tag row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-[#6f5a45]">
          <div>
            พบข้อมูลพิพิธภัณฑ์ <strong className="text-[#463629] font-bold tabular-nums">{filteredMuseums.length}</strong> แห่ง
            {hasActiveFilters && <span> (จากทั้งหมด {allMuseums.length} แห่ง)</span>}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs text-[#9c7d5c] hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Display: Grid or Table */}
      {filteredMuseums.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#d7c8b2] p-12 text-center space-y-3">
          <Landmark className="w-10 h-10 text-[#d7c8b2] mx-auto" />
          <h3 className="font-editorial text-lg font-bold text-[#463629]">
            ไม่พบพิพิธภัณฑ์ที่ตรงกับเงื่อนไขการค้นหา
          </h3>
          <p className="text-xs text-[#6f5a45] max-w-sm mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือกดล้างตัวกรองเพื่อเรียกดูข้อมูลพิพิธภัณฑ์ทั้งหมด 1,574 แห่ง
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 bg-[#9c7d5c] text-white text-xs rounded-lg hover:bg-[#856748] transition-colors"
          >
            ล้างตัวกรอง
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedMuseums.map(museum => (
            <article
              key={museum.id}
              onClick={() => onNavigate('museum-detail', { museumId: museum.id })}
              className="bg-white rounded-xl border border-[#d7c8b2] p-5 hover:border-[#9c7d5c] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Zero-pill metadata line */}
                <div className="flex items-center gap-2 text-xs text-[#6f5a45]">
                  <span className="font-semibold text-[#9c7d5c]">{museum.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{museum.province}</span>
                  {museum.temporal && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">พ.ศ. {museum.temporal}</span>
                    </>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#463629] group-hover:text-[#9c7d5c] transition-colors line-clamp-2">
                  {museum.title}
                </h3>

                {museum.spatial && (
                  <p className="text-xs text-[#6f5a45]/80 line-clamp-2 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9c7d5c] mt-0.5 shrink-0" />
                    <span>{museum.spatial}</span>
                  </p>
                )}
              </div>

              {/* Subject snippets */}
              <div className="mt-5 pt-3.5 border-t border-[#d7c8b2]/40 flex items-center justify-between text-xs text-[#6f5a45]">
                <div className="truncate max-w-[85%]">
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
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-[#d7c8b2] overflow-x-auto shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#ece4d4]/60 border-b border-[#d7c8b2] text-[#463629] font-semibold">
                <th className="py-3 px-4 w-16">รหัส</th>
                <th className="py-3 px-4">ชื่อพิพิธภัณฑ์</th>
                <th className="py-3 px-4">ประเภท</th>
                <th className="py-3 px-4">จังหวัด</th>
                <th className="py-3 px-4">หัวเรื่องเด่น</th>
                <th className="py-3 px-4 w-20 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7c8b2]/50 text-[#6f5a45]">
              {paginatedMuseums.map(museum => (
                <tr 
                  key={museum.id}
                  onClick={() => onNavigate('museum-detail', { museumId: museum.id })}
                  className="hover:bg-[#fffdf7] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-[11px] text-[#9c7d5c]">
                    {museum.sourceId || museum.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#463629] max-w-xs">
                    {museum.title}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {museum.type}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {museum.province}
                  </td>
                  <td className="py-3 px-4 max-w-sm truncate">
                    {museum.subjectList.slice(0, 3).join(', ') || '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs text-[#9c7d5c] font-medium hover:underline">
                      เปิดดู
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[#d7c8b2] pt-6">
          <div className="text-xs text-[#6f5a45]">
            หน้า <strong className="text-[#463629]">{currentPage}</strong> จากทั้งหมด <strong className="text-[#463629]">{totalPages}</strong> หน้า
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-[#d7c8b2] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">ก่อนหน้า</span>
            </button>

            {/* Simple page numbers */}
            <div className="hidden sm:flex items-center gap-1 px-2 text-xs font-mono">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded ${
                      currentPage === pageNum
                        ? 'bg-[#9c7d5c] text-white font-semibold'
                        : 'hover:bg-[#ece4d4]/60 text-[#463629]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#d7c8b2] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white text-xs flex items-center gap-1"
            >
              <span className="hidden sm:inline">ถัดไป</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
