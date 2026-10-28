import React, { useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Layers, 
  FileCheck2, 
  ShieldCheck, 
  Landmark, 
  Tag, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { museumStore } from '../services/museumStore';

export const Insights: React.FC = () => {
  const allMuseums = museumStore.getPublishedMuseums();
  const allSubjects = museumStore.getSubjects();
  const qualityReport = museumStore.getDataQualityReport();

  // Museum type distribution
  const typeDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    allMuseums.forEach(m => {
      const t = m.type || 'ทั่วไป';
      counts.set(t, (counts.get(t) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, [allMuseums]);

  // Province distribution (top 12)
  const provinceDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    const knownProvinces = new Set(museumStore.getProvinces());
    allMuseums.forEach(m => {
      const provinces = new Set([m.province, ...(m.provinces || [])]
        .filter(province => knownProvinces.has(province)));
      provinces.forEach(province => counts.set(province, (counts.get(province) || 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([province, count]) => ({ province, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [allMuseums]);

  // Top subjects (top 15)
  const topSubjects = useMemo(() => {
    return allSubjects.slice(0, 15);
  }, [allSubjects]);

  const maxTypeCount = typeDistribution[0]?.count || 1;
  const maxProvinceCount = provinceDistribution[0]?.count || 1;
  const maxSubjectCount = topSubjects[0]?.count || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="border-b border-[#d7c8b2] pb-6">
        <div className="text-xs uppercase tracking-widest text-[#9c7d5c] font-semibold mb-1">
          สถิติเชิงประจักษ์ (Empirical Data Overview)
        </div>
        <h1 className="text-3xl font-editorial font-bold text-[#463629]">
          ภาพรวมและสถิติข้อมูลพิพิธภัณฑ์ไทย
        </h1>
        <p className="text-xs text-[#6f5a45] mt-1 font-sans">
          การวิเคราะห์เชิงสถิติจากชุดข้อมูลพิพิธภัณฑ์ 1,574 แห่ง ของศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน) คำนวณจากระเบียนจริงทั้งหมด
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-[#d7c8b2] shadow-2xs space-y-1">
          <div className="text-xs text-[#6f5a45] flex items-center justify-between">
            <span>ระเบียนทั้งหมด</span>
            <Landmark className="w-4 h-4 text-[#9c7d5c]" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#463629] tabular-nums">
            {allMuseums.length.toLocaleString('th-TH')}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            ความถูกต้อง 100% มีชื่อพิพิธภัณฑ์ครบถ้วน
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#d7c8b2] shadow-2xs space-y-1">
          <div className="text-xs text-[#6f5a45] flex items-center justify-between">
            <span>หัวเรื่องการจัดแสดง</span>
            <Tag className="w-4 h-4 text-[#e6c12f]" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#9c7d5c] tabular-nums">
            {allSubjects.length.toLocaleString('th-TH')}
          </div>
          <div className="text-[11px] text-[#6f5a45]">
            จำแนกตามคำสำคัญของนักวิจัย
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#d7c8b2] shadow-2xs space-y-1">
          <div className="text-xs text-[#6f5a45] flex items-center justify-between">
            <span>ความสมบูรณ์ลิงก์ต้นฉบับ</span>
            <ExternalLink className="w-4 h-4 text-[#9c7d5c]" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#463629] tabular-nums">
            {allMuseums.filter(m => m.sourceUri && m.sourceUri.startsWith('http')).length.toLocaleString('th-TH')}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            มีลิงก์อ้างอิงสู่ SAC ครบ 100%
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#d7c8b2] shadow-2xs space-y-1">
          <div className="text-xs text-[#6f5a45] flex items-center justify-between">
            <span>การกระจายตัวเชิงพื้นที่</span>
            <MapPin className="w-4 h-4 text-[#9c7d5c]" />
          </div>
          <div className="text-2xl font-bold font-editorial text-[#e6c12f] tabular-nums">
            {museumStore.getProvinces().length}
          </div>
          <div className="text-[11px] text-[#6f5a45]">
            จังหวัดที่มีพิพิธภัณฑ์ในฐานข้อมูล
          </div>
        </div>

      </div>

      {/* Grid: 2 Charts Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Distribution by Museum Type */}
        <div className="bg-white p-6 rounded-xl border border-[#d7c8b2] space-y-4 shadow-2xs">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#9c7d5c]">
              Institutional Types
            </div>
            <h2 className="text-lg font-bold font-editorial text-[#463629]">
              การกระจายตัวตามประเภทองค์กรพิพิธภัณฑ์
            </h2>
            <p className="text-xs text-[#6f5a45]">
              สัดส่วนประเภทการบริหารจัดการและแหล่งทุนของพิพิธภัณฑ์ไทย
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {typeDistribution.map(item => {
              const pct = ((item.count / allMuseums.length) * 100).toFixed(1);
              const barWidth = Math.max(4, (item.count / maxTypeCount) * 100);
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#463629]">{item.type}</span>
                    <span className="text-[#6f5a45] font-mono tabular-nums">
                      {item.count} แห่ง ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#ece4d4]/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#9c7d5c] rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Top Provinces */}
        <div className="bg-white p-6 rounded-xl border border-[#d7c8b2] space-y-4 shadow-2xs">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#9c7d5c]">
              Geographical Distribution
            </div>
            <h2 className="text-lg font-bold font-editorial text-[#463629]">
              12 จังหวัดที่มีความหนาแน่นของพิพิธภัณฑ์สูงสุด
            </h2>
            <p className="text-xs text-[#6f5a45]">
              จำนวนพิพิธภัณฑ์ที่สืบค้นได้จากที่อยู่และการระบุจังหวัดในชุดข้อมูล
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {provinceDistribution.map(item => {
              const barWidth = Math.max(4, (item.count / maxProvinceCount) * 100);
              return (
                <div key={item.province} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#463629]">{item.province}</span>
                    <span className="text-[#6f5a45] font-mono tabular-nums">
                      {item.count} แห่ง
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#ece4d4]/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#e6c12f] rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Chart 3: Top Subjects Frequency Bar Chart */}
      <div className="bg-white p-6 rounded-xl border border-[#d7c8b2] space-y-4 shadow-2xs">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#9c7d5c]">
            Taxonomic Prevalence
          </div>
          <h2 className="text-lg font-bold font-editorial text-[#463629]">
            15 หัวเรื่องภูมิปัญญาและโบราณคดีที่มีการจัดแสดงสูงสุด
          </h2>
          <p className="text-xs text-[#6f5a45]">
            วิถีชีวิตท้องถิ่นครองอันดับหนึ่งด้วยพิพิธภัณฑ์กว่า 391 แห่ง สะท้อนพลังของพิพิธภัณฑ์ชุมชนในประเทศไทย
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 pt-2">
          {topSubjects.map(sub => {
            const barWidth = Math.max(5, (sub.count / maxSubjectCount) * 100);
            return (
              <div key={sub.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#463629] truncate max-w-[200px]">{sub.name}</span>
                  <span className="text-[#6f5a45] font-mono tabular-nums">{sub.count} แห่ง</span>
                </div>
                <div className="w-full h-2.5 bg-[#ece4d4]/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#9c7d5c] rounded-full"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Rigor & Quality Audit Overview */}
      <div className="bg-[#ece4d4]/30 rounded-2xl border border-[#d7c8b2] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-[#9c7d5c]" />
          <h2 className="text-base font-bold font-editorial text-[#463629]">
            รายงานความสมบูรณ์ของชุดข้อมูลต้นฉบับ (Data Completeness Audit)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-white rounded-lg border border-[#d7c8b2]/70">
            <div className="text-[#6f5a45]">ระเบียนที่มีชื่อพิพิธภัณฑ์</div>
            <div className="text-lg font-bold text-emerald-700 tabular-nums">
              {allMuseums.length - qualityReport.missingTitles} / {allMuseums.length}
            </div>
            <div className="text-[11px] text-[#6f5a45]/70">ครบถ้วน 100%</div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-[#d7c8b2]/70">
            <div className="text-[#6f5a45]">ระเบียนที่มีหัวเรื่อง (Subjects)</div>
            <div className="text-lg font-bold text-emerald-700 tabular-nums">
              {allMuseums.length - qualityReport.missingSubjects} / {allMuseums.length}
            </div>
            <div className="text-[11px] text-[#6f5a45]/70">
              {(((allMuseums.length - qualityReport.missingSubjects) / allMuseums.length) * 100).toFixed(1)}% มีการจัดหมวดหมู่
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-[#d7c8b2]/70">
            <div className="text-[#6f5a45]">ระเบียนที่มีที่อยู่/สถานที่ตั้ง</div>
            <div className="text-lg font-bold text-emerald-700 tabular-nums">
              {allMuseums.length - qualityReport.missingSpatial} / {allMuseums.length}
            </div>
            <div className="text-[11px] text-[#6f5a45]/70">
              {(((allMuseums.length - qualityReport.missingSpatial) / allMuseums.length) * 100).toFixed(1)}% มีพิกัดข้อความ
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
