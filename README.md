# StyleLens — AI Fashion Discovery & Runway Model Virtual Try-On

An AI-driven fashion discovery, body proportion scanning, and runway virtual try-on studio with an **Atelier Noir** luxury aesthetic.

StyleLens pairs budget, style preferences, comfort sensory needs, and camera capture with an AI body type analyzer to curate designer garments from **Zara**, **Calvin Klein**, and **Michael Kors**, rendering users as runway campaign models with interactive multi-outfit switching.

---

## ✨ Features

- **Progressive Single-Journey Studio**:
  - **Step 1: Style & Budget Calibration**: Visual cards for budget tier, aesthetic persona, comfort sensory profile, and clothing category.
  - **Step 2: Photo & Pose**: In-flow live webcam capture with full-body framing guide & 3-second pose countdown, file upload, or 1-click studio model preset.
  - **Step 3: AI Body Type & Silhouette Scan**: Real-time laser scanning animation analyzing body proportions (Hourglass, Athletic, Pear, Rectangle, Oval) with tailored flattering silhouette cut recommendations.
  - **Step 4: Curated Recommendations & Runway Try-On**: Presents the user as an authentic editorial campaign model with 1-click outfit switching across Zara, Calvin Klein, and Michael Kors.

- **Strict Retailer Budget Mapping**:
  - **Low Budget (\$25 – \$99)**: **Zara** (European high-street tailoring, urban staples)
  - **Medium Budget (\$60 – \$220)**: **Calvin Klein** (Minimalist Americana, iconic denim, sculpted knits)
  - **High Budget (\$250 – \$950)**: **Michael Kors (MKors)** (Double-face wool trench coats, evening georgette gowns, tuxedo suiting)

- **Interactive Runway Try-On Studio**:
  - **Editorial Model Presentation**: Luxury framing with fit confidence metrics, brand watermark, and campaign badge.
  - **3 Presentation Modes**:
    - *Runway Model*: Full editorial high-fashion presentation.
    - *Split Before/After Slider*: Interactive draggable divider comparing original pose against styled garment.
    - *Side-by-Side*: Dual comparison view of the original user photo alongside the composited model.
  - **Multi-Outfit Lookbook Dock**: Bottom dock with brand filter tabs (All, Zara, Calvin Klein, Michael Kors) and 1-click garment re-draping.
  - **Direct Retailer Checkout**: Instant links to official product pages.

- **Editorial Vogue Trends**:
  - Live editorial feed summarizing runway dispatches and fashion trends sourced from Vogue with AI styling takeaways.

- **Compliance & Privacy by Design**:
  - Strict compliance with the *AI Fashion Intake & Virtual Try-On Specification*:
  - In-memory ephemeral photo handling, non-inference of sensitive biometric traits, immediate 1-click data wipe, and FTC AI simulation disclaimers.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express, TypeScript (TSX)
- **AI & Computer Vision**:
  - Proportional Silhouette Body Type Analyzer
  - Gemini Neural Try-On & Context Builder
  - Voyage / Vonage Video API WebRTC Session Abstraction
- **Styling**: Tailored Atelier Noir palette (`#08080A`, `#111116`, champagne gold `#D4AF37`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ and npm installed

### 2. Installation
```bash
git clone https://github.com/akshi-atreya/AI-Fashion-Hackathon.git
cd AI-Fashion-Hackathon
npm install
```

### 3. Environment Setup (Optional)
```bash
cp .env.example .env
```
Fill in your API keys in `.env` if using live external providers:
```env
PORT=3005
CLIENT_PORT=5180
GEMINI_API_KEY=your_gemini_key_here
VOYAGE_API_KEY=your_voyage_key_here
```
*(The app includes resilient, zero-friction neural fallbacks and curated catalog seeds if API keys are not provided).*

### 4. Running the Application
Run both backend API server and frontend client concurrently:
```bash
npm run dev
```
- **Web App**: [http://localhost:5180](http://localhost:5180)
- **API Server**: [http://localhost:3005](http://localhost:3005)

---

## 📦 Production Build

```bash
npm run build
npm run preview
```

---

## 📜 License
MIT License
