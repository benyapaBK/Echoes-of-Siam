import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Landmark, 
  Tag, 
  Sliders, 
  Image as ImageIcon, 
  FileCheck2, 
  Trash2, 
  History, 
  Upload, 
  Download, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash, 
  RotateCcw, 
  Search, 
  Check, 
  X, 
  AlertTriangle,
  ExternalLink,
  Save,
  Globe,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Network,
  Code,
  Copy,
  Video,
  MessageSquare,
  HelpCircle,
  Volume2,
  Play,
  Compass,
  Menu,
  UserCheck,
  Mail
} from 'lucide-react';
import { museumStore } from '../services/museumStore';
import { useAuth } from '../context/AuthContext';
import type { Museum, SubjectItem, SiteSettings, AuditLog, BannerSlide, GraphBloomPreset, KnowledgeGraphImage, MascotConfig, MascotFaq } from '../types/museum';
import { LivingMemoryUniverseCanvas } from '../components/home/LivingMemoryUniverseCanvas';
import { AdminKnowledgeGraphView } from '../components/admin/AdminKnowledgeGraphView';
import { AdminMascotView } from '../components/admin/AdminMascotView';
import { AdminUserInquiriesView } from '../components/admin/AdminUserInquiriesView';
import { AdminSubjectsTaxonomyView } from '../components/admin/AdminSubjectsTaxonomyView';
import { AdminHeaderNavView } from '../components/admin/AdminHeaderNavView';
import { AdminContactView } from '../components/admin/AdminContactView';

interface AdminProps {
  onNavigate: (tab: string, meta?: any) => void;
  initialMenu?: string;
  initialSubTab?: string;
}

export const Admin: React.FC<AdminProps> = ({ onNavigate, initialMenu, initialSubTab }) => {
  const { isAdmin, adminEmail, logout, isFirebaseActive } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string>(() => initialMenu || 'dashboard');

  useEffect(() => {
    if (initialMenu) {
      setActiveMenu(initialMenu);
    }
  }, [initialMenu]);

  // If not admin, redirect or show access restricted
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-editorial text-[#463629]">
          สิทธิ์การเข้าถึงถูกจำกัด
        </h2>
        <p className="text-xs text-[#6f5a45]">
          หน้านี้สงวนไว้สำหรับผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้น
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-5 py-2.5 bg-[#9c7d5c] text-white rounded-lg text-xs font-semibold"
        >
          เข้าสู่ระบบผู้ดูแล
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d7c8b2] pb-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#9c7d5c] font-semibold">
            ระบบบริหารจัดการสารสนเทศ (Admin Management Console)
          </div>
          <h1 className="text-2xl font-editorial font-bold text-[#463629] flex items-center gap-2.5">
            <img 
              src="/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png" 
              alt="Echoes of Siam" 
              className="w-7 h-7 object-contain rounded-full shadow-2xs" 
            />
            <span>แผงควบคุมระบบ — Echoes of Siam</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="block font-semibold text-[#463629]">{adminEmail || 'admin@gmail.com'}</span>
            <span className="text-[11px] text-emerald-700 flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              <span>{isFirebaseActive ? 'เชื่อมต่อ Firebase แล้ว' : 'โหมดการจัดการคลังข้อมูลในเครื่อง'}</span>
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Admin Layout: Left Navigation + Right Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar Menu (3 cols) */}
        <nav className="lg:col-span-3 bg-white rounded-xl border border-[#d7c8b2] p-3 space-y-1 shadow-2xs text-xs">
          {[
            { id: 'dashboard', label: 'ภาพรวม (Dashboard)', icon: LayoutDashboard },
            { id: 'contact', label: 'จัดการหน้าติดต่อเรา & ผู้สร้าง (Contact CMS)', icon: UserCheck },
            { id: 'header_nav', label: 'จัดการแถบเมนูด้านบน (Header Nav CMS)', icon: Menu },
            { id: 'banners', label: 'จัดการแบนเนอร์หน้าแรก & วิดีโอ (Banners)', icon: Layers },
            { id: 'bloom', label: 'จัดการกราฟความรู้ & แผนภาพ (Graph & Bloom)', icon: Network },
            { id: 'mascot', label: 'จัดการมาสคอตน้องมิวมิว (Mascot Chatbot)', icon: Sparkles },
            { id: 'inquiries', label: 'ข้อความและคำถามจากผู้ใช้ (User Inquiries)', icon: MessageSquare },
            { id: 'museums', label: 'จัดการพิพิธภัณฑ์ (Museums)', icon: Landmark },
            { id: 'subjects', label: 'จัดการดัชนีหัวเรื่อง 9 ประเภท (Taxonomy & Subjects)', icon: Tag },
            { id: 'settings', label: 'ตั้งค่าหน้าหลัก (Site CMS)', icon: Sliders },
            { id: 'images', label: 'จัดการรูปภาพ (Images)', icon: ImageIcon },
            { id: 'quality', label: 'ตรวจสอบคุณภาพข้อมูล (Audit)', icon: FileCheck2 },
            { id: 'trash', label: 'ถังขยะและกู้คืน (Trash)', icon: Trash2 },
            { id: 'logs', label: 'บันทึกกิจกรรม (Audit Logs)', icon: History },
            { id: 'import', label: 'นำเข้าข้อมูล (Import)', icon: Upload },
            { id: 'export', label: 'ส่งออกข้อมูล (Export)', icon: Download },
            { id: 'security', label: 'ความปลอดภัย & Firebase', icon: ShieldCheck },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors font-medium cursor-pointer ${
                  isActive 
                    ? 'bg-[#9c7d5c] text-white' 
                    : 'text-[#6f5a45] hover:bg-[#ece4d4]/50 hover:text-[#463629]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#9c7d5c]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Content Area (9 cols) */}
        <main className="lg:col-span-9 bg-white rounded-xl border border-[#d7c8b2] p-6 shadow-2xs min-h-[600px]">
          {activeMenu === 'dashboard' && <AdminDashboardView onNavigateTab={setActiveMenu} />}
          {activeMenu === 'contact' && <AdminContactView onNavigate={onNavigate} />}
          {activeMenu === 'header_nav' && <AdminHeaderNavView onNavigate={onNavigate} />}
          {activeMenu === 'banners' && <AdminBannersView onNavigate={onNavigate} />}
          {activeMenu === 'bloom' && <AdminKnowledgeGraphView onNavigate={onNavigate} initialSubTab={initialSubTab as any} />}
          {activeMenu === 'mascot' && <AdminMascotView onNavigate={onNavigate} />}
          {activeMenu === 'inquiries' && <AdminUserInquiriesView onNavigate={onNavigate} />}
          {activeMenu === 'museums' && <AdminMuseumsView onNavigate={onNavigate} />}
          {activeMenu === 'subjects' && <AdminSubjectsTaxonomyView onNavigate={onNavigate} initialSubTab={initialSubTab as any} />}
          {activeMenu === 'settings' && <AdminSettingsView />}
          {activeMenu === 'images' && <AdminImagesView />}
          {activeMenu === 'quality' && <AdminQualityView />}
          {activeMenu === 'trash' && <AdminTrashView />}
          {activeMenu === 'logs' && <AdminLogsView />}
          {activeMenu === 'import' && <AdminImportView />}
          {activeMenu === 'export' && <AdminExportView />}
          {activeMenu === 'security' && <AdminSecurityView />}
        </main>

      </div>

    </div>
  );
};

/* --- SUB-VIEWS --- */

// 1. Dashboard View
const AdminDashboardView: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const allMuseums = museumStore.getAllMuseums();
  const published = allMuseums.filter(m => m.status === 'published');
  const drafts = allMuseums.filter(m => m.status === 'draft');
  const subjects = museumStore.getSubjects();
  const trash = museumStore.getTrash();
  const logs = museumStore.getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          ภาพรวมคลังข้อมูล (Dashboard)
        </h2>
        <p className="text-xs text-[#6f5a45]">
          สรุปสถานะระเบียนพิพิธภัณฑ์ หัวเรื่อง และกิจกรรมผู้ดูแลระบบล่าสุด
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl space-y-1">
          <div className="text-xs text-[#6f5a45]">พิพิธภัณฑ์ทั้งหมด</div>
          <div className="text-2xl font-bold font-editorial text-[#463629] tabular-nums">
            {allMuseums.length.toLocaleString('th-TH')}
          </div>
          <div className="text-[11px] text-emerald-700">เผยแพร่แล้ว {published.length} แห่ง</div>
        </div>

        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl space-y-1">
          <div className="text-xs text-[#6f5a45]">ฉบับร่าง (Drafts)</div>
          <div className="text-2xl font-bold font-editorial text-[#9c7d5c] tabular-nums">
            {drafts.length}
          </div>
          <div className="text-[11px] text-[#6f5a45]">รอการเผยแพร่</div>
        </div>

        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl space-y-1">
          <div className="text-xs text-[#6f5a45]">หัวเรื่องภูมิปัญญา</div>
          <div className="text-2xl font-bold font-editorial text-[#e6c12f] tabular-nums">
            {subjects.length.toLocaleString('th-TH')}
          </div>
          <div className="text-[11px] text-[#6f5a45]">ดัชนีพร้อมใช้งาน</div>
        </div>

        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl space-y-1">
          <div className="text-xs text-[#6f5a45]">ถังขยะ (Trash)</div>
          <div className="text-2xl font-bold font-editorial text-red-700 tabular-nums">
            {trash.length}
          </div>
          <div className="text-[11px] text-[#6f5a45]">ระเบียนที่กู้คืนได้</div>
        </div>
      </div>

      {/* Quick Access to Banner CMS, Header Nav CMS & Contact CMS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-r from-[#ece4d4]/60 to-[#fffdf7] border border-[#d7c8b2] rounded-xl flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#9c7d5c] text-white flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#463629]">จัดการหน้าปกเว็บไซต์ (Banners)</h4>
              <p className="text-xs text-[#6f5a45]">ปรับแต่ง 3 แบนเนอร์หลักหรือเพิ่มแบนเนอร์ใหม่</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('banners')}
            className="w-full sm:w-auto self-end px-3.5 py-1.5 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
          >
            จัดการแบนเนอร์ →
          </button>
        </div>

        <div className="p-4 bg-gradient-to-r from-[#f5ede0]/70 to-[#fffdf7] border border-[#d7c8b2] rounded-xl flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#463629] text-[#ebdcc9] flex items-center justify-center shrink-0">
              <Menu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#463629]">จัดการแถบเมนูด้านบน (Header CMS)</h4>
              <p className="text-xs text-[#6f5a45]">แก้ไขชื่อเมนู ปลายทาง ฟังก์ชั่น และเมนูย่อย</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('header_nav')}
            className="w-full sm:w-auto self-end px-3.5 py-1.5 bg-[#463629] hover:bg-[#34271c] text-[#ebdcc9] rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
          >
            จัดการแถบเมนู →
          </button>
        </div>

        <div className="p-4 bg-gradient-to-r from-[#fbf6ed] to-[#fffdf7] border border-[#d7c8b2] rounded-xl flex flex-col justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#d4af37] text-[#1c130c] flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#463629]">ติดต่อเรา & ผู้สร้างระบบ (Contact CMS)</h4>
              <p className="text-xs text-[#6f5a45]">แก้ไขสถานที่ ข้อมูลติดต่อ และรูปภาพผู้สร้างในกรอบวงกลม</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('contact')}
            className="w-full sm:w-auto self-end px-3.5 py-1.5 bg-[#866747] hover:bg-[#6f5437] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
          >
            จัดการหน้าติดต่อเรา →
          </button>
        </div>
      </div>

      {/* Recent activities */}
      <div className="space-y-3 pt-4 border-t border-[#d7c8b2]/60">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#463629]">
            กิจกรรมผู้ดูแลล่าสุด (Recent Audit Logs)
          </h3>
          <button 
            onClick={() => onNavigateTab('logs')}
            className="text-xs text-[#9c7d5c] hover:underline"
          >
            ดูประวัติทั้งหมด
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {logs.slice(0, 5).map(log => (
            <div key={log.id} className="p-3 bg-[#fffdf7] rounded-lg border border-[#d7c8b2]/60 flex items-center justify-between gap-4">
              <div>
                <span className="font-semibold text-[#463629] mr-2">[{log.action}]</span>
                <span className="text-[#6f5a45]">{log.details}</span>
              </div>
              <span className="text-[10px] text-[#6f5a45] font-mono shrink-0">
                {new Date(log.timestamp).toLocaleDateString('th-TH')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. Manage Museums View
const AdminMuseumsView: React.FC<{ onNavigate: (tab: string, meta?: any) => void }> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [editingMuseum, setEditingMuseum] = useState<Museum | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Museum>>({});
  const [, setTick] = useState(0);

  const allMuseums = museumStore.getAllMuseums();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allMuseums.slice(0, 30);
    return allMuseums.filter(m => 
      m.title.toLowerCase().includes(q) ||
      m.province.toLowerCase().includes(q) ||
      (m.sourceId && m.sourceId.includes(q))
    ).slice(0, 30);
  }, [allMuseums, search]);

  const handleEdit = (m: Museum) => {
    setEditingMuseum(m);
    setFormData({ ...m });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMuseum || !formData.title) return;
    museumStore.updateMuseum(editingMuseum.id, formData);
    setEditingMuseum(null);
    setTick(t => t + 1);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    museumStore.createMuseum({
      title: formData.title,
      type: formData.type || 'ทั่วไป',
      creator: formData.creator || '',
      provenance: formData.provenance || '',
      subjectRaw: formData.subjectRaw || '',
      subjectList: formData.subjectRaw ? formData.subjectRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
      spatial: formData.spatial || '',
      province: formData.province || 'ไม่ระบุ',
      temporal: formData.temporal || '',
      language: formData.language || 'ไทย',
      rights: formData.rights || '',
      license: formData.license || '',
      sourceUri: formData.sourceUri || '',
      imageUrl: formData.imageUrl || '',
      imageAlt: formData.imageAlt || '',
      status: formData.status || 'published'
    });
    setIsCreating(false);
    setFormData({});
    setTick(t => t + 1);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`ย้ายพิพิธภัณฑ์ "${title}" ลงถังขยะหรือไม่?`)) {
      museumStore.softDeleteMuseum(id);
      setTick(t => t + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d7c8b2]/60 pb-3">
        <div>
          <h2 className="text-lg font-bold font-editorial text-[#463629]">
            จัดการข้อมูลพิพิธภัณฑ์ (Manage Museums)
          </h2>
          <p className="text-xs text-[#6f5a45]">
            เพิ่ม แก้ไข และจัดการสถานะระเบียนพิพิธภัณฑ์
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: '',
              type: 'หน่วยงานราชการ',
              province: 'กรุงเทพมหานคร',
              status: 'published'
            });
            setIsCreating(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มพิพิธภัณฑ์ใหม่</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#9c7d5c] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อพิพิธภัณฑ์เพื่อแก้ไขหรือลบ..."
          className="w-full pl-9 pr-3 py-2 text-xs text-[#463629] bg-[#fffdf7] border border-[#d7c8b2] rounded-lg focus:outline-none focus:border-[#9c7d5c]"
        />
      </div>

      {/* Museums List Table */}
      <div className="border border-[#d7c8b2] rounded-xl overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-[#ece4d4]/60 border-b border-[#d7c8b2] font-semibold text-[#463629]">
            <tr>
              <th className="py-2.5 px-3">รหัส</th>
              <th className="py-2.5 px-3">ชื่อพิพิธภัณฑ์</th>
              <th className="py-2.5 px-3">ประเภท</th>
              <th className="py-2.5 px-3">จังหวัด</th>
              <th className="py-2.5 px-3">สถานะ</th>
              <th className="py-2.5 px-3 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d7c8b2]/50 text-[#6f5a45]">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-[#fffdf7]">
                <td className="py-2.5 px-3 font-mono text-[11px] text-[#9c7d5c]">{m.sourceId || m.id}</td>
                <td className="py-2.5 px-3 font-semibold text-[#463629]">{m.title}</td>
                <td className="py-2.5 px-3">{m.type}</td>
                <td className="py-2.5 px-3">{m.province}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    m.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {m.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="text-[#9c7d5c] hover:underline"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(m.id, m.title)}
                    className="text-red-600 hover:underline"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {(editingMuseum || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#d7c8b2] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#d7c8b2] pb-3">
              <h3 className="text-base font-bold font-editorial text-[#463629]">
                {isCreating ? 'เพิ่มพิพิธภัณฑ์ใหม่' : `แก้ไข: ${editingMuseum?.title}`}
              </h3>
              <button 
                onClick={() => { setEditingMuseum(null); setIsCreating(false); }}
                className="text-[#6f5a45]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isCreating ? handleCreate : handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">ชื่อพิพิธภัณฑ์ *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">ประเภท *</label>
                  <input
                    type="text"
                    value={formData.type || ''}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">จังหวัด *</label>
                  <input
                    type="text"
                    value={formData.province || ''}
                    onChange={e => setFormData({ ...formData, province: e.target.value })}
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">สถานที่ตั้ง / ที่อยู่</label>
                <textarea
                  rows={2}
                  value={formData.spatial || ''}
                  onChange={e => setFormData({ ...formData, spatial: e.target.value })}
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">หัวเรื่อง (คั่นด้วยจุลภาค)</label>
                <input
                  type="text"
                  value={formData.subjectRaw || ''}
                  onChange={e => setFormData({ ...formData, subjectRaw: e.target.value })}
                  placeholder="วิถีชีวิตท้องถิ่น, โบราณคดี, พระพุทธรูป"
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">External Image URL (HTTPS เท่านั้น)</label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/museum.jpg"
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
                {formData.imageUrl && (
                  <div className="mt-2 h-32 bg-stone-100 rounded-lg overflow-hidden border border-[#d7c8b2]">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">สถานะ</label>
                  <select
                    value={formData.status || 'published'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  >
                    <option value="published">Published (เผยแพร่)</option>
                    <option value="draft">Draft (ฉบับร่าง)</option>
                    <option value="archived">Archived (เก็บถาวร)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">ลิงก์ข้อมูลต้นทาง ศมส.</label>
                  <input
                    type="url"
                    value={formData.sourceUri || ''}
                    onChange={e => setFormData({ ...formData, sourceUri: e.target.value })}
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[#d7c8b2]">
                <button
                  type="button"
                  onClick={() => { setEditingMuseum(null); setIsCreating(false); }}
                  className="px-4 py-2 border border-[#d7c8b2] rounded-lg text-[#6f5a45]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg font-semibold"
                >
                  บันทึกลงฐานข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Manage Subjects View with Merge Tool
const AdminSubjectsView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sourceSubject, setSourceSubject] = useState('');
  const [targetSubject, setTargetSubject] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const subjects = museumStore.getSubjects();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subjects.slice(0, 50);
    return subjects.filter(s => s.name.toLowerCase().includes(q)).slice(0, 50);
  }, [subjects, search]);

  const handleMerge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceSubject || !targetSubject || sourceSubject === targetSubject) {
      alert('โปรดเลือกหัวเรื่องต้นทางและปลายทางที่แตกต่างกัน');
      return;
    }
    if (confirm(`ยืนยันการรวมหัวเรื่อง "${sourceSubject}" เข้ากับ "${targetSubject}" หรือไม่?`)) {
      const affected = museumStore.mergeSubjects(sourceSubject, targetSubject);
      setMessage(`รวมหัวเรื่องสำเร็จ! ส่งผลต่อพิพิธภัณฑ์ ${affected} แห่ง`);
      setSourceSubject('');
      setTargetSubject('');
      setTick(t => t + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          จัดการหัวเรื่องและรวมคำพ้อง (Subject Taxonomy Management)
        </h2>
        <p className="text-xs text-[#6f5a45]">
          ตรวจสอบหัวเรื่อง 2,460 เรื่อง และรวมหัวเรื่องที่เป็นเรื่องเดียวกันเพื่อความเป็นระเบียบ
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
          {message}
        </div>
      )}

      {/* Merge Tool Form */}
      <div className="p-4 bg-[#ece4d4]/40 rounded-xl border border-[#d7c8b2] space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-[#463629]">
          เครื่องมือรวมหัวเรื่อง (Subject Merge Tool)
        </h3>
        <form onSubmit={handleMerge} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-end">
          <div>
            <label className="block text-[#6f5a45] mb-1">หัวเรื่องต้นทาง (ที่จะถูกแทนที่)</label>
            <input
              type="text"
              required
              value={sourceSubject}
              onChange={e => setSourceSubject(e.target.value)}
              placeholder="เช่น กลุ่มชาติพันธุ์"
              className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
            />
          </div>
          <div>
            <label className="block text-[#6f5a45] mb-1">หัวเรื่องปลายทาง (เป้าหมาย)</label>
            <input
              type="text"
              required
              value={targetSubject}
              onChange={e => setTargetSubject(e.target.value)}
              placeholder="เช่น ชาติพันธุ์"
              className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg font-semibold"
          >
            รวมหัวเรื่องทันที
          </button>
        </form>
      </div>

      {/* Subject Search & Catalog */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#9c7d5c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อหัวเรื่อง..."
            className="w-full pl-9 pr-3 py-2 text-xs text-[#463629] bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
          />
        </div>

        <div className="border border-[#d7c8b2] rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#ece4d4]/60 border-b border-[#d7c8b2] text-[#463629] font-semibold">
              <tr>
                <th className="py-2.5 px-3">ชื่อหัวเรื่อง</th>
                <th className="py-2.5 px-3">จำนวนพิพิธภัณฑ์ที่เชื่อมโยง</th>
                <th className="py-2.5 px-3">สถานะ</th>
                <th className="py-2.5 px-3 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7c8b2]/50 text-[#6f5a45]">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-[#fffdf7]">
                  <td className="py-2.5 px-3 font-semibold text-[#463629]">{s.name}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums">{s.count} แห่ง</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">active</span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setSourceSubject(s.name)}
                      className="text-[#9c7d5c] hover:underline"
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
  );
};

// 4. Homepage & Site Settings View
const AdminSettingsView: React.FC = () => {
  const currentSettings = museumStore.getSiteSettings();
  const [formData, setFormData] = useState<SiteSettings>(currentSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    museumStore.updateSiteSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          ตั้งค่าหน้าหลักและข้อความประชาสัมพันธ์ (Site CMS)
        </h2>
        <p className="text-xs text-[#6f5a45]">
          แก้ไขข้อความ Hero, Tagline และประกาศหน้าแรกโดยไม่ต้องแก้โค้ดโปรแกรม
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>บันทึกการตั้งค่าหน้าหลักลงฐานข้อมูลเรียบร้อยแล้ว</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-[#463629]">หัวข้อหลักหน้าแรก (Hero Title)</label>
          <input
            type="text"
            value={formData.heroTitle}
            onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
            className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[#463629]">คำอธิบายรองหน้าแรก (Hero Subtitle)</label>
          <textarea
            rows={3}
            value={formData.heroSubtitle}
            onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
            className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-[#463629]">คำขวัญแพลตฟอร์ม (Tagline)</label>
          <input
            type="text"
            value={formData.tagline}
            onChange={e => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
          />
        </div>

        <div className="p-4 bg-[#ece4d4]/40 rounded-xl border border-[#d7c8b2] space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-[#463629]">แถบประกาศข่าวสาร (Announcement Banner)</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementEnabled}
                onChange={e => setFormData({ ...formData, announcementEnabled: e.target.checked })}
                className="accent-[#9c7d5c]"
              />
              <span className="text-xs text-[#6f5a45]">เปิดใช้งาน</span>
            </label>
          </div>
          <input
            type="text"
            value={formData.announcement}
            onChange={e => setFormData({ ...formData, announcement: e.target.value })}
            placeholder="ข้อความประกาศบนแถบด้านบนของหน้าแรก..."
            className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg font-semibold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>บันทึกการตั้งค่า</span>
          </button>
        </div>
      </form>
    </div>
  );
};

// 4.1 Manage Banner Slides View
const AdminBannersView: React.FC<{ onNavigate: (tab: string, meta?: any) => void }> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<BannerSlide[]>(() => museumStore.getBannerSlides());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tag, setTag] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [videoUrl, setVideoUrl] = useState('');
  const [isGenerativeLivingMemory, setIsGenerativeLivingMemory] = useState(false);
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('museums');
  const [secondaryCtaText, setSecondaryCtaText] = useState('');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState('about');
  const [order, setOrder] = useState<number>(1);
  const [active, setActive] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshBanners = () => {
    setBanners(museumStore.getBannerSlides());
  };

  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      refreshBanners();
    });
    return () => {
      unsub();
    };
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setTag('แบนเนอร์สไลด์ใหม่');
    setBadgeText('Echoes of Siam');
    setImageUrl('/assets/images/siam_museum_heritage_hall_1792473891438.jpg');
    setMediaType('image');
    setVideoUrl('');
    setIsGenerativeLivingMemory(false);
    setCtaText('สำรวจข้อมูล');
    setCtaLink('museums');
    setSecondaryCtaText('');
    setSecondaryCtaLink('about');
    setOrder(banners.length + 1);
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: BannerSlide) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setTag(b.tag || '');
    setBadgeText(b.badgeText || '');
    setImageUrl(b.imageUrl || '');
    setMediaType(b.mediaType || (b.isGenerativeLivingMemory || b.videoUrl ? 'video' : 'image'));
    setVideoUrl(b.videoUrl || '');
    setIsGenerativeLivingMemory(!!b.isGenerativeLivingMemory);
    setCtaText(b.ctaText || '');
    setCtaLink(b.ctaLink || 'museums');
    setSecondaryCtaText(b.secondaryCtaText || '');
    setSecondaryCtaLink(b.secondaryCtaLink || 'about');
    setOrder(b.order);
    setActive(b.active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingBanner) {
      museumStore.updateBannerSlide(editingBanner.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        tag: tag.trim(),
        badgeText: badgeText.trim(),
        imageUrl: imageUrl.trim(),
        mediaType,
        videoUrl: videoUrl.trim(),
        isGenerativeLivingMemory,
        ctaText: ctaText.trim(),
        ctaLink,
        secondaryCtaText: secondaryCtaText.trim(),
        secondaryCtaLink,
        order: Number(order) || 1,
        active
      });
      showToast(`อัปเดตแบนเนอร์ "${title.trim()}" สำเร็จ`);
    } else {
      museumStore.createBannerSlide({
        title: title.trim(),
        subtitle: subtitle.trim(),
        tag: tag.trim() || 'Echoes of Siam',
        badgeText: badgeText.trim(),
        imageUrl: imageUrl.trim(),
        mediaType,
        videoUrl: videoUrl.trim(),
        isGenerativeLivingMemory,
        ctaText: ctaText.trim() || 'สำรวจข้อมูล',
        ctaLink,
        secondaryCtaText: secondaryCtaText.trim(),
        secondaryCtaLink,
        order: Number(order) || banners.length + 1,
        active
      });
      showToast(`เพิ่มแบนเนอร์ใหม่ "${title.trim()}" สำเร็จ`);
    }
    setIsModalOpen(false);
    refreshBanners();
  };

  const handleToggleActive = (b: BannerSlide) => {
    museumStore.updateBannerSlide(b.id, { active: !b.active });
    showToast(b.active ? `ปิดการแสดงผลแบนเนอร์: ${b.title}` : `เปิดการแสดงผลแบนเนอร์: ${b.title}`);
    refreshBanners();
  };

  const handleDelete = (b: BannerSlide) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบแบนเนอร์ "${b.title}"?`)) {
      museumStore.deleteBannerSlide(b.id);
      showToast(`ลบแบนเนอร์เรียบร้อยแล้ว`);
      refreshBanners();
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newBanners = [...banners];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newBanners.length) return;
    
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIdx];
    newBanners[targetIdx] = temp;
    
    museumStore.reorderBannerSlides(newBanners.map(b => b.id));
    refreshBanners();
    showToast('ปรับลำดับการแสดงผลแบนเนอร์สำเร็จ');
  };

  const handleResetDefaults = () => {
    if (confirm('คุณต้องการรีเซ็ตแบนเนอร์ทั้งหมดกลับเป็นชุดเริ่มต้น 3 รูปแบบ (แบนเนอร์ต้อนรับ, แบนเนอร์เกี่ยวกับเว็บไซต์, แบนเนอร์ตัวอย่างข้อมูลจัดแสดง) หรือไม่?')) {
      museumStore.resetDefaultBanners();
      refreshBanners();
      showToast('คืนค่าแบนเนอร์มาตรฐาน 3 รูปแบบเรียบร้อยแล้ว');
    }
  };

  const PRESET_IMAGES = [
    {
      label: 'ภาพหน้าปกและตราสัญลักษณ์ทางการ Echoes of Siam (สัญลักษณ์และจิตรกรรมมรดก)',
      url: '/assets/images/echoes_of_siam_banner.png'
    },
    {
      label: 'ภาพห้องโถงพิพิธภัณฑ์มรดกสยาม (แบนเนอร์ต้อนรับ)',
      url: '/assets/images/siam_museum_heritage_hall_1792473891438.jpg'
    },
    {
      label: 'สถาปัตยกรรมคลังวัฒนธรรมและแผนผังความรู้ (เกี่ยวกับเว็บไซต์)',
      url: '/assets/images/siam_cultural_archive_1792474260752.jpg'
    },
    {
      label: 'ศิลปวัตถุโบราณคดีและวิถีชนบ้านเชียง (ตัวอย่างข้อมูลจัดแสดง)',
      url: '/assets/images/thai_crafts_pottery_artifacts_1792473892186.jpg'
    },
    {
      label: 'ตราสัญลักษณ์มรดกสยามทางการ (Emblem Avatar)',
      url: '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png'
    }
  ];

  const LINK_OPTIONS = [
    { id: 'museums', label: 'สารบัญพิพิธภัณฑ์ (Museums)' },
    { id: 'subjects', label: 'สำรวจหัวเรื่องภูมิปัญญา (Subjects)' },
    { id: 'graph', label: 'แผนผังองค์ความรู้ (Knowledge Graph)' },
    { id: 'insights', label: 'ภาพรวมและสถิติข้อมูล (Insights)' },
    { id: 'about', label: 'เกี่ยวกับโครงการและอ้างอิง (About)' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d7c8b2]/60 pb-4">
        <div>
          <h2 className="text-lg font-bold font-editorial text-[#463629] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#9c7d5c]" />
            <span>จัดการแบนเนอร์หน้าแรก (Hero Banner Management)</span>
          </h2>
          <p className="text-xs text-[#6f5a45]">
            เพิ่ม แก้ไข ลบ จัดเรียงลำดับ และใส่รูปภาพแบนเนอร์สไลด์หน้าปกเว็บไซต์ Echoes of Siam
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="คืนค่าแบนเนอร์เริ่มต้น 3 แบบ (ต้อนรับ, เกี่ยวกับเว็บไซต์, ตัวอย่างข้อมูล)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>คืนค่า 3 แบนเนอร์มาตรฐาน</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มแบนเนอร์ใหม่</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl flex items-center justify-between">
          <span className="text-[#6f5a45]">แบนเนอร์ทั้งหมด:</span>
          <span className="font-bold text-[#463629] text-base">{banners.length} สไลด์</span>
        </div>
        <div className="p-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl flex items-center justify-between">
          <span className="text-[#6f5a45]">กำลังเปิดแสดงผลหน้าแรก:</span>
          <span className="font-bold text-emerald-700 text-base">{banners.filter(b => b.active).length} สไลด์</span>
        </div>
        <div className="p-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl flex items-center justify-between">
          <span className="text-[#6f5a45]">ซ่อนชั่วคราว:</span>
          <span className="font-bold text-[#9c7d5c] text-base">{banners.filter(b => !b.active).length} สไลด์</span>
        </div>
      </div>

      {/* Banner Cards List */}
      <div className="space-y-4">
        {banners.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#d7c8b2] rounded-2xl bg-[#fffdf7] space-y-3">
            <Layers className="w-10 h-10 text-[#9c7d5c]/60 mx-auto" />
            <p className="text-sm font-semibold text-[#463629]">ยังไม่มีแบนเนอร์สไลด์ในระบบ</p>
            <p className="text-xs text-[#6f5a45]">คลิก "คืนค่า 3 แบนเนอร์มาตรฐาน" หรือ "เพิ่มแบนเนอร์ใหม่" เพื่อเริ่มต้น</p>
            <button
              onClick={handleResetDefaults}
              className="mt-2 px-4 py-2 bg-[#9c7d5c] text-white rounded-lg text-xs font-semibold"
            >
              คืนค่า 3 แบนเนอร์เริ่มต้น
            </button>
          </div>
        ) : (
          banners.map((b, idx) => (
            <div 
              key={b.id}
              className={`p-4 rounded-2xl border transition-all ${
                b.active 
                  ? 'bg-white border-[#d7c8b2] shadow-2xs hover:border-[#9c7d5c]' 
                  : 'bg-zinc-50 border-zinc-200 opacity-70'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Left: Thumbnail & Banner Information */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  
                  {/* Image Thumbnail with Overlay Tag */}
                  <div className="relative w-36 h-24 sm:w-44 sm:h-28 rounded-xl overflow-hidden bg-stone-800 shrink-0 border border-[#d7c8b2]/70">
                    {b.imageUrl ? (
                      <img 
                        src={b.imageUrl} 
                        alt={b.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 text-[10px]">
                        ไม่มีรูปภาพ
                      </div>
                    )}
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] rounded font-mono font-bold">
                      #{idx + 1}
                    </span>

                    {/* Video Indicator Tag */}
                    {(b.mediaType === 'video' || b.isGenerativeLivingMemory || b.videoUrl) && (
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/85 backdrop-blur-xs text-[#e6c12f] text-[9px] rounded font-bold flex items-center gap-1 border border-[#e6c12f]/40 shadow-xs">
                        <Video className="w-3 h-3 text-[#e6c12f]" />
                        <span>วิดีโอ</span>
                      </span>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.active 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-zinc-200 text-zinc-700'
                      }`}>
                        {b.active ? 'กำลังแสดงผล' : 'ปิดชั่วคราว'}
                      </span>

                      {(b.mediaType === 'video' || b.isGenerativeLivingMemory || b.videoUrl) && (
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-900 border border-sky-300 text-[10px] font-semibold rounded flex items-center gap-1">
                          <Video className="w-3 h-3 text-sky-700" />
                          <span>{b.isGenerativeLivingMemory ? 'The Living Memory Universe' : 'วิดีโอเคลื่อนไหว'}</span>
                        </span>
                      )}

                      {b.tag && (
                        <span className="px-2 py-0.5 bg-[#ece4d4] text-[#463629] text-[10px] font-heading font-semibold rounded">
                          {b.tag}
                        </span>
                      )}

                      {b.badgeText && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] rounded font-medium">
                          {b.badgeText}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold font-editorial text-[#463629] truncate">
                      {b.title}
                    </h3>

                    <p className="text-xs text-[#6f5a45] line-clamp-2 leading-relaxed">
                      {b.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#9c7d5c]">
                      {b.ctaText && (
                        <span>ปุ่มหลัก: <strong>{b.ctaText}</strong> → /{b.ctaLink}</span>
                      )}
                      {b.secondaryCtaText && (
                        <span className="text-[#6f5a45]">· ปุ่มรอง: <strong>{b.secondaryCtaText}</strong> → /{b.secondaryCtaLink}</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right: Management Controls */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                  
                  {/* Reorder Buttons */}
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-[#6f5a45] hover:text-[#463629] hover:bg-[#ece4d4] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="เลื่อนขึ้น"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === banners.length - 1}
                    className="p-1.5 text-[#6f5a45] hover:text-[#463629] hover:bg-[#ece4d4] rounded-lg disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="เลื่อนลง"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-[#d7c8b2] mx-1" />

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => handleToggleActive(b)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      b.active 
                        ? 'text-emerald-700 hover:bg-emerald-50' 
                        : 'text-zinc-400 hover:bg-zinc-100'
                    }`}
                    title={b.active ? 'คลิกเพื่อปิดชั่วคราว' : 'คลิกเพื่อเปิดแสดงผล'}
                  >
                    {b.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(b)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#9c7d5c] hover:bg-[#ece4d4] rounded-lg transition-colors cursor-pointer border border-[#d7c8b2]/70"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>แก้ไข</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(b)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="ลบแบนเนอร์"
                  >
                    <Trash className="w-4 h-4" />
                  </button>

                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog: Add / Edit Banner */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl border border-[#d7c8b2] shadow-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#d7c8b2]/60 pb-3">
              <div>
                <h3 className="text-lg font-bold font-editorial text-[#463629]">
                  {editingBanner ? 'แก้ไขข้อมูลแบนเนอร์สไลด์' : 'เพิ่มแบนเนอร์สไลด์ใหม่'}
                </h3>
                <p className="text-xs text-[#6f5a45]">
                  กำหนดภาพ คำบรรยาย และปุ่มดำเนินการสำหรับหน้าแรก
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#6f5a45] hover:text-[#463629] rounded-lg hover:bg-[#ece4d4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              
              {/* Row 1: Title */}
              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">
                  ชื่อหัวข้อแบนเนอร์ (Headline Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="เช่น ยินดีต้อนรับสู่ Echoes of Siam หรือ สถาปัตยกรรมองค์ความรู้"
                  className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg text-sm font-semibold text-[#463629] focus:outline-none focus:ring-2 focus:ring-[#9c7d5c]/40"
                />
              </div>

              {/* Row 2: Subtitle */}
              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">
                  คำอธิบาย / รายละเอียดรอง (Subtitle) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  placeholder="คำอธิบายสั้นๆ ที่ปรากฏบนแบนเนอร์เพื่อดึงดูดผู้เข้าชม..."
                  className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg text-xs leading-relaxed text-[#463629] focus:outline-none focus:ring-2 focus:ring-[#9c7d5c]/40"
                />
              </div>

              {/* Row 3: Tag & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">
                    ป้ายกำกับหมวดหมู่ (Tag Label)
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={e => setTag(e.target.value)}
                    placeholder="เช่น ดิจิทัลอาร์ไคฟ์ระดับชาติ, Discovery Graph, ตัวอย่างศิลปวัตถุ"
                    className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">
                    ข้อความป้ายเด่น (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={e => setBadgeText(e.target.value)}
                    placeholder="เช่น คลังข้อมูล 1,574 แห่ง, 2,460 หัวเรื่อง"
                    className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>
              </div>

              {/* Row 4: Media Format (Image vs Video Banner) */}
              <div className="space-y-3 p-4 bg-[#ece4d4]/30 rounded-xl border border-[#d7c8b2]">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-[#463629] block">
                    รูปแบบสื่อของแบนเนอร์ (Media Format) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#9c7d5c] font-medium">
                    {mediaType === 'video' ? 'วิดีโอเคลื่อนไหว (Moving Video)' : 'ภาพนิ่งความละเอียดสูง'}
                  </span>
                </div>

                {/* Media Type Tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('image');
                      setIsGenerativeLivingMemory(false);
                    }}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      mediaType === 'image'
                        ? 'bg-[#9c7d5c] text-white border-[#9c7d5c] shadow-xs'
                        : 'bg-white hover:bg-[#fffdf7] text-[#463629] border-[#d7c8b2]'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>แบนเนอร์ภาพนิ่ง (Static Image)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('video');
                      setIsGenerativeLivingMemory(true);
                    }}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      mediaType === 'video'
                        ? 'bg-[#9c7d5c] text-white border-[#9c7d5c] shadow-xs'
                        : 'bg-white hover:bg-[#fffdf7] text-[#463629] border-[#d7c8b2]'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>แบนเนอร์วิดีโอเคลื่อนไหว (Moving Video)</span>
                  </button>
                </div>

                {/* Video specific configuration */}
                {mediaType === 'video' && (
                  <div className="space-y-3 pt-2 border-t border-[#d7c8b2]/60 animate-fadeIn">
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isGenerativeLivingMemory}
                          onChange={e => setIsGenerativeLivingMemory(e.target.checked)}
                          className="accent-[#9c7d5c] w-4 h-4 mt-0.5"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-amber-950 block">
                            เปิดใช้อนุภาคกราฟความรู้ The Jason Brain Living Memory Universe (แนะนำ)
                          </span>
                          <span className="text-[11px] text-amber-900/80 leading-relaxed block mt-0.5">
                            วิดีโอจำลองเครือข่ายความรู้เคลื่อนไหวระดับสากล เชื่อมโยง 1,574 พิพิธภัณฑ์ พร้อมองค์ประกอบเงาสถาปัตยกรรมหลังคาสยามโบราณและยอดฉัตรสีทอง
                          </span>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#463629] flex items-center justify-between">
                        <span>URL ไฟล์วิดีโอภายนอก (อุปกรณ์เสริม หากต้องการใช้วิดีโอ MP4 / WebM เอง)</span>
                        {videoUrl && (
                          <button
                            type="button"
                            onClick={() => setVideoUrl('')}
                            className="text-[10px] text-red-600 hover:underline"
                          >
                            ล้าง URL
                          </button>
                        )}
                      </label>
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={e => {
                          setVideoUrl(e.target.value);
                          if (e.target.value) setIsGenerativeLivingMemory(false);
                        }}
                        placeholder="https://.../video.mp4 (เว้นว่างไว้หากใช้ระบบ The Jason Brain Universe)"
                        className="w-full p-2.5 bg-white border border-[#d7c8b2] rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Image URL (always used as poster / fallback) */}
                <div className="space-y-1.5 pt-1">
                  <label className="font-semibold text-[#463629] block">
                    {mediaType === 'video' ? 'ภาพโปสเตอร์สำรอง (Poster Fallback Image URL)' : 'รูปภาพแบนเนอร์ (Banner Image URL)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="https://... หรือ /assets/images/..."
                    className="w-full p-2.5 bg-white border border-[#d7c8b2] rounded-lg text-xs font-mono"
                  />

                  {/* Quick Presets Buttons */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] text-[#6f5a45] font-semibold">หรือเลือกรูปภาพทางการที่เตรียมไว้:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_IMAGES.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className={`text-left p-2 rounded-lg border text-[11px] flex items-center gap-2 transition-all cursor-pointer ${
                            imageUrl === preset.url 
                              ? 'bg-[#9c7d5c] text-white border-[#9c7d5c]' 
                              : 'bg-white hover:bg-[#fffdf7] text-[#463629] border-[#d7c8b2]'
                          }`}
                        >
                          <img 
                            src={preset.url} 
                            alt="" 
                            className="w-8 h-8 rounded object-cover shrink-0 border border-black/10" 
                          />
                          <span className="truncate">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="mt-3 pt-3 border-t border-[#d7c8b2]/60">
                  <span className="text-[11px] font-semibold text-[#463629] block mb-2">ตัวอย่างหน้าตาแบนเนอร์ (Live Preview):</span>
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black shadow-inner flex flex-col justify-end p-4 border border-[#d7c8b2]">
                    {mediaType === 'video' && isGenerativeLivingMemory ? (
                      <div className="absolute inset-0">
                        <LivingMemoryUniverseCanvas showControls={false} />
                      </div>
                    ) : imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                    <div className="relative z-10 space-y-1 pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-[#e6c12f] text-[#463629] text-[9px] font-bold rounded">
                          {tag || 'Tag'}
                        </span>
                        {badgeText && (
                          <span className="px-2 py-0.5 bg-white/20 text-white text-[9px] rounded">
                            {badgeText}
                          </span>
                        )}
                        {mediaType === 'video' && (
                          <span className="px-2 py-0.5 bg-cyan-500/80 text-white text-[9px] font-bold rounded flex items-center gap-1">
                            <Video className="w-2.5 h-2.5" />
                            <span>วิดีโอเคลื่อนไหว</span>
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-white drop-shadow font-editorial truncate">
                        {title || 'หัวข้อแบนเนอร์'}
                      </div>
                      <div className="text-[11px] text-[#ece4d4] line-clamp-1">
                        {subtitle || 'คำอธิบายแบนเนอร์'}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Row 5: Action Buttons & Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Primary CTA */}
                <div className="space-y-2 p-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl">
                  <div className="font-semibold text-[#463629]">ปุ่มหลัก (Primary CTA)</div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#6f5a45]">ข้อความบนปุ่ม</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={e => setCtaText(e.target.value)}
                      placeholder="เช่น สำรวจสารบัญพิพิธภัณฑ์"
                      className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#6f5a45]">หน้าปลายทาง</label>
                    <select
                      value={ctaLink}
                      onChange={e => setCtaLink(e.target.value)}
                      className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
                    >
                      {LINK_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Secondary CTA */}
                <div className="space-y-2 p-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl">
                  <div className="font-semibold text-[#463629]">ปุ่มรอง (Secondary CTA - ไม่บังคับ)</div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#6f5a45]">ข้อความบนปุ่ม</label>
                    <input
                      type="text"
                      value={secondaryCtaText}
                      onChange={e => setSecondaryCtaText(e.target.value)}
                      placeholder="เช่น เกี่ยวกับโครงการ (เว้นว่างได้)"
                      className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#6f5a45]">หน้าปลายทาง</label>
                    <select
                      value={secondaryCtaLink}
                      onChange={e => setSecondaryCtaLink(e.target.value)}
                      className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg"
                    >
                      {LINK_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* Row 6: Order & Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#ece4d4]/40 rounded-xl border border-[#d7c8b2]">
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-[#463629]">ลำดับการแสดงผล (Order):</label>
                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={e => setOrder(parseInt(e.target.value) || 1)}
                    className="w-16 p-1.5 bg-white border border-[#d7c8b2] rounded text-center font-bold"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#463629]">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={e => setActive(e.target.checked)}
                    className="w-4 h-4 accent-[#9c7d5c]"
                  />
                  <span>เปิดใช้งานแบนเนอร์นี้ทันที (Active)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d7c8b2]/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#d7c8b2] rounded-lg text-[#6f5a45] hover:bg-[#ece4d4] font-medium transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg font-semibold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBanner ? 'บันทึกการแก้ไข' : 'สร้างแบนเนอร์ใหม่'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

// 4.2 Manage Knowledge Graph & Neo4j Bloom Perspectives View
const AdminBloomView: React.FC<{ onNavigate: (tab: string, meta?: any) => void }> = ({ onNavigate }) => {
  const [presets, setPresets] = useState<GraphBloomPreset[]>(() => museumStore.getBloomPresets());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<GraphBloomPreset | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [neo4jUrl, setNeo4jUrl] = useState('');
  const [cypherQuery, setCypherQuery] = useState('');
  const [layout, setLayout] = useState<any>('cose');
  const [category, setCategory] = useState<any>('archeology');
  const [focusType, setFocusType] = useState<any>('Subject');
  const [focusSubject, setFocusSubject] = useState('');
  const [maxNodes, setMaxNodes] = useState(65);
  const [badgeText, setBadgeText] = useState('');
  const [colorTheme, setColorTheme] = useState<any>('terracotta');
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshPresets = () => {
    setPresets(museumStore.getBloomPresets());
  };

  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      refreshPresets();
    });
    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingPreset(null);
    setName('');
    setDescription('');
    setNeo4jUrl('https://bloom.neo4j.io/index.html?connectURL=neo4j%2Bs%3A%2F%2Fdemo.neo4jlabs.com&perspective=siam_heritage');
    setCypherQuery('MATCH (m:Museum)-[r:HAS_SUBJECT]->(s:Subject) RETURN m, r, s LIMIT 60');
    setLayout('cose');
    setCategory('archeology');
    setFocusType('Subject');
    setFocusSubject('โบราณคดี');
    setMaxNodes(65);
    setBadgeText('มุมมองบูมใหม่');
    setColorTheme('gold');
    setActive(true);
    setOrder(presets.length + 1);
    setIsModalOpen(true);
  };

  const openEditModal = (p: GraphBloomPreset) => {
    setEditingPreset(p);
    setName(p.name);
    setDescription(p.description);
    setNeo4jUrl(p.neo4jUrl || '');
    setCypherQuery(p.cypherQuery || '');
    setLayout(p.layout);
    setCategory(p.category);
    setFocusType(p.focusType);
    setFocusSubject(p.focusSubject || '');
    setMaxNodes(p.maxNodes);
    setBadgeText(p.badgeText || '');
    setColorTheme(p.colorTheme);
    setActive(p.active);
    setOrder(p.order);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingPreset) {
      museumStore.updateBloomPreset(editingPreset.id, {
        name: name.trim(),
        description: description.trim(),
        neo4jUrl: neo4jUrl.trim() || undefined,
        cypherQuery: cypherQuery.trim() || undefined,
        layout,
        category,
        focusType,
        focusSubject: focusSubject.trim() || undefined,
        maxNodes: Number(maxNodes) || 60,
        badgeText: badgeText.trim() || undefined,
        colorTheme,
        active,
        order: Number(order) || 1
      });
      showToast(`อัปเดตมุมมองบูม "${name.trim()}" สำเร็จ — แสดงผลให้ผู้ใช้เลือกได้ทันที!`);
    } else {
      museumStore.createBloomPreset({
        name: name.trim(),
        description: description.trim(),
        neo4jUrl: neo4jUrl.trim() || undefined,
        cypherQuery: cypherQuery.trim() || undefined,
        layout,
        category,
        focusType,
        focusSubject: focusSubject.trim() || undefined,
        maxNodes: Number(maxNodes) || 60,
        badgeText: badgeText.trim() || undefined,
        colorTheme,
        active,
        order: Number(order) || presets.length + 1
      });
      showToast(`เพิ่มมุมมองบูม "${name.trim()}" สำเร็จ — แสดงผลให้ผู้ใช้เลือกได้ทันที!`);
    }
    setIsModalOpen(false);
    refreshPresets();
  };

  const handleToggleActive = (p: GraphBloomPreset) => {
    museumStore.updateBloomPreset(p.id, { active: !p.active });
    showToast(p.active ? `ปิดการแสดงผลมุมมอง: ${p.name}` : `เปิดการแสดงผลมุมมอง: ${p.name}`);
    refreshPresets();
  };

  const handleDelete = (p: GraphBloomPreset) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบมุมมองบูม "${p.name}"?`)) {
      museumStore.deleteBloomPreset(p.id);
      showToast(`ลบมุมมองบูมสำเร็จ`);
      refreshPresets();
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newPresets = [...presets];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newPresets.length) return;

    const temp = newPresets[index];
    newPresets[index] = newPresets[targetIdx];
    newPresets[targetIdx] = temp;

    museumStore.reorderBloomPresets(newPresets.map(p => p.id));
    refreshPresets();
    showToast('ปรับลำดับมุมมองบูมสำเร็จ');
  };

  const handleResetDefaults = () => {
    if (confirm('คุณต้องการรีเซ็ตมุมมองบูมทั้งหมดกลับเป็น 5 รูปแบบมาตรฐานตามระบบหรือไม่?')) {
      museumStore.resetDefaultBloomPresets();
      refreshPresets();
      showToast('คืนค่า 5 มุมมองบูมมาตรฐานเรียบร้อยแล้ว');
    }
  };

  const COLOR_THEMES = [
    { id: 'terracotta', label: 'Terracotta (แดงดินเผา)', hex: '#9c7d5c' },
    { id: 'gold', label: 'Heritage Gold (ทองสยาม)', hex: '#e6c12f' },
    { id: 'emerald', label: 'Emerald Green (เขียวมรกต)', hex: '#10b981' },
    { id: 'royal', label: 'Royal Blue (น้ำเงินคราม)', hex: '#3b82f6' },
    { id: 'amber', label: 'Amber Gold (อำพัน)', hex: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d7c8b2]/60 pb-4">
        <div>
          <h2 className="text-lg font-bold font-editorial text-[#463629] flex items-center gap-2">
            <Network className="w-5 h-5 text-[#9c7d5c]" />
            <span>จัดการกราฟความรู้ & Neo4j Bloom (Knowledge Graph Management)</span>
          </h2>
          <p className="text-xs text-[#6f5a45] mt-0.5">
            สร้าง เพิ่ม แก้ไข ลบมุมมองบูมสำเร็จรูป พร้อมเชื่อมโยง Neo4j Link และคำสั่ง Cypher — ผู้ใช้งานจะเห็นตัวเลือกในหน้ากราฟความรู้ทันทีที่บันทึก
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('graph')}
            className="px-3 py-2 bg-[#ece4d4]/70 hover:bg-[#ece4d4] text-[#463629] border border-[#d7c8b2] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="เปิดหน้ากราฟความรู้เพื่อทดสอบการแสดงผลสด"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#9c7d5c]" />
            <span>ดูหน้ากราฟสด</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="คืนค่ามุมมองบูม 5 แบบมาตรฐาน"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>คืนค่า 5 มาตรฐาน</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มมุมมองบูมใหม่</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Real-time Indicator Banner */}
      <div className="p-3.5 bg-[#ece4d4]/40 rounded-xl border border-[#d7c8b2] flex items-center justify-between text-xs text-[#6f5a45]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#e6c12f]" />
          <span>
            ระบบจะซิงค์มุมมองบูมที่เปิดใช้งาน (<strong>{presets.filter(p => p.active).length} / {presets.length}</strong>) ไปยังหน้า <strong>"กราฟความรู้"</strong> ทันที
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#9c7d5c]">Firestore Cloud Sync: พร้อมทำงาน</span>
      </div>

      {/* Presets Cards List */}
      <div className="space-y-3">
        {presets.map((preset, idx) => {
          return (
            <div
              key={preset.id}
              className={`p-4 rounded-xl border transition-all ${
                preset.active 
                  ? 'bg-white border-[#d7c8b2] shadow-xs' 
                  : 'bg-zinc-50 border-zinc-200 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left Info Area */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#ece4d4] text-[#463629] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      preset.active 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-zinc-200 text-zinc-700'
                    }`}>
                      {preset.active ? 'เปิดใช้งาน (Live)' : 'ปิดชั่วคราว'}
                    </span>

                    {preset.badgeText && (
                      <span className="px-2 py-0.5 bg-[#e6c12f]/30 text-[#463629] text-[10px] font-bold rounded">
                        {preset.badgeText}
                      </span>
                    )}

                    <span className="px-2 py-0.5 bg-[#ece4d4] text-[#6f5a45] text-[10px] font-mono rounded">
                      Layout: {preset.layout}
                    </span>

                    <span className="px-2 py-0.5 bg-[#ece4d4] text-[#6f5a45] text-[10px] rounded">
                      ธีมสี: {preset.colorTheme}
                    </span>

                    <span className="text-[10px] text-[#6f5a45]">
                      จำกัด {preset.maxNodes} โหนด
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-editorial text-[#463629]">
                    {preset.name}
                  </h3>

                  <p className="text-xs text-[#6f5a45] leading-relaxed line-clamp-2">
                    {preset.description}
                  </p>

                  {/* Neo4j and Cypher info */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                    {preset.neo4jUrl ? (
                      <a
                        href={preset.neo4jUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#9c7d5c] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>ลิงก์ Neo4j Bloom: เชื่อมต่อแล้ว</span>
                      </a>
                    ) : (
                      <span className="text-zinc-400">ไม่มีลิงก์ภายนอก</span>
                    )}

                    {preset.cypherQuery && (
                      <span className="font-mono text-[10px] bg-[#fffdf7] px-2 py-0.5 rounded border border-[#d7c8b2] text-[#463629] truncate max-w-xs">
                        Cypher: {preset.cypherQuery}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1.5 shrink-0 justify-end border-t md:border-t-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-[#6f5a45] hover:text-[#463629] hover:bg-[#ece4d4] rounded-lg disabled:opacity-30 cursor-pointer"
                    title="เลื่อนขึ้น"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === presets.length - 1}
                    className="p-1.5 text-[#6f5a45] hover:text-[#463629] hover:bg-[#ece4d4] rounded-lg disabled:opacity-30 cursor-pointer"
                    title="เลื่อนลง"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-[#d7c8b2] mx-1" />

                  <button
                    onClick={() => handleToggleActive(preset)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      preset.active 
                        ? 'text-emerald-700 hover:bg-emerald-50' 
                        : 'text-zinc-500 hover:bg-zinc-100'
                    }`}
                    title={preset.active ? 'ปิดการแสดงผล' : 'เปิดการแสดงผล'}
                  >
                    {preset.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => openEditModal(preset)}
                    className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="แก้ไขมุมมองบูมนี้"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(preset)}
                    className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="ลบมุมมองบูมนี้"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#d7c8b2] shadow-2xl max-w-2xl w-full p-6 space-y-5 my-8 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-[#d7c8b2]/60 pb-3">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-[#9c7d5c]" />
                <h3 className="font-editorial font-bold text-base text-[#463629]">
                  {editingPreset ? 'แก้ไขมุมมองบูมสำเร็จรูป (Edit Bloom Preset)' : 'เพิ่มมุมมองบูมสำเร็จรูปใหม่ (Add Bloom Preset)'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#6f5a45] hover:text-[#463629] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Row 1: Name */}
              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">
                  ชื่อมุมมองบูมสำเร็จรูป (Perspective Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="เช่น โบราณคดีและวัฒนธรรมบ้านเชียง, เครือข่าย 77 จังหวัด"
                  className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg text-sm font-semibold text-[#463629] focus:outline-none focus:ring-2 focus:ring-[#9c7d5c]/40"
                />
              </div>

              {/* Row 2: Description */}
              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">
                  คำอธิบายมุมมอง (Description) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="อธิบายว่ามุมมองนี้แสดงความสัมพันธ์อะไร..."
                  className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              {/* Row 3: Neo4j URL with quick presets */}
              <div className="space-y-1.5 p-3 bg-[#ece4d4]/30 rounded-xl border border-[#d7c8b2]">
                <label className="font-semibold text-[#463629] flex items-center justify-between">
                  <span>ลิงก์เชื่อมต่อ NEO4J (Neo4j Bloom Web URL / Bolt Link)</span>
                  <span className="text-[10px] text-[#9c7d5c]">รองรับ Bloom Web & Bolt</span>
                </label>
                <input
                  type="text"
                  value={neo4jUrl}
                  onChange={e => setNeo4jUrl(e.target.value)}
                  placeholder="https://bloom.neo4j.io/index.html?connectURL=... หรือ neo4j+s://..."
                  className="w-full p-2 bg-white border border-[#d7c8b2] rounded-lg font-mono text-[11px]"
                />
                
                {/* Quick URL helpers */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                  <span className="text-[#6f5a45]">ตัวอย่างด่วน:</span>
                  <button
                    type="button"
                    onClick={() => setNeo4jUrl('https://bloom.neo4j.io/index.html?connectURL=neo4j%2Bs%3A%2F%2Fdemo.neo4jlabs.com&perspective=siam_heritage')}
                    className="px-2 py-0.5 bg-white border border-[#d7c8b2] rounded hover:bg-[#ece4d4] cursor-pointer"
                  >
                    Neo4j Bloom Web Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeo4jUrl('neo4j+s://demo.neo4jlabs.com:7687')}
                    className="px-2 py-0.5 bg-white border border-[#d7c8b2] rounded hover:bg-[#ece4d4] cursor-pointer"
                  >
                    Bolt Protocol Link
                  </button>
                </div>
              </div>

              {/* Row 4: Cypher Query */}
              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">
                  คำสั่ง Cypher Query ประจำมุมมอง (Cypher Query Template)
                </label>
                <textarea
                  rows={2}
                  value={cypherQuery}
                  onChange={e => setCypherQuery(e.target.value)}
                  placeholder="MATCH (m:Museum)-[r:HAS_SUBJECT]->(s:Subject) RETURN m, r, s LIMIT 60"
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg font-mono text-[11px]"
                />
              </div>

              {/* Row 5: Layout & Color Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">
                    รูปแบบการจัดวางกราฟ (Graph Layout)
                  </label>
                  <select
                    value={layout}
                    onChange={e => setLayout(e.target.value)}
                    className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  >
                    <option value="cose">Force-Directed (CoSE Physics)</option>
                    <option value="concentric">Concentric (รัศมีเป็นวงตามลำดับ)</option>
                    <option value="circle">Circle (วงกลม)</option>
                    <option value="breadthfirst">Breadthfirst (ลำดับชั้น Hierarchical)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">
                    ชุดสีธีม Neo4j Bloom (Color Palette)
                  </label>
                  <select
                    value={colorTheme}
                    onChange={e => setColorTheme(e.target.value)}
                    className="w-full p-2.5 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  >
                    {COLOR_THEMES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Badge Text & Max Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">
                    ข้อความป้ายเด่น (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={e => setBadgeText(e.target.value)}
                    placeholder="เช่น มรดกโลก, 77 จังหวัดทั่วไทย"
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#463629] flex items-center justify-between">
                    <span>จำนวนโหนดสูงสุด (Max Nodes)</span>
                    <span className="font-bold text-[#9c7d5c]">{maxNodes} โหนด</span>
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    step="5"
                    value={maxNodes}
                    onChange={e => setMaxNodes(Number(e.target.value))}
                    className="w-full accent-[#9c7d5c] mt-2"
                  />
                </div>
              </div>

              {/* Row 7: Focus Subject & Active Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">
                    หัวเรื่องที่ต้องการโฟกัส (Focus Subject - เว้นว่างได้)
                  </label>
                  <input
                    type="text"
                    value={focusSubject}
                    onChange={e => setFocusSubject(e.target.value)}
                    placeholder="เช่น โบราณคดี, ผ้าทอ, วัด"
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={e => setActive(e.target.checked)}
                      className="accent-[#9c7d5c] w-4 h-4"
                    />
                    <span className="font-semibold text-[#463629]">
                      เปิดใช้งานมุมมองนี้ทันที (Active)
                    </span>
                  </label>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3 bg-[#ece4d4]/40 rounded-xl border border-[#d7c8b2] space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-[#9c7d5c] tracking-wider">
                  ตัวอย่างการแสดงผลให้ผู้ใช้ (Live Preview)
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-[#9c7d5c] text-white rounded-lg font-bold flex items-center gap-1.5 text-xs shadow-xs">
                    <Network className="w-3.5 h-3.5 text-[#e6c12f]" />
                    <span>{name || 'ชื่อมุมมองบูม'}</span>
                    {badgeText && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded">
                        {badgeText}
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-[11px] text-[#6f5a45]">
                  {description || 'คำอธิบายมุมมองจะปรากฏในแถบข้อมูลกราฟความรู้'}
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d7c8b2]/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#d7c8b2] rounded-lg text-[#6f5a45] hover:bg-[#ece4d4] font-medium transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPreset ? 'บันทึกการแก้ไข' : 'สร้างมุมมองบูม'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

// 5. Manage Images View
const AdminImagesView: React.FC = () => {
  const allMuseums = museumStore.getAllMuseums();
  const withImages = allMuseums.filter(m => m.imageUrl && m.imageUrl.trim() !== '');
  const withoutImages = allMuseums.filter(m => !m.imageUrl || m.imageUrl.trim() === '');

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          จัดการรูปภาพ (Manage External Images)
        </h2>
        <p className="text-xs text-[#6f5a45]">
          ตรวจสอบ URL รูปภาพภายนอกตามนโยบาย (ห้ามใช้ Firebase Storage, รองรับเฉพาะ HTTPS)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl space-y-1">
          <div className="text-[#6f5a45]">มี URL รูปภาพแล้ว</div>
          <div className="text-xl font-bold text-emerald-700">{withImages.length} แห่ง</div>
        </div>
        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl space-y-1">
          <div className="text-[#6f5a45]">ยังไม่มี URL รูปภาพ (ใช้ Placeholder)</div>
          <div className="text-xl font-bold text-[#9c7d5c]">{withoutImages.length} แห่ง</div>
        </div>
      </div>

      <div className="p-4 bg-[#ece4d4]/40 rounded-xl border border-[#d7c8b2] text-xs text-[#6f5a45] space-y-1.5 leading-relaxed">
        <h4 className="font-semibold text-[#463629]">นโยบายการจัดเก็บรูปภาพ:</h4>
        <p>1. แพลตฟอร์มจัดเก็บเฉพาะสตริง URL ภายนอกที่เป็น HTTPS ลงในระเบียน Firestore</p>
        <p>2. ห้ามอัปโหลดรูปภาพเข้าสู่ Firebase Storage หรือแปลงภาพเป็น Base64</p>
        <p>3. ระบบแสดง Placeholder ลายเส้นพิพิธภัณฑ์ที่ออกแบบมาเฉพาะเมื่อไม่มีรูปภาพหรือ URL โหลดไม่สำเร็จ</p>
      </div>
    </div>
  );
};

// 6. Data Quality & Duplicate Candidate Inspector
const AdminQualityView: React.FC = () => {
  const report = museumStore.getDataQualityReport();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          ตรวจสอบคุณภาพข้อมูล (Data Quality & Duplicates)
        </h2>
        <p className="text-xs text-[#6f5a45]">
          ตรวจจับรายการซ้ำ ตรวจสอบความสมบูรณ์ของฟิลด์ และรายงานสถิติความถูกต้อง
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg">
          <div className="text-[#6f5a45]">จำนวนระเบียนทั้งหมด</div>
          <div className="text-lg font-bold text-[#463629]">{report.totalRecords}</div>
        </div>
        <div className="p-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg">
          <div className="text-[#6f5a45]">ข้อมูลชื่อว่าง</div>
          <div className="text-lg font-bold text-emerald-700">{report.missingTitles}</div>
        </div>
        <div className="p-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg">
          <div className="text-[#6f5a45]">ไม่มีหัวเรื่อง</div>
          <div className="text-lg font-bold text-[#9c7d5c]">{report.missingSubjects}</div>
        </div>
        <div className="p-3 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg">
          <div className="text-[#6f5a45]">รายการที่ชื่อซ้ำกัน</div>
          <div className="text-lg font-bold text-amber-700">{report.duplicateCandidates.length} คู่</div>
        </div>
      </div>

      {report.duplicateCandidates.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#463629]">
            รายการพิพิธภัณฑ์ที่มีชื่อซ้ำกัน (Duplicate Candidates)
          </h3>
          <div className="border border-[#d7c8b2] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#ece4d4]/60 border-b border-[#d7c8b2] text-[#463629] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">ชื่อพิพิธภัณฑ์</th>
                  <th className="py-2.5 px-3">จำนวนที่ซ้ำ</th>
                  <th className="py-2.5 px-3">รหัสในฐานข้อมูล</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d7c8b2]/50 text-[#6f5a45]">
                {report.duplicateCandidates.slice(0, 15).map(dup => (
                  <tr key={dup.title}>
                    <td className="py-2.5 px-3 font-semibold text-[#463629]">{dup.title}</td>
                    <td className="py-2.5 px-3 font-mono">{dup.count} รายการ</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#9c7d5c]">{dup.ids.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// 7. Trash & Restore View
const AdminTrashView: React.FC = () => {
  const trash = museumStore.getTrash();
  const [, setTick] = useState(0);

  const handleRestore = (id: string) => {
    museumStore.restoreMuseum(id);
    setTick(t => t + 1);
  };

  const handlePermanent = (id: string, title: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${title}" ถาวร? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      museumStore.permanentDeleteMuseum(id);
      setTick(t => t + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          ถังขยะและการกู้คืน (Trash & Restore)
        </h2>
        <p className="text-xs text-[#6f5a45]">
          ระเบียนที่ถูก Soft-delete จะถูกย้ายมาที่นี่และไม่ปรากฏในหน้าสาธารณะ สามารถกู้คืนได้ตลอดเวลา
        </p>
      </div>

      {trash.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#6f5a45] space-y-2">
          <Trash2 className="w-8 h-8 text-[#d7c8b2] mx-auto" />
          <p>ไม่มีระเบียนในถังขยะ</p>
        </div>
      ) : (
        <div className="border border-[#d7c8b2] rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#ece4d4]/60 border-b border-[#d7c8b2] text-[#463629] font-semibold">
              <tr>
                <th className="py-2.5 px-3">ชื่อพิพิธภัณฑ์</th>
                <th className="py-2.5 px-3">ประเภท</th>
                <th className="py-2.5 px-3">จังหวัด</th>
                <th className="py-2.5 px-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d7c8b2]/50 text-[#6f5a45]">
              {trash.map(m => (
                <tr key={m.id} className="hover:bg-[#fffdf7]">
                  <td className="py-2.5 px-3 font-semibold text-[#463629]">{m.title}</td>
                  <td className="py-2.5 px-3">{m.type}</td>
                  <td className="py-2.5 px-3">{m.province}</td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleRestore(m.id)}
                      className="text-emerald-700 hover:underline font-semibold"
                    >
                      กู้คืน (Restore)
                    </button>
                    <button
                      onClick={() => handlePermanent(m.id, m.title)}
                      className="text-red-600 hover:underline"
                    >
                      ลบถาวร
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// 8. Audit Logs View
const AdminLogsView: React.FC = () => {
  const logs = museumStore.getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          บันทึกกิจกรรมผู้ดูแลระบบ (Audit Logs)
        </h2>
        <p className="text-xs text-[#6f5a45]">
          ประวัติการสร้าง แก้ไข ลบ กู้คืน และรวมหัวเรื่องทั้งหมด (Immutable Log)
        </p>
      </div>

      <div className="space-y-2 text-xs">
        {logs.map(log => (
          <div key={log.id} className="p-3 bg-[#fffdf7] border border-[#d7c8b2]/70 rounded-lg flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#9c7d5c] text-white font-mono text-[10px]">
                  {log.action}
                </span>
                <span className="font-semibold text-[#463629]">{log.targetCollection}/{log.targetId}</span>
              </div>
              <p className="text-[#6f5a45]">{log.details}</p>
              <div className="text-[10px] text-[#6f5a45]/70">โดย: {log.adminEmail}</div>
            </div>
            <div className="text-[11px] font-mono text-[#6f5a45] shrink-0">
              {new Date(log.timestamp).toLocaleString('th-TH')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 9. Import Data View
const AdminImportView: React.FC = () => {
  const [jsonText, setJsonText] = useState('');
  const [report, setReport] = useState<any>(null);

  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const list = Array.isArray(parsed) ? parsed : (parsed.result || [parsed]);
      const res = museumStore.importMuseumsFromJSON(list);
      setReport(res);
      setJsonText('');
    } catch (e: any) {
      alert('รูปแบบ JSON ไม่ถูกต้อง: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          นำเข้าชุดข้อมูล (Data Import Pipeline)
        </h2>
        <p className="text-xs text-[#6f5a45]">
          นำเข้าระเบียนพิพิธภัณฑ์จากไฟล์ JSON หรือ CSV พร้อมตรวจสอบความถูกต้อง
        </p>
      </div>

      {report && (
        <div className="p-4 bg-[#ece4d4]/60 border border-[#d7c8b2] rounded-xl text-xs space-y-1">
          <div className="font-semibold text-[#463629]">สรุปผลการนำเข้า:</div>
          <div className="text-emerald-700">✓ นำเข้าสำเร็จ: {report.success} รายการ</div>
          <div className="text-[#6f5a45]">⤼ ข้ามรายการซ้ำ: {report.skipped} รายการ</div>
          {report.errors.length > 0 && (
            <div className="text-red-700 pt-1">
              ข้อผิดพลาด: {report.errors.join(', ')}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3 text-xs">
        <label className="font-semibold text-[#463629] block">
          วาง JSON Array ของระเบียนพิพิธภัณฑ์ที่ต้องการนำเข้า:
        </label>
        <textarea
          rows={8}
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          placeholder='[ { "title": "พิพิธภัณฑ์ตัวอย่าง", "type": "ชุมชน", "province": "เชียงใหม่", ... } ]'
          className="w-full p-3 font-mono text-[11px] bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
        />
        <button
          onClick={handleImport}
          disabled={!jsonText.trim()}
          className="px-5 py-2.5 bg-[#9c7d5c] hover:bg-[#856748] disabled:opacity-50 text-white rounded-lg font-semibold"
        >
          ตรวจสอบและนำเข้าข้อมูล
        </button>
      </div>
    </div>
  );
};

// 10. Export Data View
const AdminExportView: React.FC = () => {
  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          ส่งออกข้อมูล (Export Pipeline)
        </h2>
        <p className="text-xs text-[#6f5a45]">
          ดาวน์โหลดข้อมูลในรูปแบบ CSV (รองรับภาษาไทยด้วย UTF-8 BOM) และ JSON
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl space-y-3">
          <h3 className="font-semibold text-[#463629]">พิพิธภัณฑ์ (Museums)</h3>
          <p className="text-[#6f5a45]">ส่งออกระเบียนพิพิธภัณฑ์ทั้งหมด 1,574 แห่ง</p>
          <div className="flex gap-2">
            <button
              onClick={() => downloadFile(museumStore.exportMuseumsCSV(), 'museums_data.csv', 'text/csv;charset=utf-8;')}
              className="px-3 py-1.5 bg-[#9c7d5c] text-white rounded-lg font-medium"
            >
              CSV (Excel ไทย)
            </button>
            <button
              onClick={() => downloadFile(museumStore.exportMuseumsJSON(), 'museums_data.json', 'application/json')}
              className="px-3 py-1.5 border border-[#d7c8b2] rounded-lg text-[#463629]"
            >
              JSON
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#fffdf7] border border-[#d7c8b2] rounded-xl space-y-3">
          <h3 className="font-semibold text-[#463629]">หัวเรื่องภูมิปัญญา (Subjects)</h3>
          <p className="text-[#6f5a45]">ส่งออกดัชนีหัวเรื่องทั้งหมด 2,460 หัวข้อ</p>
          <div className="flex gap-2">
            <button
              onClick={() => downloadFile(museumStore.exportSubjectsCSV(), 'subjects_data.csv', 'text/csv;charset=utf-8;')}
              className="px-3 py-1.5 bg-[#9c7d5c] text-white rounded-lg font-medium"
            >
              CSV (Excel ไทย)
            </button>
            <button
              onClick={() => downloadFile(museumStore.exportSubjectsJSON(), 'subjects_data.json', 'application/json')}
              className="px-3 py-1.5 border border-[#d7c8b2] rounded-lg text-[#463629]"
            >
              JSON
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// 11. Security & Firebase Status View
const AdminSecurityView: React.FC = () => {
  const { isFirebaseActive } = useAuth();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#d7c8b2]/60 pb-3">
        <h2 className="text-lg font-bold font-editorial text-[#463629]">
          สถาปัตยกรรมความปลอดภัยและสถานะ Firebase
        </h2>
        <p className="text-xs text-[#6f5a45]">
          ตรวจสอบสถานะการเชื่อมต่อฐานข้อมูล กฎความปลอดภัย Firestore และการจัดการผู้ดูแลระบบ
        </p>
      </div>

      <div className="p-4 rounded-xl border text-xs space-y-2 bg-emerald-50 border-emerald-200 text-emerald-900">
        <div className="flex items-center justify-between">
          <div className="font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>สถานะ Firebase: กำหนดค่าโครงการแล้ว (Active Config)</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-200/60 rounded text-[10px] font-mono font-bold">
            echoes-of-siam-2a9c2
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-emerald-800">
          <div>• Project ID: <strong>echoes-of-siam-2a9c2</strong></div>
          <div>• Auth Domain: <strong>echoes-of-siam-2a9c2.firebaseapp.com</strong></div>
          <div>• Storage Bucket: <strong>echoes-of-siam-2a9c2.firebasestorage.app</strong></div>
          <div>• App ID: <strong>1:946756947681:web:...</strong></div>
        </div>
        <p className="text-[11px] text-emerald-700 pt-1 border-t border-emerald-200">
          ระบบซิงค์คลังข้อมูล, แบนเนอร์หน้าแรก, และมุมมองกราฟความรู้ (Bloom Presets) กับ Cloud Firestore โดยตรง
        </p>
      </div>

      <div className="space-y-3 text-xs">
        <h3 className="font-semibold text-[#463629]">มาตรการความปลอดภัยที่บังคับใช้ (Zero-Trust Security):</h3>
        <ul className="space-y-1.5 text-[#6f5a45]">
          <li>✓ กฎ Default-Deny Catch-all ป้องกันการอ่านเขียนโฟลเดอร์ที่ไม่ได้รับอนุญาต</li>
          <li>✓ จำกัดสิทธิ์การสร้างและแก้ไขข้อมูลเฉพาะบัญชี Admin ที่ระบุ (admin@gmail.com, Benyapabaibuaw@gmail.com)</li>
          <li>✓ ผู้เข้าชมทั่วไปเข้าถึงได้เฉพาะเอกสารที่มีสถานะ "published" และมุมมองบลูมที่ "active"</li>
          <li>✓ บันทึก Audit Logs ทุกครั้งที่มีการเปลี่ยนแปลงข้อมูลและไม่สามารถลบย้อนหลังได้</li>
        </ul>
      </div>
    </div>
  );
};
