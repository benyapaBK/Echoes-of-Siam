import React, { useEffect, useState } from 'react';
import { Download, FileCode2, FileJson2, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { museumStore } from '../services/museumStore';

type ExportFormat = 'csv' | 'json' | 'xml';

interface ExportDataset {
  id: string;
  title: string;
  description: string;
  filename: string;
  csv: string;
  json: string;
}

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const toXml = (value: unknown, tag = 'item'): string => {
  if (Array.isArray(value)) {
    const records = value.map(item => toXml(item, tag === 'records' ? 'record' : tag)).join('');
    return tag === 'records' ? `<records>${records}</records>` : records;
  }
  if (value !== null && typeof value === 'object') {
    const children = Object.entries(value as Record<string, unknown>)
      .map(([key, child]) => toXml(child, key.replace(/[^a-zA-Z0-9_.-]/g, '_')))
      .join('');
    return `<${tag}>${children}</${tag}>`;
  }
  return `<${tag}>${escapeXml(value == null ? '' : String(value))}</${tag}>`;
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const formatOptions: { format: ExportFormat; label: string; mimeType: string; icon: React.ReactNode }[] = [
  { format: 'csv', label: 'CSV · Excel / Sheets', mimeType: 'text/csv;charset=utf-8', icon: <FileSpreadsheet className="h-4 w-4" /> },
  { format: 'json', label: 'JSON · สำหรับนักพัฒนา', mimeType: 'application/json;charset=utf-8', icon: <FileJson2 className="h-4 w-4" /> },
  { format: 'xml', label: 'XML · แลกเปลี่ยนข้อมูล', mimeType: 'application/xml;charset=utf-8', icon: <FileCode2 className="h-4 w-4" /> }
];

export const DataExportPage: React.FC = () => {
  const [, refresh] = useState(0);

  useEffect(() => museumStore.subscribe(() => refresh(value => value + 1)), []);

  const datasets: ExportDataset[] = [
    {
      id: 'museums',
      title: 'ข้อมูลพิพิธภัณฑ์',
      description: `${museumStore.getPublishedMuseums().length.toLocaleString('th-TH')} ระเบียน · รายละเอียด ที่ตั้ง หัวเรื่อง และแหล่งอ้างอิง`,
      filename: 'echoes-of-siam-museums',
      csv: museumStore.exportMuseumsCSV(true),
      json: museumStore.exportMuseumsJSON(true)
    },
    {
      id: 'subjects',
      title: 'ดัชนีหัวเรื่องภูมิปัญญา',
      description: `${museumStore.getSubjects().filter(subject => subject.status === 'active').length.toLocaleString('th-TH')} หัวเรื่อง · จำนวนและรหัสพิพิธภัณฑ์ที่เชื่อมโยง`,
      filename: 'echoes-of-siam-subjects',
      csv: museumStore.exportSubjectsCSV(true),
      json: museumStore.exportSubjectsJSON(true)
    }
  ];

  const handleDownload = (dataset: ExportDataset, format: ExportFormat, mimeType: string) => {
    const content = format === 'csv'
      ? dataset.csv
      : format === 'json'
        ? dataset.json
        : `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(JSON.parse(dataset.json), 'records')}`;
    downloadFile(content, `${dataset.filename}.${format}`, mimeType);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f5] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-[#d7c8b2] bg-gradient-to-br from-[#2a1d13] via-[#46301d] to-[#1c130c] p-8 text-white shadow-xl sm:p-10">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-[#e6c12f]/15 p-3 text-[#e6c12f]">
              <Download className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e6c12f]">Open data</p>
              <h1 className="font-editorial text-3xl font-bold sm:text-4xl">ดาวน์โหลดข้อมูล</h1>
              <p className="max-w-3xl text-sm leading-relaxed text-[#e5d6c3]">
                ดาวน์โหลดข้อมูลพิพิธภัณฑ์และดัชนีหัวเรื่องได้โดยไม่ต้องเข้าสู่ระบบ เลือกรูปแบบที่เหมาะกับการวิเคราะห์หรือใช้งานต่อ
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {datasets.map(dataset => (
            <section key={dataset.id} className="rounded-2xl border border-[#d7c8b2] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#463629]">{dataset.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#6f5a45]">{dataset.description}</p>
                </div>
                <span className="rounded-xl bg-[#f5ede0] p-2 text-[#9c7d5c]">
                  <Download className="h-5 w-5" />
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {formatOptions.map(option => (
                  <button
                    key={option.format}
                    type="button"
                    onClick={() => handleDownload(dataset, option.format, option.mimeType)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#d7c8b2] bg-[#fffdf7] px-3 py-2 text-xs font-semibold text-[#5c3d26] transition hover:border-[#9c7d5c] hover:bg-[#f5ede0] focus:outline-none focus:ring-2 focus:ring-[#9c7d5c]"
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="flex items-start gap-2 rounded-2xl border border-[#d7c8b2] bg-white/80 p-4 text-xs leading-relaxed text-[#6f5a45]">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9c7d5c]" />
          <span>ข้อมูลเปิดสำหรับการศึกษาและการวิจัย โปรดตรวจสอบสิทธิ์การใช้งานและอ้างอิงแหล่งข้อมูลต้นทางก่อนนำไปเผยแพร่ต่อ</span>
        </p>
      </div>
    </div>
  );
};
