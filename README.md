<p align="center">
  <img src="https://github.com/user-attachments/assets/1d6cfb88-f5d8-448f-b3fe-0f58b548f862" alt="InsightForge AI Banner" width="100%">
</p>

<h1 align="center">🚀 InsightForge AI</h1>

<p align="center">
  <b>AI-Powered Business Intelligence & Analytics Platform</b><br/>
  Transform raw datasets into interactive dashboards, AI-generated insights, forecasting, and business reports.
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

<p align="center">
  <img alt="Python" src="https://img.shields.io/badge/Python-3.11-blue?logo=python&style=for-the-badge" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&style=for-the-badge" />
  <img alt="React" src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&style=for-the-badge" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&style=for-the-badge" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&style=for-the-badge" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</p>

---

## 🌐 Live Demo

| Resource | Link |
|----------|------|
| **Frontend** | [insight-forge-ai.vercel.app](https://insight-forge-ai.vercel.app) |
| **Backend API** | [insightforge-ai-backend.onrender.com](https://insightforge-ai-backend.onrender.com) |
| **Swagger API Docs** | [insightforge-ai-backend.onrender.com/docs](https://insightforge-ai-backend.onrender.com/docs) |

> ⚠️ **Note:** The backend is hosted on Render's free tier and may take 30–60 seconds to spin up after inactivity.

---

## 📌 Overview

**InsightForge AI** is an AI-powered Business Intelligence platform that enables users to upload datasets and instantly receive:

- ✅ Automatic data cleaning, validation, and profiling
- ✅ Interactive dashboards and visualizations
- ✅ Forecasts of future trends
- ✅ AI-generated business reports and summaries
- ✅ A natural-language chat interface for querying their own data

The mission is to combine modern BI tooling with AI to make data analysis accessible, interactive, and intelligent — no SQL or spreadsheet gymnastics required.

---

## ✨ Key Features

### 📂 Dataset Management
- Upload CSV files with automatic validation and profiling
- Switch between multiple datasets seamlessly
- Browse upload history and manage datasets

### 📊 Interactive Dashboard
- KPI cards with key metrics
- Dynamic charts (line, bar, pie)
- Category and country breakdowns
- Dataset statistics and auto-generated business insights

### 📈 Analytics Center
- Missing value detection and duplicate detection
- Dataset quality score
- Memory usage analysis
- Column explorer with numeric/categorical breakdowns

### 🤖 AI Analytics
- AI-generated dataset summaries and reports
- AI-driven business insights
- Natural language querying with "chat with your dataset"
- Contextual recommendations

### 📉 Forecasting
- Time-series forecasting with predicted future values
- Averages, highs, and lows
- Interactive forecasting charts
- Trend analysis

### 📄 Professional Reports
- AI-written executive summaries
- Dataset statistics and business insights
- Charts and visualizations
- PDF export capability

### 🗺️ Data Visualization
- Interactive line and bar charts
- KPI cards for quick insights
- Geographic maps for location-based data

### 🔍 Smart Filtering
- Search functionality
- Category and country filters
- Dynamic dashboard updates

### 🐳 Docker Support
- Dockerized backend and frontend
- Docker Compose for one-command production-ready deployment

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[User] --> B[React + TypeScript Frontend]
    B --> C[REST API Requests]
    C --> D[FastAPI Backend]
    D --> E[Analytics Engine]
    D --> F[Forecasting Engine]
    D --> G[AI Engine]
    E --> H[Data Processing]
    F --> H
    G --> I[Groq API + Llama 3.1]
    H --> J[Business Intelligence Layer]
    I --> J
    J --> K[Interactive Dashboards]
    J --> L[Reports & Insights]
    J --> M[Forecasts]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#61DAFB,stroke:#333,stroke-width:2px
    style D fill:#009688,stroke:#333,stroke-width:2px,color:#fff
    style I fill:#FF6B6B,stroke:#333,stroke-width:2px
    style J fill:#4ECDC4,stroke:#333,stroke-width:2px
