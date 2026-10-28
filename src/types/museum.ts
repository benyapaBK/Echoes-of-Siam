export type MuseumStatus = 'published' | 'draft' | 'archived';

export interface Museum {
  id: string;
  sourceId?: string;
  title: string;
  type: string;
  creator?: string;
  provenance?: string;
  subjectRaw?: string;
  subjectList: string[];
  spatial?: string;
  province: string;
  provinces?: string[];
  temporal?: string;
  language?: string;
  rights?: string;
  license?: string;
  sourceUri?: string;
  sourceUris?: string[];
  sourceRecords?: {
    type: string;
    title: string;
    creator: string;
    subject: string;
    spatial: string;
    temporal: string;
    language: string;
    sourceUri: string;
  }[];
  imageUrl?: string;
  imageAlt?: string;
  imageRights?: string;
  status: MuseumStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  normalizedKey: string;
  count: number;
  museumIds: string[];
  status: 'active' | 'merged' | 'archived';
  mergedIntoId?: string;
  description?: string;
}

export type GraphNodeType = 'Museum' | 'Subject' | 'MuseumType' | 'Place' | 'TimePeriod';

export type RelationshipType = 
  | 'HAS_SUBJECT' 
  | 'HAS_TYPE' 
  | 'LOCATED_AT' 
  | 'CREATED_BY' 
  | 'ASSOCIATED_WITH_PERIOD';

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  degree?: number;
  meta?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
  evidence?: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  tagline: string;
  featuredMuseumIds: string[];
  featuredSubjectIds: string[];
  announcement: string;
  announcementEnabled: boolean;
  updatedAt: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  isGenerativeLivingMemory?: boolean;
  ctaText: string;
  ctaLink: string; // 'museums' | 'subjects' | 'graph' | 'about' | 'insights' | 'help'
  order: number;
  active: boolean;
  badgeText?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface AuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'MERGE_SUBJECT' | 'IMPORT' | 'RESTORE';
  targetCollection: string;
  targetId: string;
  details: string;
  adminEmail: string;
  timestamp: string;
}

export interface DataQualityReport {
  totalRecords: number;
  validRecords: number;
  missingTitles: number;
  missingSubjects: number;
  missingSpatial: number;
  missingSourceUri: number;
  recordsWithImage: number;
  uniqueTypesCount: number;
  uniqueSubjectsCount: number;
  duplicateCandidates: { title: string; count: number; ids: string[] }[];
}

export type BloomLayoutType = 'cose' | 'concentric' | 'circle' | 'breadthfirst' | 'radial';
export type BloomColorTheme = 'gold' | 'emerald' | 'amber' | 'royal' | 'terracotta' | 'obsidian';

export interface GraphBloomPreset {
  id: string;
  name: string;
  description: string;
  neo4jUrl?: string;
  cypherQuery?: string;
  layout: BloomLayoutType;
  category: 'archeology' | 'geography' | 'crafts' | 'royal' | 'ethnology' | 'all';
  focusType: 'All' | 'Museum' | 'Subject' | 'MuseumType';
  focusSubject?: string;
  maxNodes: number;
  badgeText?: string;
  colorTheme: BloomColorTheme;
  active: boolean;
  order: number;
  iconName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeGraphHighlight {
  title: string;
  detail: string;
  tag?: string;
}

export interface KnowledgeGraphImage {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  description: string;
  formattedText?: string;
  highlights: KnowledgeGraphHighlight[];
  tags: string[];
  active: boolean;
  order: number;
  credit?: string;
  updatedAt: string;
}

export interface MascotFaq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  targetTab?: string;
  targetMeta?: any;
}

export type MascotStateName = 
  | 'idle' 
  | 'greeting' 
  | 'chat' 
  | 'typing' 
  | 'thinking' 
  | 'listening' 
  | 'presenting' 
  | 'happy' 
  | 'surprised' 
  | 'confused' 
  | 'success' 
  | 'error' 
  | 'sleeping' 
  | 'goodbye';

export interface MascotPosition {
  x?: number;
  y?: number;
  bottom?: number;
  right?: number;
  isCustomDrag?: boolean;
}

export interface UserInquiry {
  id: string;
  query: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'converted';
  note?: string;
}

export interface MascotConfig {
  enabled: boolean;
  name: string;
  subtitle: string;
  greeting: string;
  currentPose: string;
  size: 'normal' | 'large' | 'extra-large' | number;
  position: MascotPosition;
  stateImages?: Partial<Record<MascotStateName, string>>;
  suggestedPrompts: string[];
  speechBubbleEnabled: boolean;
  customFaqs: MascotFaq[];
  soundEnabled?: boolean;
}

export interface LocalLivingCategory {
  id: string;
  name: string; // Database museum.type e.g. 'วัด', 'สถานศึกษา', 'หน่วยงานราชการ', etc.
  title: string;
  subtitle: string;
  iconName: string;
  colorTheme: string;
  order: number;
  active: boolean;
  featuredSubjects: string[];
}

export interface LocalLivingTaxonomyConfig {
  mainTitle: string; // 'วิถีชีวิตท้องถิ่น'
  mainSubtitle: string;
  mainDescription: string;
  badgeText: string;
  categories: LocalLivingCategory[];
  updatedAt: string;
}

export interface NavDropdownItem {
  id: string;
  label: string;
  subLabel?: string;
  iconName?: string;
  targetTab: string; // 'home' | 'museums' | 'subjects' | 'graph' | 'insights' | 'about' | 'help'
  targetMeta?: any; // e.g. { filterType: 'วัด' }, { viewMode: 'image' }, etc.
  externalUrl?: string;
  badge?: string;
  active: boolean;
  order: number;
}

export interface NavMenuItem {
  id: string;
  label: string;
  iconName?: string;
  targetAction: 'navigate' | 'search' | 'help' | 'external';
  targetTab?: string; // 'home' | 'museums' | 'subjects' | 'graph' | 'insights' | 'about' | 'help'
  targetMeta?: any; // custom params passed to page
  externalUrl?: string;
  hasDropdown?: boolean;
  dropdownItems?: NavDropdownItem[];
  badge?: string;
  badgeColor?: string;
  order: number;
  active: boolean;
  showOnMobile: boolean;
}

export interface HeaderConfig {
  brandTitle: string;
  brandSubtitle: string;
  brandEmblemUrl: string;
  searchButtonLabel: string;
  searchShortcut: string;
  helpButtonLabel: string;
  menuItems: NavMenuItem[];
  updatedAt: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  role: string;
  affiliation?: string;
  bio?: string;
  imageUrl: string;
  email?: string;
  phone?: string;
  websiteUrl?: string;
  socialLinks?: {
    facebook?: string;
    line?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
  order: number;
  active: boolean;
}

export interface ContactPageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  
  // Location & Org info
  organizationName: string;
  address: string;
  province: string;
  postalCode: string;
  mapEmbedUrl?: string;
  mapCoordinates?: string;
  transportationGuide?: string;
  openingHours: string;
  
  // Contact channels
  telephone: string;
  hotline?: string;
  email: string;
  contactEmailSecondary?: string;
  lineId?: string;
  lineQrCodeUrl?: string;
  facebookUrl?: string;
  facebookPageName?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  
  // Creators section
  creatorsSectionTitle: string;
  creatorsSectionSubtitle: string;
  creatorsSectionDescription: string;
  creators: CreatorProfile[];
  
  // Contact Form settings
  formEnabled: boolean;
  formTitle: string;
  formSubtitle: string;
  formSuccessMessage: string;

  updatedAt: string;
}
