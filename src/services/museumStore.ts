import initialMuseumsRaw from '../data/museumsData.json';
import initialLocalLivingMuseumsRaw from '../data/localLivingMuseums.json';
import initialSubjectsRaw from '../data/subjectsData.json';
import type { 
  Museum, 
  SubjectItem, 
  SiteSettings, 
  AuditLog, 
  DataQualityReport,
  GraphNode,
  GraphEdge,
  BannerSlide,
  GraphBloomPreset,
  KnowledgeGraphImage,
  MascotConfig,
  MascotFaq,
  UserInquiry,
  MascotPosition,
  LocalLivingCategory,
  LocalLivingTaxonomyConfig,
  HeaderConfig,
  NavMenuItem,
  NavDropdownItem,
  CreatorProfile,
  ContactPageConfig
} from '../types/museum';
import { db, doc, setDoc, deleteDoc, getDocs, collection } from './firebase';

export const getMascotSizePixels = (size: MascotConfig['size']): number => {
  if (typeof size === 'number' && Number.isFinite(size)) {
    return Math.max(48, Math.min(280, size));
  }
  if (size === 'normal') return 144;
  if (size === 'extra-large') return 276;
  return 208;
};

const STORAGE_KEYS = {
  MUSEUMS_OVERRIDE: 'museum_atlas_museums_v1',
  SUBJECTS_OVERRIDE: 'museum_atlas_subjects_v1',
  TRASH: 'museum_atlas_trash_v1',
  AUDIT_LOGS: 'museum_atlas_audit_v1',
  SETTINGS: 'museum_atlas_settings_v1',
  BANNERS: 'museum_atlas_banners_v1',
  BLOOM_PRESETS: 'museum_atlas_bloom_presets_v1',
  KG_IMAGES: 'museum_atlas_kg_images_v1',
  MASCOT_CONFIG: 'museum_atlas_mascot_config_v1',
  USER_INQUIRIES: 'museum_atlas_user_inquiries_v1',
  ADMIN_SESSION: 'museum_atlas_admin_session_v1',
  LOCAL_LIVING_TAXONOMY: 'museum_atlas_local_living_taxonomy_v1',
  HEADER_NAV_CONFIG: 'museum_atlas_header_nav_config_v1',
  CONTACT_PAGE_CONFIG: 'museum_atlas_contact_page_config_v1'
};

const DEFAULT_BANNERS: BannerSlide[] = [
  {
    id: 'banner_video_universe',
    title: 'Echoes of Siam',
    subtitle: 'ยินดีต้อนรับสู่ สยามเล่าขาน — ประตูสู่คลังมรดกวัฒนธรรมและแผนผังกราฟความรู้ภูมิปัญญาไทย 1,574 พิพิธภัณฑ์ทั่วประเทศ',
    tag: 'ยินดีต้อนรับสู่หน้าแรก (Welcome to Echoes of Siam)',
    imageUrl: '/assets/images/siam_cultural_archive_1792474260752.jpg',
    mediaType: 'video',
    isGenerativeLivingMemory: true,
    ctaText: '',
    ctaLink: '',
    secondaryCtaText: '',
    secondaryCtaLink: '',
    order: 1,
    active: true,
    badgeText: 'The Living Memory Universe'
  },
  {
    id: 'banner_emblem',
    title: 'Echoes of Siam',
    subtitle: 'สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์ — หน้าปกดิจิทัลอาร์ไคฟ์เชื่อมโยงรากเหง้าประวัติศาสตร์ วัฒนธรรม และภูมิปัญญาช่างสยาม 1,574 แห่งทั่วประเทศ',
    tag: 'ตราสัญลักษณ์และหน้าปกมรดกสยาม (Official Emblem & Heritage Cover)',
    imageUrl: '/assets/images/echoes_of_siam_banner.png',
    ctaText: 'เข้าสู่คลังพิพิธภัณฑ์ 1,574 แห่ง',
    ctaLink: 'museums',
    secondaryCtaText: 'เปิดกราฟความรู้',
    secondaryCtaLink: 'graph',
    order: 1,
    active: true,
    badgeText: 'อัตลักษณ์และหน้าปกทางการ'
  },
  {
    id: 'banner_welcome',
    title: 'ยินดีต้อนรับสู่ Echoes of Siam',
    subtitle: 'สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์ — รวบรวมและจัดจำแนกข้อมูลพิพิธภัณฑ์ 1,574 แห่งทั่ว 77 จังหวัด เชื่อมโยงรากเหง้าภูมิปัญญาไทยสู่โลกยุคใหม่',
    tag: 'แบนเนอร์ต้อนรับ (Welcome to Echoes of Siam)',
    imageUrl: '/assets/images/siam_museum_heritage_hall_1792473891438.jpg',
    ctaText: 'สำรวจสารบัญพิพิธภัณฑ์',
    ctaLink: 'museums',
    secondaryCtaText: 'เกี่ยวกับโครงการ',
    secondaryCtaLink: 'about',
    order: 2,
    active: true,
    badgeText: 'คลังข้อมูล 1,574 แห่ง'
  },
  {
    id: 'banner_about',
    title: 'สยามเล่าขาน: สถาปัตยกรรมองค์ความรู้และกราฟความรู้',
    subtitle: 'ค้นพบมิติความสัมพันธ์ของ 2,460 หัวเรื่องวัฒนธรรม ประวัติศาสตร์ท้องถิ่น และภูมิปัญญาช่างฝีมือ ผ่านโครงสร้างแผนผังองค์ความรู้เชิงความหมายระดับสถาบัน',
    tag: 'เกี่ยวกับเว็บไซต์ (About Platform & Graph)',
    imageUrl: '/assets/images/siam_cultural_archive_1792474260752.jpg',
    ctaText: 'เปิดกราฟความรู้',
    ctaLink: 'graph',
    secondaryCtaText: 'สำรวจดัชนีหัวเรื่อง',
    secondaryCtaLink: 'subjects',
    order: 3,
    active: true,
    badgeText: 'Discovery Graph 2,460 เรื่อง'
  },
  {
    id: 'banner_showcase',
    title: 'ตัวอย่างคลังข้อมูล: จากโบราณคดีบ้านเชียง สู่งานช่างหลวงและวิถีชน',
    subtitle: 'ตัวอย่างคลังข้อมูลและศิลปวัตถุล้ำค่า: เจาะลึกมรดกเครื่องปั้นดินเผา ภูมิปัญญาผ้าทอพื้นถิ่น ชุมชนชาติพันธุ์ และคลังโบราณวัตถุจัดแสดงกว่า 391 ชุมชนทั่วประเทศ',
    tag: 'ตัวอย่างข้อมูลและศิลปวัตถุจัดแสดง (Exhibition Showcase)',
    imageUrl: '/assets/images/thai_crafts_pottery_artifacts_1792473892186.jpg',
    ctaText: 'สำรวจหัวเรื่องภูมิปัญญา',
    ctaLink: 'subjects',
    secondaryCtaText: 'ดูสถิติภาพรวมข้อมูล',
    secondaryCtaLink: 'insights',
    order: 4,
    active: true,
    badgeText: 'ตัวอย่างข้อมูลจัดแสดง'
  }
];

const DEFAULT_BLOOM_PRESETS: GraphBloomPreset[] = [
  {
    id: 'bloom_mega_universe_all',
    name: 'มหาจักรวาลกราฟความรู้สยามสมบูรณ์ (Mega Bloom: All 1,574 Museums)',
    description: 'โครงข่ายกราฟความรู้ขนาดมหึมา (Full Mega Bloom) ประมวลผลจากข้อมูลพิพิธภัณฑ์ครบทั้ง 1,574 แห่งและ 2,460 หัวเรื่องภูมิปัญญาไทยทั่ว 77 จังหวัดอย่างแท้จริง พร้อมระบบลากจัดวางและตรึงตำแหน่งอิสระ',
    neo4jUrl: 'https://bloom.neo4j.io/index.html?connectURL=neo4j%2Bs%3A%2F%2Fdemo.neo4jlabs.com&perspective=echoes_of_siam_full_mega_universe',
    cypherQuery: 'MATCH (m:Museum)-[r:HAS_SUBJECT]->(s:Subject) RETURN m, r, s LIMIT 1574',
    layout: 'concentric',
    category: 'all',
    focusType: 'All',
    maxNodes: 1574,
    badgeText: 'ชุดข้อมูลครบ 1,574 แห่ง',
    colorTheme: 'gold',
    active: true,
    order: 0,
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'bloom_archeology',
    name: 'โบราณคดีและวัฒนธรรมก่อนประวัติศาสตร์บ้านเชียง',
    description: 'เครือข่ายความสัมพันธ์ของแหล่งโบราณคดี เครื่องปั้นดินเผา และศิลปวัตถุล้ำค่าย้อนหลังกว่า 3,000 ปี',
    neo4jUrl: 'https://bloom.neo4j.io/index.html?connectURL=neo4j%2Bs%3A%2F%2Fdemo.neo4jlabs.com&perspective=siam_heritage_archeology',
    cypherQuery: 'MATCH (m:Museum)-[r:HAS_SUBJECT]->(s:Subject {name: "โบราณคดี"}) RETURN m, r, s LIMIT 60',
    layout: 'cose',
    category: 'archeology',
    focusType: 'Subject',
    focusSubject: 'โบราณคดี',
    maxNodes: 60,
    badgeText: 'มรดกโลกและโบราณคดี',
    colorTheme: 'terracotta',
    active: true,
    order: 1,
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'bloom_regional',
    name: 'เครือข่ายพิพิธภัณฑ์ 77 จังหวัดทั่วไทย (Regional Hubs)',
    description: 'โครงสร้างการกระจายตัวของคลังพิพิธภัณฑ์ 1,574 แห่งทั่ว 77 จังหวัด เรียงศูนย์กลางจากเมืองหลักสู่ท้องถิ่น',
    neo4jUrl: 'https://bloom.neo4j.io/index.html?connectURL=neo4j%2Bs%3A%2F%2Fdemo.neo4jlabs.com&perspective=siam_regional_77provinces',
    cypherQuery: 'MATCH (m:Museum)-[r:LOCATED_AT]->(p:Province) RETURN m, r, p LIMIT 80',
    layout: 'concentric',
    category: 'geography',
    focusType: 'Museum',
    maxNodes: 80,
    badgeText: '77 จังหวัดทั่วประเทศ',
    colorTheme: 'gold',
    active: true,
    order: 2,
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'bloom_royal_arts',
    name: 'งานช่างหลวงและประณีตศิลป์ราชสำนัก (Royal Arts & Crafts)',
    description: 'มิติความเชื่อมโยงของงานช่างสิบหมู่ ประณีตศิลป์ เครื่องถม เครื่องทอง และคติช่างหลวงสยาม',
    neo4jUrl: 'https://bloom.neo4j.io/index.html?connectURL=neo4j%2Bs%3A%2F%2Fdemo.neo4jlabs.com&perspective=siam_royal_craftsmanship',
    cypherQuery: 'MATCH (m:Museum)-[r:HAS_SUBJECT]->(s:Subject) WHERE s.name IN ["งานช่างหลวง", "ประณีตศิลป์", "เครื่องทอง"] RETURN m, r, s LIMIT 70',
    layout: 'breadthfirst',
    category: 'royal',
    focusType: 'All',
    maxNodes: 70,
    badgeText: 'ศิลปวัฒนธรรมชั้นสูง',
    colorTheme: 'royal',
    active: true,
    order: 3,
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'bloom_living_heritage',
    name: 'วิถีชีวิต ชาติพันธุ์ และภูมิปัญญาผ้าทอพื้นถิ่น (Living Heritage)',
    description: 'สายสัมพันธ์ของมรดกมีชีวิต ภูมิปัญญาผ้าทอ วิถีชุมชนชาติพันธุ์ และวัฒนธรรมประเพณี 391 ชุมชน',
    neo4jUrl: 'https://bloom.neo4j.io/index.html?connectURL=neo4j%2Bs%3A%2F%2Fdemo.neo4jlabs.com&perspective=siam_indigenous_textiles',
    cypherQuery: 'MATCH (m:Museum)-[r:HAS_SUBJECT]->(s:Subject) WHERE s.name IN ["ผ้าทอ", "วิถีชีวิต", "ชาติพันธุ์"] RETURN m, r, s LIMIT 75',
    layout: 'circle',
    category: 'ethnology',
    focusType: 'Subject',
    focusSubject: 'ผ้าทอ',
    maxNodes: 75,
    badgeText: 'มรดกมีชีวิต',
    colorTheme: 'emerald',
    active: true,
    order: 4,
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'bloom_omni_hub',
    name: 'ภาพรวมเครือข่ายความรู้สยามแบบรอบด้าน (Omni Knowledge Hub)',
    description: 'การมองภาพรวมแบบเชื่อมโยงครบทุกมิติ สานต่อ 2,460 หัวเรื่องและประเภทพิพิธภัณฑ์แบบไร้รอยต่อ',
    neo4jUrl: 'https://bloom.neo4j.io/index.html?connectURL=neo4j%2Bs%3A%2F%2Fdemo.neo4jlabs.com&perspective=echoes_of_siam_omni',
    cypherQuery: 'MATCH (m:Museum)-[r]->(n) RETURN m, r, n LIMIT 100',
    layout: 'cose',
    category: 'all',
    focusType: 'All',
    maxNodes: 100,
    badgeText: 'เชื่อมโยง 2,460 เรื่อง',
    colorTheme: 'amber',
    active: true,
    order: 5,
    createdAt: '2026-10-20T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z'
  }
];

const DEFAULT_KG_IMAGES: KnowledgeGraphImage[] = [
  {
    id: 'kg_img_universe_main',
    title: 'มหาจักรวาลกราฟความรู้สยาม: The Living Memory Universe of Siam',
    subtitle: 'แผนผังองค์ความรู้เชิงความหมาย (Neo4j Bloom Knowledge Graph) เชื่อมโยง 1,574 พิพิธภัณฑ์ และ 2,460 หัวเรื่องวัฒนธรรม',
    imageUrl: '/assets/aistudio/bloom-visualisation-5_2bf66740.png',
    description: 'แผนผังกราฟความรู้มรดกวัฒนธรรมสยาม (Echoes of Siam Knowledge Graph) จากการประมวลผลและการแสดงผลโครงข่ายความสัมพันธ์ด้วย Neo4j Bloom เชื่อมโยงรากเหง้าภูมิปัญญาของชาติจาก 1,574 พิพิธภัณฑ์ทั่ว 77 จังหวัดเข้ากับ 2,460 หัวเรื่องทางวัฒนธรรม โครงสร้างแผนผังนี้จำลองมิติความสัมพันธ์แบบโครงข่ายประสาทแห่งความทรงจำ (Living Memory Universe) ที่เปิดโอกาสให้สำรวจความเชื่อมโยงข้ามยุคสมัย ข้ามสายสกุลช่าง และข้ามกลุ่มชาติพันธุ์อย่างอิสระ',
    formattedText: `### 🏛️ เสาหลักโครงสร้าง ๔ มิติแห่งสยาม:
1. **มิติโบราณคดีและก่อนประวัติศาสตร์ (Archaeological Foundation):** สายสัมพันธ์จากยุคก่อนประวัติศาสตร์บ้านเชียง ลพบุรี สุโขทัย สู่รัตนโกสินทร์
2. **มิติประณีตศิลป์และงานช่างหลวง (Royal Craftsmanship):** งานช่างสิบหมู่ เครื่องถม เครื่องทอง และสถาปัตยกรรมพระราชวัง
3. **มิติวิถีชีวิตและชาติพันธุ์ (Living Ethnology):** ภูมิปัญญาผ้าทอ เครื่องมือประมง วัฒนธรรมชุมชน ๓๙๑ แห่ง
4. **มิติการกระจายตัว ๗๗ จังหวัด (Regional Geo-Network):** การเชื่อมต่อของพิพิธภัณฑ์ท้องถิ่นสู่อัตลักษณ์เมืองหลัก`,
    highlights: [
      { title: 'โบราณคดี & ก่อนประวัติศาสตร์', detail: 'เชื่อมโยง 180+ แหล่งโบราณคดีสำคัญและเครื่องปั้นดินเผาอายุ 3,000 ปี', tag: 'Archaeology' },
      { title: 'งานช่างสิบหมู่ & ประณีตศิลป์', detail: 'เครือข่ายศิลปวัฒนธรรมหลวง เครื่องทอง งานประดับมุก และช่างแกะสลัก', tag: 'Royal Crafts' },
      { title: 'วิถีชาติพันธุ์ & มรดกผ้าทอ', detail: 'สืบสานภูมิปัญญาผ้าทอพื้นถิ่น ชุมชนไท-ยวน ไทลื้อ และชนเผ่าพื้นถิ่น', tag: 'Living Heritage' },
      { title: 'เครือข่าย 77 จังหวัด', detail: 'กระจายตัวครอบคลุม 1,574 แหล่งเรียนรู้จากเมืองหลวงสู่ท้องถิ่นลึก', tag: 'Geography' }
    ],
    tags: ['The Living Memory Universe', 'Knowledge Graph', '1,574 พิพิธภัณฑ์', '2,460 หัวเรื่อง', 'ศูนย์มานุษยวิทยาสิรินธร'],
    active: true,
    order: 1,
    credit: 'ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน) & Echoes of Siam Research Engine',
    updatedAt: '2026-10-20T00:00:00.000Z'
  },
  {
    id: 'kg_img_universe_constellation',
    title: 'กลุ่มดาวแห่งความทรงจำสยาม: The Living Memory Universe Constellation',
    subtitle: 'แผนภาพโครงข่ายกลุ่มดาวความรู้มรดกวัฒนธรรม เชื่อมโยงรากเหง้าภูมิปัญญาไทยข้ามยุคสมัยและกลุ่มชาติพันธุ์',
    imageUrl: '/assets/aistudio/image_451791c3.png',
    description: 'แผนภาพความสัมพันธ์ระดับมหาภาค แสดงการรวมกลุ่มขององค์ความรู้ (Cluster Constellation) ในรูปแบบกลุ่มดาวแห่งความทรงจำ (Living Memory Universe) ของพิพิธภัณฑ์และหัวเรื่องวัฒนธรรม ๗๗ จังหวัด แต่ละคลัสเตอร์แทนสายธารภูมิปัญญาสำคัญ เช่น ประณีตศิลป์ ช่างสิบหมู่ โบราณคดี ผ้าทอ และวิถีชุมชนท้องถิ่น',
    formattedText: `### 🌌 สถาปัตยกรรมกลุ่มดาวความรู้ (Knowledge Constellation Architecture):
1. **ศูนย์กลางมหาปัญญา (Central Wisdom Nexus):** แกนกลางเชื่อมโยงรากเหง้าประวัติศาสตร์ชาติและพิพิธภัณฑ์หลัก
2. **กลุ่มดาวภูมิปัญญาช่าง (Artisanal Craft Clusters):** งานช่างหลวงและงานประณีตศิลป์ราชสำนัก
3. **กลุ่มดาวมรดกวิถีชน (Ethnological Clusters):** ผ้าทอพื้นถิ่นและการดำรงชีวิตริมสายน้ำ
4. **กลุ่มดาวโบราณคดี (Archaeological Field Clusters):** แหล่งขุดค้นและแหล่งเรียนรู้ก่อนประวัติศาสตร์`,
    highlights: [
      { title: 'คลัสเตอร์ศูนย์กลาง', detail: 'แกนกลางเชื่อมโยงพิพิธภัณฑ์ระดับชาติและหัวเรื่องหลัก', tag: 'Central Nexus' },
      { title: 'คลัสเตอร์ภูมิปัญญาช่าง', detail: 'เครือข่ายประณีตศิลป์ ช่างสิบหมู่ และศิลปกรรมหลวง', tag: 'Artisanal Cluster' },
      { title: 'คลัสเตอร์วิถีชาติพันธุ์', detail: 'กลุ่มดาวผ้าทอพื้นถิ่น ชุมชนไท-ยวน และลุ่มน้ำ', tag: 'Living Cluster' },
      { title: 'คลัสเตอร์แหล่งโบราณคดี', detail: 'จุดเชื่อมต่อแหล่งโบราณคดีสำคัญกระจายทั่ว ๗๗ จังหวัด', tag: 'Archaeology Cluster' }
    ],
    tags: ['The Living Memory Universe', 'Constellation Graph', '1,574 พิพิธภัณฑ์', '2,460 หัวเรื่อง', 'Cluster Visualization'],
    active: true,
    order: 2,
    credit: 'ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน) & Echoes of Siam Research Engine',
    updatedAt: '2026-10-28T00:00:00.000Z'
  }
];

const DEFAULT_MASCOT_CONFIG: MascotConfig = {
  enabled: true,
  name: 'MIUMIU',
  subtitle: 'ผู้ช่วยสืบค้นมรดกและกราฟความรู้สยาม',
  greeting: 'สวัสดีครับ! ผมคือ MIUMIU ยินดีพาสำรวจคลังพิพิธภัณฑ์ 1,574 แห่งและกราฟความรู้สยามเล่าขานครับ มีข้อสงสัยเรื่องมรดกหรือหัวเรื่องไหน ถามผมได้เลยนะครับ!',
  currentPose: '/assets/mascot/IMG_8169.PNG',
  size: 208,
  position: { bottom: 28, right: 28, isCustomDrag: false },
  stateImages: {
    idle: '/assets/mascot/IMG_8169.PNG',
    greeting: '/assets/mascot/IMG_8172.PNG',
    chat: '/assets/mascot/IMG_8170.PNG',
    typing: '/assets/mascot/IMG_8179.PNG',
    thinking: '/assets/mascot/IMG_8176.PNG',
    listening: '/assets/mascot/IMG_8171.PNG',
    presenting: '/assets/mascot/IMG_8173.PNG',
    happy: '/assets/mascot/IMG_8175.PNG',
    surprised: '/assets/mascot/IMG_8187.PNG',
    confused: '/assets/mascot/IMG_8186.PNG',
    success: '/assets/mascot/IMG_8169.PNG',
    error: '/assets/mascot/IMG_8188.PNG',
    sleeping: '/assets/mascot/IMG_8189.PNG',
    goodbye: '/assets/mascot/IMG_8188.PNG'
  },
  suggestedPrompts: [
    'แนะนำพิพิธภัณฑ์เด่นที่ไม่ควรพลาด',
    'กราฟความรู้สยาม (Knowledge Graph) คืออะไร?',
    'ค้นหาพิพิธภัณฑ์เกี่ยวกับเครื่องปั้นดินเผาและบ้านเชียง',
    'มีพิพิธภัณฑ์ไหนบ้างที่มีข้อมูลผ้าทอโบราณ?',
    'แนะนำพิพิธภัณฑ์ในกรุงเทพมหานคร'
  ],
  speechBubbleEnabled: true,
  soundEnabled: true,
  customFaqs: [
    {
      id: 'faq_1',
      question: 'กราฟความรู้สยามคืออะไร?',
      answer: 'กราฟความรู้สยาม (Echoes of Siam Knowledge Graph) เป็นแผนผังองค์ความรู้ที่เชื่อมโยง 1,574 พิพิธภัณฑ์เข้ากับ 2,460 หัวเรื่องทางวัฒนธรรม เช่น โบราณคดี ช่างสิบหมู่ หรือวิถีชุมชน ช่วยให้คุณค้นพบความสัมพันธ์ที่คาดไม่ถึงครับ!',
      category: 'ความรู้',
      targetTab: 'graph'
    },
    {
      id: 'faq_2',
      question: 'ค้นหาพิพิธภัณฑ์ในจังหวัดตนเองอย่างไร?',
      answer: 'คุณสามารถไปที่เมนู "พิพิธภัณฑ์" จากนั้นใช้ช่องค้นหาหรือตัวกรองจังหวัด 77 จังหวัดทั่วไทยเพื่อดูพิพิธภัณฑ์ใกล้ตัวได้ทันทีครับ!',
      category: 'การใช้งาน',
      targetTab: 'museums'
    }
  ]
};

const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: 'ทุกพิพิธภัณฑ์มีเรื่องราว ทุกหัวเรื่องมีความเชื่อมโยง',
  heroSubtitle: 'สำรวจพิพิธภัณฑ์ในประเทศไทย ค้นพบภูมิปัญญา ประวัติศาสตร์ และวัฒนธรรมผ่านหัวเรื่องและแผนผังองค์ความรู้ที่เชื่อมโยงเรื่องราวจากอดีตเข้าด้วยกัน',
  tagline: 'Echoes of Siam — สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์',
  featuredMuseumIds: ['sac_1', 'sac_2', 'sac_3', 'sac_5', 'sac_7', 'sac_10'],
  featuredSubjectIds: [],
  announcement: 'Echoes of Siam: ฐานข้อมูลพิพิธภัณฑ์ 1,574 แห่งทั่วประเทศจากศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน)',
  announcementEnabled: true,
  updatedAt: new Date().toISOString()
};

export const DEFAULT_LOCAL_LIVING_TAXONOMY: LocalLivingTaxonomyConfig = {
  mainTitle: 'วิถีชีวิตท้องถิ่น',
  mainSubtitle: 'ดัชนีหัวเรื่องภูมิปัญญาและวิถีชนสยาม จำแนกตาม 9 ภาคส่วนการจัดการพิพิธภัณฑ์',
  mainDescription: `สำรวจพิพิธภัณฑ์ 391 แห่งที่เกี่ยวข้องกับวิถีชีวิตท้องถิ่น จำแนกตาม 9 ประเภทจากชุดข้อมูลที่คัดกรองแล้ว`,
  badgeText: 'ดัชนีวิถีชีวิตท้องถิ่น 9 ประเภท',
  updatedAt: '2026-10-28T00:00:00.000Z',
  categories: [
    {
      id: 'type_temple',
      name: 'วัด',
      title: 'พิพิธภัณฑ์วัด & มรดกพุทธศิลป์',
      subtitle: 'คลังมรดกพุทธธรรม พระพุทธรูปโบราณ คัมภีร์ใบลาน จิตรกรรมฝาผนัง และเครื่องสังฆทานวิถีพุทธ',
      iconName: 'Landmark',
      colorTheme: 'amber',
      order: 1,
      active: true,
      featuredSubjects: ['พระพุทธรูป', 'จิตรกรรมฝาผนัง', 'คัมภีร์ใบลาน', 'เครื่องทองเหลือง', 'ตาลปัตร', 'เครื่องเบญจรงค์']
    },
    {
      id: 'type_school',
      name: 'สถานศึกษา',
      title: 'พิพิธภัณฑ์สถานศึกษา & มหาวิทยาลัย',
      subtitle: 'ศูนย์วิจัยและรวบรวมองค์ความรู้ทางมานุษยวิทยา โบราณคดี ธรรมชาติวิทยา และหอประวัติศาสตร์ท้องถิ่น',
      iconName: 'GraduationCap',
      colorTheme: 'indigo',
      order: 2,
      active: true,
      featuredSubjects: ['ประวัติศาสตร์ท้องถิ่น', 'โบราณคดี', 'ธรรมชาติวิทยา', 'วัฒนธรรมล้านนา', 'เครื่องปั้นดินเผา', 'วิถีชีวิต']
    },
    {
      id: 'type_gov',
      name: 'หน่วยงานราชการ',
      title: 'พิพิธภัณฑ์หน่วยงานราชการ & ความทรงจำแผ่นดิน',
      subtitle: 'แหล่งจัดแสดงวิวัฒนาการการบริหาร การทหาร การแพทย์ เกษตรกรรม และความทรงจำของชาติ',
      iconName: 'Building2',
      colorTheme: 'teal',
      order: 3,
      active: true,
      featuredSubjects: ['การแพทย์แผนไทย', 'ยุทโธปกรณ์', 'ป่าไม้และสิ่งแวดล้อม', 'เกษตรกรรมโบราณ', 'เครื่องราชอิสริยาภรณ์']
    },
    {
      id: 'type_private',
      name: 'ส่วนบุคคล',
      title: 'พิพิธภัณฑ์ส่วนบุคคล & ของสะสมทรงคุณค่า',
      subtitle: 'ของสะสมโบราณทรงคุณค่า พระเครื่อง ของเก่าหายาก วิถีชีวิตย้อนยุค และความหลงใหลเฉพาะบุคคล',
      iconName: 'User',
      colorTheme: 'orange',
      order: 4,
      active: true,
      featuredSubjects: ['ของเก่าสะสม', 'พระเครื่อง', 'เครื่องเรือนไม้สัก', 'จักรยานโบราณ', 'นาฬิกาโบราณ', 'เครื่องแก้ว']
    },
    {
      id: 'type_local_gov',
      name: 'องค์กรปกครองส่วนท้องถิ่น',
      title: 'พิพิธภัณฑ์องค์กรปกครองส่วนท้องถิ่น',
      subtitle: 'หอประวัติศาสตร์เมือง วัฒนธรรมตำบล และการฟื้นฟูรากเหง้าโดย อบจ. อบต. และเทศบาล',
      iconName: 'Building',
      colorTheme: 'emerald',
      order: 5,
      active: true,
      featuredSubjects: ['ประวัติศาสตร์ชุมชน', 'เรือโบราณ', 'ผ้าซิ่นตีนจก', 'เครื่องจักสาน', 'วิถีลุ่มน้ำ', 'ประเพณีท้องถิ่น']
    },
    {
      id: 'type_community',
      name: 'ชุมชน',
      title: 'พิพิธภัณฑ์ชุมชน & ชาติพันธุ์',
      subtitle: 'จิตวิญญาณแห่งชาติพันธุ์ ภูมิปัญญาพื้นบ้าน ข้าวของเครื่องใช้ และประเพณีพิธีกรรมมีชีวิต',
      iconName: 'Users',
      colorTheme: 'green',
      order: 6,
      active: true,
      featuredSubjects: ['ชาติพันธุ์ไทลื้อ', 'ม้ง', 'กะเหรี่ยง', 'ผ้าทอมือพื้นเมือง', 'วิถีชาวนา', 'เครื่องดนตรีพื้นบ้าน', 'พิธีกรรม']
    },
    {
      id: 'type_business',
      name: 'องค์กรธุรกิจ',
      title: 'พิพิธภัณฑ์องค์กรธุรกิจ & พาณิชย์สยาม',
      subtitle: 'ประวัติการค้าขาย ธนาคาร อุตสาหกรรมดั้งเดิม การพิมพ์ ยาสูบ และวิวัฒนาการเศรษฐกิจสยาม',
      iconName: 'Briefcase',
      colorTheme: 'blue',
      order: 7,
      active: true,
      featuredSubjects: ['ประวัติการธนาคาร', 'เงินตราโบราณ', 'โรงงานยาสูบ', 'แท่นพิมพ์โบราณ', 'เครื่องจักรไอน้ำ', 'การค้าสำเภา']
    },
    {
      id: 'type_foundation',
      name: 'มูลนิธิและองค์กรไม่แสวงหากำไร',
      title: 'พิพิธภัณฑ์มูลนิธิ & สมาคม',
      subtitle: 'องค์กรสืบสานมรดกทางวัฒนธรรม ศิลปะร่วมสมัย อนุสรณ์สถานบุคคลสำคัญ และการกุศลเพื่อสังคม',
      iconName: 'HeartHandshake',
      colorTheme: 'purple',
      order: 8,
      active: true,
      featuredSubjects: ['ศิลปะร่วมสมัย', 'หอศิลป์', 'ชีวประวัติบุคคลสำคัญ', 'ภูมิปัญญาการแพทย์ทางเลือก', 'หัตถศิลป์เพื่อชุมชน']
    },
    {
      id: 'type_national',
      name: 'พิพิธภัณฑสถานแห่งชาติ',
      title: 'พิพิธภัณฑสถานแห่งชาติ',
      subtitle: 'สมบัติแห่งชาติ ศิลปะโบราณคดีชิ้นเอก โบราณวัตถุระดับมรดกโลก และมรดกประณีตศิลป์ราชสำนัก',
      iconName: 'Crown',
      colorTheme: 'ruby',
      order: 9,
      active: true,
      featuredSubjects: ['โบราณคดีก่อนประวัติศาสตร์', 'ประณีตศิลป์ราชสำนัก', 'ศิลาจารึก', 'เทวรูปสัมฤทธิ์', 'เครื่องทองสุโขทัย', 'พระพุทธรูปศรัทธา']
    }
  ]
};

export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  brandTitle: 'Echoes of Siam',
  brandSubtitle: 'สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์',
  brandEmblemUrl: '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png',
  searchButtonLabel: 'ค้นหา',
  searchShortcut: '⌘K',
  helpButtonLabel: 'ช่วยเหลือ',
  updatedAt: '2026-10-28T00:00:00.000Z',
  menuItems: [
    {
      id: 'nav_home',
      label: 'หน้าแรก',
      iconName: 'Home',
      targetAction: 'navigate',
      targetTab: 'home',
      hasDropdown: true,
      dropdownItems: [
        {
          id: 'sub_home_main',
          label: 'หน้าแรก (Home)',
          subLabel: 'หน้าปกและภาพรวมแพลตฟอร์ม',
          iconName: 'Home',
          targetTab: 'home',
          order: 1,
          active: true
        },
        {
          id: 'sub_home_insights',
          label: 'ภาพรวมข้อมูล (Insights)',
          subLabel: 'สถิติ 1,574 พิพิธภัณฑ์ และการวิเคราะห์',
          iconName: 'BarChart3',
          targetTab: 'insights',
          order: 2,
          active: true
        }
      ],
      order: 1,
      active: true,
      showOnMobile: true
    },
    {
      id: 'nav_museums',
      label: 'พิพิธภัณฑ์',
      iconName: 'Landmark',
      targetAction: 'navigate',
      targetTab: 'museums',
      badge: '1,574 แห่ง',
      badgeColor: 'amber',
      hasDropdown: true,
      dropdownItems: [
        {
          id: 'sub_mus_all',
          label: 'พิพิธภัณฑ์ทั้งหมด',
          subLabel: 'สำรวจคลังข้อมูล 1,574 แห่งทั่ว 77 จังหวัด',
          iconName: 'Landmark',
          targetTab: 'museums',
          order: 1,
          active: true
        },
        {
          id: 'sub_mus_temple',
          label: 'พิพิธภัณฑ์วัด',
          subLabel: '409 แห่ง มรดกพุทธศิลป์และวิถีธรรม',
          iconName: 'Landmark',
          targetTab: 'museums',
          targetMeta: { filterType: 'วัด' },
          order: 2,
          active: true
        },
        {
          id: 'sub_mus_national',
          label: 'พิพิธภัณฑสถานแห่งชาติ',
          subLabel: '42 แห่ง กรมศิลปากร โบราณวัตถุชิ้นเอก',
          iconName: 'Crown',
          targetTab: 'museums',
          targetMeta: { filterType: 'พิพิธภัณฑสถานแห่งชาติ' },
          order: 3,
          active: true
        },
        {
          id: 'sub_mus_community',
          label: 'พิพิธภัณฑ์ชุมชน & ท้องถิ่น',
          subLabel: '108 ชุมชนชาติพันธุ์และวิถีชนสยาม',
          iconName: 'Users',
          targetTab: 'museums',
          targetMeta: { filterType: 'ชุมชน' },
          order: 4,
          active: true
        }
      ],
      order: 2,
      active: true,
      showOnMobile: true
    },
    {
      id: 'nav_subjects',
      label: 'สำรวจหัวเรื่อง',
      iconName: 'Tag',
      targetAction: 'navigate',
      targetTab: 'subjects',
      badge: 'วิถีชีวิตท้องถิ่น',
      badgeColor: 'gold',
      hasDropdown: false,
      order: 3,
      active: true,
      showOnMobile: true
    },
    {
      id: 'nav_graph',
      label: 'กราฟความรู้',
      iconName: 'Network',
      targetAction: 'navigate',
      targetTab: 'graph',
      badge: 'Neo4j Bloom',
      badgeColor: 'indigo',
      hasDropdown: true,
      dropdownItems: [
        {
          id: 'sub_kg_image',
          label: 'แผนภาพกราฟหลัก (Image Graph)',
          subLabel: 'แผนผังองค์ความรู้หลัก & สไลด์ซูมภาพ',
          iconName: 'ImageIcon',
          targetTab: 'graph',
          targetMeta: { viewMode: 'image' },
          order: 1,
          active: true
        },
        {
          id: 'sub_kg_bloom',
          label: 'มุมมองบูมสำเร็จรูป (Neo4j Bloom)',
          subLabel: 'มุมมองคัดสรรและคำสั่ง Cypher',
          iconName: 'Sparkles',
          targetTab: 'graph',
          targetMeta: { viewMode: 'bloom' },
          order: 2,
          active: true
        },
        {
          id: 'sub_kg_interactive',
          label: 'ทดลองลากกราฟสด (Live Interactive)',
          subLabel: 'ลากขยับและตรึงตำแหน่งโหนดอิสระ',
          iconName: 'Network',
          targetTab: 'graph',
          targetMeta: { viewMode: 'interactive' },
          order: 3,
          active: true
        }
      ],
      order: 4,
      active: true,
      showOnMobile: true
    },
    {
      id: 'nav_about',
      label: 'เกี่ยวกับโครงการ',
      iconName: 'BookOpen',
      targetAction: 'navigate',
      targetTab: 'about',
      hasDropdown: false,
      order: 5,
      active: true,
      showOnMobile: true
    },
    {
      id: 'nav_contact',
      label: 'ติดต่อเรา',
      iconName: 'Mail',
      targetAction: 'navigate',
      targetTab: 'contact',
      hasDropdown: false,
      order: 6,
      active: true,
      showOnMobile: true
    }
  ]
};

const DEFAULT_CONTACT_PAGE_CONFIG: ContactPageConfig = {
  heroTitle: 'ติดต่อเรา',
  heroSubtitle: 'ช่องทางการสื่อสาร เชื่อมโยง และแลกเปลี่ยนข้อมูลสารสนเทศพิพิธภัณฑ์ไทย',
  heroDescription: 'ยินดีต้อนรับสู่ศูนย์กลางการติดต่อโครงการ Echoes of Siam (สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์) หากท่านมีข้อสงสัย ข้อเสนอแนะ หรือต้องการร่วมเป็นส่วนหนึ่งของเครือข่ายพิพิธภัณฑ์ สามารถติดต่อเราได้ตามช่องทางด้านล่างนี้',
  organizationName: 'ศูนย์ประสานงานสารสนเทศมรดกวัฒนธรรม Echoes of Siam',
  address: 'เลขที่ ๒๐/๑ ถนนบรมราชชนนี แขวงตลิ่งชัน เขตตลิ่งชัน กรุงเทพมหานคร',
  province: 'กรุงเทพมหานคร',
  postalCode: '10170',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Sirindhorn+Anthropology+Centre&t=&z=15&ie=UTF8&iwloc=&output=embed',
  mapCoordinates: '13.7891° N, 100.4567° E',
  transportationGuide: 'เดินทางสะดวกด้วยรถโดยสารประจำทางสาย 515, 556, 124, 125 หรือลงสถานีรถไฟชานเมืองสายสีแดง (สถานีตลิ่งชัน) ต่อรถสาธารณะประมาณ 5 นาที',
  openingHours: 'วันจันทร์ – วันศุกร์ เวลา 08:30 – 16:30 น. (เว้นวันหยุดราชการและวันหยุดนักขัตฤกษ์)',
  telephone: '02-880-9429 ต่อ 3300',
  hotline: '081-987-6543 (ฝ่ายเทคนิคและฐานข้อมูล)',
  email: 'Benyapabaibuaw@gmail.com',
  contactEmailSecondary: 'echoes.of.siam.contact@gmail.com',
  lineId: '@echoesofsiam',
  lineQrCodeUrl: '',
  facebookUrl: 'https://facebook.com/EchoesOfSiamOfficial',
  facebookPageName: 'Echoes of Siam — สยามเล่าขาน',
  youtubeUrl: 'https://youtube.com',
  websiteUrl: 'https://sac.or.th',
  creatorsSectionTitle: 'ผู้สร้างและพัฒนาระบบ (System Creators & Team)',
  creatorsSectionSubtitle: 'คณะผู้สร้างสรรค์นวัตกรรมดิจิทัล สถาปัตยกรรมกราฟความรู้ และการสืบสานมรดกภูมิปัญญาไทย',
  creatorsSectionDescription: 'แพลตฟอร์มนี้ริเริ่มและพัฒนาขึ้นด้วยความตั้งใจที่จะเชื่อมโยงข้อมูลพิพิธภัณฑ์ 1,574 แห่งและภูมิปัญญา 2,460 เรื่องสู่คนรุ่นใหม่ โดยอาศัยเทคโนโลยีกราฟความรู้และการออกแบบเชิงสร้างสรรค์',
  creators: [
    {
      id: 'creator_lead_1',
      name: 'เบญญาภา ใบกล้า (Benyapabaibuaw)',
      role: 'ผู้สร้างและหัวหน้านักพัฒนาระบบ (Lead Creator & System Architect)',
      affiliation: 'คณะทำงานเทคโนโลยีสารสนเทศมรดกวัฒนธรรมดิจิทัล',
      bio: 'ผู้ออกแบบสถาปัตยกรรมระบบกราฟความรู้ (Knowledge Graph Architecture), โครงสร้างการเชื่อมโยงข้อมูล 1,574 พิพิธภัณฑ์ และส่วนต่อประสานผู้ใช้สยามเล่าขาน เพื่อเปิดโลกทัศน์มรดกไทยสู่อนาคต',
      imageUrl: '/assets/aistudio/Echoes_of_Siam_Heritage_Emblem_b1d3a246.png',
      email: 'Benyapabaibuaw@gmail.com',
      phone: '081-234-5678',
      websiteUrl: 'https://github.com',
      socialLinks: {
        facebook: 'https://facebook.com',
        line: '@benyapa_lead',
        github: 'https://github.com'
      },
      order: 1,
      active: true
    }
  ],
  formEnabled: true,
  formTitle: 'ส่งข้อความถึงทีมงาน / สอบถามข้อมูลเพิ่มเติม',
  formSubtitle: 'กรอกแบบฟอร์มด้านล่างเพื่อติดต่อทีมงาน ข้อความจะถูกส่งตรงไปยังแผงควบคุมระบบของผู้ดูแลทันที',
  formSuccessMessage: 'ขอบคุณสำหรับข้อความของท่าน! ทีมงานได้รับข้อมูลแล้วและจะติดต่อกลับโดยเร็วที่สุด',
  updatedAt: new Date().toISOString()
};

class MuseumStore {
  private museums: Museum[] = [];
  private localLivingMuseums: Museum[] = initialLocalLivingMuseumsRaw as Museum[];
  private subjects: SubjectItem[] = [];
  private trash: Museum[] = [];
  private auditLogs: AuditLog[] = [];
  private banners: BannerSlide[] = [];
  private bloomPresets: GraphBloomPreset[] = [];
  private kgImages: KnowledgeGraphImage[] = [];
  private mascotConfig: MascotConfig = DEFAULT_MASCOT_CONFIG;
  private userInquiries: UserInquiry[] = [];
  private localLivingTaxonomy: LocalLivingTaxonomyConfig = DEFAULT_LOCAL_LIVING_TAXONOMY;
  private headerConfig: HeaderConfig = DEFAULT_HEADER_CONFIG;
  private contactConfig: ContactPageConfig = DEFAULT_CONTACT_PAGE_CONFIG;
  private settings: SiteSettings = DEFAULT_SETTINGS;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initStore();
  }

  private initStore() {
    try {
      // 1. Load museums
      const savedMuseums = localStorage.getItem(STORAGE_KEYS.MUSEUMS_OVERRIDE);
      if (savedMuseums) {
        this.museums = JSON.parse(savedMuseums);
      } else {
        this.museums = (initialMuseumsRaw as Museum[]);
      }

      // 2. Load subjects
      const savedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS_OVERRIDE);
      if (savedSubjects) {
        this.subjects = JSON.parse(savedSubjects);
      } else {
        this.subjects = (initialSubjectsRaw as SubjectItem[]);
      }

      // 3. Load trash
      const savedTrash = localStorage.getItem(STORAGE_KEYS.TRASH);
      if (savedTrash) {
        this.trash = JSON.parse(savedTrash);
      }

      // 4. Load audit logs
      const savedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (savedAudit) {
        this.auditLogs = JSON.parse(savedAudit);
      } else {
        this.auditLogs = [
          {
            id: 'log_initial',
            action: 'IMPORT',
            targetCollection: 'museums',
            targetId: 'all_1574',
            details: 'นำเข้าชุดข้อมูลตั้งต้น 1,574 ระเบียนพิพิธภัณฑ์จากศูนย์มานุษยวิทยาสิรินธร',
            adminEmail: 'system@sac.or.th',
            timestamp: '2020-12-14T13:20:00.000Z'
          }
        ];
      }

      // 5. Load settings
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
      }

      // 6. Load banners
      const savedBanners = localStorage.getItem(STORAGE_KEYS.BANNERS);
      if (savedBanners) {
        const parsed = JSON.parse(savedBanners);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          const loaded = parsed.map((b: BannerSlide) => ({
            ...b,
            imageUrl: b.imageUrl?.replace('/src/assets/images/', '/assets/images/') || b.imageUrl
          }));
          // Ensure the official video banner and Echoes of Siam banner are updated and included
          let finalBanners = loaded.map((b: BannerSlide) => {
            if (b.id === 'banner_video_universe') {
              return {
                ...b,
                title: 'Echoes of Siam',
                subtitle: 'ยินดีต้อนรับสู่ สยามเล่าขาน — ประตูสู่คลังมรดกวัฒนธรรมและแผนผังกราฟความรู้ภูมิปัญญาไทย 1,574 พิพิธภัณฑ์ทั่วประเทศ',
                tag: 'ยินดีต้อนรับสู่หน้าแรก (Welcome to Echoes of Siam)',
                ctaText: '',
                ctaLink: '',
                secondaryCtaText: '',
                secondaryCtaLink: '',
                badgeText: 'The Living Memory Universe'
              };
            }
            return b;
          });
          if (!finalBanners.some((b: BannerSlide) => b.id === 'banner_video_universe')) {
            finalBanners = [DEFAULT_BANNERS[0], ...finalBanners];
          }
          if (!finalBanners.some((b: BannerSlide) => b.imageUrl?.includes('echoes_of_siam_banner') || b.id === 'banner_emblem')) {
            finalBanners = [DEFAULT_BANNERS[1], ...finalBanners];
          }
          this.banners = finalBanners;
        } else {
          this.banners = DEFAULT_BANNERS;
        }
      } else {
        this.banners = DEFAULT_BANNERS;
      }

      // 7. Load Bloom Presets (Clean and purge any preset containing 'เทส' or 'test')
      const savedBloom = localStorage.getItem(STORAGE_KEYS.BLOOM_PRESETS);
      if (savedBloom) {
        try {
          const parsed = JSON.parse(savedBloom);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Filter out all test presets as requested
            const cleanPresets = parsed.filter(p => {
              const n = (p.name || '').toLowerCase();
              const id = (p.id || '').toLowerCase();
              const d = (p.description || '').toLowerCase();
              return !n.includes('เทส') && !n.includes('test') && !n.includes('ทดสอบ') &&
                     !id.includes('test') && !d.includes('เทส');
            });
            const hasMega = cleanPresets.some(p => p.id === 'bloom_mega_universe_all');
            this.bloomPresets = hasMega 
              ? cleanPresets 
              : [DEFAULT_BLOOM_PRESETS[0], ...cleanPresets];
          } else {
            this.bloomPresets = DEFAULT_BLOOM_PRESETS;
          }
        } catch {
          this.bloomPresets = DEFAULT_BLOOM_PRESETS;
        }
      } else {
        this.bloomPresets = DEFAULT_BLOOM_PRESETS;
      }

      // 8. Load Knowledge Graph Images
      const savedKgImages = localStorage.getItem(STORAGE_KEYS.KG_IMAGES);
      if (savedKgImages) {
        try {
          const parsed = JSON.parse(savedKgImages);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.kgImages = parsed.map((img: KnowledgeGraphImage) => {
              if (img.id === 'kg_img_universe_main' && (!img.imageUrl || img.imageUrl.includes('siam_cultural_archive'))) {
                return {
                  ...img,
                  imageUrl: '/assets/aistudio/bloom-visualisation-5_2bf66740.png',
                  credit: 'ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน) & Echoes of Siam Research Engine (Neo4j Bloom Visualization)'
                };
              }
              return img;
            });
            if (!this.kgImages.some(img => img.id === 'kg_img_universe_constellation')) {
              this.kgImages.push(DEFAULT_KG_IMAGES[1]);
            }
            localStorage.setItem(STORAGE_KEYS.KG_IMAGES, JSON.stringify(this.kgImages));
          } else {
            this.kgImages = DEFAULT_KG_IMAGES;
          }
        } catch {
          this.kgImages = DEFAULT_KG_IMAGES;
        }
      } else {
        this.kgImages = DEFAULT_KG_IMAGES;
      }

      // 9. Load Mascot Configuration
      const savedMascot = localStorage.getItem(STORAGE_KEYS.MASCOT_CONFIG);
      if (savedMascot) {
        try {
          const parsed = JSON.parse(savedMascot);
          if (parsed.name === 'Nong Siam' || parsed.name === 'น้องสยาม' || !parsed.name) {
            parsed.name = 'MIUMIU';
          }
          if (parsed.greeting && (parsed.greeting.includes('Nong Siam') || parsed.greeting.includes('น้องสยาม'))) {
            parsed.greeting = parsed.greeting.replace(/Nong Siam|น้องสยาม/g, 'MIUMIU');
          }
          this.mascotConfig = { ...DEFAULT_MASCOT_CONFIG, ...parsed };
        } catch {
          this.mascotConfig = DEFAULT_MASCOT_CONFIG;
        }
      } else {
        this.mascotConfig = DEFAULT_MASCOT_CONFIG;
      }

      // 10. Load User Inquiries (Unanswered queries saved for Admin review)
      const savedInquiries = localStorage.getItem(STORAGE_KEYS.USER_INQUIRIES);
      if (savedInquiries) {
        try {
          this.userInquiries = JSON.parse(savedInquiries);
        } catch {
          this.userInquiries = [];
        }
      } else {
        this.userInquiries = [
          {
            id: 'inq_demo_1',
            query: 'พิพิธภัณฑ์ไหนในอยุธยาเปิดให้เข้าชมตอนกลางคืนบ้าง?',
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            status: 'pending',
            note: 'สอบถามรอบการเข้าชมยามค่ำคืน'
          },
          {
            id: 'inq_demo_2',
            query: 'มีนิทรรศการดาบโบราณและอาวุธไทยสมัยสมเด็จพระนเรศวรไหม?',
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
            status: 'pending'
          }
        ];
      }

      // 11. Load Local Living Taxonomy (วิถีชีวิตท้องถิ่น 9 ประเภท)
      const savedTaxonomy = localStorage.getItem(STORAGE_KEYS.LOCAL_LIVING_TAXONOMY);
      if (savedTaxonomy) {
        try {
          const parsed = JSON.parse(savedTaxonomy);
          this.localLivingTaxonomy = {
            ...DEFAULT_LOCAL_LIVING_TAXONOMY,
            ...parsed,
            mainDescription:
              typeof parsed.mainDescription === 'string'
                ? parsed.mainDescription.replace(/1,574/g, '391')
                : DEFAULT_LOCAL_LIVING_TAXONOMY.mainDescription
          };
        } catch {
          this.localLivingTaxonomy = DEFAULT_LOCAL_LIVING_TAXONOMY;
        }
      } else {
        this.localLivingTaxonomy = DEFAULT_LOCAL_LIVING_TAXONOMY;
      }

      // 12. Load Header Navigation Config (แถบเมนูด้านบน & ฟังก์ชั่นภาพรวม)
      const savedHeader = localStorage.getItem(STORAGE_KEYS.HEADER_NAV_CONFIG);
      if (savedHeader) {
        try {
          const parsed = JSON.parse(savedHeader);
          this.headerConfig = { ...DEFAULT_HEADER_CONFIG, ...parsed };
        } catch {
          this.headerConfig = DEFAULT_HEADER_CONFIG;
        }
      } else {
        this.headerConfig = DEFAULT_HEADER_CONFIG;
      }

      // 13. Load Contact Page & Creators Config (หน้าติดต่อเรา & ผู้สร้างระบบ)
      const savedContact = localStorage.getItem(STORAGE_KEYS.CONTACT_PAGE_CONFIG);
      if (savedContact) {
        try {
          const parsed = JSON.parse(savedContact);
          this.contactConfig = { ...DEFAULT_CONTACT_PAGE_CONFIG, ...parsed };
        } catch {
          this.contactConfig = DEFAULT_CONTACT_PAGE_CONFIG;
        }
      } else {
        this.contactConfig = DEFAULT_CONTACT_PAGE_CONFIG;
      }

      // 14. Background Firestore Sync
      this.initFirestoreSync();
    } catch (e) {
      console.error('Error initializing MuseumStore:', e);
      this.museums = (initialMuseumsRaw as Museum[]);
      this.subjects = (initialSubjectsRaw as SubjectItem[]);
      this.banners = DEFAULT_BANNERS;
      this.bloomPresets = DEFAULT_BLOOM_PRESETS;
      this.kgImages = DEFAULT_KG_IMAGES;
      this.mascotConfig = DEFAULT_MASCOT_CONFIG;
      this.localLivingTaxonomy = DEFAULT_LOCAL_LIVING_TAXONOMY;
      this.headerConfig = DEFAULT_HEADER_CONFIG;
      this.contactConfig = DEFAULT_CONTACT_PAGE_CONFIG;
    }
  }

  private async initFirestoreSync() {
    if (!db) return;
    try {
      const presetsSnap = await getDocs(collection(db, 'bloom_presets'));
      if (!presetsSnap.empty) {
        const cloudPresets: GraphBloomPreset[] = [];
        presetsSnap.forEach(d => {
          cloudPresets.push(d.data() as GraphBloomPreset);
        });
        if (cloudPresets.length > 0) {
          this.bloomPresets = cloudPresets.sort((a, b) => a.order - b.order);
          localStorage.setItem(STORAGE_KEYS.BLOOM_PRESETS, JSON.stringify(this.bloomPresets));
          this.notify();
        }
      } else {
        // Seed default bloom presets to cloud
        for (const preset of this.bloomPresets) {
          await setDoc(doc(db, 'bloom_presets', preset.id), preset);
        }
      }
    } catch (err) {
      console.warn('Firestore initial sync notice:', err);
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  private persistMuseums() {
    localStorage.setItem(STORAGE_KEYS.MUSEUMS_OVERRIDE, JSON.stringify(this.museums));
    this.notify();
  }

  private persistSubjects() {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS_OVERRIDE, JSON.stringify(this.subjects));
    this.notify();
  }

  private persistTrash() {
    localStorage.setItem(STORAGE_KEYS.TRASH, JSON.stringify(this.trash));
    this.notify();
  }

  private persistAudit() {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
    this.notify();
  }

  private persistSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    this.notify();
  }

  private persistBanners() {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(this.banners));
    this.notify();
  }

  private persistBloomPresets() {
    localStorage.setItem(STORAGE_KEYS.BLOOM_PRESETS, JSON.stringify(this.bloomPresets));
    this.notify();
    if (db) {
      for (const preset of this.bloomPresets) {
        setDoc(doc(db, 'bloom_presets', preset.id), preset).catch(() => {});
      }
    }
  }

  // --- BANNER SLIDES APIS ---

  public getBannerSlides(): BannerSlide[] {
    return [...this.banners].sort((a, b) => a.order - b.order);
  }

  public getActiveBannerSlides(): BannerSlide[] {
    return this.banners
      .filter(b => b.active)
      .sort((a, b) => a.order - b.order);
  }

  public createBannerSlide(data: Omit<BannerSlide, 'id'>, adminEmail = 'admin@gmail.com'): BannerSlide {
    const newId = `banner_${Date.now()}`;
    const newSlide: BannerSlide = {
      ...data,
      id: newId,
      order: data.order || this.banners.length + 1
    };
    this.banners.push(newSlide);
    this.logAudit({
      action: 'CREATE',
      targetCollection: 'banners',
      targetId: newId,
      details: `เพิ่มแบนเนอร์สไลด์ใหม่: ${newSlide.title}`,
      adminEmail
    });
    this.persistBanners();
    return newSlide;
  }

  public updateBannerSlide(id: string, updates: Partial<BannerSlide>, adminEmail = 'admin@gmail.com'): BannerSlide | undefined {
    const index = this.banners.findIndex(b => b.id === id);
    if (index === -1) return undefined;
    const updated: BannerSlide = {
      ...this.banners[index],
      ...updates
    };
    this.banners[index] = updated;
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'banners',
      targetId: id,
      details: `แก้ไขแบนเนอร์สไลด์: ${updated.title}`,
      adminEmail
    });
    this.persistBanners();
    return updated;
  }

  public deleteBannerSlide(id: string, adminEmail = 'admin@gmail.com'): boolean {
    const index = this.banners.findIndex(b => b.id === id);
    if (index === -1) return false;
    const [removed] = this.banners.splice(index, 1);
    this.logAudit({
      action: 'DELETE',
      targetCollection: 'banners',
      targetId: id,
      details: `ลบแบนเนอร์สไลด์: ${removed.title}`,
      adminEmail
    });
    this.persistBanners();
    return true;
  }

  public reorderBannerSlides(orderedIds: string[], adminEmail = 'admin@gmail.com'): void {
    orderedIds.forEach((id, idx) => {
      const slide = this.banners.find(b => b.id === id);
      if (slide) slide.order = idx + 1;
    });
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'banners',
      targetId: 'reorder',
      details: 'ปรับลำดับการแสดงผลแบนเนอร์สไลด์หน้าแรก',
      adminEmail
    });
    this.persistBanners();
  }

  public resetDefaultBanners(adminEmail = 'admin@gmail.com'): BannerSlide[] {
    this.banners = JSON.parse(JSON.stringify(DEFAULT_BANNERS));
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'banners',
      targetId: 'reset_defaults',
      details: 'คืนค่าแบนเนอร์สไลด์มาตรฐานตามที่กำหนด',
      adminEmail
    });
    this.persistBanners();
    return this.banners;
  }

  // --- KNOWLEDGE GRAPH BLOOM PRESETS APIS ---

  public getBloomPresets(): GraphBloomPreset[] {
    return [...this.bloomPresets].sort((a, b) => a.order - b.order);
  }

  public getActiveBloomPresets(): GraphBloomPreset[] {
    return this.bloomPresets
      .filter(p => p.active)
      .sort((a, b) => a.order - b.order);
  }

  public getBloomPresetById(id: string): GraphBloomPreset | undefined {
    return this.bloomPresets.find(p => p.id === id);
  }

  public createBloomPreset(
    data: Omit<GraphBloomPreset, 'id' | 'createdAt' | 'updatedAt'>,
    adminEmail = 'admin@gmail.com'
  ): GraphBloomPreset {
    const newId = `bloom_${Date.now()}`;
    const now = new Date().toISOString();
    const newPreset: GraphBloomPreset = {
      ...data,
      id: newId,
      order: data.order || this.bloomPresets.length + 1,
      createdAt: now,
      updatedAt: now
    };
    this.bloomPresets.push(newPreset);
    this.logAudit({
      action: 'CREATE',
      targetCollection: 'bloom_presets',
      targetId: newId,
      details: `เพิ่มมุมมองบูมกราฟสำเร็จรูป: ${newPreset.name}`,
      adminEmail
    });
    this.persistBloomPresets();
    return newPreset;
  }

  public updateBloomPreset(
    id: string,
    updates: Partial<GraphBloomPreset>,
    adminEmail = 'admin@gmail.com'
  ): GraphBloomPreset | undefined {
    const index = this.bloomPresets.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    const updated: GraphBloomPreset = {
      ...this.bloomPresets[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.bloomPresets[index] = updated;
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'bloom_presets',
      targetId: id,
      details: `แก้ไขมุมมองบูมกราฟสำเร็จรูป: ${updated.name}`,
      adminEmail
    });
    this.persistBloomPresets();
    return updated;
  }

  public deleteBloomPreset(id: string, adminEmail = 'admin@gmail.com'): boolean {
    const index = this.bloomPresets.findIndex(p => p.id === id);
    if (index === -1) return false;
    const [removed] = this.bloomPresets.splice(index, 1);
    this.logAudit({
      action: 'DELETE',
      targetCollection: 'bloom_presets',
      targetId: id,
      details: `ลบมุมมองบูมกราฟสำเร็จรูป: ${removed.name}`,
      adminEmail
    });
    this.persistBloomPresets();
    if (db) {
      deleteDoc(doc(db, 'bloom_presets', id)).catch(() => {});
    }
    return true;
  }

  public reorderBloomPresets(orderedIds: string[], adminEmail = 'admin@gmail.com'): void {
    orderedIds.forEach((id, idx) => {
      const preset = this.bloomPresets.find(p => p.id === id);
      if (preset) preset.order = idx + 1;
    });
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'bloom_presets',
      targetId: 'reorder',
      details: 'ปรับลำดับการแสดงผลมุมมองบูมกราฟสำเร็จรูป',
      adminEmail
    });
    this.persistBloomPresets();
  }

  public purgeTestBloomPresets(adminEmail = 'admin@gmail.com'): number {
    const initialCount = this.bloomPresets.length;
    this.bloomPresets = this.bloomPresets.filter(p => {
      const n = (p.name || '').toLowerCase();
      const id = (p.id || '').toLowerCase();
      const d = (p.description || '').toLowerCase();
      return !n.includes('เทส') && !n.includes('test') && !n.includes('ทดสอบ') &&
             !id.includes('test') && !d.includes('เทส');
    });
    if (this.bloomPresets.length === 0) {
      this.bloomPresets = JSON.parse(JSON.stringify(DEFAULT_BLOOM_PRESETS));
    }
    const removedCount = initialCount - this.bloomPresets.length;
    this.persistBloomPresets();
    this.logAudit({
      action: 'DELETE',
      targetCollection: 'bloom_presets',
      targetId: 'purge_tests',
      details: `ลบรายการบูมทดสอบที่ชื่อว่า 'เทส' จำนวน ${removedCount} รายการ`,
      adminEmail
    });
    return removedCount;
  }

  public resetDefaultBloomPresets(adminEmail = 'admin@gmail.com'): GraphBloomPreset[] {
    this.bloomPresets = JSON.parse(JSON.stringify(DEFAULT_BLOOM_PRESETS));
    this.persistBloomPresets();
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'bloom_presets',
      targetId: 'reset_defaults',
      details: 'คืนค่ามุมมองบูมกราฟมาตรฐาน 5 รูปแบบ',
      adminEmail
    });
    return this.bloomPresets;
  }

  // --- KNOWLEDGE GRAPH IMAGE APIS (กราฟความรู้แบบรูปภาพ - เมนหลัก) ---

  public getKnowledgeGraphImages(): KnowledgeGraphImage[] {
    return [...this.kgImages].sort((a, b) => a.order - b.order);
  }

  public getActiveKnowledgeGraphImages(): KnowledgeGraphImage[] {
    return this.kgImages
      .filter(img => img.active)
      .sort((a, b) => a.order - b.order);
  }

  public getKnowledgeGraphImageById(id: string): KnowledgeGraphImage | undefined {
    return this.kgImages.find(img => img.id === id);
  }

  public createKnowledgeGraphImage(
    data: Omit<KnowledgeGraphImage, 'id' | 'updatedAt'>,
    adminEmail = 'admin@gmail.com'
  ): KnowledgeGraphImage {
    const newId = `kg_img_${Date.now()}`;
    const now = new Date().toISOString();
    const newImage: KnowledgeGraphImage = {
      ...data,
      id: newId,
      order: data.order || this.kgImages.length + 1,
      updatedAt: now
    };
    this.kgImages.push(newImage);
    this.logAudit({
      action: 'CREATE',
      targetCollection: 'kg_images',
      targetId: newId,
      details: `เพิ่มแผนภาพกราฟความรู้: ${newImage.title}`,
      adminEmail
    });
    this.persistKgImages();
    return newImage;
  }

  public updateKnowledgeGraphImage(
    id: string,
    updates: Partial<KnowledgeGraphImage>,
    adminEmail = 'admin@gmail.com'
  ): KnowledgeGraphImage | undefined {
    const index = this.kgImages.findIndex(img => img.id === id);
    if (index === -1) return undefined;
    const updated: KnowledgeGraphImage = {
      ...this.kgImages[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.kgImages[index] = updated;
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'kg_images',
      targetId: id,
      details: `แก้ไขแผนภาพกราฟความรู้: ${updated.title}`,
      adminEmail
    });
    this.persistKgImages();
    return updated;
  }

  public deleteKnowledgeGraphImage(id: string, adminEmail = 'admin@gmail.com'): boolean {
    const index = this.kgImages.findIndex(img => img.id === id);
    if (index === -1) return false;
    const [removed] = this.kgImages.splice(index, 1);
    this.logAudit({
      action: 'DELETE',
      targetCollection: 'kg_images',
      targetId: id,
      details: `ลบแผนภาพกราฟความรู้: ${removed.title}`,
      adminEmail
    });
    this.persistKgImages();
    return true;
  }

  public reorderKnowledgeGraphImages(orderedIds: string[], adminEmail = 'admin@gmail.com'): void {
    orderedIds.forEach((id, idx) => {
      const img = this.kgImages.find(item => item.id === id);
      if (img) img.order = idx + 1;
    });
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'kg_images',
      targetId: 'reorder',
      details: 'ปรับลำดับการแสดงผลแผนภาพกราฟความรู้',
      adminEmail
    });
    this.persistKgImages();
  }

  public resetDefaultKnowledgeGraphImages(adminEmail = 'admin@gmail.com'): KnowledgeGraphImage[] {
    this.kgImages = JSON.parse(JSON.stringify(DEFAULT_KG_IMAGES));
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'kg_images',
      targetId: 'reset_defaults',
      details: 'คืนค่าแผนภาพกราฟความรู้มาตรฐาน',
      adminEmail
    });
    this.persistKgImages();
    return this.kgImages;
  }

  private persistKgImages() {
    try {
      localStorage.setItem(STORAGE_KEYS.KG_IMAGES, JSON.stringify(this.kgImages));
      this.notify();
    } catch (e) {
      console.error('Failed to persist kg images:', e);
    }
  }

  // --- MASCOT SYSTEM APIS (น้องมิวมิว) ---

  public getMascotConfig(): MascotConfig {
    return {
      ...this.mascotConfig,
      size: getMascotSizePixels(this.mascotConfig.size)
    };
  }

  public updateMascotConfig(updates: Partial<MascotConfig>, adminEmail = 'admin@gmail.com'): MascotConfig {
    this.mascotConfig = {
      ...this.mascotConfig,
      ...updates
    };
    try {
      localStorage.setItem(STORAGE_KEYS.MASCOT_CONFIG, JSON.stringify(this.mascotConfig));
      this.notify();
      this.logAudit({
        action: 'UPDATE',
        targetCollection: 'mascot_config',
        targetId: 'mascot',
        details: `อัปเดตการตั้งค่ามาสคอตน้องมิวมิว (เปิดใช้งาน: ${this.mascotConfig.enabled ? 'เปิด' : 'ปิด'})`,
        adminEmail
      });
    } catch (e) {
      console.error('Failed to persist mascot config:', e);
    }
    return this.mascotConfig;
  }

  public updateMascotPosition(position: MascotPosition, adminEmail = 'admin@gmail.com'): MascotConfig {
    this.mascotConfig.position = { ...position, isCustomDrag: true };
    try {
      localStorage.setItem(STORAGE_KEYS.MASCOT_CONFIG, JSON.stringify(this.mascotConfig));
      this.notify();
      this.logAudit({
        action: 'UPDATE',
        targetCollection: 'mascot_config',
        targetId: 'position',
        details: `บันทึกตำแหน่งกลางของน้องมิวมิว (X: ${position.x ?? 'auto'}, Y: ${position.y ?? 'auto'}, Bottom: ${position.bottom ?? 'auto'}, Right: ${position.right ?? 'auto'})`,
        adminEmail
      });
      if (db) {
        setDoc(doc(db, 'site_configs', 'mascot_config'), this.mascotConfig).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to persist mascot position:', e);
    }
    return this.mascotConfig;
  }

  // --- USER INQUIRIES APIS (ข้อความและคำถามจากผู้ใช้งาน) ---
  public getUserInquiries(): UserInquiry[] {
    return [...this.userInquiries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addUserInquiry(query: string): UserInquiry {
    const newInquiry: UserInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      query: query.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    this.userInquiries.unshift(newInquiry);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_INQUIRIES, JSON.stringify(this.userInquiries));
      this.notify();
      if (db) {
        setDoc(doc(db, 'user_inquiries', newInquiry.id), newInquiry).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to persist inquiry:', e);
    }
    return newInquiry;
  }

  public updateUserInquiry(id: string, updates: Partial<UserInquiry>): void {
    const index = this.userInquiries.findIndex(i => i.id === id);
    if (index === -1) return;
    this.userInquiries[index] = { ...this.userInquiries[index], ...updates };
    try {
      localStorage.setItem(STORAGE_KEYS.USER_INQUIRIES, JSON.stringify(this.userInquiries));
      this.notify();
    } catch (e) {
      console.error('Failed to update inquiry:', e);
    }
  }

  public deleteUserInquiry(id: string): void {
    this.userInquiries = this.userInquiries.filter(i => i.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_INQUIRIES, JSON.stringify(this.userInquiries));
      this.notify();
      if (db) {
        deleteDoc(doc(db, 'user_inquiries', id)).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to delete inquiry:', e);
    }
  }

  public clearUserInquiries(): void {
    this.userInquiries = [];
    try {
      localStorage.setItem(STORAGE_KEYS.USER_INQUIRIES, JSON.stringify(this.userInquiries));
      this.notify();
    } catch (e) {
      console.error('Failed to clear inquiries:', e);
    }
  }

  // --- LOCAL LIVING TAXONOMY APIS (ดัชนีวิถีชีวิตท้องถิ่น 9 ประเภท) ---

  private persistLocalLivingTaxonomy() {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCAL_LIVING_TAXONOMY, JSON.stringify(this.localLivingTaxonomy));
      this.notify();
      if (db) {
        setDoc(doc(db, 'site_configs', 'local_living_taxonomy'), this.localLivingTaxonomy).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to persist local living taxonomy:', e);
    }
  }

  public getLocalLivingTaxonomy(): LocalLivingTaxonomyConfig {
    return { ...this.localLivingTaxonomy };
  }

  public updateLocalLivingTaxonomy(
    updates: Partial<LocalLivingTaxonomyConfig>,
    adminEmail = 'admin@gmail.com'
  ): LocalLivingTaxonomyConfig {
    this.localLivingTaxonomy = {
      ...this.localLivingTaxonomy,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'local_living_taxonomy',
      targetId: 'config',
      details: `อัปเดตองค์ประกอบดัชนีวิถีชีวิตท้องถิ่น: ${this.localLivingTaxonomy.mainTitle}`,
      adminEmail
    });
    this.persistLocalLivingTaxonomy();
    return this.localLivingTaxonomy;
  }

  public updateLocalLivingCategory(
    categoryId: string,
    updates: Partial<LocalLivingCategory>,
    adminEmail = 'admin@gmail.com'
  ): LocalLivingTaxonomyConfig {
    const idx = this.localLivingTaxonomy.categories.findIndex(c => c.id === categoryId);
    if (idx !== -1) {
      this.localLivingTaxonomy.categories[idx] = {
        ...this.localLivingTaxonomy.categories[idx],
        ...updates
      };
      this.localLivingTaxonomy.updatedAt = new Date().toISOString();
      this.logAudit({
        action: 'UPDATE',
        targetCollection: 'local_living_taxonomy',
        targetId: categoryId,
        details: `แก้ไขหมวดหมู่ประเภท: ${this.localLivingTaxonomy.categories[idx].title || this.localLivingTaxonomy.categories[idx].name}`,
        adminEmail
      });
      this.persistLocalLivingTaxonomy();
    }
    return this.localLivingTaxonomy;
  }

  public addLocalLivingCategory(
    category: Omit<LocalLivingCategory, 'id'>,
    adminEmail = 'admin@gmail.com'
  ): LocalLivingTaxonomyConfig {
    const newId = `type_${Date.now()}`;
    const newCategory: LocalLivingCategory = {
      ...category,
      id: newId,
      order: category.order || this.localLivingTaxonomy.categories.length + 1
    };
    this.localLivingTaxonomy.categories.push(newCategory);
    this.localLivingTaxonomy.categories.sort((a, b) => a.order - b.order);
    this.localLivingTaxonomy.updatedAt = new Date().toISOString();
    this.logAudit({
      action: 'CREATE',
      targetCollection: 'local_living_taxonomy',
      targetId: newId,
      details: `เพิ่มหมวดหมู่ประเภทใหม่ในดัชนีวิถีชีวิตท้องถิ่น: ${newCategory.title || newCategory.name}`,
      adminEmail
    });
    this.persistLocalLivingTaxonomy();
    return this.localLivingTaxonomy;
  }

  public deleteLocalLivingCategory(
    categoryId: string,
    adminEmail = 'admin@gmail.com'
  ): LocalLivingTaxonomyConfig {
    const removed = this.localLivingTaxonomy.categories.find(c => c.id === categoryId);
    this.localLivingTaxonomy.categories = this.localLivingTaxonomy.categories.filter(c => c.id !== categoryId);
    this.localLivingTaxonomy.updatedAt = new Date().toISOString();
    this.logAudit({
      action: 'DELETE',
      targetCollection: 'local_living_taxonomy',
      targetId: categoryId,
      details: `ลบหมวดหมู่ประเภท: ${removed?.title || categoryId}`,
      adminEmail
    });
    this.persistLocalLivingTaxonomy();
    return this.localLivingTaxonomy;
  }

  public resetDefaultLocalLivingTaxonomy(adminEmail = 'admin@gmail.com'): LocalLivingTaxonomyConfig {
    this.localLivingTaxonomy = JSON.parse(JSON.stringify(DEFAULT_LOCAL_LIVING_TAXONOMY));
    this.localLivingTaxonomy.updatedAt = new Date().toISOString();
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'local_living_taxonomy',
      targetId: 'reset_default',
      details: 'คืนค่าเริ่มต้นดัชนีวิถีชีวิตท้องถิ่น 9 ประเภทตามโครงสร้างระบบ',
      adminEmail
    });
    this.persistLocalLivingTaxonomy();
    return this.localLivingTaxonomy;
  }

  public getMuseumsByCategory(categoryName: string): Museum[] {
    return this.localLivingMuseums.filter(m => m.status === 'published' && m.type === categoryName);
  }

  public getLocalLivingMuseums(): Museum[] {
    return this.localLivingMuseums;
  }

  public getLocalLivingMuseumById(id: string): Museum | undefined {
    return this.localLivingMuseums.find(museum => museum.id === id);
  }

  public getSubjectsByCategory(categoryName: string): { name: string; count: number }[] {
    const museums = this.getMuseumsByCategory(categoryName);
    const subjectMap = new Map<string, number>();
    museums.forEach(m => {
      if (m.subjectList && Array.isArray(m.subjectList)) {
        m.subjectList.forEach(s => {
          const trimmed = s.trim();
          if (trimmed) {
            subjectMap.set(trimmed, (subjectMap.get(trimmed) || 0) + 1);
          }
        });
      }
    });
    return Array.from(subjectMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  // --- HEADER NAVIGATION CMS APIS (จัดการแถบเมนูด้านบนและฟังก์ชั่นภาพรวม) ---

  private persistHeaderConfig() {
    try {
      localStorage.setItem(STORAGE_KEYS.HEADER_NAV_CONFIG, JSON.stringify(this.headerConfig));
      this.notify();
      if (db) {
        setDoc(doc(db, 'site_configs', 'header_nav_config'), this.headerConfig).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to persist header navigation config:', e);
    }
  }

  public getHeaderConfig(): HeaderConfig {
    return { ...this.headerConfig };
  }

  public updateHeaderConfig(
    updates: Partial<HeaderConfig>,
    adminEmail = 'admin@gmail.com'
  ): HeaderConfig {
    this.headerConfig = {
      ...this.headerConfig,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'header_nav_config',
      targetId: 'global',
      details: 'อัปเดตการตั้งค่าแถบเมนูด้านบนและองค์ประกอบส่วนหัว (Header CMS)',
      adminEmail
    });
    this.persistHeaderConfig();
    return this.headerConfig;
  }

  public updateNavMenuItem(
    itemId: string,
    updates: Partial<NavMenuItem>,
    adminEmail = 'admin@gmail.com'
  ): HeaderConfig {
    const idx = this.headerConfig.menuItems.findIndex(m => m.id === itemId);
    if (idx !== -1) {
      this.headerConfig.menuItems[idx] = {
        ...this.headerConfig.menuItems[idx],
        ...updates
      };
      this.headerConfig.updatedAt = new Date().toISOString();
      this.logAudit({
        action: 'UPDATE',
        targetCollection: 'header_nav_config',
        targetId: itemId,
        details: `แก้ไขเมนูด้านบน "${this.headerConfig.menuItems[idx].label}" (ฟังก์ชั่น: ${this.headerConfig.menuItems[idx].targetAction}/${this.headerConfig.menuItems[idx].targetTab || 'custom'})`,
        adminEmail
      });
      this.persistHeaderConfig();
    }
    return this.headerConfig;
  }

  public addNavMenuItem(
    item: Omit<NavMenuItem, 'id'>,
    adminEmail = 'admin@gmail.com'
  ): HeaderConfig {
    const newId = `nav_${Date.now()}`;
    const newItem: NavMenuItem = {
      ...item,
      id: newId,
      order: item.order || this.headerConfig.menuItems.length + 1
    };
    this.headerConfig.menuItems.push(newItem);
    this.headerConfig.menuItems.sort((a, b) => a.order - b.order);
    this.headerConfig.updatedAt = new Date().toISOString();
    this.logAudit({
      action: 'CREATE',
      targetCollection: 'header_nav_config',
      targetId: newId,
      details: `เพิ่มเมนูด้านบนใหม่: ${newItem.label}`,
      adminEmail
    });
    this.persistHeaderConfig();
    return this.headerConfig;
  }

  public deleteNavMenuItem(
    itemId: string,
    adminEmail = 'admin@gmail.com'
  ): HeaderConfig {
    const removed = this.headerConfig.menuItems.find(m => m.id === itemId);
    this.headerConfig.menuItems = this.headerConfig.menuItems.filter(m => m.id !== itemId);
    this.headerConfig.updatedAt = new Date().toISOString();
    this.logAudit({
      action: 'DELETE',
      targetCollection: 'header_nav_config',
      targetId: itemId,
      details: `ลบเมนูด้านบน: ${removed?.label || itemId}`,
      adminEmail
    });
    this.persistHeaderConfig();
    return this.headerConfig;
  }

  public resetDefaultHeaderConfig(adminEmail = 'admin@gmail.com'): HeaderConfig {
    this.headerConfig = JSON.parse(JSON.stringify(DEFAULT_HEADER_CONFIG));
    this.headerConfig.updatedAt = new Date().toISOString();
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'header_nav_config',
      targetId: 'reset_default',
      details: 'คืนค่าเริ่มต้นแถบเมนูด้านบนและฟังก์ชั่นทั้งหมดตามมาตรฐาน',
      adminEmail
    });
    this.persistHeaderConfig();
    return this.headerConfig;
  }

  // --- CONTACT PAGE & CREATORS CMS APIS (จัดการหน้าติดต่อเราและคณะผู้สร้างระบบ) ---

  private persistContactConfig() {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACT_PAGE_CONFIG, JSON.stringify(this.contactConfig));
      this.notify();
      if (db) {
        setDoc(doc(db, 'site_configs', 'contact_page_config'), this.contactConfig).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to persist contact page config:', e);
    }
  }

  public getContactConfig(): ContactPageConfig {
    return { ...this.contactConfig };
  }

  public updateContactConfig(
    updates: Partial<ContactPageConfig>,
    adminEmail = 'admin@gmail.com'
  ): ContactPageConfig {
    this.contactConfig = {
      ...this.contactConfig,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'contact_page_config',
      targetId: 'global',
      details: 'อัปเดตข้อมูลหน้าติดต่อเราและช่องทางการติดต่อ (Contact CMS)',
      adminEmail
    });
    this.persistContactConfig();
    return this.contactConfig;
  }

  public addCreator(
    creator: Omit<CreatorProfile, 'id'>,
    adminEmail = 'admin@gmail.com'
  ): ContactPageConfig {
    const newId = `creator_${Date.now()}`;
    const newCreator: CreatorProfile = {
      ...creator,
      id: newId,
      order: creator.order || this.contactConfig.creators.length + 1
    };
    this.contactConfig.creators.push(newCreator);
    this.contactConfig.creators.sort((a, b) => a.order - b.order);
    this.contactConfig.updatedAt = new Date().toISOString();
    this.logAudit({
      action: 'CREATE',
      targetCollection: 'contact_page_config',
      targetId: newId,
      details: `เพิ่มข้อมูลผู้สร้างระบบใหม่: ${newCreator.name} (${newCreator.role})`,
      adminEmail
    });
    this.persistContactConfig();
    return this.contactConfig;
  }

  public updateCreator(
    creatorId: string,
    updates: Partial<CreatorProfile>,
    adminEmail = 'admin@gmail.com'
  ): ContactPageConfig {
    const idx = this.contactConfig.creators.findIndex(c => c.id === creatorId);
    if (idx !== -1) {
      this.contactConfig.creators[idx] = {
        ...this.contactConfig.creators[idx],
        ...updates
      };
      this.contactConfig.updatedAt = new Date().toISOString();
      this.logAudit({
        action: 'UPDATE',
        targetCollection: 'contact_page_config',
        targetId: creatorId,
        details: `แก้ไขข้อมูลผู้สร้างระบบ: ${this.contactConfig.creators[idx].name}`,
        adminEmail
      });
      this.persistContactConfig();
    }
    return this.contactConfig;
  }

  public deleteCreator(
    creatorId: string,
    adminEmail = 'admin@gmail.com'
  ): ContactPageConfig {
    const removed = this.contactConfig.creators.find(c => c.id === creatorId);
    this.contactConfig.creators = this.contactConfig.creators.filter(c => c.id !== creatorId);
    this.contactConfig.updatedAt = new Date().toISOString();
    this.logAudit({
      action: 'DELETE',
      targetCollection: 'contact_page_config',
      targetId: creatorId,
      details: `ลบข้อมูลผู้สร้างระบบ: ${removed?.name || creatorId}`,
      adminEmail
    });
    this.persistContactConfig();
    return this.contactConfig;
  }

  public resetDefaultContactConfig(adminEmail = 'admin@gmail.com'): ContactPageConfig {
    this.contactConfig = JSON.parse(JSON.stringify(DEFAULT_CONTACT_PAGE_CONFIG));
    this.contactConfig.updatedAt = new Date().toISOString();
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'contact_page_config',
      targetId: 'reset_default',
      details: 'คืนค่าเริ่มต้นหน้าติดต่อเราและข้อมูลผู้สร้างระบบตามมาตรฐาน',
      adminEmail
    });
    this.persistContactConfig();
    return this.contactConfig;
  }

  // --- QUERY APIS ---

  public getMuseums(): Museum[] {
    return this.museums;
  }

  public getAllMuseums(): Museum[] {
    return this.museums;
  }

  public getPublishedMuseums(): Museum[] {
    return this.museums.filter(m => m.status === 'published');
  }

  public getMuseumById(id: string): Museum | undefined {
    return this.museums.find(m => m.id === id);
  }

  public getRelatedMuseums(museum: Museum, limit = 4): Museum[] {
    if (!museum.subjectList || museum.subjectList.length === 0) return [];
    const subjectsSet = new Set(museum.subjectList);
    
    const scored = this.museums
      .filter(m => m.id !== museum.id && m.status === 'published')
      .map(m => {
        let matchCount = 0;
        m.subjectList.forEach(s => {
          if (subjectsSet.has(s)) matchCount++;
        });
        return { museum: m, score: matchCount };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map(item => item.museum);
  }

  public getSubjects(): SubjectItem[] {
    return this.subjects;
  }

  public getSubjectByName(name: string): SubjectItem | undefined {
    return this.subjects.find(s => s.name === name);
  }

  public getProvinces(): string[] {
    const set = new Set<string>();
    this.museums.forEach(m => {
      if (m.province && m.province !== 'ไม่ระบุ') {
        set.add(m.province);
      }
    });
    return Array.from(set).sort();
  }

  public getMuseumTypes(): string[] {
    const set = new Set<string>();
    this.museums.forEach(m => {
      if (m.type) set.add(m.type);
    });
    return Array.from(set).sort();
  }

  public getSiteSettings(): SiteSettings {
    return this.settings;
  }

  public updateSiteSettings(newSettings: Partial<SiteSettings>, adminEmail = 'admin@gmail.com') {
    this.settings = {
      ...this.settings,
      ...newSettings,
      updatedAt: new Date().toISOString()
    };
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'siteSettings',
      targetId: 'global',
      details: 'อัปเดตการตั้งค่าเว็บไซต์และข้อความหน้าหลัก',
      adminEmail
    });
    this.persistSettings();
  }

  // --- MUTATION APIS ---

  public createMuseum(data: Omit<Museum, 'id' | 'createdAt' | 'updatedAt'>, adminEmail = 'admin@gmail.com'): Museum {
    const newId = `sac_custom_${Date.now()}`;
    const now = new Date().toISOString();
    const newMuseum: Museum = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now
    };
    this.museums.unshift(newMuseum);
    this.recalculateSubjects();
    this.logAudit({
      action: 'CREATE',
      targetCollection: 'museums',
      targetId: newId,
      details: `สร้างพิพิธภัณฑ์ใหม่: ${newMuseum.title}`,
      adminEmail
    });
    this.persistMuseums();
    return newMuseum;
  }

  public updateMuseum(id: string, updates: Partial<Museum>, adminEmail = 'admin@gmail.com'): Museum | undefined {
    const index = this.museums.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    const old = this.museums[index];
    const updated: Museum = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.museums[index] = updated;
    this.recalculateSubjects();
    this.logAudit({
      action: 'UPDATE',
      targetCollection: 'museums',
      targetId: id,
      details: `แก้ไขข้อมูลพิพิธภัณฑ์: ${updated.title}`,
      adminEmail
    });
    this.persistMuseums();
    return updated;
  }

  public softDeleteMuseum(id: string, adminEmail = 'admin@gmail.com'): boolean {
    const index = this.museums.findIndex(m => m.id === id);
    if (index === -1) return false;
    const [deleted] = this.museums.splice(index, 1);
    this.trash.unshift(deleted);
    this.recalculateSubjects();
    this.logAudit({
      action: 'DELETE',
      targetCollection: 'museums',
      targetId: id,
      details: `ย้ายพิพิธภัณฑ์ลงถังขยะ: ${deleted.title}`,
      adminEmail
    });
    this.persistMuseums();
    this.persistTrash();
    return true;
  }

  public restoreMuseum(id: string, adminEmail = 'admin@gmail.com'): boolean {
    const index = this.trash.findIndex(m => m.id === id);
    if (index === -1) return false;
    const [restored] = this.trash.splice(index, 1);
    this.museums.unshift(restored);
    this.recalculateSubjects();
    this.logAudit({
      action: 'RESTORE',
      targetCollection: 'museums',
      targetId: id,
      details: `กู้คืนพิพิธภัณฑ์จากถังขยะ: ${restored.title}`,
      adminEmail
    });
    this.persistMuseums();
    this.persistTrash();
    return true;
  }

  public permanentDeleteMuseum(id: string, adminEmail = 'admin@gmail.com'): boolean {
    const index = this.trash.findIndex(m => m.id === id);
    if (index === -1) return false;
    const [removed] = this.trash.splice(index, 1);
    this.logAudit({
      action: 'DELETE',
      targetCollection: 'trash',
      targetId: id,
      details: `ลบพิพิธภัณฑ์ถาวร: ${removed.title}`,
      adminEmail
    });
    this.persistTrash();
    return true;
  }

  public getTrash(): Museum[] {
    return this.trash;
  }

  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  private logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    const log: AuditLog = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    this.persistAudit();
  }

  private recalculateSubjects() {
    const map = new Map<string, string[]>();
    this.museums.forEach(m => {
      if (m.subjectList) {
        m.subjectList.forEach(s => {
          if (!map.has(s)) map.set(s, []);
          map.get(s)!.push(m.id);
        });
      }
    });

    const newSubjects: SubjectItem[] = [];
    map.forEach((mIds, name) => {
      newSubjects.push({
        id: `sub_${name}`,
        name,
        normalizedKey: name.toLowerCase().replace(/\s+/g, ''),
        count: mIds.length,
        museumIds: mIds,
        status: 'active'
      });
    });

    newSubjects.sort((a, b) => b.count - a.count);
    this.subjects = newSubjects;
    this.persistSubjects();
  }

  public mergeSubjects(sourceName: string, targetName: string, adminEmail = 'admin@gmail.com'): number {
    let affectedCount = 0;
    this.museums.forEach(m => {
      if (m.subjectList && m.subjectList.includes(sourceName)) {
        affectedCount++;
        m.subjectList = m.subjectList.filter(s => s !== sourceName);
        if (!m.subjectList.includes(targetName)) {
          m.subjectList.push(targetName);
        }
        m.subjectRaw = m.subjectList.join(', ');
        m.updatedAt = new Date().toISOString();
      }
    });

    this.recalculateSubjects();
    this.logAudit({
      action: 'MERGE_SUBJECT',
      targetCollection: 'subjects',
      targetId: `${sourceName}->${targetName}`,
      details: `รวมหัวเรื่อง '${sourceName}' เข้ากับ '${targetName}' ส่งผลต่อ ${affectedCount} พิพิธภัณฑ์`,
      adminEmail
    });
    this.persistMuseums();
    return affectedCount;
  }

  // --- DATA QUALITY & STATS ---

  public getDataQualityReport(): DataQualityReport {
    let missingTitles = 0;
    let missingSubjects = 0;
    let missingSpatial = 0;
    let missingSourceUri = 0;
    let recordsWithImage = 0;
    const titleCounts = new Map<string, string[]>();

    this.museums.forEach(m => {
      if (!m.title || m.title.trim() === '') missingTitles++;
      if (!m.subjectList || m.subjectList.length === 0) missingSubjects++;
      if (!m.spatial || m.spatial.trim() === '' || m.spatial === '-') missingSpatial++;
      if (!m.sourceUri || !m.sourceUri.startsWith('http')) missingSourceUri++;
      if (m.imageUrl && m.imageUrl.trim() !== '') recordsWithImage++;

      // duplicate check
      const trimmedTitle = m.title.trim();
      if (!titleCounts.has(trimmedTitle)) titleCounts.set(trimmedTitle, []);
      titleCounts.get(trimmedTitle)!.push(m.id);
    });

    const duplicateCandidates: { title: string; count: number; ids: string[] }[] = [];
    titleCounts.forEach((ids, title) => {
      if (ids.length > 1) {
        duplicateCandidates.push({ title, count: ids.length, ids });
      }
    });

    duplicateCandidates.sort((a, b) => b.count - a.count);

    return {
      totalRecords: this.museums.length,
      validRecords: this.museums.length - missingTitles,
      missingTitles,
      missingSubjects,
      missingSpatial,
      missingSourceUri,
      recordsWithImage,
      uniqueTypesCount: this.getMuseumTypes().length,
      uniqueSubjectsCount: this.subjects.length,
      duplicateCandidates
    };
  }

  // --- KNOWLEDGE GRAPH DATA GENERATOR (FULL & COMPLETE ARCHITECTURE) ---

  public getKnowledgeGraphData(options?: {
    focusSubject?: string;
    focusMuseumId?: string;
    province?: string;
    museumType?: string;
    maxNodes?: number;
    nodeTypes?: string[];
    includeAll?: boolean;
  }): { 
    nodes: GraphNode[]; 
    edges: GraphEdge[]; 
    totalMuseumsInGraph: number; 
    totalSubjectsInGraph: number; 
    totalAvailableMuseums: number; 
    totalAvailableSubjects: number; 
  } {
    const isAll = !!options?.includeAll || (typeof options?.maxNodes === 'number' && options.maxNodes >= 1500);
    const maxNodes = isAll ? 4500 : (options?.maxNodes || 100);
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const addedNodeIds = new Set<string>();

    const addNode = (node: GraphNode): boolean => {
      if (!addedNodeIds.has(node.id) && (isAll || nodes.length < maxNodes)) {
        addedNodeIds.add(node.id);
        nodes.push({ ...node });
        return true;
      }
      return addedNodeIds.has(node.id);
    };

    const addEdge = (edge: GraphEdge): boolean => {
      if (addedNodeIds.has(edge.source) && addedNodeIds.has(edge.target)) {
        edges.push(edge);
        return true;
      }
      return false;
    };

    const publishedMuseums = this.getPublishedMuseums();
    const availableMuseumsCount = publishedMuseums.length;
    const availableSubjectsCount = this.subjects.length;

    // SCENARIO 1: Focus on a specific Museum
    if (options?.focusMuseumId) {
      const focus = this.getMuseumById(options.focusMuseumId);
      if (focus) {
        addNode({
          id: focus.id,
          label: focus.title,
          type: 'Museum',
          degree: focus.subjectList.length + 1,
          meta: focus
        });

        // Add its subjects
        focus.subjectList.forEach(subName => {
          const subId = `sub_${subName}`;
          if (addNode({ id: subId, label: subName, type: 'Subject', degree: 1 })) {
            addEdge({
              id: `edge_${focus.id}_${subId}`,
              source: focus.id,
              target: subId,
              type: 'HAS_SUBJECT',
              label: 'มีหัวเรื่อง'
            });
          }
        });

        // Add its type
        const typeId = `type_${focus.type}`;
        if (addNode({ id: typeId, label: focus.type, type: 'MuseumType', degree: 1 })) {
          addEdge({
            id: `edge_${focus.id}_${typeId}`,
            source: focus.id,
            target: typeId,
            type: 'HAS_TYPE',
            label: 'ประเภท'
          });
        }

        // Add neighbor museums sharing subjects
        const related = this.getRelatedMuseums(focus, Math.min(30, maxNodes - nodes.length));
        related.forEach(rel => {
          if (addNode({ id: rel.id, label: rel.title, type: 'Museum', degree: 1, meta: rel })) {
            rel.subjectList.forEach(sn => {
              const sid = `sub_${sn}`;
              if (addedNodeIds.has(sid)) {
                addEdge({
                  id: `edge_${rel.id}_${sid}`,
                  source: rel.id,
                  target: sid,
                  type: 'HAS_SUBJECT',
                  label: 'มีหัวเรื่อง'
                });
              }
            });
          }
        });
      }
    } 
    // SCENARIO 2: Focus on a specific Subject
    else if (options?.focusSubject) {
      const subName = options.focusSubject;
      const subId = `sub_${subName}`;
      addNode({ id: subId, label: subName, type: 'Subject', degree: 1 });

      const matchingMuseums = publishedMuseums
        .filter(m => m.subjectList && m.subjectList.includes(subName))
        .slice(0, isAll ? publishedMuseums.length : Math.min(120, maxNodes - 5));

      matchingMuseums.forEach(m => {
        if (addNode({ id: m.id, label: m.title, type: 'Museum', degree: m.subjectList.length, meta: m })) {
          addEdge({
            id: `edge_${m.id}_${subId}`,
            source: m.id,
            target: subId,
            type: 'HAS_SUBJECT',
            label: 'มีหัวเรื่อง'
          });
        }
      });

      // Add neighbor subjects shared by these museums
      const coSubjectCounts: Record<string, number> = {};
      matchingMuseums.forEach(m => {
        m.subjectList.forEach(sn => {
          if (sn !== subName) {
            coSubjectCounts[sn] = (coSubjectCounts[sn] || 0) + 1;
          }
        });
      });

      const topCoSubjects = Object.entries(coSubjectCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, Math.max(0, maxNodes - nodes.length));

      topCoSubjects.forEach(([csName]) => {
        const csId = `sub_${csName}`;
        if (addNode({ id: csId, label: csName, type: 'Subject', degree: 1 })) {
          matchingMuseums.forEach(m => {
            if (m.subjectList && m.subjectList.includes(csName)) {
              addEdge({
                id: `edge_${m.id}_${csId}`,
                source: m.id,
                target: csId,
                type: 'HAS_SUBJECT',
                label: 'มีหัวเรื่อง'
              });
            }
          });
        }
      });
    } 
    // SCENARIO 3: General / All Data / Filtered by Province or Type
    else {
      let candidateMuseums = publishedMuseums;
      if (options?.province && options.province !== 'all') {
        candidateMuseums = candidateMuseums.filter(m => m.province === options.province);
      }
      if (options?.museumType && options.museumType !== 'all') {
        candidateMuseums = candidateMuseums.filter(m => m.type === options.museumType);
      }

      // Sort candidate museums by richness (number of subjects) to present high-value hubs
      const sortedMuseums = [...candidateMuseums].sort((a, b) => (b.subjectList?.length || 0) - (a.subjectList?.length || 0));

      // Calculate how many museums vs subjects to include
      const targetMuseumCount = isAll 
        ? sortedMuseums.length 
        : Math.min(sortedMuseums.length, Math.max(25, Math.floor(maxNodes * 0.72)));

      const selectedMuseums = sortedMuseums.slice(0, targetMuseumCount);

      // Add museum nodes
      selectedMuseums.forEach(m => {
        addNode({
          id: m.id,
          label: m.title,
          type: 'Museum',
          degree: m.subjectList?.length || 1,
          meta: m
        });
      });

      // Gather subjects attached to these selected museums
      const subjectFreq: Record<string, number> = {};
      selectedMuseums.forEach(m => {
        (m.subjectList || []).forEach(sn => {
          subjectFreq[sn] = (subjectFreq[sn] || 0) + 1;
        });
      });

      // Sort subjects by frequency in the selected museums
      const sortedSubjectNames = Object.keys(subjectFreq).sort((a, b) => subjectFreq[b] - subjectFreq[a]);
      const targetSubjectCount = isAll 
        ? sortedSubjectNames.length 
        : Math.min(sortedSubjectNames.length, Math.max(10, maxNodes - nodes.length));

      const selectedSubjects = sortedSubjectNames.slice(0, targetSubjectCount);

      selectedSubjects.forEach(sn => {
        const sId = `sub_${sn}`;
        addNode({
          id: sId,
          label: sn,
          type: 'Subject',
          degree: subjectFreq[sn] || 1
        });
      });

      // Add all connecting edges between added museums and added subjects
      selectedMuseums.forEach(m => {
        (m.subjectList || []).forEach(sn => {
          const sId = `sub_${sn}`;
          if (addedNodeIds.has(sId) && addedNodeIds.has(m.id)) {
            addEdge({
              id: `edge_${m.id}_${sId}`,
              source: m.id,
              target: sId,
              type: 'HAS_SUBJECT',
              label: 'มีหัวเรื่อง'
            });
          }
        });
      });

      // Add core Museum Types if capacity allows
      if (nodes.length + 9 <= maxNodes || isAll) {
        this.getMuseumTypes().forEach(t => {
          const typeId = `type_${t}`;
          if (addNode({ id: typeId, label: t, type: 'MuseumType', degree: 1 })) {
            selectedMuseums.forEach(m => {
              if (m.type === t) {
                addEdge({
                  id: `edge_${m.id}_${typeId}`,
                  source: m.id,
                  target: typeId,
                  type: 'HAS_TYPE',
                  label: 'ประเภท'
                });
              }
            });
          }
        });
      }
    }

    // Accurate Degree Recalculation based on actual incident edges in this graph
    const degreeCounts: Record<string, number> = {};
    edges.forEach(e => {
      degreeCounts[e.source] = (degreeCounts[e.source] || 0) + 1;
      degreeCounts[e.target] = (degreeCounts[e.target] || 0) + 1;
    });

    nodes.forEach(n => {
      n.degree = degreeCounts[n.id] || 1;
    });

    const totalMuseumsInGraph = nodes.filter(n => n.type === 'Museum').length;
    const totalSubjectsInGraph = nodes.filter(n => n.type === 'Subject').length;

    return { 
      nodes, 
      edges, 
      totalMuseumsInGraph, 
      totalSubjectsInGraph, 
      totalAvailableMuseums: availableMuseumsCount, 
      totalAvailableSubjects: availableSubjectsCount 
    };
  }

  // --- EXPORT PIPELINE (WITH UTF-8 BOM) ---

  public exportMuseumsCSV(): string {
    const headers = ['id', 'title', 'type', 'creator', 'provenance', 'subjectRaw', 'spatial', 'province', 'temporal', 'language', 'rights', 'license', 'sourceUri'];
    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = this.museums.map(m => [
      escapeCsv(m.id),
      escapeCsv(m.title),
      escapeCsv(m.type),
      escapeCsv(m.creator || ''),
      escapeCsv(m.provenance || ''),
      escapeCsv(m.subjectRaw || ''),
      escapeCsv(m.spatial || ''),
      escapeCsv(m.province || ''),
      escapeCsv(m.temporal || ''),
      escapeCsv(m.language || ''),
      escapeCsv(m.rights || ''),
      escapeCsv(m.license || ''),
      escapeCsv(m.sourceUri || '')
    ].join(','));

    // Prepend UTF-8 BOM for Thai Excel compatibility
    return '\uFEFF' + [headers.join(','), ...rows].join('\n');
  }

  public exportMuseumsJSON(): string {
    return JSON.stringify(this.museums, null, 2);
  }

  public exportSubjectsCSV(): string {
    const headers = ['id', 'name', 'count', 'museumIds'];
    const rows = this.subjects.map(s => [
      `"${s.id}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      s.count,
      `"${s.museumIds.join(';')}"`
    ].join(','));

    return '\uFEFF' + [headers.join(','), ...rows].join('\n');
  }

  public exportSubjectsJSON(): string {
    return JSON.stringify(this.subjects, null, 2);
  }

  public exportGraphJSON(): string {
    const graphData = this.getKnowledgeGraphData({ maxNodes: 300 });
    return JSON.stringify(graphData, null, 2);
  }

  // --- IMPORT PIPELINE ---

  public importMuseumsFromJSON(importedList: any[], adminEmail = 'admin@gmail.com'): { success: number; skipped: number; errors: string[] } {
    const errors: string[] = [];
    let success = 0;
    let skipped = 0;

    importedList.forEach((item, idx) => {
      if (!item.title || typeof item.title !== 'string') {
        errors.push(`แถวที่ ${idx + 1}: ขาดชื่อพิพิธภัณฑ์ (title)`);
        skipped++;
        return;
      }

      // Check if already exists
      const existing = this.museums.find(m => m.id === item.id || m.title === item.title);
      if (existing) {
        skipped++;
        return;
      }

      const newId = item.id || `sac_imported_${Date.now()}_${idx}`;
      const subjList: string[] = Array.isArray(item.subjectList) 
        ? item.subjectList 
        : (item.subjectRaw ? item.subjectRaw.split(',').map((s: string) => s.trim()).filter(Boolean) : []);

      const museum: Museum = {
        id: newId,
        sourceId: item.sourceId || '',
        title: item.title.trim(),
        type: item.type || 'ทั่วไป',
        creator: item.creator || '',
        provenance: item.provenance || '',
        subjectRaw: item.subjectRaw || subjList.join(', '),
        subjectList: subjList,
        spatial: item.spatial || '',
        province: item.province || 'ไม่ระบุ',
        temporal: item.temporal || '',
        language: item.language || 'ไทย',
        rights: item.rights || '',
        license: item.license || '',
        sourceUri: item.sourceUri || '',
        imageUrl: item.imageUrl || '',
        imageAlt: item.imageAlt || '',
        imageRights: item.imageRights || '',
        status: 'published',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.museums.push(museum);
      success++;
    });

    if (success > 0) {
      this.recalculateSubjects();
      this.logAudit({
        action: 'IMPORT',
        targetCollection: 'museums',
        targetId: `imported_${success}_items`,
        details: `นำเข้าข้อมูลพิพิธภัณฑ์สำเร็จ ${success} รายการ (ข้าม ${skipped} รายการ)`,
        adminEmail
      });
      this.persistMuseums();
    }

    return { success, skipped, errors };
  }
}

export const museumStore = new MuseumStore();
