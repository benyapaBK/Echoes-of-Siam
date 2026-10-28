# MUSEUM ATLAS THAILAND — ภูมิปัญญาไทยในพิพิธภัณฑ์

A scholarly, modern digital archive and knowledge discovery platform indexing 1,574 verified museums across Thailand from the Princess Maha Chakri Sirindhorn Anthropology Centre (SAC) dataset, featuring interactive knowledge graph exploration with Cytoscape.js, full-featured search and filtering, data quality analytics, and a secure administration system with Cloud Firestore integration.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1 clarification:
> - **Dataset Loading**: Pre-bundle and index all 1,574 verified museum records from the official SAC dataset for immediate client-side exploration, paired with live Cloud Firestore synchronization and batch import tooling.
> - **Knowledge Graph Perspective**: Center the initial graph visualization on high-degree Heritage Subjects and interconnected Museum clusters (such as "วิถีชีวิตท้องถิ่นและภูมิปัญญา", "ประวัติศาสตร์และโบราณคดี", and "พระพุทธรูป") to reveal cultural linkages without overloading the viewport.
> - **Admin Experience**: Provide a development preview demo admin toggle (`admin@gmail.com`) for immediate evaluation, while preserving real Firebase Authentication (Email/Password) and hardened Firestore security rules ready for production deployment.

---

## 1. Overview & Core Concept

- **What It Does**: Serves as a digital archive and relational discovery atlas for Thai museums. Users can search and filter 1,574 institutions by classification, geographical location (spatial), era (temporal), and subjects. An interactive Cytoscape.js Knowledge Graph enables visual navigation across entities (Museums, Subjects, Types, Places, Time Periods) and their verified relationships (`HAS_SUBJECT`, `HAS_TYPE`, `LOCATED_AT`, `CREATED_BY`, `ASSOCIATED_WITH_PERIOD`).
- **Target Audience & Persona**: Cultural heritage researchers, museum professionals, educators, students, domestic and international travelers, and digital archivists.
- **Key Value**: Moves beyond flat directory listings by surfacing the interconnected fabric of Thai wisdom and historical narrative, preserving 100% of the authentic government dataset without hallucinated records.

---

## 2. User Experience & Visual Design

### Visual Identity & Curatorial Theme (Museum & Editorial Domain)
In accordance with `references/9_museum_editorial_institutional.md` and the Master Prompt design tokens:
- **Brand Palette**:
  - Primary Brown: `#9c7d5c` (Navigation headers, anchor elements, primary buttons)
  - Heritage Gold: `#e6c12f` & Warm Gold: `#e8c742` (Key metrics, subject badges, focal accents)
  - Warm Beige: `#ece4d4` & Soft Yellow: `#fff59d` (Secondary panels, pill-free metadata callouts)
  - Archival Surface: `#fffdf7` & Border: `#d7c8b2` (1px delicate hairline dividers, no heavy dropshadows)
  - Typography: Deep Ink Brown `#463629` (high legibility contrast) & Muted Sienna `#6f5a45`
- **Typographic Hierarchy**:
  - Expressive Display Serif for institutional headers (e.g. *Playfair Display* / *Fraunces* style serif headings with `text-wrap: balance`).
  - Contemporary, highly legible Thai & Latin sans-serif for body reading (*Plus Jakarta Sans* / *Sarabun* scale, 1.6 leading).
  - Tabular numerals (`tabular-nums`) for accession metrics, record counts, and dates.
- **Anti-Slop Discipline**:
  - **Zero-Pill Metadata**: Metadata fields (type, province, language, era) rendered as clean unboxed text separated by typographic middots (`·`).
  - **Interactive Controls**: Distinct functional segmented tabs and filter chips for active queries.
  - **No Decorative Dots or Fake Metrics**: Real, computed statistics directly from the 1,574 dataset records.

### Key User Flows & Pages
1. **Public Discovery Flow**:
   - **Homepage**: Archival marquee hero ("ทุกพิพิธภัณฑ์มีเรื่องราว ทุกหัวเรื่องมีความเชื่อมโยง"), search bar with live auto-suggestions, verified statistics ribbon (1,574 museums, 2,460 subjects, 9 institutional types), featured curatorial collections, and an interactive Knowledge Graph teaser.
   - **Museum Directory**: Multi-faceted search by title, creator, province/spatial text, subject, and museum type, with active filter tags, sorting, grid/table view toggle, and pagination.
   - **Museum Detail**: High-resolution gallery presentation, full provenance, license, official SAC source link (`db.sac.or.th`), subject tags, related museums sharing subjects, and a mini localized knowledge graph.
   - **Subject Explorer**: Catalog of 2,460 distinct subjects sorted by frequency or name, with connected museum rosters and co-occurrence graphs.
   - **Knowledge Graph**: Full-screen Cytoscape.js canvas with zoom, pan, node type filters, ego-network node expansion, detail drawer, and graph export (JSON/CSV).
   - **Insights & Data Overview**: Real chart breakdowns of museum types, top subjects, regional distribution, and field completeness.
   - **About & Sources**: Provenance documentation, methodology, data dictionary, and Sirindhorn Anthropology Centre attribution.
2. **Admin & Data Management Flow**:
   - **Authentication**: Firebase Email/Password login modal with dev quick-access toggle for `admin@gmail.com`.
   - **Dashboard**: Real-time record counts, data health check, and recent audit activity.
   - **Museum CRUD & Subject Manager**: Detailed editor with external HTTPS image URL preview, subject linking, draft/published status toggle, and soft-delete/restore capability.
   - **Data Quality & Audit Logs**: Completeness inspection, duplicate candidate detection, and audit trail of administrative modifications.
   - **Import & Export**: Client/Admin CSV/JSON import pipeline with schema validation and UTF-8 with BOM export for spreadsheet compatibility.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Pre-Bundled Cleaned Dataset with Dual-Source Architecture**
  - *Chosen Approach*: Embed the verified 1,574-record dataset from the user's zip into an optimized client-side database/index (`src/data/museums.json`), while providing seamless Firestore read/write sync hooks for admin modifications.
  - *Why*: Guarantees instant zero-latency loading and zero empty-state friction for all public visitors, while maintaining 100% fidelity with the user's requirement for live Firestore management.
  - *Alternatives Considered*: Empty database on initial launch requiring manual import — rejected per user clarification to enable instant browsing.
- **Decision 2: Graph Engine with Cytoscape.js & Canvas Optimization**
  - *Chosen Approach*: Deploy Cytoscape.js with `cose` (compound spring embedder) / concentric layouts, node clustering, and progressive neighborhood expansion rather than dumping all 4,000+ nodes simultaneously.
  - *Why*: Rendering 1,574 museums + 2,460 subjects simultaneously in browser WebGL/Canvas causes severe stuttering. Progressive ego-networks maintain 60 FPS while enabling deep associative discovery.
- **Decision 3: External Images Only (No Firebase Storage)**
  - *Chosen Approach*: Enforce external HTTPS image URLs with inline fallback containers (`bg-stone-100` with archival badge) and Alt-text validation, adhering strictly to the user constraint banning Firebase Storage.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MUSEUM ATLAS THAILAND                           │
├──────────────────────────────────┬─────────────────────────────────────┤
│          PUBLIC ARCHIVE          │            ADMIN CONSOLE            │
│  ┌────────────────────────────┐  │  ┌───────────────────────────────┐  │
│  │ Home, Directory & Search   │  │  │ Admin Dashboard & Auth Guard  │  │
│  │ Museum Detail & Provenance │  │  │ Museum & Subject Management   │  │
│  │ Subject Explorer (2,460)   │  │  │ Data Quality & Duplicate Audit│  │
│  │ Cytoscape Knowledge Graph  │  │  │ Import / Export (CSV/JSON)    │  │
│  │ Insights & Data Overview   │  │  │ Version History & Trash Bin   │  │
│  └─────────────┬──────────────┘  │  └───────────────┬───────────────┘  │
└────────────────┼────────────────────────────────────┼──────────────────┘
                 │                                    │
                 ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   UNIFIED DATA & PERSISTENCE LAYER                     │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │
│  │   Pre-Seeded SAC Dataset     │    │   Cloud Firestore Services   │  │
│  │  (1,574 Museums, 2,460 Subs) │◄───┤  - museums, subjects, audit  │  │
│  │   Local In-Memory Cache      │    │  - siteSettings, graphConfig │  │
│  └──────────────────────────────┘    └──────────────────────────────┘  │
│                                                     │                  │
│                                                     ▼                  │
│                                      ┌──────────────────────────────┐  │
│                                      │  firestore.rules & Security  │  │
│                                      │  (Default-deny, ABAC Admin)  │  │
│                                      └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Entities
- **Museum**: `id`, `sourceId` (`sac_1`), `title`, `type` (9 types), `creator`, `provenance`, `subjectRaw`, `subjectIds` (`string[]`), `spatial` (address/province), `temporal` (year/era), `language`, `rights`, `license`, `sourceUri` (`db.sac.or.th/museum/museum-detail/{id}`), `imageUrl`, `imageAlt`, `status` (`published` | `draft` | `archived`), `createdAt`, `updatedAt`.
- **Subject**: `id`, `name`, `normalizedKey`, `museumCount`, `relatedMuseumIds`.
- **GraphNode / GraphEdge**: Node types (`Museum`, `Subject`, `MuseumType`, `Place`, `TimePeriod`) and verified relationships (`HAS_SUBJECT`, `HAS_TYPE`, `LOCATED_AT`, `ASSOCIATED_WITH_PERIOD`).
- **AuditLog & Trash**: Record ID, action (`CREATE`, `UPDATE`, `DELETE`, `MERGE_SUBJECT`), admin email, timestamp, and previous state.

---

## 5. Execution Stages

1. **Dataset Ingestion & Utilities**: Extract and parse all 1,574 museum records from `public/assets/aistudio/museum-vdrlqo_a224cf08.zip` into a structured, type-safe dataset `src/data/museums.ts` with subject extraction and indexing.
2. **Design Tokens & Global Styles**: Configure Thai heritage editorial colors, typography, and responsive layouts in `src/index.css`.
3. **Core Services & Firebase Integration**: Setup Firestore interfaces, mock/demo auth provider, error handlers conforming to `handleFirestoreError`, and `firestore.rules`.
4. **Public Interface & Navigation**: Build Header (top bar contract), Footer, Home, Directory, Detail, Subject Explorer, Insights, and About pages.
5. **Cytoscape Knowledge Graph**: Build interactive graph visualizer with node controls, filters, search, and detail modal.
6. **Admin Suite**: Build Admin Dashboard, Museum Editor, Subject Manager, Data Quality Inspector, Audit Logs, and CSV/JSON Import/Export.
7. **Verification & Quality Assurance**: Run build compilation and verify end-to-end functionality.
