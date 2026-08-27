# 🧭 Master Developer Reference & Feature Catalog (Career Projects)

> **Dokumen ini dirancang sebagai katalog referensi teknikal lengkap.**  
> Ketika kamu atau AI Agent ingin membuat fitur baru di masa depan, dokumen ini berfungsi sebagai **peta fitur, snippet pola implementasi, dan reusable modules** dari seluruh project yang ada di folder `Career`.

---

## 🗺️ Project Index & Ecosystem Overview

```
📁 E:\College Stuff\Career\
├── 🏎️ leclerc/               -> High-End Creative Web Experience (Canvas 2D, Web Audio API, GSAP + Lenis)
├── 🕷️ Portofolio/            -> Interactive Comic-Themed Portfolio (Gamification, Command Palette, Terminal, Audio FX)
├── 🎓 Student Life/          -> Cross-Platform App (React 19 + TypeScript + Electron + Capacitor Mobile + Supabase AI)
├── ☕ Website Kopi/           -> Fullstack Laravel 10/11 + Filament Admin CMS (E-Commerce, Booking & Services)
├── 🏛️ Fersya Website/        -> Laravel Architect Cafe Platform (Clean MVC Architecture & Blade Templates)
└── 💰 Saving Projects/       -> Lightweight Offline-First PWA & F1 Pit Wall Dashboard Telemetry Mockups
```

---

## 📑 Feature & Component Library by Project

---

### 1. 🏎️ Project: `leclerc` (Creative Front-End & Audio-Visual)
* **Stack:** React 18, Vite 6, Tailwind CSS v4, GSAP 3, Lenis, Framer Motion 13, Simplex-Noise, Web Audio API.

#### 🎯 Fitur & Reusable Components:
1. **Lenis + GSAP Sync Engine (`src/App.jsx`)**
   * *Kegunaan:* Sinkronisasi frame render Lenis ke GSAP ticker agar kalkulasi `ScrollTrigger` tidak patah-patah / jittering.
   * *Snippet Pola:*
     ```javascript
     lenis.on('scroll', ScrollTrigger.update);
     gsap.ticker.add((time) => lenis.raf(time * 1000));
     gsap.ticker.lagSmoothing(0);
     ```
2. **Generative Fluid Waves Canvas (`src/components/ui/WavesBackground.jsx`)**
   * *Kegunaan:* Latar belakang garis gelombang dinamis prosedural berbasis `simplex-noise` dengan interaksi mouse repulsion (garis membias saat kursor mendekat) dan dukungan high-DPI retina display.
3. **Interactive Piano Synthesizer / Sound of Speed (`src/components/sections/SoundOfSpeed.jsx`)**
   * *Kegunaan:* Generator suara piano murni dengan Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode` + exponential ADSR envelope) tanpa perlu asset file audio MP3 eksternal.
4. **Animated SVG Stroke Signature (`src/components/hero/AnimatedSignature.jsx`)**
   * *Kegunaan:* Animasi goresan tanda tangan otomatis menggunakan manipulasi `strokeDasharray` dan `strokeDashoffset`.
5. **Dual Identity Split Screen (`src/components/sections/OnTrackOffTrack.jsx`)**
   * *Kegunaan:* Layout split-screen interaktif dengan flex-grow transition untuk menampilkan dualisme konsep/persona.
6. **3D Perspective Cards Vault (`src/components/sections/HelmetVault.jsx`)**
   * *Kegunaan:* Efek rotasi 3D dinamis (`rotateX`, `rotateY`, `perspective`) yang merespons posisi kursor mouse pada elemen kartu.
7. **Custom Spring-Physics Cursor (`src/components/ui/CustomCursor.jsx`)**
   * *Kegunaan:* Kursor kustom dengan fisika pegas (`useSpring`), deteksi elemen interaktif, dan `mix-blend-mode: difference`.

---

### 2. 🕷️ Project: `Portofolio` (Gamified & Creative Front-End Showcase)
* **Stack:** React 19, Vite 8, Tailwind CSS v4, GSAP 3.15 (`@gsap/react`), Anime.js 3.2.2, Framer Motion 12, Lenis 1.3, Lucide React.

#### 🎯 Fitur & Reusable Components:
1. **Gamification & Achievement System (`src/lib/achievements.js` & `src/components/AchievementToast.jsx`)**
   * *Kegunaan:* Sistem achievement toast pop-up otomatis saat pengguna melakukan aksi tertentu (misal: scroll 100%, buka terminal, klik easter egg, coba ganti suit).
2. **Command Palette / Quick Navigator (`src/components/CommandPalette.jsx`)**
   * *Kegunaan:* Modal pencarian cepat bergaya `Cmd+K` / `Ctrl+K` dengan shortcut keyboard global untuk navigasi seksi dan aksi instan.
3. **Interactive Developer Terminal / Parker Lab (`src/components/ParkerLabTerminal.jsx`)**
   * *Kegunaan:* Terminal interaktif di mana pengunjung bisa mengetik perintah (`help`, `skills`, `projects`, `contact`, `clear`, `matrix`) dengan efek teks bergaya hacker/retro CLI.
4. **Spider Skill Web Canvas Graph (`src/components/SpiderSkillWeb.jsx`)**
   * *Kegunaan:* Visualisasi skill berbasis jaring laba-laba interaktif / node-graph canvas yang bereaksi terhadap tarikan mouse.
5. **Mini Bug Hunter Easter Egg Game (`src/components/SpideyBugHunter.jsx`)**
   * *Kegunaan:* Mini game seru di mana bug merayap di layar dan pengguna bisa mengkliknya untuk mengumpulkan skor & membuka achievement.
6. **Suit & Theme Switcher (`src/components/SuitSelector.jsx`)**
   * *Kegunaan:* Pengganti palet warna tema global (Classic Red/Blue, Symbiote Black, Iron Spider Gold, 2099 Cyberpunk) secara instan.
7. **Comic Action FX & Halftone Doodle (`src/components/ComicActionFX.jsx`, `ComicDoodleButton.jsx`, `ComicTicker.jsx`)**
   * *Kegunaan:* Efek visual komik (balon kata aksi *POW!*, *THWIP!*, halftone dot pattern, dan continuous comic ticker).
8. **Interactive Sound FX Engine (`src/lib/soundFx.js` & `src/components/AudioPlayer.jsx`)**
   * *Kegunaan:* Web audio synthesizer untuk efek klik tombol, switch tema, pencapaian achievement, dan background ambiance.

---

### 3. 🎓 Project: `Student Life` (Full-Featured Cross-Platform Ecosystem)
* **Stack:** React 19, TypeScript 5.8, Tailwind CSS v4, Motion 12, Capacitor 8 (iOS/Android), Electron 43 (Desktop), Supabase JS 2.45, Vitest.

#### 🎯 Fitur & Reusable Components:
1. **Universal Multi-Platform Architecture (`electron/` & `capacitor.config.ts`)**
   * *Kegunaan:* Satu codebase React/TypeScript yang dikompilasi menjadi **Web App**, **Desktop App (Windows/Mac/Linux via Electron)**, dan **Mobile App (Android APK & iOS via Capacitor)**.
2. **Gamified Student Quest & Mission Tracker (`src/components/MissionsView.tsx` & `BadgesModal.tsx`)**
   * *Kegunaan:* Sistem manajemen tugas berbentuk quest RPG lengkap dengan reward EXP, streak harian, badge koleksi, dan level progres.
3. **AI-Powered Daily Quiz Generator (`supabase/functions/generate-quiz/index.ts` & `DailyQuizModal.tsx`)**
   * *Kegunaan:* Supabase Edge Function berbasis Deno/TypeScript yang mengintegrasikan AI API untuk menghasilkan kuis studi adaptif setiap hari.
4. **Personal Finance & Student Vault Tracker (`src/components/VaultView.tsx`, `AddTransactionModal.tsx`, `SavingsGoalModal.tsx`)**
   * *Kegunaan:* Modul pencatatan kas masuk/keluar, target tabungan dengan progress bar dinamis, dan visualisasi kategori pengeluaran.
5. **Interactive Agenda & Timetable System (`src/components/AgendaView.tsx` & `DashboardView.tsx`)**
   * *Kegunaan:* Kalender jadwal kuliah, countdown deadline tugas, reminder notifikasi, dan ringkasan performa akademik.
6. **Mobile-First Gestures & Expressive Navigation (`src/components/BottomNav.tsx`, `SideDrawer.tsx`, `ExpressiveSelect.tsx`)**
   * *Kegunaan:* Navigasi mobile responsif dengan drawer animasi spring physics, haptic feedback hooks, dan custom dropdown selector.

---

### 4. ☕ Project: `Website Kopi` & 🏛️ `Fersya Website / architect-cafe` (Fullstack & CMS)
* **Stack:** PHP 8.x, Laravel 10/11, Filament PHP v3 Admin Panel, MySQL/SQLite, Tailwind CSS, Blade Components.

#### 🎯 Fitur & Reusable Components:
1. **Filament Admin Resource & CRUD Management (`app/Filament/Resources/PortfolioResource.php`)**
   * *Kegunaan:* Dashboard CMS instan berbasis Filament untuk mengelola portofolio, produk kopi, artikel blog, dan testimoni tanpa perlu bikin UI admin manual dari nol.
2. **Booking & Consultation Engine Models (`app/Models/Consultation.php`, `Order.php`, `OrderItem.php`)**
   * *Kegunaan:* Skema database dan relasi Eloquent ORM untuk alur reservasi meja/konsultasi arsitek dan checkout order pesanan.
3. **Modular Blade Components Layout (`resources/views/frontend/layouts/app.blade.php`, `components/frontend/navbar.blade.php`)**
   * *Kegunaan:* Template engine terstruktur dengan sistem slot, yield, dan reusable partial views.

---

### 5. 💰 Project: `Saving Project` & `Saving Project Cinto` (Offline-First & Telemetry)
* **Stack:** HTML5, Modern Vanilla JS / Tailwind, PWA Service Worker (`manifest.json`), JSON Storage Backup.

#### 🎯 Fitur & Reusable Components:
1. **Offline-First Data Persistence & Backup (`savings-tracker-backup-*.json` & `PRD_Local_Savings_Tracker.md`)**
   * *Kegunaan:* Pola penyimpanan data murni client-side (LocalStorage / IndexedDB) dengan fitur export-import backup JSON yang aman tanpa ketergantungan server.
2. **F1 Pit Wall & Scuderia Telemetry Dashboard (`stitch_ferrari_leclerc_f1_theme`)**
   * *Kegunaan:* Desain layout HUD motorsport bertema telemetry data pit wall balapan.

---

## 🧠 Matrix Kemampuan & Referensi Cepat untuk AI / Developer

Ketika kamu meminta fitur tertentu di project baru, berikut referensi project asalnya:

| Jika kamu ingin membuat fitur... | Ambil referensi dari Project: | File / Modul Kunci: |
| :--- | :--- | :--- |
| **Generative Canvas Waves / Perlin Noise** | `leclerc` | `src/components/ui/WavesBackground.jsx` |
| **Synthesizer Suara / Web Audio API** | `leclerc` / `Portofolio` | `src/components/sections/SoundOfSpeed.jsx` & `src/lib/soundFx.js` |
| **Smooth Scroll + GSAP ScrollTrigger** | `leclerc` / `Portofolio` | `src/App.jsx` (`Lenis` + `gsap.ticker`) |
| **Command Palette (`Cmd+K` Modal)** | `Portofolio` | `src/components/CommandPalette.jsx` |
| **Interactive CLI Hacker Terminal** | `Portofolio` | `src/components/ParkerLabTerminal.jsx` |
| **Achievement / Gamification Pop-up** | `Portofolio` | `src/lib/achievements.js` & `src/components/AchievementToast.jsx` |
| **Theme / Costume Switcher** | `Portofolio` | `src/components/SuitSelector.jsx` |
| **Interactive Canvas Skill Web Node** | `Portofolio` | `src/components/SpiderSkillWeb.jsx` |
| **Bungkus Web jadi Desktop (Electron)** | `Student Life` | `electron/main.ts`, `electron/preload.ts`, `package.json` |
| **Bungkus Web jadi Android/iOS (Capacitor)** | `Student Life` | `capacitor.config.ts`, `android/`, `ios/` |
| **Database & Serverless Edge Functions (AI)**| `Student Life` | `supabase/schema.sql` & `supabase/functions/generate-quiz` |
| **Student Task RPG Quest Tracker** | `Student Life` | `src/components/MissionsView.tsx` |
| **Expense & Budget Tracker** | `Student Life` / `Saving Project` | `src/components/VaultView.tsx` & `PRD_Local_Savings_Tracker.md` |
| **Admin Panel CMS Instan (Laravel)** | `Website Kopi` | `app/Filament/Resources/` & `composer.json` |
| **E-Commerce & Consultation Booking** | `Website Kopi` | `app/Models/Order.php`, `Consultation.php` |

---

## 🚀 Cara Menggunakan Dokumen Ini ke Depan

1. **Untuk AI Assistant (Antigravity / LLM):**  
   Cukup berikan instruksi seperti:  
   * *"Buatkan fitur Command Palette seperti di project Portofolio"*  
   * *"Pasang integrasi Lenis + GSAP ScrollTrigger persis seperti di project leclerc"*  
   * *"Setup Electron + Capacitor wrapper dari pola di project Student Life"*
2. **Untuk Koleksi Belajar Pribadi (Obsidian / Notion / GitHub):**  
   File ini bisa kamu simpan sebagai **`Master-Feature-Catalog.md`** di vault catatanmu untuk menjadi indeks portofolio teknikal dan referensi arsitektur code kamu kapan pun dibutuhkan!
