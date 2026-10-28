# โครงสร้างฐานข้อมูล Cloud Firestore (Firestore Schema)

## 1. Collection: `museums/{museumId}`
เก็บบันทึกระเบียนพิพิธภัณฑ์ทั้งหมด

```typescript
interface MuseumDoc {
  id: string; // e.g. sac_1
  sourceId: string; // e.g. 1
  title: string;
  type: string;
  creator?: string;
  provenance?: string;
  subjectRaw: string;
  subjectList: string[];
  spatial: string;
  province: string;
  temporal?: string;
  language: string;
  rights?: string;
  license: string;
  sourceUri: string;
  imageUrl?: string;
  imageAlt?: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 2. Collection: `subjects/{subjectId}`
เก็บข้อมูลหัวเรื่องวัฒนธรรมและภูมิปัญญา 2,460 หัวข้อ

```typescript
interface SubjectDoc {
  id: string; // e.g. sub_5a8b9f12
  name: string;
  normalizedKey: string;
  count: number;
  museumIds: string[];
  status: 'active' | 'merged' | 'archived';
  mergedIntoId?: string;
  updatedAt: Timestamp;
}
```

## 3. Collection: `siteSettings/global`
เก็บการตั้งค่าข้อความและแบนเนอร์หน้าแรก

```typescript
interface SiteSettingsDoc {
  heroTitle: string;
  heroSubtitle: string;
  tagline: string;
  featuredMuseumIds: string[];
  featuredSubjectIds: string[];
  announcement: string;
  announcementEnabled: boolean;
  updatedAt: Timestamp;
}
```

## 4. Collection: `auditLogs/{logId}`
บันทึกประวัติการกระทำของผู้ดูแลระบบ

```typescript
interface AuditLogDoc {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'MERGE_SUBJECT' | 'IMPORT' | 'RESTORE';
  targetCollection: string;
  targetId: string;
  details: string;
  adminEmail: string;
  timestamp: Timestamp;
}
```

## 5. Collection: `trash/{trashId}`
เก็บระเบียนพิพิธภัณฑ์ที่ถูก Soft-delete เพื่อการกู้คืน
