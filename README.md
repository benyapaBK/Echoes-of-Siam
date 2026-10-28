# Echoes of Siam - สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์

> "ทุกพิพิธภัณฑ์มีเรื่องราว ทุกหัวเรื่องมีความเชื่อมโยง"
> "เรื่องราวจากอดีต เชื่อมโยงองค์ความรู้ สู่การเรียนรู้ที่ไม่สิ้นสุด"

**Echoes of Siam (สยามเล่าขาน: ภูมิปัญญาไทยในพิพิธภัณฑ์)** เป็นแพลตฟอร์มสำรวจและค้นพบองค์ความรู้ (Knowledge Discovery Platform) ดิจิทัลสำหรับพิพิธภัณฑ์ 1,574 แห่งทั่วประเทศไทย โดยดึงข้อมูลจากชุดข้อมูลทางการของ **ศูนย์มานุษยวิทยาสิรินธร (องค์การมหาชน)** ผ่านพอร์ทัล Thai Gov Data พร้อมแผนผังองค์ความรู้เชิงความสัมพันธ์ (Knowledge Graph) ด้วย Cytoscape.js

---

## 1. จุดเด่นและฟังก์ชันหลักของระบบ (Features)

- **สารบัญและระบบค้นหาแบบละเอียด (Museum Directory)**: ค้นหาและกรอง 1,574 พิพิธภัณฑ์ตามประเภทการจัดการ (9 ประเภท), จังหวัด (77 จังหวัด), หัวเรื่อง และปีที่ก่อตั้ง พร้อมมุมมองแบบการ์ดและตาราง
- **หัวข้อสำคัญ: วิถีชีวิตท้องถิ่น (Subject Explorer)**: แสดงพิพิธภัณฑ์ 391 แห่งจากไฟล์ข้อมูล แยกเป็น 9 ประเภท พร้อมหัวเรื่องย่อยและตัวกรองจังหวัด โดยรวมระเบียนชื่อซ้ำเป็นรายการเดียวและเก็บลิงก์ต้นทางไว้ครบ
- **แผนผังองค์ความรู้ (Cytoscape.js Knowledge Graph)**: สำรวจความเชื่อมโยงของโหนดพิพิธภัณฑ์ หัวเรื่อง และประเภทสถาบันแบบ Interactive รองรับการซูม เลื่อน ขยายความเชื่อมโยงรอบตัว (Ego-network) และส่งออก Graph JSON
- **หน้ารายละเอียดพิพิธภัณฑ์ (Museum Detail)**: ข้อมูลประวัติการได้มา (Provenance), ผู้สร้าง (Creator), สิทธิ์ (Rights), ลิงก์ตรงสู่ฐานข้อมูล ศมส. (SAC) และพิพิธภัณฑ์ที่เกี่ยวข้อง
- **ภาพรวมและสถิติข้อมูล (Insights)**: กราฟแท่งเปรียบเทียบสัดส่วนประเภทพิพิธภัณฑ์ จังหวัดที่มีพิพิธภัณฑ์สูงสุด 12 ลำดับแรก และหัวเรื่องยอดนิยม 15 ลำดับแรก
- **ระบบผู้ดูแลระบบ (Admin Console)**:
  - เข้าสู่ระบบด้วยบัญชีผู้ดูแลจริงที่สร้างไว้ใน Firebase Authentication และได้รับอนุญาตในระบบ
  - จัดการพิพิธภัณฑ์ (เพิ่ม แก้ไข สถานะ ฉบับร่าง/เผยแพร่)
  - นโยบายรูปภาพภายนอก HTTPS เท่านั้น (ไม่มีการเก็บไฟล์ใน Firebase Storage)
  - เครื่องมือรวมหัวเรื่อง (Subject Merge Tool)
  - ถังขยะและระบบกู้คืน (Soft Delete & Restore)
  - ตรวจจับข้อมูลซ้ำซ้อนและรายงานคุณภาพข้อมูล (Data Quality Audit)
  - บันทึกกิจกรรมที่ไม่สามารถแก้ไขได้ (Immutable Audit Logs)
  - บันทึกข้อมูลที่ผู้ดูแลแก้ไขลง Firestore พร้อมบันทึก Audit Log
  - หน้าดาวน์โหลดข้อมูลสาธารณะ ส่งออกพิพิธภัณฑ์และหัวเรื่องได้เป็น CSV, JSON และ XML โดยไม่ต้องเข้าสู่ระบบ
  - ปรับขนาดมาสคอตด้วยแถบเลื่อน และเปิดแชทผ่านปุ่มแถบด้านข้างได้

---

## 2. อัตลักษณ์แบรนด์และชุดสี (Brand Identity & Color Tokens)

| ชื่อสี | รหัสสี HEX | การใช้งาน |
|---|---|---|
| Primary Brown | `#9c7d5c` | สีหลักสำหรับ Navigation, หัวข้อสำคัญ, ปุ่มหลัก |
| Heritage Gold | `#e6c12f` | โหนดหัวเรื่อง, สถิติสำคัญ, จุดเด่น |
| Warm Gold | `#e8c742` | โหนดความสัมพันธ์, ไฮไลต์ |
| Beige | `#ece4d4` | พื้นหลังพื้นที่รอง, การ์ดข้อมูล |
| Soft Yellow | `#fff59d` | ป้ายข้อมูลและการค้นพบ |
| Pale Yellow | `#fff9c4` | ไฮไลต์อ่อน |
| Text Primary | `#463629` | ข้อความหลัก Contrast สูง |
| Text Secondary | `#6f5a45` | ข้อความรองและคำอธิบาย |
| Surface | `#fffdf7` | พื้นหลังหลักนุ่มนวลสบายตา |
| Border | `#d7c8b2` | เส้นขอบบาง 1px Hairline |

---

## 3. สถาปัตยกรรมเทคโนโลยี (Technology Stack)

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Thai Google Fonts (*Bai Jamjuree*, *Sarabun*, *Playfair Display*)
- **Graph Engine**: Cytoscape.js
- **Icons**: Lucide React
- **Database & Auth**: Cloud Firestore + Firebase Authentication (Email/Password)
- **Data Source**: Princess Maha Chakri Sirindhorn Anthropology Centre (SAC)

---

## 4. การติดตั้งและเริ่มต้นใช้งาน (Installation)

### 4.1 ติดตั้ง Dependencies
```bash
npm install
```

### 4.2 เริ่มต้น Development Server
```bash
npm run dev
```
เซิร์ฟเวอร์จะเริ่มทำงานที่ `http://localhost:3000`

### 4.3 สร้างไฟล์สำหรับ Production Build
```bash
npm run build
```

---

## 5. การตั้งค่า Firebase (Firebase Setup)

1. สร้างโปรเจกต์ใน Firebase Console
2. เปิดใช้งาน **Cloud Firestore** และ **Firebase Authentication** (เลือกวิธี Email/Password)
3. กำหนดค่าจาก Web App ใน Firebase Console ลงใน `firebase-applet-config.json` ซึ่งเป็นไฟล์ที่แอปใช้เชื่อมต่อ Firebase
4. เพิ่มบัญชีผู้ดูแลจริงใน **Authentication → Users** และตั้งรหัสผ่านจาก Firebase Console หรือส่งลิงก์รีเซ็ตรหัสผ่านให้ผู้ดูแล ห้ามเก็บรหัสผ่านจริงไว้ใน source code หรือเอกสาร
5. หน้าเข้าสู่ระบบแอดมินกรอกเฉพาะรหัสผ่าน โดยระบบใช้บัญชี `admin@gmail.com` ใน Firebase Authentication (ตั้งรหัสผ่านของบัญชีนี้ใน Firebase Console)
6. ปรับใช้กฎความปลอดภัย `firestore.rules` และดัชนี `firestore.indexes.json` ก่อนเปิดใช้งานการบันทึกข้อมูลจากผู้ดูแล โดยระบบใช้คอลเลกชัน `museums`, `subjects`, `banners`, `bloom_presets`, `kg_images`, `site_configs`, `audit_logs`, `trash` และ `user_inquiries`
