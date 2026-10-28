import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Tag, 
  ExternalLink, 
  Network, 
  Landmark, 
  User, 
  Calendar, 
  ShieldAlert, 
  BookOpen, 
  ChevronRight,
  Globe,
  Share2,
  Check
} from 'lucide-react';
import { museumStore } from '../services/museumStore';
import type { Museum } from '../types/museum';

interface MuseumDetailProps {
  museumId: string;
  localLiving?: boolean;
  onNavigate: (tab: string, meta?: any) => void;
}

export const MuseumDetail: React.FC<MuseumDetailProps> = ({ museumId, localLiving = false, onNavigate }) => {
  const museum = localLiving
    ? museumStore.getLocalLivingMuseumById(museumId)
    : museumStore.getMuseumById(museumId);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!museum) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Landmark className="w-12 h-12 text-[#d7c8b2] mx-auto" />
        <h2 className="text-2xl font-editorial font-bold text-[#463629]">
          ไม่พบข้อมูลพิพิธภัณฑ์ที่ระบุ
        </h2>
        <p className="text-xs text-[#6f5a45]">
          พิพิธภัณฑ์นี้อาจถูกย้าย หรือไม่มีอยู่ในฐานข้อมูลปัจจุบัน
        </p>
        <button
          onClick={() => onNavigate('museums')}
          className="px-4 py-2 bg-[#9c7d5c] text-white text-xs rounded-lg hover:bg-[#856748]"
        >
          กลับสู่สารบัญพิพิธภัณฑ์
        </button>
      </div>
    );
  }

  const relatedMuseums = museumStore.getRelatedMuseums(museum, 4);
  const sourceUris = museum.sourceUris?.length
    ? museum.sourceUris
    : museum.sourceUri
      ? [museum.sourceUri]
      : [];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button and share bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('museums')}
          className="inline-flex items-center gap-1.5 text-xs text-[#6f5a45] hover:text-[#463629] transition-colors py-1 px-2.5 rounded-md hover:bg-[#ece4d4]/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับไปยังสารบัญพิพิธภัณฑ์</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('graph', { focusMuseumId: museum.id })}
            className="inline-flex items-center gap-1.5 text-xs text-[#463629] bg-[#ece4d4] hover:bg-[#d7c8b2] px-3 py-1.5 rounded-lg border border-[#d7c8b2] transition-colors font-medium shadow-2xs"
          >
            <Network className="w-3.5 h-3.5 text-[#9c7d5c]" />
            <span>ดูใน Knowledge Graph</span>
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 text-[#6f5a45] hover:text-[#463629] border border-[#d7c8b2] rounded-lg bg-white"
            title="คัดลอกลิงก์"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Accession Presentation */}
      <article className="bg-white rounded-2xl border border-[#d7c8b2] overflow-hidden shadow-xs">
        
        {/* Visual Frame: If image URL exists and valid, render; otherwise render styled institutional header */}
        {museum.imageUrl && !imageError ? (
          <div className="w-full h-80 bg-stone-100 relative overflow-hidden">
            <img
              src={museum.imageUrl}
              alt={museum.imageAlt || museum.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {museum.imageRights && (
              <div className="absolute bottom-2 right-2 text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                © {museum.imageRights}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full bg-[#ece4d4]/30 border-b border-[#d7c8b2]/60 p-8 sm:p-12 relative flex flex-col justify-center">
            <div className="max-w-2xl space-y-2">
              <div className="text-[11px] uppercase tracking-widest font-mono text-[#9c7d5c]">
                ACCESSION NO. {museum.sourceId ? `SAC-${museum.sourceId}` : museum.id}
              </div>
              <h1 className="text-2xl sm:text-4xl font-editorial font-bold text-[#463629] leading-tight">
                {museum.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#6f5a45]">
                <span className="font-semibold text-[#9c7d5c]">{museum.type}</span>
                <span aria-hidden="true">·</span>
                <span>{museum.province}</span>
                {museum.temporal && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>พ.ศ. {museum.temporal}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content details grid */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Spatial / Location Address */}
          {museum.spatial && museum.spatial !== '-' && (
            <div className="p-4 bg-[#fffdf7] rounded-xl border border-[#d7c8b2]/70 flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#9c7d5c] mt-0.5 shrink-0" />
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-[#463629]">สถานที่ตั้ง / ที่อยู่จัดแสดง:</span>
                <p className="text-[#6f5a45] leading-relaxed whitespace-pre-line">{museum.spatial}</p>
              </div>
            </div>
          )}

          {/* Core Metadata Definition List (dl) */}
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[#9c7d5c]">
              ข้อมูลพื้นฐานตามระเบียนคลังความรู้ ศมส.
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs border-t border-b border-[#d7c8b2]/60 py-5">
              
              <div>
                <dt className="text-[#6f5a45] font-medium">ประเภทสถาบันพิพิธภัณฑ์</dt>
                <dd className="font-semibold text-[#463629] mt-0.5">{museum.type || 'ไม่มีข้อมูลในชุดข้อมูลต้นทาง'}</dd>
              </div>

              <div>
                <dt className="text-[#6f5a45] font-medium">จังหวัด</dt>
                <dd className="font-semibold text-[#463629] mt-0.5">{museum.province || 'ไม่ระบุ'}</dd>
              </div>

              <div>
                <dt className="text-[#6f5a45] font-medium">ผู้ก่อตั้ง / ผู้สร้างข้อมูล (Creator)</dt>
                <dd className="text-[#463629] mt-0.5">{museum.creator || 'ไม่มีข้อมูลในชุดข้อมูลต้นทาง'}</dd>
              </div>

              <div>
                <dt className="text-[#6f5a45] font-medium">ปีที่ก่อตั้ง / ช่วงเวลา (Temporal)</dt>
                <dd className="text-[#463629] mt-0.5">{museum.temporal ? `พ.ศ. ${museum.temporal}` : 'ไม่มีข้อมูลในชุดข้อมูลต้นทาง'}</dd>
              </div>

              <div>
                <dt className="text-[#6f5a45] font-medium">ภาษาที่ใช้ในการจัดแสดง (Language)</dt>
                <dd className="text-[#463629] mt-0.5">{museum.language || 'ไทย'}</dd>
              </div>

              <div>
                <dt className="text-[#6f5a45] font-medium">ประวัติการได้มา (Provenance)</dt>
                <dd className="text-[#463629] mt-0.5">{museum.provenance || 'ไม่มีข้อมูลในชุดข้อมูลต้นทาง'}</dd>
              </div>

              <div>
                <dt className="text-[#6f5a45] font-medium">สิทธิ์ในการเผยแพร่ (Rights)</dt>
                <dd className="text-[#463629] mt-0.5">{museum.rights || 'ไม่มีข้อมูลในชุดข้อมูลต้นทาง'}</dd>
              </div>

              <div>
                <dt className="text-[#6f5a45] font-medium">สัญญาอนุญาต (License)</dt>
                <dd className="text-[#463629] mt-0.5">{museum.license || 'DGA Open Government License'}</dd>
              </div>
            </dl>
          </div>

          {/* Subjects Section */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[#9c7d5c]">
              หัวเรื่องและประเด็นการจัดแสดง (Subjects)
            </h2>

            {museum.subjectList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {museum.subjectList.map(subj => (
                  <button
                    key={subj}
                    onClick={() => onNavigate('subjects', { selectSubject: subj })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ece4d4]/60 hover:bg-[#ece4d4] rounded-lg text-xs font-medium text-[#463629] transition-colors border border-[#d7c8b2]"
                  >
                    <Tag className="w-3 h-3 text-[#9c7d5c]" />
                    <span>{subj}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6f5a45]">ไม่มีข้อมูลหัวเรื่องในชุดข้อมูลต้นทาง</p>
            )}
          </div>

          {/* Source Link */}
          {sourceUris.length > 0 && (
            <div className="pt-4 border-t border-[#d7c8b2]/50 flex items-center justify-between text-xs text-[#6f5a45]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#9c7d5c]" />
                <span>แหล่งข้อมูลทางการ: ศูนย์มานุษยวิทยาสิรินธร (SAC)</span>
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                {sourceUris.map((sourceUri, index) => (
                  <a
                    key={sourceUri}
                    href={sourceUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#9c7d5c] font-medium hover:underline"
                  >
                    <span>{sourceUris.length > 1 ? `เปิดดูต้นฉบับ ${index + 1}` : 'เปิดดูหน้ารายละเอียดต้นฉบับ'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </article>

      {/* Related Museums based on shared subjects */}
      {relatedMuseums.length > 0 && (
        <section className="space-y-4 pt-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-semibold text-[#9c7d5c] mb-1">
              สายสัมพันธ์เชิงสถาบันและภูมิปัญญา (Cross-Institutional Linkages)
            </div>
            <h2 className="text-xl font-editorial font-bold text-[#463629]">
              พิพิธภัณฑ์ที่มีเนื้อหาและภูมิปัญญาเชื่อมโยงกัน
            </h2>
            <p className="text-xs text-[#6f5a45]">
              คำนวณจากความเชื่อมโยงของหัวเรื่องการจัดแสดงที่มีร่วมกันในฐานข้อมูล
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedMuseums.map(rel => (
              <article
                key={rel.id}
                onClick={() => onNavigate('museum-detail', { museumId: rel.id })}
                className="bg-white rounded-xl border border-[#d7c8b2] p-4 hover:border-[#9c7d5c] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="text-[11px] text-[#6f5a45]">
                    <span className="font-semibold text-[#9c7d5c]">{rel.type}</span>
                    <span className="mx-1" aria-hidden="true">·</span>
                    <span>{rel.province}</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#463629] group-hover:text-[#9c7d5c] line-clamp-2">
                    {rel.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-[#d7c8b2]/40 text-[11px] text-[#6f5a45] truncate">
                  {rel.subjectList.slice(0, 2).join(', ')}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
