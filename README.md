# 🌿 Kisaan Mitra - AI Plant Disease Doctor

[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?logo=github)](https://github.com/Vidhi35/Kisan_Mitra)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![Powered By Groq](https://img.shields.io/badge/AI-Groq%20Llama%203-f55036)](https://groq.com/)

**Kisaan Mitra** (Farmer's Friend) is a state-of-the-art agricultural assistant that empowers farmers to detect plant diseases instantly using Artificial Intelligence. 

Unlike traditional apps that rely on expensive paid APIs, Kisaan Mitra utilizes a **hybrid architecture** combining specific computer vision models with high-speed Large Language Models (LLMs) to provide accurate, multilingual, and free advice.

---

## 🚀 Features

### 🔍 instant Disease Detection
*   **Dual-Layer Analysis**:
    1.  **Visual Scan**: Uses a specialized `MobileNetV2` model (via Hugging Face) to detecting visual symptoms on leaves/fruits.
    2.  **Expert Diagnosis**: Finds the exact disease name and confidence level (e.g., "Cedar Apple Rust: 98%").

### 💊 Expert Treatment Advice
*   Generates comprehensive care reports using **Llama 3 (70B Versatile)** on Groq's LPU.
*   **Organic Solutions**: Neem oil, pruning, homemade remedies.
*   **Chemical/Fungicide**: Specific scientific recommendations when necessary.
*   **Prevention**: Steps to avoid future outbreaks.

### � Multilingual Support
*   Reports generated in **English** and Indian Regional Languages (Hindi, Tamil, Telugu, etc.) based on user preference.

### ⚡ Performance
*   **Zero Latency**: Powered by Groq for sub-second text generation.
*   **Mobile First**: Responsive design built with Tailwind CSS v4 & Shadcn/UI.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 16 (App Router), React 19, TypeScript
*   **Styling**: Tailwind CSS 4, Shadcn UI, Lucide Icons
*   **AI Vision**: Hugging Face Inference Router (`MobileNetV2` / `ViT`)
*   **AI Text**: Groq Cloud (`Llama-3.3-70b-versatile`)
*   **Database**: Supabase (PostgreSQL) - *Optional for basic usage*
*   **Deployment**: Vercel (Zero-Config)

---

## ⚙️ Usage Guide

### prerequisites
*   Node.js 18+ installed.
*   Git installed.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Vidhi35/Kisan_Mitra.git
    cd Kisan_Mitra/frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the `frontend` folder with your free keys:

    ```env
    # 1. AI Services (Required - Free)
    GROQ_API_KEY=gsk_...                # Get from console.groq.com
    HF_ACCESS_TOKEN=hf_...              # Get from huggingface.co/settings/tokens

    # 2. Database (Optional for local test, Required for Auth)
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to start diagnosing plants!

---

## 🚀 Deployment

The easiest way to deploy is **Vercel**.

1.  Push your code to GitHub.
2.  Import the project in Vercel.
3.  **Important**: Add `GROQ_API_KEY` and `HF_ACCESS_TOKEN` in Vercel's *Settings > Environment Variables*.
4.  Deploy!

See [DEPLOYMENT.md](./frontend/DEPLOYMENT.md) for a detailed step-by-step guide.

---

## 🤝 Contributing

We welcome contributions to help farmers worldwide!
1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit changes (`git commit -m 'Add AmazingFeature'`).
4.  Push to branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Made with ❤️ for Farmers.*
