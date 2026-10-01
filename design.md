# TaskMate --- Design System & UI Specification

## 1. Overview

**TaskMate** adalah aplikasi manajemen tugas akademik untuk mahasiswa.
Desain mengutamakan tampilan modern, bersih, profesional, ringan, dan
mudah dipindai dalam waktu singkat.

Dokumen ini menjadi acuan implementasi UI/UX berdasarkan seluruh screen
desain yang tersedia di project:

-   Sign In
-   Create Account
-   Student Productivity Dashboard
-   All Academic Tasks
-   Today Tasks
-   Upcoming Tasks
-   Create New Academic Task Modal
-   Completed Tasks

### Design Goals

1.  Membantu mahasiswa melihat prioritas tugas secara cepat.
2.  Menyediakan navigasi yang konsisten di seluruh halaman.
3.  Menonjolkan status, prioritas, deadline, dan kategori tugas.
4.  Menggunakan visual hierarchy yang jelas tanpa tampilan yang terlalu
    ramai.
5.  Tetap nyaman digunakan pada desktop, tablet, dan mobile.

------------------------------------------------------------------------

# 2. Brand Identity

## 2.1 Brand

**Nama aplikasi:** TaskMate\
**Tagline:** Student Academic Hub

### Brand Personality

-   Modern
-   Produktif
-   Friendly
-   Academic
-   Minimal
-   Trustworthy
-   Focus-oriented

## 2.2 Logo / App Icon

Gunakan ikon checklist di dalam bentuk rounded square.

Karakter visual:

-   Rounded square
-   Warna utama indigo
-   Ikon checklist berwarna putih
-   Shadow lembut
-   Ukuran desktop sekitar 40--44 px

Contoh konsep:

``` text
┌──────────┐
│    ✓     │
│          │
└──────────┘
 TaskMate
```

------------------------------------------------------------------------

# 3. Design Tokens

## 3.1 Primary Colors

  Token         Hex         Penggunaan
  ------------- ----------- ------------------------------
  Primary 50    `#EEF2FF`   Background tint
  Primary 100   `#E0E7FF`   Border / selected background
  Primary 500   `#6366F1`   Primary accent
  Primary 600   `#4F46E5`   Button / active state
  Primary 700   `#4338CA`   Hover / strong accent
  Royal Blue    `#434CE8`   Auth branding
  Accent        `#3E49E0`   Secondary brand accent

### Recommended Primary

``` css
--color-primary: #4F46E5;
--color-primary-hover: #4338CA;
--color-primary-soft: #EEF2FF;
```

## 3.2 Neutral Colors

  Token            Hex         Penggunaan
  ---------------- ----------- -----------------------------
  Background       `#F8FAFC`   Main application background
  Background Alt   `#F1F4F9`   Alternative page background
  Surface          `#FFFFFF`   Card / sidebar
  Text Primary     `#0F172A`   Heading
  Text Secondary   `#475569`   Body text
  Text Muted       `#94A3B8`   Supporting text
  Border           `#E2E8F0`   Border
  Border Soft      `#F1F5F9`   Subtle divider

## 3.3 Semantic Colors

  Status    Suggested Color   Penggunaan
  --------- ----------------- ----------------------------------------
  Success   `#059669`         Completed / milestone
  Warning   `#F59E0B`         Medium priority / approaching deadline
  Danger    `#DC2626`         High priority / overdue
  Info      `#2563EB`         Informational state

------------------------------------------------------------------------

# 4. Typography

## 4.1 Primary Font

Gunakan:

**Inter**

Fallback:

``` css
font-family:
  Inter,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  sans-serif;
```

## 4.2 Typography Scale

  Element                  Size     Weight
  ----------------- ----------- ----------
  Page Heading        28--32 px   700--800
  Section Heading     20--24 px        700
  Card Heading        16--18 px   600--700
  Body                14--16 px   400--500
  Small Text          12--13 px   400--600
  Caption             11--12 px        500

Gunakan line-height yang nyaman dan hindari paragraf terlalu padat.

------------------------------------------------------------------------

# 5. Layout System

## 5.1 Desktop Application Layout

Struktur utama:

``` text
┌───────────────────────────────────────────────────────────────┐
│                       TaskMate Application                    │
├───────────────┬───────────────────────────────────────────────┤
│               │                                               │
│   Sidebar     │              Main Content                     │
│   240–280px   │                                               │
│               │                                               │
│               │                                               │
│               │                                               │
└───────────────┴───────────────────────────────────────────────┘
```

Sidebar:

-   Lebar desktop: sekitar `256–280px`
-   Background: putih
-   Border kanan tipis
-   Tinggi: full viewport
-   Position: sticky/fixed pada desktop

Main content:

-   Flexible width
-   Background `#F8FAFC`
-   Padding sekitar 24--40 px
-   Konten menggunakan max-width jika diperlukan

## 5.2 Spacing

Gunakan sistem spacing berbasis kelipatan 4 px:

``` text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Default card padding:

``` text
20–24px
```

Gap antar card:

``` text
16–24px
```

------------------------------------------------------------------------

# 6. Border Radius

Gunakan radius yang cukup besar untuk memberikan karakter modern.

  Component              Radius
  ----------------- -----------
  Small button         8--10 px
  Input               10--12 px
  Card                14--20 px
  App icon            12--16 px
  Large container     24--32 px
  Auth container      28--32 px
  Pill                  9999 px

------------------------------------------------------------------------

# 7. Shadow

Shadow digunakan secara ringan.

### Card

``` css
box-shadow:
  0 4px 16px rgba(15, 23, 42, 0.05);
```

### Primary Button

Gunakan shadow indigo yang sangat halus.

### Auth Container

Gunakan shadow lebih kuat karena auth screen memiliki floating
container.

Hindari shadow terlalu gelap pada dashboard.

------------------------------------------------------------------------

# 8. Navigation / Sidebar

Sidebar merupakan komponen utama dan harus konsisten pada seluruh
halaman setelah login.

## 8.1 Struktur

``` text
┌─────────────────────────┐
│  [✓] TaskMate           │
│      Student Academic   │
│      Hub                │
│                         │
│  OVERVIEW               │
│  ▣ Dashboard            │
│  □ All Academic Tasks   │
│                         │
│  ACADEMIC CATEGORIES    │
│  ○ Today Tasks          │
│  ○ Upcoming Tasks       │
│  ○ Completed Tasks      │
│                         │
│                         │
│  ─────────────────────  │
│  Profile / User         │
└─────────────────────────┘
```

## 8.2 Navigation Item

Default:

-   Background transparan
-   Text `#475569`
-   Icon muted
-   Radius 10--12 px

Hover:

-   Background `#F8FAFC`
-   Text lebih gelap

Active:

-   Background `#EEF2FF`
-   Text `#4F46E5`
-   Icon `#4F46E5`
-   Font weight 600

------------------------------------------------------------------------

# 9. Authentication Screens

Authentication terdiri dari:

1.  Sign In
2.  Create Account

## 9.1 Overall Auth Layout

Desktop:

``` text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────────────┬────────────────────────────────┐ │
│  │                      │                                │ │
│  │   Brand Showcase     │       Authentication Form      │ │
│  │                      │                                │ │
│  │   TaskMate            │       Welcome back             │ │
│  │   tagline             │       Email                    │ │
│  │                      │       Password                 │ │
│  │   Feature Cards      │       [ Sign In ]              │ │
│  │                      │                                │ │
│  └──────────────────────┴────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Outer background:

-   Dark navy `#0D1017` atau `#07090E`
-   Dot-grid pattern
-   Padding desktop sekitar 24--40 px

Auth container:

-   Background putih
-   Rounded 28--32 px
-   Overflow hidden
-   Shadow besar
-   Desktop layout: 2 kolom

## 9.2 Brand Showcase Panel

Background:

-   Indigo / royal-blue gradient
-   Dot-grid pattern
-   White typography

Isi:

-   TaskMate branding
-   Tagline
-   Feature preview cards
-   Glassmorphism cards

Glass card:

``` css
background: rgba(255,255,255,0.08);
backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,0.18);
```

## 9.3 Sign In Form

Heading:

**Welcome back 👋**

Form:

-   Email
-   Password
-   Remember me jika diperlukan
-   Forgot password
-   Primary Sign In button
-   Google sign-in
-   Link ke Create Account

Input:

-   White background
-   Border `#E2E8F0`
-   Radius 10--12 px
-   Focus border primary
-   Focus ring primary soft

Primary button:

``` text
Background: #4F46E5
Text: white
Radius: 10–12px
Height: 44–48px
```

## 9.4 Create Account

Heading:

**Create your account 🚀**

Fields:

-   Full Name
-   Email
-   Password
-   Confirm Password

CTA:

**Create Account**

Secondary:

**Continue with Google**

------------------------------------------------------------------------

# 10. Dashboard

Dashboard merupakan halaman utama setelah user berhasil login.

## 10.1 Header

Contoh:

``` text
Good Evening, Alex 👋
Here's what's happening with your academic tasks today.
```

Header kanan dapat berisi:

-   Notification
-   User profile
-   Avatar
-   Menu

## 10.2 Summary Cards

Gunakan card untuk metrik utama:

``` text
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ Total Tasks    │ │ Today's Tasks  │ │ Completed      │
│ 24             │ │ 6              │ │ 18             │
└────────────────┘ └────────────────┘ └────────────────┘
```

Karakter:

-   White surface
-   Border soft
-   Rounded 16--20 px
-   Icon dengan background soft
-   Angka besar dan bold
-   Label kecil muted

## 10.3 Academic Progress

Gunakan progress bar atau progress card.

Informasi:

-   Progress percentage
-   Tasks completed
-   Remaining tasks
-   Deadline information

Progress color menggunakan primary indigo.

## 10.4 Priority Tasks

Task dengan prioritas tinggi harus mudah dikenali.

Contoh data:

-   Operating Systems Lab Quiz
-   Submit Database Management Report
-   Group Project Sync -- Mobile App Architecture
-   Finish UI/UX Assignment -- TaskMate Prototype

Task card harus menampilkan:

-   Task title
-   Subject/category
-   Deadline
-   Priority
-   Status
-   Checkbox/action

------------------------------------------------------------------------

# 11. Task Management

TaskMate memiliki empat konteks utama:

1.  All Academic Tasks
2.  Today Tasks
3.  Upcoming Tasks
4.  Completed Tasks

Semua halaman menggunakan layout yang sama agar pengguna tidak perlu
mempelajari ulang interface.

------------------------------------------------------------------------

# 12. All Academic Tasks

Header:

``` text
Good Evening, Alex 👋

All Academic Tasks
Manage and track all your academic responsibilities.
```

Filter toolbar:

-   All Status
-   All Priority
-   All Categories
-   Sort by Deadline

Filter menggunakan rounded select/button dengan border soft.

## Task List

Gunakan list/table hybrid.

Desktop:

``` text
┌─────────────────────────────────────────────────────────────┐
│ Task                    Category     Priority    Deadline   │
├─────────────────────────────────────────────────────────────┤
│ Database Report         Database     High        Oct 03     │
│ UI/UX Assignment        Design       Medium      Oct 05     │
│ Operating Systems Quiz  OS           High        Oct 07     │
└─────────────────────────────────────────────────────────────┘
```

Mobile dapat berubah menjadi stacked cards.

------------------------------------------------------------------------

# 13. Today Tasks

Tujuan halaman:

Menampilkan semua tugas yang perlu diperhatikan hari ini.

Header:

**Today Tasks**

Filter:

-   All Status
-   All Priority
-   Category
-   Deadline

CTA tambahan:

**Ask Gemini**

CTA ini dapat ditempatkan pada bagian kanan header atau toolbar.

------------------------------------------------------------------------

# 14. Upcoming Tasks

Menampilkan tugas yang akan datang.

Jika tidak ada data:

``` text
┌──────────────────────────────────┐
│                                  │
│          [ Illustration ]        │
│                                  │
│        No tasks yet              │
│   Start planning your academic   │
│   responsibilities.             │
│                                  │
│     [ Create Your First Task ]  │
│                                  │
└──────────────────────────────────┘
```

Empty state harus:

-   Terpusat
-   Banyak whitespace
-   Text muted
-   CTA primary

------------------------------------------------------------------------

# 15. Completed Tasks

Halaman ini menampilkan histori tugas selesai.

Highlight:

**You completed 24 tasks this month!**

Gunakan progress / achievement card.

Contoh:

``` text
┌────────────────────────────────────┐
│ ✓  You completed 24 tasks          │
│    this month!                     │
└────────────────────────────────────┘
```

Kemudian:

**Finished Tasks History**

Task completed dapat menggunakan:

-   Check icon
-   Text muted
-   Strikethrough opsional
-   Completed date
-   Category
-   Completion badge

Warna success dapat menggunakan:

`#059669`

------------------------------------------------------------------------

# 16. Create New Academic Task Modal

Modal muncul di atas dashboard dengan backdrop.

## 16.1 Backdrop

Gunakan:

-   Semi-transparent dark overlay
-   Blur sekitar 4--6 px
-   Background dashboard tetap terlihat samar

Contoh:

``` css
backdrop-filter: blur(5px);
```

## 16.2 Modal

Desktop:

-   Width sekitar 560--680 px
-   White background
-   Rounded 20--24 px
-   Shadow besar

Struktur:

``` text
┌───────────────────────────────────────┐
│ Create New Academic Task          ×   │
├───────────────────────────────────────┤
│                                       │
│ Task Title                            │
│ [................................]    │
│                                       │
│ Description                           │
│ [................................]    │
│ [................................]    │
│                                       │
│ Category          Priority            │
│ [...........]     [...........]        │
│                                       │
│ Deadline          Time                │
│ [...........]     [...........]        │
│                                       │
├───────────────────────────────────────┤
│                       Cancel  Create  │
└───────────────────────────────────────┘
```

Field yang direkomendasikan:

-   Task Title
-   Description
-   Category
-   Priority
-   Deadline
-   Time
-   Optional attachment

Actions:

-   Cancel
-   Create Task

Create Task merupakan primary CTA.

------------------------------------------------------------------------

# 17. Buttons

## Primary

``` text
Background: #4F46E5
Text: #FFFFFF
```

Hover:

``` text
Background: #4338CA
```

## Secondary

``` text
Background: #FFFFFF
Border: #E2E8F0
Text: #475569
```

## Ghost

Tidak menggunakan border.

Digunakan untuk:

-   Icon actions
-   Secondary navigation
-   Close button

## Button Sizes

  Size          Height
  -------- -----------
  Small      32--36 px
  Medium     40--44 px
  Large      48--52 px

------------------------------------------------------------------------

# 18. Form Controls

Input standard:

``` text
Height: 44–48px
Radius: 10–12px
Border: #E2E8F0
Padding: 12–14px
```

Focus:

``` text
border: #4F46E5
box-shadow: 0 0 0 3px #EEF2FF
```

Placeholder:

`#94A3B8`

Label:

-   13--14 px
-   Weight 600
-   `#334155`

------------------------------------------------------------------------

# 19. Status & Priority

Status badge:

``` text
Pending
In Progress
Completed
Overdue
```

Priority:

``` text
Low
Medium
High
```

Gunakan badge berbentuk pill.

Contoh:

``` text
[ High ]
[ Medium ]
[ Completed ]
```

Jangan hanya mengandalkan warna. Sertakan teks/icon agar tetap mudah
dipahami.

------------------------------------------------------------------------

# 20. Cards

Card dasar:

``` css
background: #FFFFFF;
border: 1px solid #E2E8F0;
border-radius: 16px;
padding: 20px;
```

Hover:

-   Shadow sedikit meningkat
-   Border dapat berubah menjadi primary soft
-   Transition 150--200 ms

Hindari efek hover yang terlalu besar.

------------------------------------------------------------------------

# 21. Icons

Gunakan icon style:

-   Outline
-   Minimal
-   Stroke sekitar 2 px
-   Konsisten

Icon dapat menggunakan:

-   Lucide
-   Heroicons
-   Material Symbols

Ukuran umum:

``` text
16px  → inline/small
20px  → navigation
24px  → primary action
32px+ → empty state / feature
```

------------------------------------------------------------------------

# 22. Responsive Design

## Desktop

Breakpoint:

``` text
>= 1024px
```

Layout:

-   Sidebar visible
-   Main content beside sidebar
-   Multi-column cards
-   Modal centered

## Tablet

Breakpoint:

``` text
768px – 1023px
```

Perubahan:

-   Sidebar dapat diperkecil atau menjadi drawer
-   Grid menjadi 2 kolom
-   Padding dikurangi
-   Table dapat berubah menjadi card list

## Mobile

Breakpoint:

``` text
< 768px
```

Perubahan:

-   Sidebar menjadi drawer / bottom navigation
-   Content full width
-   Grid menjadi 1 kolom
-   Filter menjadi horizontal scroll atau dropdown
-   Modal hampir full-width
-   Form field menjadi satu kolom
-   Header menjadi stacked

------------------------------------------------------------------------

# 23. Responsive Grid

Dashboard:

``` css
grid-template-columns: repeat(1, minmax(0, 1fr));
```

Tablet:

``` css
grid-template-columns: repeat(2, minmax(0, 1fr));
```

Desktop:

``` css
grid-template-columns: repeat(3, minmax(0, 1fr));
```

Untuk task list, desktop dapat menggunakan table/list sedangkan mobile
menggunakan card.

------------------------------------------------------------------------

# 24. Interaction & Motion

Gunakan motion yang sederhana.

Transition default:

``` css
transition: all 150ms ease;
```

Hover:

-   Button color transition
-   Card shadow
-   Navigation background

Modal:

1.  Backdrop fade in
2.  Modal fade + scale sedikit
3.  Content tetap stabil

Durasi:

``` text
150–250ms
```

Hindari animasi berlebihan karena aplikasi berfokus pada produktivitas.

------------------------------------------------------------------------

# 25. Accessibility

Semua implementasi harus memenuhi prinsip dasar accessibility.

### Keyboard

Semua:

-   Button
-   Input
-   Select
-   Navigation

harus dapat diakses menggunakan keyboard.

### Focus

Setiap interactive element memiliki visible focus state.

### Contrast

Pastikan teks utama memiliki contrast yang cukup terhadap background.

### Semantic HTML

Gunakan:

``` html
<header>
<nav>
<main>
<aside>
<section>
<form>
<button>
```

sesuai konteks.

### Form Error

Error harus ditampilkan menggunakan:

-   Pesan teks
-   Icon bila diperlukan
-   Border/error state

Jangan hanya menggunakan warna merah.

------------------------------------------------------------------------

# 26. Empty States

Empty state digunakan pada:

-   Upcoming Tasks
-   Completed Tasks jika belum ada data
-   Search/filter tanpa hasil

Komponen:

``` text
Illustration
Heading
Supporting description
Primary CTA
```

Gunakan whitespace yang cukup.

------------------------------------------------------------------------

# 27. Loading States

Gunakan skeleton loader untuk:

-   Dashboard cards
-   Task list
-   User profile

Skeleton menggunakan warna neutral soft.

Contoh:

``` text
┌────────────────────────────┐
│ ██████████                 │
│ █████████████████          │
│ ███████                    │
└────────────────────────────┘
```

------------------------------------------------------------------------

# 28. Error States

Error state harus menjelaskan masalah secara singkat.

Contoh:

``` text
Something went wrong

We couldn't load your tasks.
Please try again.

[ Try Again ]
```

------------------------------------------------------------------------

# 29. Content Guidelines

Gunakan copy yang:

-   Singkat
-   Friendly
-   Action-oriented
-   Tidak terlalu formal
-   Mudah dipahami mahasiswa

Contoh:

### Good

``` text
Create New Academic Task
```

### Avoid

``` text
Please enter the necessary information
to create a new academic responsibility.
```

CTA harus menggunakan kata kerja:

-   Create Task
-   Add Task
-   Sign In
-   Create Account
-   Try Again
-   View Tasks

------------------------------------------------------------------------

# 30. Component Architecture

Komponen yang disarankan:

``` text
components/
├── layout/
│   ├── AppShell
│   ├── Sidebar
│   ├── Header
│   └── MobileNavigation
│
├── auth/
│   ├── AuthLayout
│   ├── SignInForm
│   ├── RegisterForm
│   └── BrandShowcase
│
├── dashboard/
│   ├── SummaryCard
│   ├── ProgressCard
│   ├── PriorityTaskList
│   └── AcademicCategory
│
├── tasks/
│   ├── TaskCard
│   ├── TaskList
│   ├── TaskFilters
│   ├── TaskStatusBadge
│   ├── TaskPriorityBadge
│   └── TaskEmptyState
│
├── modal/
│   └── CreateTaskModal
│
└── common/
    ├── Button
    ├── Input
    ├── Select
    ├── Badge
    ├── Avatar
    └── Skeleton
```

------------------------------------------------------------------------

# 31. Page Structure

``` text
TaskMate
│
├── /login
│   └── Sign In
│
├── /register
│   └── Create Account
│
└── /app
    │
    ├── /dashboard
    │   └── Student Productivity Dashboard
    │
    ├── /tasks
    │   └── All Academic Tasks
    │
    ├── /tasks/today
    │   └── Today Tasks
    │
    ├── /tasks/upcoming
    │   └── Upcoming Tasks
    │
    └── /tasks/completed
        └── Completed Tasks
```

Create task:

``` text
/app/tasks/new
```

atau sebagai modal pada halaman task.

------------------------------------------------------------------------

# 32. UX Flow

## Authentication

``` text
Landing
   ↓
Sign In
   ↓
Dashboard
```

Jika belum memiliki akun:

``` text
Sign In
   ↓
Create Account
   ↓
Dashboard
```

## Create Task

``` text
Dashboard
   ↓
Create Task
   ↓
Create New Academic Task Modal
   ↓
Fill Form
   ↓
Create Task
   ↓
Task appears in task list
```

## Complete Task

``` text
Task List
   ↓
Mark as Completed
   ↓
Status = Completed
   ↓
Move to Completed Tasks
```

------------------------------------------------------------------------

# 33. Design Consistency Rules

1.  Jangan mengganti primary color antar halaman.
2.  Gunakan Inter secara konsisten.
3.  Sidebar harus memiliki struktur yang sama.
4.  Button primary selalu menggunakan indigo.
5.  Card menggunakan white surface.
6.  Background halaman menggunakan neutral light.
7.  Radius komponen harus konsisten.
8.  Jangan menggunakan terlalu banyak warna.
9.  Priority dan status harus memiliki label yang jelas.
10. Mobile layout harus tetap mempertahankan hierarchy desktop.

------------------------------------------------------------------------

# 34. Screen Reference Matrix

  Screen                           Layout                Primary Purpose
  -------------------------------- --------------------- -----------------
  Sign In                          Split Auth            Login
  Create Account                   Split Auth            Registration
  Student Productivity Dashboard   Sidebar + Dashboard   Overview
  All Academic Tasks               Sidebar + Task List   Semua tugas
  Today Tasks                      Sidebar + Task List   Tugas hari ini
  Upcoming Tasks                   Sidebar + Task List   Tugas mendatang
  Create New Academic Task         Modal                 Membuat tugas
  Completed Tasks                  Sidebar + History     Riwayat selesai

------------------------------------------------------------------------

# 35. Implementation Priority

Urutan implementasi yang disarankan:

### Phase 1 --- Foundation

-   Font
-   Color tokens
-   Spacing
-   Radius
-   Shadows
-   Buttons
-   Inputs
-   Badge

### Phase 2 --- Layout

-   App Shell
-   Sidebar
-   Header
-   Responsive navigation

### Phase 3 --- Authentication

-   Sign In
-   Register
-   Auth validation
-   Responsive auth layout

### Phase 4 --- Dashboard

-   Summary cards
-   Progress
-   Priority tasks
-   Categories

### Phase 5 --- Task Management

-   All Tasks
-   Today
-   Upcoming
-   Completed
-   Filtering
-   Sorting

### Phase 6 --- Create Task

-   Modal
-   Form validation
-   Create action
-   Success feedback

### Phase 7 --- Responsive & Accessibility

-   Mobile navigation
-   Responsive cards
-   Keyboard navigation
-   Focus states
-   Empty/loading/error states

------------------------------------------------------------------------

# 36. Final Visual Direction

TaskMate harus terasa seperti **modern academic productivity
dashboard**, bukan aplikasi administrasi yang kaku.

Karakter akhir:

``` text
Modern       █████████░
Clean        ██████████
Academic     █████████░
Friendly     ████████░░
Minimal      █████████░
Productive   ██████████
```

Prioritas visual:

**Clarity → Hierarchy → Consistency → Productivity → Decoration**

UI harus membantu mahasiswa menyelesaikan tugas, bukan membuat perhatian
mereka teralihkan oleh dekorasi.

------------------------------------------------------------------------

## Design Checklist

### Visual

-   [ ] Inter digunakan sebagai font utama
-   [ ] Indigo digunakan sebagai primary color
-   [ ] Background menggunakan neutral light
-   [ ] Card menggunakan white surface
-   [ ] Border dan shadow dibuat subtle
-   [ ] Radius konsisten

### Layout

-   [ ] Sidebar desktop tersedia
-   [ ] Mobile menggunakan drawer/bottom navigation
-   [ ] Dashboard responsive
-   [ ] Task list responsive
-   [ ] Modal responsive

### Interaction

-   [ ] Hover state
-   [ ] Focus state
-   [ ] Loading state
-   [ ] Empty state
-   [ ] Error state
-   [ ] Success feedback

### Accessibility

-   [ ] Keyboard navigation
-   [ ] Semantic HTML
-   [ ] Visible focus
-   [ ] Accessible labels
-   [ ] Color bukan satu-satunya indikator status

### Product Flow

-   [ ] Sign In
-   [ ] Create Account
-   [ ] Dashboard
-   [ ] All Tasks
-   [ ] Today Tasks
-   [ ] Upcoming Tasks
-   [ ] Completed Tasks
-   [ ] Create Task
-   [ ] Complete Task
