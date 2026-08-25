# 🏎️ Charles Leclerc #16 — Scuderia Ferrari HP Official Showcase

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/scrolltrigger/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An ultra-luxury, high-performance web experience showcasing Formula 1 driver **Charles Leclerc (#16)** and Scuderia Ferrari HP. Built with cutting-edge creative development techniques, bespoke fluid vector physics, interactive 3D WebGL rendering, and cinematic scroll choreography inspired by world-class driver platforms like *landonorris.com*.

---

## ✨ Key Features & Technical Highlights

### 1. 🌊 Dynamic Fluid Ribbon Trail Mask Engine
* **Tapered Aerodynamic Droplet Vector Spline:** As the cursor sweeps across Charles Leclerc's portrait, it continuously paints an organic liquid ribbon trail that seamlessly reveals his Monaco GP Helmet worn beneath.
* **Physics & Scale-Compensated Coordinate Mapping:** Computes velocity vectors, normal tangent lines ($\vec{n}$), and sub-step quadratic Bézier curves (`Q x y, midX midY`) in real-time, scaled precisely to parent bounding boxes regardless of GSAP CSS transforms.
* **Natural Dissolve / Fade-Out:** The fluid ribbon gracefully dissolves within 0.8 seconds of mouse inactivity, returning the portrait cleanly to its editorial state with zero mask glitching.
* **Synchronized Backdrop Liquid Shadow:** A companion fluid shadow layer trails beneath the portrait to produce physical depth.

### 2. ⚡ Client-Side BFS Transparency Processing
* Built-in canvas image pre-processor utilizing a **Breadth-First Search (BFS) flood-fill algorithm** on pixel data (`getImageData()`) to eliminate outer white and fake checkerboard backgrounds in milliseconds without requiring heavy backend image servers.

### 3. 🎬 Cinematic GSAP Scroll Choreography
* **Full-bleed Hero Zoom-out:** The fullscreen cover transitions smoothly into a cropped editorial portrait box with authentic Monza GP scooped notch framing.
* **Real-time SVG Signature Drawing:** Charles Leclerc's grand signature dynamically writes itself across the screen using animated `stroke-dasharray` and `stroke-dashoffset` precisely mapped to scroll progress ($0.12 \to 0.94$).
* **Frictionless Unpinning:** Optimized scroll pinning distance (`+=1400px`) eliminates frozen scrolling stalls, flowing seamlessly into the multi-chapter timeline.

### 4. 🪖 Interactive 3D WebGL Helmet Viewer
* Real-time 3D GLTF / Three.js visor helmet rendering with custom racing shaders, wireframe dome overlay, studio environment lighting, and interactive camera orbit controls.

### 5. ⏱️ Monza Grand Prix Telemetry HUD
* 1:1 authentic Monaco & Monza GP race telemetry cards with live tire telemetry, lap time indicators, sector delta bars, and official team radio audio player integration.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite
* **Animations & Physics:** GSAP (ScrollTrigger), Framer Motion, Canvas 2D
* **3D & Shaders:** Three.js, React Three Fiber (R3F), Drei
* **Styling & Typography:** Tailwind CSS, Custom Editorial Serif & Heavyweight Racing Sans Typography
* **Icons & Assets:** Lucide React, Custom F1 Monaco GP Photography & SVG Vectors

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/leclerc.git
   cd leclerc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
leclerc/
├── public/
│   ├── images/              # Cutout portraits, official helmet renders, Monza GP textures
│   └── models/              # 3D GLTF helmet models
├── src/
│   ├── components/
│   │   ├── 3d/              # Three.js 3D WebGL Helmet Viewers & Wireframe Domes
│   │   ├── hero/            # Hero Section, MainVisualStack, Fluid Ribbon Mask, Signature
│   │   ├── sections/        # Navbar, MenuOverlay, Timeline, Monza GP Cards
│   │   └── ui/              # WavesBackground, TextBoxReveal, Cutout Canvas processors
│   ├── App.jsx              # Main application layout & audio provider
│   ├── index.css            # Global design tokens, typography, and utility classes
│   └── main.jsx             # React DOM entrypoint
├── package.json             # Project dependencies and build scripts
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

---

## 🏎️ Scuderia Ferrari HP • Charles Leclerc #16
*“We did it at home. We did it at Monaco. For Ferrari.”*
