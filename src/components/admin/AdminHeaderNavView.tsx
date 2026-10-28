import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  ExternalLink, 
  Layers, 
  Compass, 
  ChevronDown, 
  Sliders, 
  Search, 
  HelpCircle,
  Smartphone,
  Monitor,
  Tag,
  BookOpen,
  Landmark,
  Home,
  Network,
  BarChart3,
  X
} from 'lucide-react';
import { museumStore } from '../../services/museumStore';
import type { HeaderConfig, NavMenuItem, NavDropdownItem } from '../../types/museum';

interface AdminHeaderNavViewProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const AdminHeaderNavView: React.FC<AdminHeaderNavViewProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<HeaderConfig>(() => museumStore.getHeaderConfig());
  const [editingItem, setEditingItem] = useState<NavMenuItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Sub-item editing state inside the item modal
  const [editingSubItemIndex, setEditingSubItemIndex] = useState<number | null>(null);
  const [tempSubItem, setTempSubItem] = useState<NavDropdownItem>({
    id: '',
    label: '',
    subLabel: '',
    targetTab: 'museums',
    active: true,
    order: 1
  });
  const [isAddingSubItem, setIsAddingSubItem] = useState(false);

  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      setConfig(museumStore.getHeaderConfig());
    });
    return unsub;
  }, []);

  const triggerToast = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const handleUpdateBrand = (field: keyof HeaderConfig, value: any) => {
    const updated = { ...config, [field]: value };
    setConfig(updated);
    museumStore.updateHeaderConfig({ [field]: value });
    triggerToast('บันทึกการตั้งค่าแบรนด์และภาพรวมสำเร็จ');
  };

  const handleToggleItemActive = (id: string, currentVal: boolean) => {
    museumStore.updateNavMenuItem(id, { active: !currentVal });
    triggerToast(`เปลี่ยนสถานะการแสดงผลเมนูสำเร็จ`);
  };

  const handleToggleMobile = (id: string, currentVal: boolean) => {
    museumStore.updateNavMenuItem(id, { showOnMobile: !currentVal });
    triggerToast(`บันทึกการแสดงผลบนอุปกรณ์เคลื่อนที่`);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newItems = [...config.menuItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate order numbers
    newItems.forEach((item, idx) => {
      item.order = idx + 1;
    });

    const updated = { ...config, menuItems: newItems };
    setConfig(updated);
    museumStore.updateHeaderConfig({ menuItems: newItems });
    triggerToast('จัดลำดับเมนูสำเร็จ');
  };

  const handleDeleteItem = (id: string, label: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบเมนู "${label}" ออกจากแถบเมนูด้านบน?`)) {
      return;
    }
    museumStore.deleteNavMenuItem(id);
    triggerToast(`ลบเมนู "${label}" เรียบร้อยแล้ว`);
  };

  const handleOpenEditModal = (item: NavMenuItem) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsCreatingNew(false);
    setIsAddingSubItem(false);
    setEditingSubItemIndex(null);
  };

  const handleOpenCreateModal = () => {
    const nextOrder = config.menuItems.length + 1;
    const newItem: NavMenuItem = {
      id: `menu_custom_${Date.now()}`,
      label: 'เมนูใหม่',
      targetAction: 'navigate',
      targetTab: 'museums',
      order: nextOrder,
      active: true,
      showOnMobile: true,
      hasDropdown: false,
      dropdownItems: []
    };
    setEditingItem(newItem);
    setIsCreatingNew(true);
    setIsAddingSubItem(false);
    setEditingSubItemIndex(null);
  };

  const handleSaveItemModal = () => {
    if (!editingItem) return;
    if (!editingItem.label.trim()) {
      alert('กรุณากรอกชื่อเมนูที่แสดง');
      return;
    }

    if (isCreatingNew) {
      museumStore.addNavMenuItem(editingItem);
      triggerToast(`เพิ่มเมนู "${editingItem.label}" เข้าสู่แถบเมนูเรียบร้อยแล้ว`);
    } else {
      museumStore.updateNavMenuItem(editingItem.id, editingItem);
      triggerToast(`บันทึกการแก้ไขเมนู "${editingItem.label}" สำเร็จ`);
    }

    setEditingItem(null);
    setIsCreatingNew(false);
  };

  const handleResetDefaults = () => {
    if (window.confirm('คุณต้องการรีเซ็ตแถบเมนูทั้งหมดกลับเป็นค่ามาตรฐานเริ่มต้นของเว็บไซต์หรือไม่? การแก้ไขที่ผ่านมาจะถูกล้าง')) {
      museumStore.resetDefaultHeaderConfig();
      triggerToast('คืนค่าแถบเมนูด้านบนเป็นค่าเริ่มต้นสำเร็จ');
    }
  };

  // Sub-items management within edit modal
  const handleSaveSubItem = () => {
    if (!editingItem) return;
    if (!tempSubItem.label.trim()) {
      alert('กรุณากรอกชื่อเมนูย่อย');
      return;
    }

    const currentSubItems = editingItem.dropdownItems ? [...editingItem.dropdownItems] : [];
    if (editingSubItemIndex !== null && editingSubItemIndex >= 0) {
      currentSubItems[editingSubItemIndex] = { ...tempSubItem };
    } else {
      currentSubItems.push({
        ...tempSubItem,
        id: tempSubItem.id || `sub_${Date.now()}`,
        order: currentSubItems.length + 1
      });
    }

    setEditingItem({
      ...editingItem,
      dropdownItems: currentSubItems,
      hasDropdown: currentSubItems.length > 0
    });

    setIsAddingSubItem(false);
    setEditingSubItemIndex(null);
  };

  const handleDeleteSubItem = (index: number) => {
    if (!editingItem || !editingItem.dropdownItems) return;
    const updated = editingItem.dropdownItems.filter((_, idx) => idx !== index);
    setEditingItem({
      ...editingItem,
      dropdownItems: updated,
      hasDropdown: updated.length > 0
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d7c8b2] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#9c7d5c] font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>ระบบจัดการภาพรวมเว็บไซต์ (Site Navigation CMS)</span>
          </div>
          <h2 className="text-xl font-bold font-editorial text-[#463629] flex items-center gap-2.5">
            <Menu className="w-6 h-6 text-[#9c7d5c]" />
            <span>จัดการแถบเมนูด้านบน (Header Navigation CMS)</span>
          </h2>
          <p className="text-xs text-[#6f5a45] mt-1 max-w-2xl leading-relaxed">
            ปรับแต่งชื่อเมนูภาษาไทย ฟังก์ชั่นการทำงานของแต่ละปุ่ม เมนูย่อย (Dropdown) 
            ป้ายแจ้งเตือน (Badges) และข้อมูลอัตลักษณ์แบรนด์บนแถบเมนูหลักของเว็บไซต์แบบเรียลไทม์
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6f5a45] hover:text-[#463629] bg-[#fffdf7] hover:bg-[#ece4d4]/50 border border-[#d7c8b2] rounded-lg transition-colors cursor-pointer"
            title="คืนค่าเป็นเมนูมาตรฐานระบบ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#9c7d5c] hover:bg-[#866747] rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มเมนูใหม่</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {saveSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800 animate-slideDown shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{saveSuccessMessage}</span>
        </div>
      )}

      {/* Live Preview Bar */}
      <div className="bg-[#1f1914] text-white p-4 rounded-xl shadow-md border border-[#3d2e20]">
        <div className="flex items-center justify-between text-[11px] text-[#c9b197] mb-2 px-1 border-b border-[#3d2e20] pb-2">
          <div className="flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-[#e5a93c]" />
            <span className="font-semibold uppercase tracking-wider">ตัวอย่างแถบเมนูจำลองแบบสด (Live Navbar Simulation)</span>
          </div>
          <span className="text-[10px] text-[#a88a6d]">ผลลัพธ์จะอัปเดตบนหน้าเว็บจริงทันที</span>
        </div>
        
        <div className="flex items-center justify-between gap-4 py-1.5 overflow-x-auto scrollbar-thin">
          {/* Logo simulation */}
          <div className="flex items-center gap-2 shrink-0">
            <img 
              src={config.brandEmblemUrl} 
              alt="Logo" 
              className="w-6 h-6 object-contain rounded-full border border-[#d4af37]/40" 
            />
            <div>
              <div className="text-xs font-bold font-editorial text-[#fffdf7]">{config.brandTitle}</div>
              <div className="text-[9px] text-[#c9b197] hidden sm:block truncate max-w-[180px]">{config.brandSubtitle}</div>
            </div>
          </div>

          {/* Menus simulation */}
          <div className="flex items-center gap-1.5 shrink-0">
            {config.menuItems
              .filter(item => item.active)
              .sort((a, b) => a.order - b.order)
              .map(item => (
                <div 
                  key={item.id} 
                  className="px-2.5 py-1 rounded bg-[#2e2319] hover:bg-[#3d2e20] text-xs font-medium text-[#ebdcc9] flex items-center gap-1 border border-[#4a3a2a] cursor-pointer"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 bg-[#d4af37] text-[#1f1914] font-bold rounded">
                      {item.badge}
                    </span>
                  )}
                  {item.hasDropdown && <ChevronDown className="w-3 h-3 text-[#a88a6d]" />}
                </div>
              ))}
          </div>

          {/* Quick buttons simulation */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-1 rounded text-[11px] bg-[#33261a] text-[#ebdcc9] border border-[#4a3a2a]">
              {config.searchButtonLabel || 'ค้นหา'}
            </span>
            <span className="px-2 py-1 rounded text-[11px] bg-[#33261a] text-[#ebdcc9] border border-[#4a3a2a]">
              {config.helpButtonLabel || 'ช่วยเหลือ'}
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Global Brand & Header Settings */}
      <div className="bg-[#fffdf7] border border-[#d7c8b2] rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#d7c8b2]/60 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#9c7d5c]" />
            <h3 className="text-sm font-bold font-editorial text-[#463629]">
              1. ตั้งค่าอัตลักษณ์แบรนด์ & ปุ่มหลักบนแถบเมนู (Brand Identity & Action Buttons)
            </h3>
          </div>
          <span className="text-[11px] text-[#6f5a45]">ปรับเปลี่ยนข้อความอัตลักษณ์ส่วนหัว</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-medium text-[#463629] mb-1">ชื่อแบรนด์หลัก (Brand Title)</label>
            <input
              type="text"
              value={config.brandTitle}
              onChange={(e) => handleUpdateBrand('brandTitle', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-[#463629]"
              placeholder="Echoes of Siam"
            />
          </div>

          <div>
            <label className="block font-medium text-[#463629] mb-1">สโลแกน / ชื่อรอง (Brand Subtitle)</label>
            <input
              type="text"
              value={config.brandSubtitle}
              onChange={(e) => handleUpdateBrand('brandSubtitle', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-[#463629]"
              placeholder="สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์"
            />
          </div>

          <div>
            <label className="block font-medium text-[#463629] mb-1">ปุ่มค้นหาด่วน (Search Button Label)</label>
            <input
              type="text"
              value={config.searchButtonLabel || 'ค้นหา'}
              onChange={(e) => handleUpdateBrand('searchButtonLabel', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-[#463629]"
              placeholder="ค้นหา"
            />
          </div>

          <div>
            <label className="block font-medium text-[#463629] mb-1">ปุ่มช่วยเหลือ (Help Button Label)</label>
            <input
              type="text"
              value={config.helpButtonLabel || 'ช่วยเหลือ'}
              onChange={(e) => handleUpdateBrand('helpButtonLabel', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-[#463629]"
              placeholder="ช่วยเหลือ"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#463629] mb-1 text-xs">ลิงก์ภาพตราสัญลักษณ์แบรนด์ (Emblem Image URL)</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={config.brandEmblemUrl}
              onChange={(e) => handleUpdateBrand('brandEmblemUrl', e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-xs text-[#463629]"
              placeholder="/assets/aistudio/..."
            />
            {config.brandEmblemUrl && (
              <img 
                src={config.brandEmblemUrl} 
                alt="Emblem" 
                className="w-8 h-8 rounded-full border border-[#d7c8b2] object-contain p-0.5 bg-white shrink-0" 
              />
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Navigation Items Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#9c7d5c]" />
            <h3 className="text-sm font-bold font-editorial text-[#463629]">
              2. รายการเมนูบนแถบนำทาง (Navbar Menu Items & Action Routing)
            </h3>
          </div>
          <span className="text-xs text-[#6f5a45]">
            ทั้งหมด {config.menuItems.length} เมนู (เปิดใช้งาน {config.menuItems.filter(i => i.active).length} เมนู)
          </span>
        </div>

        <div className="bg-white border border-[#d7c8b2] rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f9f5ef] border-b border-[#d7c8b2] text-[#463629] font-semibold">
                  <th className="py-3 px-3 w-16 text-center">ลำดับ</th>
                  <th className="py-3 px-4">ชื่อเมนูที่แสดง (Label)</th>
                  <th className="py-3 px-4">ฟังก์ชั่น / ปลายทาง (Action & Route)</th>
                  <th className="py-3 px-3 text-center">เมนูย่อย (Sub-items)</th>
                  <th className="py-3 px-3 text-center">ป้ายกำกับ (Badge)</th>
                  <th className="py-3 px-3 text-center">การแสดงผล</th>
                  <th className="py-3 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece4d4]">
                {config.menuItems
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => {
                    const dropdownCount = item.dropdownItems?.length || 0;
                    return (
                      <tr key={item.id} className="hover:bg-[#fffdf7] transition-colors">
                        {/* Order & Reorder arrows */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-bold text-[#6f5a45] w-4">{item.order}</span>
                            <div className="flex flex-col">
                              <button
                                disabled={index === 0}
                                onClick={() => handleMoveOrder(index, 'up')}
                                className="p-0.5 text-[#6f5a45] hover:text-[#463629] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="เลื่อนขึ้น"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                disabled={index === config.menuItems.length - 1}
                                onClick={() => handleMoveOrder(index, 'down')}
                                className="p-0.5 text-[#6f5a45] hover:text-[#463629] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                title="เลื่อนลง"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Label & Icon */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#463629] text-sm">{item.label}</span>
                            <span className="text-[10px] text-[#9c7d5c] bg-[#f5ede0] px-1.5 py-0.5 rounded font-mono">
                              {item.id}
                            </span>
                          </div>
                          {item.externalUrl && (
                            <div className="text-[10px] text-sky-700 flex items-center gap-1 mt-0.5">
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate max-w-[200px]">{item.externalUrl}</span>
                            </div>
                          )}
                        </td>

                        {/* Action & Target */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                item.targetAction === 'navigate' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                                item.targetAction === 'search' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                                item.targetAction === 'help' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                                'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              }`}>
                                {item.targetAction === 'navigate' ? 'เปิดหน้าเว็บ (Navigate)' :
                                 item.targetAction === 'search' ? 'เปิดค้นหาด่วน (Search Modal)' :
                                 item.targetAction === 'help' ? 'เปิดคู่มือ (Help)' : 'ลิงก์ภายนอก (External)'}
                              </span>
                              {item.targetTab && (
                                <span className="font-medium text-[#463629]">
                                  → <span className="underline decoration-dotted">{item.targetTab}</span>
                                </span>
                              )}
                            </div>
                            {item.targetMeta && Object.keys(item.targetMeta).length > 0 && (
                              <div className="text-[10px] text-[#6f5a45] font-mono">
                                พารามิเตอร์: {JSON.stringify(item.targetMeta)}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Sub-items / Dropdown */}
                        <td className="py-3 px-3 text-center">
                          {item.hasDropdown ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px]">
                              <span>{dropdownCount} รายการ</span>
                              <ChevronDown className="w-3 h-3" />
                            </span>
                          ) : (
                            <span className="text-[#a88a6d] text-[11px]">ไม่มี</span>
                          )}
                        </td>

                        {/* Badge */}
                        <td className="py-3 px-3 text-center">
                          {item.badge ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/20 text-[#866747] border border-[#d4af37]/40">
                              {item.badge}
                            </span>
                          ) : (
                            <span className="text-[#a88a6d] text-[11px]">-</span>
                          )}
                        </td>

                        {/* Visibility Toggles */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Desktop / Global Active */}
                            <button
                              onClick={() => handleToggleItemActive(item.id, item.active)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                item.active 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                  : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
                              }`}
                              title={item.active ? 'เปิดแสดงผลอยู่ (คลิกเพื่อซ่อน)' : 'ซ่อนอยู่ (คลิกเพื่อแสดง)'}
                            >
                              {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            {/* Mobile Active */}
                            <button
                              onClick={() => handleToggleMobile(item.id, item.showOnMobile)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                item.showOnMobile
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                                  : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200'
                              }`}
                              title={item.showOnMobile ? 'แสดงบนมือถือ (คลิกเพื่อซ่อนบนมือถือ)' : 'ซ่อนบนมือถือ (คลิกเพื่อแสดง)'}
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Actions (Edit / Delete) */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-[#463629] bg-[#fffdf7] hover:bg-[#ece4d4]/60 border border-[#d7c8b2] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#9c7d5c]" />
                              <span>แก้ไขฟังก์ชั่น</span>
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.label)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                              title="ลบเมนูนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit / Create Menu Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffdf7] border border-[#d7c8b2] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#d7c8b2] pb-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#9c7d5c] font-semibold">
                  {isCreatingNew ? 'เพิ่มเมนูใหม่ในแถบนำทาง' : 'แก้ไขคุณสมบัติและฟังก์ชั่นเมนู'}
                </div>
                <h3 className="text-lg font-bold font-editorial text-[#463629]">
                  {isCreatingNew ? 'สร้างเมนูใหม่' : `แก้ไขเมนู: ${editingItem.label}`}
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-lg bg-white border border-[#d7c8b2] flex items-center justify-center text-[#6f5a45] hover:text-[#463629] hover:bg-[#ece4d4]/50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Fields */}
            <div className="space-y-4 text-xs">
              
              {/* Row 1: Label and ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    ชื่อเมนูที่แสดง (Menu Display Label) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingItem.label}
                    onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] font-medium text-[#463629]"
                    placeholder="เช่น สำรวจคลังมรดก, นิทรรศการ ฯลฯ"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    รหัสอ้างอิงของเมนู (Menu Identifier ID)
                  </label>
                  <input
                    type="text"
                    value={editingItem.id}
                    disabled={!isCreatingNew}
                    onChange={(e) => setEditingItem({ ...editingItem, id: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-[#d7c8b2] rounded-lg text-stone-600 font-mono disabled:opacity-75"
                    placeholder="เช่น menu_heritage"
                  />
                </div>
              </div>

              {/* Row 2: Action Type & Target Route */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    ประเภทการทำงาน (Action Functionality) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingItem.targetAction}
                    onChange={(e) => setEditingItem({ 
                      ...editingItem, 
                      targetAction: e.target.value as any 
                    })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-[#463629]"
                  >
                    <option value="navigate">เปิดหน้าในเว็บ (Navigate Tab)</option>
                    <option value="search">เปิดกล่องค้นหาด่วน (Search Modal)</option>
                    <option value="help">เปิดหน้าต่างช่วยเหลือ/คู่มือ (Help Modal)</option>
                    <option value="external">เปิดลิงก์ภายนอก (External Web Link)</option>
                  </select>
                </div>

                {editingItem.targetAction === 'navigate' && (
                  <div>
                    <label className="block font-medium text-[#463629] mb-1">
                      หน้าเป้าหมายปลายทาง (Target Page Tab) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editingItem.targetTab || 'home'}
                      onChange={(e) => setEditingItem({ ...editingItem, targetTab: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-[#463629] font-medium"
                    >
                      <option value="home">หน้าแรก (Home)</option>
                      <option value="museums">สำรวจพิพิธภัณฑ์ (Museums Directory)</option>
                      <option value="subjects">สำรวจหัวเรื่อง 9 ประเภท (Subjects Explorer)</option>
                      <option value="graph">มหาจักรวาลกราฟความรู้ (Knowledge Graph)</option>
                      <option value="insights">บทวิเคราะห์และสถิติ (Insights & Analytics)</option>
                      <option value="about">เกี่ยวกับโครงการ (About & Sources)</option>
                      <option value="contact">ติดต่อเรา & คณะผู้สร้าง (Contact & Creators)</option>
                      <option value="help">คู่มือการใช้งาน (User Guide & Help)</option>
                    </select>
                  </div>
                )}

                {editingItem.targetAction === 'external' && (
                  <div>
                    <label className="block font-medium text-[#463629] mb-1">
                      ที่อยู่เว็บไซต์ภายนอก (External URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={editingItem.externalUrl || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, externalUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-[#463629]"
                      placeholder="https://sac.or.th"
                    />
                  </div>
                )}
              </div>

              {/* Row 3: Badge and Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    ข้อความป้ายกำกับ (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={editingItem.badge || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-[#463629]"
                    placeholder="เช่น ใหม่, 9 หมวด, สด, 3D"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    ลำดับการแสดง (Order Priority)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={editingItem.order}
                    onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-white border border-[#d7c8b2] rounded-lg focus:outline-hidden focus:border-[#9c7d5c] text-[#463629]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#463629] mb-1">
                    การแสดงผลเริ่มต้น
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.active}
                        onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                        className="rounded text-[#9c7d5c] focus:ring-[#9c7d5c]"
                      />
                      <span>เปิดแสดงผล</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.showOnMobile}
                        onChange={(e) => setEditingItem({ ...editingItem, showOnMobile: e.target.checked })}
                        className="rounded text-[#9c7d5c] focus:ring-[#9c7d5c]"
                      />
                      <span>แสดงบนมือถือ</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section: Dropdown Sub-Items */}
              <div className="border border-[#d7c8b2] rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-[#ece4d4] pb-2">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#463629]">
                      <input
                        type="checkbox"
                        checked={editingItem.hasDropdown ?? false}
                        onChange={(e) => setEditingItem({ 
                          ...editingItem, 
                          hasDropdown: e.target.checked,
                          dropdownItems: e.target.checked ? (editingItem.dropdownItems || []) : []
                        })}
                        className="rounded text-[#9c7d5c] focus:ring-[#9c7d5c]"
                      />
                      <span>เปิดใช้งานเมนูย่อย (Dropdown Menu)</span>
                    </label>
                  </div>

                  {editingItem.hasDropdown && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingSubItem(true);
                        setEditingSubItemIndex(null);
                        setTempSubItem({
                          id: `sub_${Date.now()}`,
                          label: '',
                          subLabel: '',
                          targetTab: editingItem.targetTab || 'museums',
                          active: true,
                          order: (editingItem.dropdownItems?.length || 0) + 1
                        });
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-[#463629] bg-[#f5ede0] hover:bg-[#ece4d4] rounded-lg border border-[#d7c8b2] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#9c7d5c]" />
                      <span>เพิ่มรายการย่อย</span>
                    </button>
                  )}
                </div>

                {editingItem.hasDropdown && (
                  <div className="space-y-2">
                    {(!editingItem.dropdownItems || editingItem.dropdownItems.length === 0) && (
                      <p className="text-[11px] text-[#a88a6d] italic py-2">
                        ยังไม่มีรายการย่อยในดรอปดาวน์ คลิก "เพิ่มรายการย่อย" เพื่อเริ่มเพิ่มตัวเลือก
                      </p>
                    )}

                    {editingItem.dropdownItems && editingItem.dropdownItems.map((sub, idx) => (
                      <div 
                        key={sub.id || idx} 
                        className="flex items-center justify-between p-2.5 bg-[#fffdf7] border border-[#ece4d4] rounded-lg"
                      >
                        <div>
                          <div className="font-bold text-[#463629] flex items-center gap-1.5">
                            <span>{sub.label}</span>
                            <span className="text-[10px] text-[#9c7d5c] font-normal">→ {sub.targetTab}</span>
                          </div>
                          {sub.subLabel && (
                            <div className="text-[10px] text-[#6f5a45]">{sub.subLabel}</div>
                          )}
                          {sub.targetMeta && Object.keys(sub.targetMeta).length > 0 && (
                            <div className="text-[9px] text-[#866747] font-mono">
                              พารามิเตอร์: {JSON.stringify(sub.targetMeta)}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSubItemIndex(idx);
                              setTempSubItem({ ...sub });
                              setIsAddingSubItem(true);
                            }}
                            className="p-1 text-[#6f5a45] hover:text-[#463629] hover:bg-[#ece4d4]/50 rounded cursor-pointer"
                            title="แก้ไขรายการนี้"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubItem(idx)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            title="ลบรายการนี้"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Sub-item inline editor */}
                    {isAddingSubItem && (
                      <div className="p-3 bg-[#f9f5ef] border border-[#d7c8b2] rounded-lg space-y-3 mt-3 animate-fadeIn">
                        <div className="font-bold text-[#463629] text-[11px]">
                          {editingSubItemIndex !== null ? 'แก้ไขเมนูย่อย' : 'เพิ่มเมนูย่อยใหม่'}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-[#463629] mb-1">
                              ชื่อเมนูย่อย <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={tempSubItem.label}
                              onChange={(e) => setTempSubItem({ ...tempSubItem, label: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#d7c8b2] rounded text-xs text-[#463629]"
                              placeholder="เช่น วัดและศาสนสถาน"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-[#463629] mb-1">
                              หน้าเป้าหมาย (Target Tab)
                            </label>
                            <select
                              value={tempSubItem.targetTab || 'museums'}
                              onChange={(e) => setTempSubItem({ ...tempSubItem, targetTab: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#d7c8b2] rounded text-xs text-[#463629]"
                            >
                              <option value="museums">สำรวจพิพิธภัณฑ์ (Museums)</option>
                              <option value="subjects">สำรวจหัวเรื่อง (Subjects)</option>
                              <option value="graph">กราฟความรู้ (Graph)</option>
                              <option value="insights">บทวิเคราะห์ (Insights)</option>
                              <option value="about">เกี่ยวกับโครงการ (About)</option>
                              <option value="contact">ติดต่อเรา (Contact)</option>
                              <option value="help">ช่วยเหลือ (Help)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-[#463629] mb-1">
                            คำอธิบายสั้นๆ (Sub-label / Description)
                          </label>
                          <input
                            type="text"
                            value={tempSubItem.subLabel || ''}
                            onChange={(e) => setTempSubItem({ ...tempSubItem, subLabel: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-white border border-[#d7c8b2] rounded text-xs text-[#463629]"
                            placeholder="คำอธิบายเพิ่มเติมใต้ชื่อเมนู"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingSubItem(false);
                              setEditingSubItemIndex(null);
                            }}
                            className="px-2.5 py-1 text-xs text-[#6f5a45] hover:text-[#463629] cursor-pointer"
                          >
                            ยกเลิก
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveSubItem}
                            className="px-3 py-1 bg-[#9c7d5c] hover:bg-[#866747] text-white rounded font-medium text-xs cursor-pointer"
                          >
                            ตกลงรายการย่อย
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-[#d7c8b2] pt-4">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-[#6f5a45] hover:text-[#463629] bg-white border border-[#d7c8b2] rounded-lg transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSaveItemModal}
                className="px-5 py-2 text-xs font-bold text-white bg-[#9c7d5c] hover:bg-[#866747] rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกการเปลี่ยนแปลง</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
