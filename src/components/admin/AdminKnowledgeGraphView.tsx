import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Image as ImageIcon, 
  Plus, 
  Edit3, 
  Trash, 
  Trash2, 
  RotateCcw, 
  Check, 
  X, 
  Save, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink 
} from 'lucide-react';
import { museumStore } from '../../services/museumStore';
import type { GraphBloomPreset, KnowledgeGraphImage } from '../../types/museum';

interface AdminKnowledgeGraphViewProps {
  onNavigate: (tab: string, meta?: any) => void;
  initialSubTab?: 'image' | 'bloom';
}

export const AdminKnowledgeGraphView: React.FC<AdminKnowledgeGraphViewProps> = ({ onNavigate, initialSubTab }) => {
  const [subTab, setSubTab] = useState<'image' | 'bloom'>(() => initialSubTab || 'image');

  useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- 1. IMAGE KNOWLEDGE GRAPH STATE ---
  const [kgImages, setKgImages] = useState<KnowledgeGraphImage[]>(() => museumStore.getKnowledgeGraphImages());
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<KnowledgeGraphImage | null>(null);

  // Image Form State
  const [imgTitle, setImgTitle] = useState('');
  const [imgSubtitle, setImgSubtitle] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imgDescription, setImgDescription] = useState('');
  const [imgFormattedText, setImgFormattedText] = useState('');
  const [imgTags, setImgTags] = useState('');
  const [imgCredit, setImgCredit] = useState('');
  const [imgActive, setImgActive] = useState(true);

  // --- 2. BLOOM PRESETS STATE ---
  const [presets, setPresets] = useState<GraphBloomPreset[]>(() => museumStore.getBloomPresets());
  const [isBloomModalOpen, setIsBloomModalOpen] = useState(false);
  const [editingPreset, setEditingPreset] = useState<GraphBloomPreset | null>(null);

  // Bloom Form State
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
  const [colorTheme, setColorTheme] = useState('gold');
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState(1);

  const refreshData = () => {
    setKgImages(museumStore.getKnowledgeGraphImages());
    setPresets(museumStore.getBloomPresets());
  };

  useEffect(() => {
    const unsub = museumStore.subscribe(() => {
      refreshData();
    });
    return () => unsub();
  }, []);

  const PRESET_KG_IMAGE_OPTIONS = [
    {
      label: 'ภาพโครงข่ายความสัมพันธ์ Neo4j Bloom (The Living Memory Universe)',
      url: '/assets/optimized/knowledge-graph.webp'
    },
    {
      label: 'ภาพกลุ่มดาวแห่งความทรงจำสยาม (The Living Memory Universe Constellation)',
      url: '/assets/aistudio/image_451791c3.png'
    },
    {
      label: 'แผนภาพมหาจักรวาลสยาม (The Living Memory Universe)',
      url: '/assets/optimized/siam-cultural-archive.webp'
    },
    {
      label: 'ตราสัญลักษณ์มรดกสยาม (Echoes of Siam Heritage Emblem)',
      url: '/assets/optimized/echoes-of-siam-emblem.webp'
    },
    {
      label: 'คลังโบราณคดีและงานประณีตศิลป์',
      url: '/assets/images/sac_database_overview_1792474278484.jpg'
    }
  ];

  // Image Graph handlers
  const openCreateImageModal = () => {
    setEditingImage(null);
    setImgTitle('');
    setImgSubtitle('');
    setImgUrl(PRESET_KG_IMAGE_OPTIONS[0].url);
    setImgDescription('');
    setImgFormattedText(`### 🏛️ เสาหลักโครงสร้าง ๔ มิติแห่งสยาม:\n1. **มิติโบราณคดีและก่อนประวัติศาสตร์ (Archaeological Foundation):** สายสัมพันธ์จากยุคก่อนประวัติศาสตร์บ้านเชียง\n2. **มิติประณีตศิลป์และงานช่างหลวง (Royal Craftsmanship):** งานช่างสิบหมู่ เครื่องถม เครื่องทอง\n3. **มิติวิถีชีวิตและชาติพันธุ์ (Living Ethnology):** ภูมิปัญญาผ้าทอและชุมชน ๓๙๑ แห่ง\n4. **มิติการกระจายตัว ๗๗ จังหวัด (Regional Geo-Network):** การเชื่อมต่อ 1,574 พิพิธภัณฑ์ทั่วประเทศ`);
    setImgTags('Knowledge Graph, Living Memory Universe, 1574 พิพิธภัณฑ์, ศูนย์มานุษยวิทยาสิรินธร');
    setImgCredit('ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน) & Echoes of Siam Research Engine');
    setImgActive(true);
    setIsImageModalOpen(true);
  };

  const openEditImageModal = (img: KnowledgeGraphImage) => {
    setEditingImage(img);
    setImgTitle(img.title);
    setImgSubtitle(img.subtitle || '');
    setImgUrl(img.imageUrl);
    setImgDescription(img.description);
    setImgFormattedText(img.formattedText || '');
    setImgTags((img.tags || []).join(', '));
    setImgCredit(img.credit || '');
    setImgActive(img.active);
    setIsImageModalOpen(true);
  };

  const handleSaveImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgTitle.trim() || !imgUrl.trim()) return;

    const tagsArray = imgTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingImage) {
      museumStore.updateKnowledgeGraphImage(editingImage.id, {
        title: imgTitle.trim(),
        subtitle: imgSubtitle.trim(),
        imageUrl: imgUrl.trim(),
        description: imgDescription.trim(),
        formattedText: imgFormattedText.trim(),
        tags: tagsArray,
        credit: imgCredit.trim() || undefined,
        active: imgActive
      });
      showToast(`อัปเดตแผนภาพกราฟความรู้ "${imgTitle.trim()}" เรียบร้อยแล้ว`);
    } else {
      museumStore.createKnowledgeGraphImage({
        title: imgTitle.trim(),
        subtitle: imgSubtitle.trim(),
        imageUrl: imgUrl.trim(),
        description: imgDescription.trim(),
        formattedText: imgFormattedText.trim(),
        highlights: [],
        tags: tagsArray,
        credit: imgCredit.trim() || undefined,
        active: imgActive,
        order: kgImages.length + 1
      });
      showToast(`เพิ่มแผนภาพกราฟความรู้ "${imgTitle.trim()}" สำเร็จ`);
    }

    setIsImageModalOpen(false);
    refreshData();
  };

  const handleDeleteImage = (img: KnowledgeGraphImage) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบแผนภาพกราฟความรู้ "${img.title}"?`)) {
      museumStore.deleteKnowledgeGraphImage(img.id);
      showToast('ลบแผนภาพกราฟความรู้สำเร็จ');
      refreshData();
    }
  };

  const handleToggleImageActive = (img: KnowledgeGraphImage) => {
    museumStore.updateKnowledgeGraphImage(img.id, { active: !img.active });
    showToast(img.active ? `ปิดการแสดงผลแผนภาพ: ${img.title}` : `เปิดการแสดงผลแผนภาพ: ${img.title}`);
    refreshData();
  };

  const handleMoveImage = (idx: number, direction: 'up' | 'down') => {
    const list = [...kgImages];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    museumStore.reorderKnowledgeGraphImages(list.map(i => i.id));
    refreshData();
  };

  const handleResetDefaultImages = () => {
    if (confirm('ต้องการคืนค่าแผนภาพกราฟความรู้มาตรฐาน (The Living Memory Universe) หรือไม่?')) {
      museumStore.resetDefaultKnowledgeGraphImages();
      refreshData();
      showToast('คืนค่าแผนภาพกราฟความรู้เริ่มต้นเรียบร้อยแล้ว');
    }
  };

  // Bloom Presets handlers
  const openCreateBloomModal = () => {
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
    setIsBloomModalOpen(true);
  };

  const openEditBloomModal = (p: GraphBloomPreset) => {
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
    setIsBloomModalOpen(true);
  };

  const handleSaveBloom = (e: React.FormEvent) => {
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
        colorTheme: colorTheme as any,
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
        colorTheme: colorTheme as any,
        active,
        order: Number(order) || presets.length + 1
      });
      showToast(`เพิ่มมุมมองบูม "${name.trim()}" สำเร็จ — แสดงผลให้ผู้ใช้เลือกได้ทันที!`);
    }
    setIsBloomModalOpen(false);
    refreshData();
  };

  const handleDeleteBloom = (p: GraphBloomPreset) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบมุมมองบูม "${p.name}"?`)) {
      museumStore.deleteBloomPreset(p.id);
      showToast(`ลบมุมมองบูมสำเร็จ`);
      refreshData();
    }
  };

  const handleToggleBloomActive = (p: GraphBloomPreset) => {
    museumStore.updateBloomPreset(p.id, { active: !p.active });
    showToast(p.active ? `ปิดการแสดงผลมุมมอง: ${p.name}` : `เปิดการแสดงผลมุมมอง: ${p.name}`);
    refreshData();
  };

  const handleMoveBloom = (index: number, direction: 'up' | 'down') => {
    const newPresets = [...presets];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newPresets.length) return;

    const temp = newPresets[index];
    newPresets[index] = newPresets[targetIdx];
    newPresets[targetIdx] = temp;

    museumStore.reorderBloomPresets(newPresets.map(p => p.id));
    refreshData();
    showToast('ปรับลำดับมุมมองบูมสำเร็จ');
  };

  const handlePurgeTestBloom = () => {
    if (confirm('ยืนยันลบรายการบูมทดสอบที่มีชื่อว่า "เทส", "test", หรือ "ทดสอบ" ทั้งหมดออกจากระบบทันทีหรือไม่?')) {
      const removed = museumStore.purgeTestBloomPresets();
      refreshData();
      showToast(`ลบรายการบูมทดสอบสำเร็จแล้ว ${removed} รายการ`);
    }
  };

  const handleResetDefaultBlooms = () => {
    if (confirm('คุณต้องการรีเซ็ตมุมมองบูมทั้งหมดกลับเป็น 5 รูปแบบมาตรฐานตามระบบหรือไม่?')) {
      museumStore.resetDefaultBloomPresets();
      refreshData();
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
            <span>จัดการกราฟความรู้ & Neo4j Bloom (Knowledge Graph System)</span>
          </h2>
          <p className="text-xs text-[#6f5a45] mt-0.5">
            จัดการทั้งกราฟความรู้แบบรูปภาพ (เมนหลักขึ้นก่อน) และมุมมองบูมสำเร็จรูป Neo4j Bloom — ข้อมูลจะอัปเดตไปยังหน้าผู้ใช้ทันที
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
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#d7c8b2]">
        <button
          onClick={() => setSubTab('image')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            subTab === 'image'
              ? 'border-[#9c7d5c] text-[#463629] bg-[#ece4d4]/40 rounded-t-lg'
              : 'border-transparent text-[#6f5a45] hover:text-[#463629]'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-[#9c7d5c]" />
          <span>๑. แผนภาพกราฟความรู้ (Image Knowledge Graph - เมนหลัก)</span>
          <span className="px-1.5 py-0.2 bg-[#9c7d5c] text-white text-[10px] rounded-full">
            {kgImages.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('bloom')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            subTab === 'bloom'
              ? 'border-[#9c7d5c] text-[#463629] bg-[#ece4d4]/40 rounded-t-lg'
              : 'border-transparent text-[#6f5a45] hover:text-[#463629]'
          }`}
        >
          <Network className="w-4 h-4 text-[#9c7d5c]" />
          <span>๒. มุมมองบูมสำเร็จรูป (Neo4j Bloom Presets)</span>
          <span className="px-1.5 py-0.2 bg-[#ece4d4] text-[#463629] text-[10px] rounded-full">
            {presets.length}
          </span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* TAB 1: IMAGE KNOWLEDGE GRAPH (เมนหลัก) */}
      {subTab === 'image' && (
        <div className="space-y-4">
          
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>แผนภาพกราฟความรู้หลัก:</strong> ในหน้า "กราฟความรู้" จะนำแผนภาพนี้ขึ้นแสดงเป็น<strong>รายการแรกสุด</strong>ก่อนมุมมองบูม พร้อมการจัดหน้าคำบรรยายที่สวยงามวิจิตร
              </span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetDefaultImages}
                className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                คืนค่ามาตรฐาน
              </button>
              <button
                onClick={openCreateImageModal}
                className="px-3 py-1.5 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มแผนภาพกราฟใหม่</span>
              </button>
            </div>
          </div>

          {/* Cards of Image Knowledge Graphs */}
          <div className="space-y-3">
            {kgImages.map((img, idx) => (
              <div
                key={img.id}
                className={`p-4 rounded-xl border transition-all ${
                  img.active 
                    ? 'bg-white border-[#d7c8b2] shadow-xs' 
                    : 'bg-zinc-50 border-zinc-200 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="relative w-36 h-24 rounded-xl overflow-hidden bg-stone-900 shrink-0 border border-[#d7c8b2]">
                      <img 
                        src={img.imageUrl} 
                        alt={img.title} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-mono rounded">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          img.active 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-zinc-200 text-zinc-700'
                        }`}>
                          {img.active ? 'กำลังแสดงผลเป็นเมนหลัก' : 'ปิดชั่วคราว'}
                        </span>
                        {img.credit && (
                          <span className="text-[10px] text-[#6f5a45] truncate">
                            ที่มา: {img.credit}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold font-editorial text-[#463629]">
                        {img.title}
                      </h3>

                      <p className="text-xs text-[#6f5a45] line-clamp-2 leading-relaxed">
                        {img.subtitle || img.description}
                      </p>

                      {img.tags && img.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {img.tags.map((t, tIdx) => (
                            <span key={tIdx} className="px-1.5 py-0.5 bg-[#ece4d4] text-[#463629] text-[9px] rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 justify-end border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto">
                    <button
                      onClick={() => handleMoveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-[#6f5a45] hover:bg-[#ece4d4] rounded-lg disabled:opacity-30 cursor-pointer"
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveImage(idx, 'down')}
                      disabled={idx === kgImages.length - 1}
                      className="p-1.5 text-[#6f5a45] hover:bg-[#ece4d4] rounded-lg disabled:opacity-30 cursor-pointer"
                      title="เลื่อนลง"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleImageActive(img)}
                      className={`p-1.5 rounded-lg cursor-pointer ${
                        img.active ? 'text-emerald-700 hover:bg-emerald-50' : 'text-zinc-500 hover:bg-zinc-100'
                      }`}
                      title={img.active ? 'ปิดการแสดงผล' : 'เปิดการแสดงผล'}
                    >
                      {img.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditImageModal(img)}
                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                      title="แก้ไขข้อมูลและคำบรรยาย"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img)}
                      className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="ลบแผนภาพนี้"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: NEO4J BLOOM PRESETS */}
      {subTab === 'bloom' && (
        <div className="space-y-4">
          
          <div className="p-3.5 bg-[#ece4d4]/40 rounded-xl border border-[#d7c8b2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6f5a45]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e6c12f] shrink-0" />
              <span>
                มุมมองบูมสำเร็จรูปเปิดใช้งาน (<strong>{presets.filter(p => p.active).length} / {presets.length}</strong>) ให้ผู้ใช้เลือกสลับมุมมองโหนดเครือข่าย
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePurgeTestBloom}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="ลบรายการบูมทั้งหมดที่มีชื่อว่า 'เทส'"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>ลบรายการทดสอบ (เทส) ทั้งหมด</span>
              </button>

              <button
                onClick={handleResetDefaultBlooms}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>คืนค่า 5 มาตรฐาน</span>
              </button>

              <button
                onClick={openCreateBloomModal}
                className="px-3 py-1.5 bg-[#9c7d5c] hover:bg-[#856748] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มมุมมองบูมใหม่</span>
              </button>
            </div>
          </div>

          {/* Presets Cards List */}
          <div className="space-y-3">
            {presets.map((preset, idx) => (
              <div
                key={preset.id}
                className={`p-4 rounded-xl border transition-all ${
                  preset.active 
                    ? 'bg-white border-[#d7c8b2] shadow-xs' 
                    : 'bg-zinc-50 border-zinc-200 opacity-60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
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
                    </div>

                    <h3 className="text-sm font-bold font-editorial text-[#463629]">
                      {preset.name}
                    </h3>
                    <p className="text-xs text-[#6f5a45] leading-relaxed line-clamp-2">
                      {preset.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
                      {preset.neo4jUrl ? (
                        <a
                          href={preset.neo4jUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#9c7d5c] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
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

                  <div className="flex items-center gap-1.5 shrink-0 justify-end border-t md:border-t-0 pt-2 md:pt-0">
                    <button
                      onClick={() => handleMoveBloom(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-[#6f5a45] hover:bg-[#ece4d4] rounded-lg disabled:opacity-30 cursor-pointer"
                      title="เลื่อนขึ้น"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveBloom(idx, 'down')}
                      disabled={idx === presets.length - 1}
                      className="p-1.5 text-[#6f5a45] hover:bg-[#ece4d4] rounded-lg disabled:opacity-30 cursor-pointer"
                      title="เลื่อนลง"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleBloomActive(preset)}
                      className={`p-1.5 rounded-lg cursor-pointer ${
                        preset.active ? 'text-emerald-700 hover:bg-emerald-50' : 'text-zinc-500 hover:bg-zinc-100'
                      }`}
                      title={preset.active ? 'ปิดการแสดงผล' : 'เปิดการแสดงผล'}
                    >
                      {preset.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditBloomModal(preset)}
                      className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                      title="แก้ไขมุมมองบูมนี้"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBloom(preset)}
                      className="p-1.5 text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="ลบมุมมองบูมนี้"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* MODAL 1: ADD/EDIT IMAGE KNOWLEDGE GRAPH */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#d7c8b2] shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#d7c8b2]/60 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#9c7d5c]" />
                <h3 className="font-editorial font-bold text-base text-[#463629]">
                  {editingImage ? 'แก้ไขแผนภาพกราฟความรู้ (Edit Image Graph)' : 'เพิ่มแผนภาพกราฟความรู้ใหม่ (Add Image Graph)'}
                </h3>
              </div>
              <button onClick={() => setIsImageModalOpen(false)} className="p-1 text-[#6f5a45] hover:text-[#463629] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveImage} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">ชื่อแผนภาพกราฟความรู้ (Title) *</label>
                <input
                  type="text"
                  required
                  value={imgTitle}
                  onChange={e => setImgTitle(e.target.value)}
                  placeholder="เช่น มหาจักรวาลกราฟความรู้สยาม: The Living Memory Universe"
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">คำโปรยสั้น (Subtitle)</label>
                <input
                  type="text"
                  value={imgSubtitle}
                  onChange={e => setImgSubtitle(e.target.value)}
                  placeholder="เช่น แผนผังองค์ความรู้เชิงความหมายเชื่อมโยง 1,574 พิพิธภัณฑ์"
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">URL รูปภาพแผนภาพกราฟความรู้ *</label>
                <input
                  type="text"
                  required
                  value={imgUrl}
                  onChange={e => setImgUrl(e.target.value)}
                  placeholder="/assets/images/... หรือ https://..."
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
                
                {/* Image options */}
                <div className="pt-1.5 flex flex-wrap gap-1.5">
                  {PRESET_KG_IMAGE_OPTIONS.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => setImgUrl(opt.url)}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors cursor-pointer ${
                        imgUrl === opt.url ? 'bg-[#9c7d5c] text-white border-[#9c7d5c]' : 'bg-[#fffdf7] text-[#463629] border-[#d7c8b2]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {imgUrl && (
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-black/90 border border-[#d7c8b2]">
                  <img src={imgUrl} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">คำอธิบายภาพรวม (Description)</label>
                <textarea
                  rows={3}
                  value={imgDescription}
                  onChange={e => setImgDescription(e.target.value)}
                  placeholder="อธิบายโครงสร้างและมิติความเชื่อมโยงในแผนภาพนี้..."
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">
                  รายละเอียดจัดหน้าข้อความสวยงาม (Formatted Text / Markdown)
                </label>
                <textarea
                  rows={5}
                  value={imgFormattedText}
                  onChange={e => setImgFormattedText(e.target.value)}
                  placeholder="### 🏛️ เสาหลักโครงสร้าง ๔ มิติแห่งสยาม:&#10;1. **มิติโบราณคดี...**"
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">แท็ก (คั่นด้วยจุลภาค)</label>
                  <input
                    type="text"
                    value={imgTags}
                    onChange={e => setImgTags(e.target.value)}
                    placeholder="Knowledge Graph, 1574 พิพิธภัณฑ์"
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">เครดิตข้อมูล / แหล่งอ้างอิง</label>
                  <input
                    type="text"
                    value={imgCredit}
                    onChange={e => setImgCredit(e.target.value)}
                    placeholder="ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน)"
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={imgActive}
                    onChange={e => setImgActive(e.target.checked)}
                    className="accent-[#9c7d5c] w-4 h-4"
                  />
                  <span className="font-semibold text-[#463629]">
                    เปิดใช้งานแผนภาพนี้ทันที (Active & Display First)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d7c8b2]/60">
                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="px-4 py-2 border border-[#d7c8b2] rounded-lg text-[#6f5a45]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#9c7d5c] text-white rounded-lg font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกแผนภาพ</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD/EDIT BLOOM PRESET */}
      {isBloomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#d7c8b2] shadow-2xl max-w-2xl w-full p-6 space-y-4 my-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#d7c8b2]/60 pb-3">
              <div className="flex items-center gap-2">
                <Network className="w-5 h-5 text-[#9c7d5c]" />
                <h3 className="font-editorial font-bold text-base text-[#463629]">
                  {editingPreset ? 'แก้ไขมุมมองบูมสำเร็จรูป (Edit Bloom Preset)' : 'เพิ่มมุมมองบูมสำเร็จรูปใหม่ (Add Bloom Preset)'}
                </h3>
              </div>
              <button onClick={() => setIsBloomModalOpen(false)} className="p-1 text-[#6f5a45] hover:text-[#463629] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBloom} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">ชื่อมุมมองบูมสำเร็จรูป (Bloom View Name) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="เช่น โบราณคดี & วัฒนธรรมบ้านเชียง"
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">คำอธิบายมิติความเชื่อมโยง *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="อธิบายมิติและคุณค่าของมุมมองความรู้นี้..."
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">ลิงก์เชื่อมต่อ Neo4j Bloom (URL)</label>
                <input
                  type="url"
                  value={neo4jUrl}
                  onChange={e => setNeo4jUrl(e.target.value)}
                  placeholder="https://bloom.neo4j.io/index.html?connectURL=..."
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#463629]">คำสั่ง Cypher Query (Neo4j)</label>
                <textarea
                  rows={2}
                  value={cypherQuery}
                  onChange={e => setCypherQuery(e.target.value)}
                  placeholder="MATCH (m:Museum)-[r:HAS_SUBJECT]->(s:Subject) RETURN m, r, s LIMIT 60"
                  className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">รูปแบบการจัดวาง (Layout)</label>
                  <select
                    value={layout}
                    onChange={e => setLayout(e.target.value)}
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  >
                    <option value="cose">CoSE (แรงดึงดูดฟิสิกส์ - ธรรมชาติ)</option>
                    <option value="concentric">Concentric (วงกลมศูนย์กลางซ้อนชั้น)</option>
                    <option value="circle">Circle (วงกลมล้อมรอบ)</option>
                    <option value="breadthfirst">Breadthfirst (โครงสร้างลำดับชั้น)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">ธีมสี (Bloom Palette)</label>
                  <select
                    value={colorTheme}
                    onChange={e => setColorTheme(e.target.value)}
                    className="w-full p-2 bg-[#fffdf7] border border-[#d7c8b2] rounded-lg"
                  >
                    {COLOR_THEMES.map(theme => (
                      <option key={theme.id} value={theme.id}>{theme.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="font-semibold text-[#463629]">หัวเรื่องที่ต้องการโฟกัส (Focus Subject)</label>
                  <input
                    type="text"
                    value={focusSubject}
                    onChange={e => setFocusSubject(e.target.value)}
                    placeholder="เช่น โบราณคดี, ผ้าทอ"
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
                    <span className="font-semibold text-[#463629]">เปิดใช้งานมุมมองนี้ทันที</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#d7c8b2]/60">
                <button
                  type="button"
                  onClick={() => setIsBloomModalOpen(false)}
                  className="px-4 py-2 border border-[#d7c8b2] rounded-lg text-[#6f5a45]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#9c7d5c] text-white rounded-lg font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกมุมมองบูม</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
