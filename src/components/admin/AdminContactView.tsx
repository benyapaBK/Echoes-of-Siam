import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Globe, 
  Layers, 
  Sliders, 
  ExternalLink, 
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Navigation,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { museumStore } from '../../services/museumStore';
import type { ContactPageConfig, CreatorProfile } from '../../types/museum';

interface AdminContactViewProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const AdminContactView: React.FC<AdminContactViewProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<ContactPageConfig>(() => museumStore.getContactConfig());
  const [editingCreator, setEditingCreator] = useState<CreatorProfile | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'creators' | 'location' | 'channels' | 'hero' | 'form'>('creators');

  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      setConfig(museumStore.getContactConfig());
    });
    return unsub;
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleUpdateConfigField = (field: keyof ContactPageConfig, value: any) => {
    const updated = { ...config, [field]: value };
    setConfig(updated);
    museumStore.updateContactConfig({ [field]: value });
    triggerToast('บันทึกการแก้ไขข้อมูลสำเร็จ');
  };

  const handleOpenCreateCreator = () => {
    const nextOrder = (config.creators?.length || 0) + 1;
    const newCreator: CreatorProfile = {
      id: `creator_${Date.now()}`,
      name: '',
      role: 'ผู้พัฒนาระบบ (System Developer)',
      affiliation: 'คณะทำงานเทคโนโลยีสารสนเทศมรดกวัฒนธรรม',
      bio: '',
      imageUrl: '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png',
      email: '',
      phone: '',
      websiteUrl: '',
      order: nextOrder,
      active: true
    };
    setEditingCreator(newCreator);
    setIsCreatingNew(true);
  };

  const handleOpenEditCreator = (creator: CreatorProfile) => {
    setEditingCreator(JSON.parse(JSON.stringify(creator)));
    setIsCreatingNew(false);
  };

  const handleSaveCreatorModal = () => {
    if (!editingCreator) return;
    if (!editingCreator.name.trim()) {
      alert('กรุณากรอกชื่อ-นามสกุลของผู้สร้างระบบ');
      return;
    }

    if (isCreatingNew) {
      museumStore.addCreator(editingCreator);
      triggerToast(`เพิ่มผู้สร้างระบบ "${editingCreator.name}" สำเร็จ`);
    } else {
      museumStore.updateCreator(editingCreator.id, editingCreator);
      triggerToast(`บันทึกข้อมูลผู้สร้างระบบ "${editingCreator.name}" สำเร็จ`);
    }

    setEditingCreator(null);
    setIsCreatingNew(false);
  };

  const handleDeleteCreator = (id: string, name: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้สร้าง "${name}"?`)) {
      return;
    }
    museumStore.deleteCreator(id);
    triggerToast(`ลบข้อมูล "${name}" เรียบร้อยแล้ว`);
  };

  const handleMoveCreatorOrder = (index: number, direction: 'up' | 'down') => {
    const newCreators = [...config.creators];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCreators.length) return;

    const temp = newCreators[index];
    newCreators[index] = newCreators[targetIndex];
    newCreators[targetIndex] = temp;

    newCreators.forEach((c, idx) => {
      c.order = idx + 1;
    });

    handleUpdateConfigField('creators', newCreators);
    triggerToast('จัดลำดับผู้สร้างระบบสำเร็จ');
  };

  const handleResetDefaults = () => {
    if (window.confirm('คุณต้องการคืนค่าหน้าติดต่อเราและข้อมูลผู้สร้างระบบกลับเป็นค่าเริ่มต้นตามระบบหรือไม่? การแก้ไขที่ผ่านมาจะถูกแทนที่')) {
      museumStore.resetDefaultContactConfig();
      triggerToast('คืนค่าเริ่มต้นหน้าติดต่อเราสำเร็จ');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d7c8b2] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#9c7d5c] font-semibold uppercase tracking-wider mb-1">
            <Mail className="w-4 h-4" />
            <span>ระบบจัดการเนื้อหาหน้าติดต่อเรา (Contact Page & Creators CMS)</span>
          </div>
          <h2 className="text-xl font-bold font-editorial text-[#463629] flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-[#9c7d5c]" />
            <span>จัดการหน้าติดต่อเรา & ข้อมูลคณะผู้สร้างระบบ</span>
          </h2>
          <p className="text-xs text-[#6f5a45] mt-1 max-w-2xl leading-relaxed">
            แก้ไขสถานที่ตั้ง ช่องทางติดต่อ เบอร์โทร อีเมล แผนที่ และรายชื่อคณะผู้สร้างระบบ
            พร้อมรูปภาพในกรอบวงกลมและข้อมูลแนะนำตัวได้อย่างอิสระ ทุกการแก้ไขจะแสดงผลบนหน้าติดต่อเราทันที
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigate('contact')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#463629] hover:text-[#2a1d13] bg-[#fbf6ed] hover:bg-[#ece4d4] border border-[#d7c8b2] rounded-lg transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#9c7d5c]" />
            <span>ดูหน้าติดต่อเราสด</span>
          </button>

          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6f5a45] hover:text-[#463629] bg-white hover:bg-[#ece4d4]/50 border border-[#d7c8b2] rounded-lg transition-colors cursor-pointer"
            title="คืนค่าเป็นค่ามาตรฐานระบบ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้น</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800 animate-slideDown shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{saveToast}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#d7c8b2] pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: 'creators', label: '1. คณะผู้สร้างระบบ (Creators)', icon: UserCheck },
          { id: 'location', label: '2. สถานที่ตั้ง & การเดินทาง', icon: MapPin },
          { id: 'channels', label: '3. ช่องทางติดต่อ (โทร/อีเมล/โซเชียล)', icon: Phone },
          { id: 'hero', label: '4. ข้อความหัวเรื่อง (Hero Section)', icon: Sliders },
          { id: 'form', label: '5. แบบฟอร์มส่งข้อความ (Form Settings)', icon: Mail }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#9c7d5c] text-white shadow-xs'
                  : 'text-[#6f5a45] hover:bg-[#f5ede0] hover:text-[#463629]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CREATORS MANAGEMENT (จัดการคณะผู้สร้างระบบ) */}
      {activeTab === 'creators' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#fffdf7] border border-[#d7c8b2] p-5 rounded-2xl">
            <div>
              <h3 className="text-base font-bold font-editorial text-[#463629] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
                <span>จัดการรายชื่อและรูปภาพผู้สร้างระบบ (System Creators & Team)</span>
              </h3>
              <p className="text-xs text-[#6f5a45] mt-1">
                ใส่รูปภาพในกรอบวงกลม ชื่อ-นามสกุล ตำแหน่ง สังกัด และข้อความแนะนำตัวได้อย่างอิสระ
              </p>
            </div>
            <button
              onClick={handleOpenCreateCreator}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#9c7d5c] hover:bg-[#866747] text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มผู้สร้างใหม่</span>
            </button>
          </div>

          {/* Creators Section Header text config */}
          <div className="bg-white border border-[#d7c8b2] p-5 rounded-2xl space-y-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9c7d5c]">
              ตั้งค่าข้อความส่วนแนะนำผู้สร้าง (Creators Section Header)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-[#463629] mb-1">หัวข้อส่วนผู้สร้าง (Section Title)</label>
                <input
                  type="text"
                  value={config.creatorsSectionTitle}
                  onChange={(e) => handleUpdateConfigField('creatorsSectionTitle', e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
                />
              </div>
              <div>
                <label className="block font-medium text-[#463629] mb-1">คำบรรยายย่อย (Section Subtitle)</label>
                <input
                  type="text"
                  value={config.creatorsSectionSubtitle}
                  onChange={(e) => handleUpdateConfigField('creatorsSectionSubtitle', e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#463629] mb-1">คำกล่าวเกริ่นนำ (Section Description)</label>
              <textarea
                rows={2}
                value={config.creatorsSectionDescription}
                onChange={(e) => handleUpdateConfigField('creatorsSectionDescription', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-xs text-[#463629] resize-none"
              />
            </div>
          </div>

          {/* Creators Cards List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#463629]">
              รายชื่อผู้สร้างปัจจุบัน ({config.creators?.length || 0} ท่าน)
            </h4>

            {(!config.creators || config.creators.length === 0) && (
              <div className="p-8 text-center bg-white border border-[#d7c8b2] rounded-2xl text-xs text-[#a88a6d]">
                ยังไม่มีข้อมูลผู้สร้างระบบในระบบ คลิก "เพิ่มผู้สร้างใหม่" เพื่อเริ่มใส่ข้อมูล
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {config.creators
                .sort((a, b) => a.order - b.order)
                .map((creator, index) => (
                  <div
                    key={creator.id}
                    className="bg-white border border-[#d7c8b2] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Circular Avatar Preview */}
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#9c7d5c] via-[#d4af37] to-[#e6c12f] shadow-md">
                          <img
                            src={creator.imageUrl || '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png'}
                            alt={creator.name}
                            className="w-full h-full rounded-full object-cover bg-[#2a1d13]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png';
                            }}
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#d4af37] text-[#1c130c] flex items-center justify-center text-[10px] font-bold border border-white">
                          {creator.order}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-[#463629] truncate">{creator.name}</h5>
                          {!creator.active && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 text-stone-500 rounded border border-stone-300">
                              ซ่อนอยู่
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-semibold text-[#866747] bg-[#f5ede0] px-2 py-0.5 rounded inline-block">
                          {creator.role}
                        </div>
                        {creator.affiliation && (
                          <div className="text-[11px] text-[#9c7d5c] truncate">{creator.affiliation}</div>
                        )}
                        {creator.bio && (
                          <p className="text-[11px] text-[#6f5a45] line-clamp-2 pt-1">{creator.bio}</p>
                        )}
                      </div>
                    </div>

                    {/* Bottom action controls */}
                    <div className="pt-3 border-t border-[#ece4d4] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveCreatorOrder(index, 'up')}
                          className="p-1 text-[#6f5a45] hover:text-[#463629] disabled:opacity-30 cursor-pointer"
                          title="เลื่อนขึ้น"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === config.creators.length - 1}
                          onClick={() => handleMoveCreatorOrder(index, 'down')}
                          className="p-1 text-[#6f5a45] hover:text-[#463629] disabled:opacity-30 cursor-pointer"
                          title="เลื่อนลง"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditCreator(creator)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#463629] bg-[#fbf6ed] hover:bg-[#ece4d4] border border-[#d7c8b2] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#9c7d5c]" />
                          <span>แก้ไขข้อมูล</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCreator(creator.id, creator.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
                          title="ลบผู้สร้างนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LOCATION & MAP SETTINGS (สถานที่ตั้ง & การเดินทาง) */}
      {activeTab === 'location' && (
        <div className="bg-white border border-[#d7c8b2] rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="border-b border-[#ece4d4] pb-3">
            <h3 className="text-base font-bold font-editorial text-[#463629] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#9c7d5c]" />
              <span>ตั้งค่าสถานที่ตั้งและข้อมูลการเดินทาง (Location & Transportation)</span>
            </h3>
            <p className="text-xs text-[#6f5a45] mt-1">
              ระบุชื่อหน่วยงาน/ศูนย์ประสานงาน ที่อยู่ พิกัด GPS และคำแนะนำการเดินทาง
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-medium text-[#463629] mb-1">ชื่อหน่วยงาน / ศูนย์ประสานงาน</label>
              <input
                type="text"
                value={config.organizationName}
                onChange={(e) => handleUpdateConfigField('organizationName', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-[#463629] mb-1">ที่อยู่สถานที่ตั้ง (Address)</label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => handleUpdateConfigField('address', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">จังหวัด</label>
              <input
                type="text"
                value={config.province}
                onChange={(e) => handleUpdateConfigField('province', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">รหัสไปรษณีย์</label>
              <input
                type="text"
                value={config.postalCode}
                onChange={(e) => handleUpdateConfigField('postalCode', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">พิกัดแผนที่ GPS (เช่น 13.7891° N, 100.4567° E)</label>
              <input
                type="text"
                value={config.mapCoordinates || ''}
                onChange={(e) => handleUpdateConfigField('mapCoordinates', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629] font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">เวลาทำการ (Opening Hours)</label>
              <input
                type="text"
                value={config.openingHours}
                onChange={(e) => handleUpdateConfigField('openingHours', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-[#463629] mb-1">คำแนะนำการเดินทาง (Transportation Guide)</label>
              <textarea
                rows={2}
                value={config.transportationGuide || ''}
                onChange={(e) => handleUpdateConfigField('transportationGuide', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-xs text-[#463629] resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-[#463629] mb-1">ลิงก์ Google Maps Embed (iframe URL หรือ maps.google.com embed)</label>
              <input
                type="text"
                value={config.mapEmbedUrl || ''}
                onChange={(e) => handleUpdateConfigField('mapEmbedUrl', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-xs text-[#463629] font-mono"
              />
              <p className="text-[11px] text-[#9c7d5c] mt-1">
                นำลิงก์ embed จาก Google Maps เพื่อแสดงแผนที่แบบอินเทอร์แอคทีฟบนหน้าติดต่อเรา
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT CHANNELS (ช่องทางการติดต่อ) */}
      {activeTab === 'channels' && (
        <div className="bg-white border border-[#d7c8b2] rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="border-b border-[#ece4d4] pb-3">
            <h3 className="text-base font-bold font-editorial text-[#463629] flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#9c7d5c]" />
              <span>ช่องทางการติดต่อสื่อสารโดยตรง (Direct Channels)</span>
            </h3>
            <p className="text-xs text-[#6f5a45] mt-1">
              เบอร์โทรศัพท์ อีเมล LINE Facebook YouTube และเว็บไซต์ทางการ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-[#463629] mb-1">เบอร์โทรศัพท์หลัก</label>
              <input
                type="text"
                value={config.telephone}
                onChange={(e) => handleUpdateConfigField('telephone', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">เบอร์สายด่วน (Hotline)</label>
              <input
                type="text"
                value={config.hotline || ''}
                onChange={(e) => handleUpdateConfigField('hotline', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">อีเมลติดต่อกลางหลัก</label>
              <input
                type="email"
                value={config.email}
                onChange={(e) => handleUpdateConfigField('email', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">อีเมลติดต่อสำรอง / ซัพพอร์ต</label>
              <input
                type="email"
                value={config.contactEmailSecondary || ''}
                onChange={(e) => handleUpdateConfigField('contactEmailSecondary', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">LINE Official Account (ID)</label>
              <input
                type="text"
                value={config.lineId || ''}
                onChange={(e) => handleUpdateConfigField('lineId', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
                placeholder="@echoesofsiam"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">ชื่อเพจ Facebook</label>
              <input
                type="text"
                value={config.facebookPageName || ''}
                onChange={(e) => handleUpdateConfigField('facebookPageName', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-[#463629] mb-1">ลิงก์ URL Facebook Page</label>
              <input
                type="url"
                value={config.facebookUrl || ''}
                onChange={(e) => handleUpdateConfigField('facebookUrl', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">เว็บไซต์หลัก (Website URL)</label>
              <input
                type="url"
                value={config.websiteUrl || ''}
                onChange={(e) => handleUpdateConfigField('websiteUrl', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">ช่อง YouTube</label>
              <input
                type="url"
                value={config.youtubeUrl || ''}
                onChange={(e) => handleUpdateConfigField('youtubeUrl', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HERO SECTION (ข้อความหัวเรื่องหลัก) */}
      {activeTab === 'hero' && (
        <div className="bg-white border border-[#d7c8b2] rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="border-b border-[#ece4d4] pb-3">
            <h3 className="text-base font-bold font-editorial text-[#463629] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#9c7d5c]" />
              <span>ปรับแต่งข้อความส่วนหัวของหน้า (Hero Banner Settings)</span>
            </h3>
            <p className="text-xs text-[#6f5a45] mt-1">
              กำหนดชื่อหน้า สโลแกน และคำอธิบายภาพรวมที่จะแสดงบนแบนเนอร์ด้านบนสุดของหน้าติดต่อเรา
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-[#463629] mb-1">ชื่อหน้าหลัก (Hero Title)</label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={(e) => handleUpdateConfigField('heroTitle', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629] font-medium"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">สโลแกน / หัวข้อย่อย (Hero Subtitle)</label>
              <input
                type="text"
                value={config.heroSubtitle}
                onChange={(e) => handleUpdateConfigField('heroSubtitle', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">คำบรรยายความเป็นมาและวัตถุประสงค์ (Hero Description)</label>
              <textarea
                rows={3}
                value={config.heroDescription}
                onChange={(e) => handleUpdateConfigField('heroDescription', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-xs text-[#463629] resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FORM SETTINGS (แบบฟอร์มส่งข้อความ) */}
      {activeTab === 'form' && (
        <div className="bg-white border border-[#d7c8b2] rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="border-b border-[#ece4d4] pb-3">
            <h3 className="text-base font-bold font-editorial text-[#463629] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#9c7d5c]" />
              <span>การตั้งค่าแบบฟอร์มส่งข้อความ (Contact Form Settings)</span>
            </h3>
            <p className="text-xs text-[#6f5a45] mt-1">
              เปิด/ปิดการรับข้อความจากผู้ใช้งาน และแก้ไขข้อความตอบรับอัตโนมัติ
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#463629]">
                <input
                  type="checkbox"
                  checked={config.formEnabled}
                  onChange={(e) => handleUpdateConfigField('formEnabled', e.target.checked)}
                  className="rounded text-[#9c7d5c] focus:ring-[#9c7d5c]"
                />
                <span>เปิดใช้งานแบบฟอร์มส่งข้อความบนหน้าติดต่อเรา</span>
              </label>
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">หัวข้อแบบฟอร์ม (Form Title)</label>
              <input
                type="text"
                value={config.formTitle}
                onChange={(e) => handleUpdateConfigField('formTitle', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">คำอธิบายใต้หัวข้อ (Form Subtitle)</label>
              <input
                type="text"
                value={config.formSubtitle}
                onChange={(e) => handleUpdateConfigField('formSubtitle', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#463629] mb-1">ข้อความเมื่อส่งสำเร็จ (Success Message)</label>
              <textarea
                rows={2}
                value={config.formSuccessMessage}
                onChange={(e) => handleUpdateConfigField('formSuccessMessage', e.target.value)}
                className="w-full px-3 py-2 bg-[#fbf6ed]/40 border border-[#d7c8b2] rounded-lg text-[#463629] resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE CREATOR MODAL */}
      {editingCreator && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffdf7] border border-[#d7c8b2] rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#d7c8b2] pb-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#9c7d5c] font-semibold">
                  {isCreatingNew ? 'เพิ่มผู้สร้างระบบใหม่' : 'แก้ไขข้อมูลและรูปภาพผู้สร้างระบบ'}
                </div>
                <h3 className="text-xl font-bold font-editorial text-[#463629]">
                  {isCreatingNew ? 'สร้างโปรไฟล์ผู้สร้างระบบ' : `แก้ไข: ${editingCreator.name || 'ผู้สร้าง'}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingCreator(null)}
                className="w-8 h-8 rounded-lg bg-white border border-[#d7c8b2] flex items-center justify-center text-[#6f5a45] hover:text-[#463629] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="space-y-4 text-xs">

              {/* Circular Avatar Preview & Image URL */}
              <div className="p-4 bg-white border border-[#d7c8b2] rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                <div className="shrink-0 text-center">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#9c7d5c] via-[#d4af37] to-[#e6c12f] shadow-lg mx-auto ring-4 ring-[#fffdf7]">
                    <img
                      src={editingCreator.imageUrl || '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png'}
                      alt="Avatar Preview"
                      className="w-full h-full rounded-full object-cover bg-[#2a1d13]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png';
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[#9c7d5c] font-medium block mt-1">กรอบวงกลมจริง</span>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="block font-bold text-[#463629]">
                    ลิงก์รูปภาพผู้สร้าง (Image URL) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCreator.imageUrl}
                    onChange={(e) => setEditingCreator({ ...editingCreator, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#fbf6ed]/50 border border-[#d7c8b2] rounded-lg text-[#463629]"
                    placeholder="ใส่ URL รูปภาพ หรือพาธไฟล์ใน /assets/..."
                  />
                  <div className="flex items-center gap-2 flex-wrap text-[10px]">
                    <span className="text-[#9c7d5c]">ภาพตัวอย่างด่วน:</span>
                    <button
                      type="button"
                      onClick={() => setEditingCreator({ ...editingCreator, imageUrl: '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png' })}
                      className="px-2 py-0.5 bg-[#f5ede0] rounded text-[#866747] hover:underline cursor-pointer"
                    >
                      ตราสัญลักษณ์โครงการ
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCreator({ ...editingCreator, imageUrl: '/assets/mascot/IMG_8169.PNG' })}
                      className="px-2 py-0.5 bg-[#f5ede0] rounded text-[#866747] hover:underline cursor-pointer"
                    >
                      น้องมิวมิว (MIUMIU)
                    </button>
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    ชื่อ-นามสกุล / ชื่อผู้สร้าง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCreator.name}
                    onChange={(e) => setEditingCreator({ ...editingCreator, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg text-[#463629] font-medium"
                    placeholder="เช่น เบญญาภา ใบกล้า (Benyapabaibuaw)"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    ตำแหน่ง / บทบาทหน้าที่ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCreator.role}
                    onChange={(e) => setEditingCreator({ ...editingCreator, role: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg text-[#463629]"
                    placeholder="เช่น หัวหน้านักพัฒนาระบบ (System Architect)"
                  />
                </div>
              </div>

              {/* Affiliation & Bio */}
              <div>
                <label className="block font-medium text-[#463629] mb-1">
                  สังกัด / สถาบัน / คณะทำงาน
                </label>
                <input
                  type="text"
                  value={editingCreator.affiliation || ''}
                  onChange={(e) => setEditingCreator({ ...editingCreator, affiliation: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg text-[#463629]"
                  placeholder="เช่น ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน)"
                />
              </div>

              <div>
                <label className="block font-medium text-[#463629] mb-1">
                  ประวัติแนะนำตัว / ความเชี่ยวชาญ / วิสัยทัศน์ (Bio)
                </label>
                <textarea
                  rows={3}
                  value={editingCreator.bio || ''}
                  onChange={(e) => setEditingCreator({ ...editingCreator, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg text-xs text-[#463629] resize-none leading-relaxed"
                  placeholder="แนะนำบทบาทการสร้างระบบ ความเชี่ยวชาญด้านกราฟความรู้ หรือเป้าหมายในการพัฒนาแพลตฟอร์ม..."
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#463629] mb-1">อีเมลติดต่อ</label>
                  <input
                    type="email"
                    value={editingCreator.email || ''}
                    onChange={(e) => setEditingCreator({ ...editingCreator, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg text-[#463629]"
                    placeholder="Benyapabaibuaw@gmail.com"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#463629] mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    value={editingCreator.phone || ''}
                    onChange={(e) => setEditingCreator({ ...editingCreator, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg text-[#463629]"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#463629] mb-1">เว็บไซต์ / ผลงาน (Portfolio URL)</label>
                  <input
                    type="url"
                    value={editingCreator.websiteUrl || ''}
                    onChange={(e) => setEditingCreator({ ...editingCreator, websiteUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg text-[#463629]"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#463629] mb-1">ลำดับการแสดงผล (Order)</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={editingCreator.order}
                    onChange={(e) => setEditingCreator({ ...editingCreator, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg text-[#463629]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#463629]">
                  <input
                    type="checkbox"
                    checked={editingCreator.active}
                    onChange={(e) => setEditingCreator({ ...editingCreator, active: e.target.checked })}
                    className="rounded text-[#9c7d5c] focus:ring-[#9c7d5c]"
                  />
                  <span>เปิดแสดงโปรไฟล์นี้บนหน้าติดต่อเรา</span>
                </label>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-[#d7c8b2] pt-4">
              <button
                type="button"
                onClick={() => setEditingCreator(null)}
                className="px-4 py-2 text-xs font-semibold text-[#6f5a45] hover:text-[#463629] bg-white border border-[#d7c8b2] rounded-lg transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSaveCreatorModal}
                className="px-5 py-2 text-xs font-bold text-white bg-[#9c7d5c] hover:bg-[#866747] rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกข้อมูลผู้สร้าง</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
