# 🏎️ Learning Vault: Leclerc Redline Heritage Web Experience

> **Tipe Project:** High-End Interactive Motorsport Portfolio / Creative Web Experience  
> **Fokus Utama:** Creative Front-End Development, Canvas Generative Graphics, Web Audio API, Advanced GSAP/Framer Motion Animations & Smooth Inertia Scrolling.

---

## 🛠️ 1. Tech Stack & Dependencies

| Kategori | Teknologi / Library | Versi | Alasan Penggunaan & Peran |
| :--- | :--- | :--- | :--- |
| **Core Framework** | **React 18** | `^18.3.1` | Arsitektur berbasis komponen, declarative UI, efisiensi state & lifecycle management. |
| **Bundler & Tooling** | **Vite** | `^6.0.0` | Lightning-fast HMR (Hot Module Replacement) dan optimal build bundling. |
| **Styling** | **Tailwind CSS v4** | `^4.0.0` | Engine styling performan tinggi dengan CSS custom properties, utility classes, dan custom themes. |
| **Smooth Scroll** | **Lenis** | `^1.1.20` | Memberikan *inertial smooth scrolling* standar industri web interaktif modern. |
| **Core Animation** | **GSAP (GreenSock)** | `^3.12.5` | Animasi performa tinggi untuk timeline kompleks dan integrasi **ScrollTrigger**. |
| **Declarative Motion** | **Framer Motion** | `^13.1.1` | Animasi komponen React, physics spring, gesture interactions, infinite marquee, & layout animations. |
| **Generative Math** | **Simplex-Noise** | `^4.0.3` | Algoritma matematika noise prosedural untuk kalkulasi gelombang fluida dinamis pada HTML5 Canvas. |
| **Audio Engine** | **Native Web Audio API** | *Browser Built-in* | Sintesis audio interaktif (piano synth & F1 engine audio) tanpa load file MP3 eksternal. |
| **Icons** | **Lucide React** | `^1.16.0` | Set icon teknikal, motorsport-friendly, dan hemat bundle size. |

---

## ⚡ 2. Fitur-Fitur & Teknik Coding yang Diimplementasikan

### 1. **Lenis Smooth Scroll + GSAP ScrollTrigger Synchronization**
* **Konsep:** Menyatukan rendering frame Lenis dengan `gsap.ticker` agar kalkulasi posisi `ScrollTrigger` tidak mengalami *jittering* atau *desync* saat scrolling cepat.
* **Pola Implementasi:**
  ```javascript
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  ```

---

### 2. **Generative Fluid Waves (HTML5 Canvas 2D + Simplex Noise)**
* **Komponen:** `WavesBackground.jsx`
* **Konsep:**
  * Menggunakan `simplex-noise` untuk menghitung pergerakan kurva sinus procedural secara *real-time* berbasis waktu (`Date.now()`).
  * **Interactive Mouse Repulsion:** Titik koordinat kursor mouse membiaskan jarak gelombang sehingga kanvas bereaksi terhadap gerakan kursor pengguna.
  * **Adaptive Resize & DPR:** Menangani rasio pixel monitor (Device Pixel Ratio) agar visual garis tetap tajam tanpa blur pada layar Retina/HiDPI.

---

### 3. **Hero Face vs Helmet Dynamic Slice & Parallax Reveal**
* **Komponen:** `FaceHelmetReveal.jsx` & `MainVisualStack.jsx`
* **Konsep:**
  * Penggabungan visual ganda (wajah Charles Leclerc & Helm Balap Ferrari) dengan clipping/overlay presisi.
  * Animasi teks marquee berjalan tak terbatas (*infinite continuous ticker*) dengan kecepatan terpisah menggunakan Framer Motion.
  * Hover HUD telemetry card bergaya Ferrari telemetry data.

---

### 4. **Animated SVG Signature Draw-In Effect**
* **Komponen:** `AnimatedSignature.jsx`
* **Konsep:**
  * Menggunakan teknik `strokeDasharray` dan `strokeDashoffset` pada path SVG asli tanda tangan Charles Leclerc.
  * Di-trigger saat elemen masuk ke viewport pengguna (`whileInView`) dengan efek *ease-out* menyerupai goresan pena asli.

---

### 5. **Interactive Piano Synthesizer / Sound of Speed (Web Audio API)**
* **Komponen:** `SoundOfSpeed.jsx`
* **Konsep:**
  * Membuat sound generator mandiri menggunakan `AudioContext`, `OscillatorNode`, dan `GainNode`.
  * **ADSR Envelope (Attack, Decay, Sustain, Release):** Membentuk kurva gain eksponensial (`exponentialRampToValueAtTime`) sehingga menghasilkan resonansi tuts piano nyata saat ditekan atau diklik.
  * Nada berurutan memainkan notasi piano otentik yang pernah diciptakan Leclerc (karya "AUS23", "MIA23", "MON24").

---

### 6. **3D Interactive Perspective Cards & Vault (Helmet Vault)**
* **Komponen:** `HelmetVault.jsx`
* **Konsep:**
  * CSS 3D Transforms (`perspective`, `rotateX`, `rotateY`, `translateZ`) yang merespon posisi kursor mouse pada kartu helm.
  * Filter multi-kategori (Monaco Edition, Monza Special, Standard Season) dengan layout transisi mulus.

---

### 7. **Dual-Identity Split Interaction (On-Track vs Off-Track)**
* **Komponen:** `OnTrackOffTrack.jsx`
* **Konsep:**
  * Menggambarkan dualisme Charles: *The Fierce Racer (Scuderia Ferrari)* vs *The Sensitive Artist (Pianist & Fashion Icon)*.
  * Layout split-screen interaktif dengan transisi rasio lebar (*flex grow transition*), gradasi warna kontras (*Ferrari Red* vs *Deep Royal Monochrome*), dan hover audio cue.

---

### 8. **Custom Spring-Physics Cursor with Blend Mode**
* **Komponen:** `CustomCursor.jsx`
* **Konsep:**
  * Kursor dinamis yang mengikuti mouse dengan spring physics (Framer Motion `useSpring`).
  * Efek perbesaran saat hover di atas elemen interaktif (tombol, link, tuts piano) dan `mix-blend-mode: difference` untuk visibilitas di latar belakang gelap/terang.

---

### 9. **Motorsport HUD & Noise Texture Design System**
* **File:** `index.css` & `charlesData.js`
* **Konsep:**
  * *Color Token:* Ferrari Corsa Red (`#E10600`), Modena Giallo (`#FFE500`), Carbon Black (`#080809`), Monaco White (`#F8F9FA`).
  * *Typography Hierarchy:* `Playfair Display` (editorial luxury), `Syne` / `Space Grotesk` (racing bold), dan `JetBrains Mono` (F1 telemetry data).
  * *Overlay SVG Noise:* Memberikan tekstur film grain analog mewah di atas UI digital.

---

## 💡 3. Key Learnings & Rekomendasi Praktik (Cheat Sheet)

1. **Performance Canvas:** Selalu batasi loop animasi canvas dengan `requestAnimationFrame` dan bersihkan event listener pada `return () => cancelAnimationFrame(id)` di `useEffect` untuk mencegah memory leak.
2. **Audio UX Policy:** Browser memblokir auto-play audio sebelum ada interaksi pengguna (*user gesture*). Selalu inisialisasi atau resume `AudioContext` setelah interaksi klik/tap pertama.
3. **Scroll Jitter Prevention:** Jika menggunakan Lenis bersamaan dengan library animasi lain, matikan native smoothing browser dan serahkan clock tick ke GSAP ticker.
4. **Tailwind v4 Setup:** Tailwind v4 menggunakan skema `@import "tailwindcss";` tanpa perlu file `tailwind.config.js` yang besar, semua custom font dan layer dapat didefinisikan langsung via `@theme` atau custom CSS classes.

---

## 📂 4. Saran Format untuk Koleksi Belajar (Pilih yang Paling Cocok)

Untuk mendokumentasikan apa yang kamu pelajari dari setiap project ke depannya, berikut 4 format terbaik yang bisa kamu pilih:

```
                  ┌──────────────────────────────────────────────────┐
                  │          OPSI SISTEM KOLEKSI BELAJAR             │
                  └──────────────────────────────────────────────────┘
                                           │
         ┌──────────────────┬──────────────┴─────┬──────────────────┐
         ▼                  ▼                    ▼                  ▼
  [1. Obsidian Vault]  [2. Notion Hub]    [3. GitHub Repo]   [4. Interactive Lab]
    (Second Brain)       (All-in-One)     (Dev-Cookbook)       (Live Playground)
```

### Opsi 1: **Obsidian (Markdown Second Brain) — ⭐ *Sangat Direkomendasikan***
* **Kelebihan:** 
  * Semua file berbasis file `.md` lokal (kamu punya kendali 100% atas datamu).
  * Bisa menghubungkan konsep antar-project menggunakan internal link `[[GSAP]]`, `[[Web Audio API]]`, `[[Canvas 2D]]`.
  * Graph View memungkinkan kamu melihat teknologi apa yang paling sering kamu pakai dan kuasai.
* **Struktur Folder Saran:**
  ```text
  My-Dev-Vault/
  ├── 01-Projects/
  │   └── 2026-Leclerc-Redline/
  │       ├── README.md
  │       ├── Features-Breakdown.md
  │       └── Code-Snippets/
  ├── 02-Tech-Stack/
  │   ├── GSAP-ScrollTrigger.md
  │   ├── Web-Audio-API.md
  │   └── Canvas-Simplex-Noise.md
  └── 03-Reusable-Components/
      ├── CustomCursor.md
      └── WavesBackground.md
  ```

---

### Opsi 2: **Notion (Visual Database & Project Wiki)**
* **Kelebihan:**
  * Ada view Gallery, Table, dan Board (bisa cantumkan thumbnail visual / screenshot hasil project).
  * Mudah menambahkan status: *Mastered*, *Experimented*, *Need Revision*.
  * Sangat rapi untuk melampirkan screenshot, demo GIF, dan link deploy/GitHub.

---

### Opsi 3: **GitHub Repo Khusus (`developer-cookbook` / `learning-vault`)**
* **Kelebihan:**
  * Kamu bisa jadikan repo publik sebagai portofolio dokumentasi teknikalmu (*recruiter suka melihat engineer yang punya catatan rapi*).
  * Bisa diakses dari mana saja melalui GitHub web, VSCode web (`github.dev`), atau terminal.

---

### Opsi 4: **Interactive Component Playground (Docusaurus / Storybook / Next.js Lab)**
* **Kelebihan:**
  * Bukan hanya teks catatan, tapi komponen seperti `WavesBackground`, `CustomCursor`, dan `PianoSynth` bisa langsung kamu pasang live di satu website playground pribadimu (misal: `lab.yourname.dev`).
  * Sangat berguna saat kamu butuh copas komponen untuk project baru atau client di masa depan.
