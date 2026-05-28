# 🧠 WorkMind AI
### *Your Intelligent Workplace Companion*
 
> Built for the **CAPACITI AI Skill Accelerator Programme — 2026**
> **Author:** Athi Sintiya · 220212317@mycput.ac.za
 
---
 
## 📌 Project Overview
 
WorkMind AI is a production-ready Single Page Application (SPA) designed to solve real-world workplace inefficiencies by automating low-value, repetitive professional workflows. It integrates five distinct productivity modules into a polished, unified workspace dashboard — powered by **Lovable AI**.
 
The application is built around an **Intent-First & Generative UX** philosophy. Instead of multi-field forms, users provide a single open-ended input — raw keywords, unstructured text, or an uploaded document — and the AI autonomously infers context, structure, and intent to deliver ready-to-use professional outputs.
 
---
 
## 🚨 Problem Statement
 
Modern professionals lose a significant portion of their daily bandwidth to routine administrative overhead, pulling focus away from high-value strategic work:
 
| Task | Estimated Time Lost Daily | Core Inefficiency |
|:-----|:--------------------------|:------------------|
| Drafting Emails | 2–3 hours | Tone adjustment, formatting, context-switching |
| Summarizing Meetings | 1–2 hours | Cleaning transcripts, mapping action items |
| Planning & Scheduling | ~45 minutes | Prioritization fatigue, manual time-blocking |
| Conducting Research | 1–2 hours | Extracting insights from dense documents |
 
WorkMind AI compresses hours of routine synthesis into instant, ready-to-review drafts.
 
---
 
## 🛠️ Technology Stack
 
The application is a zero-egress, privacy-first client-side SPA — all document processing and state management remain isolated within the user's active browser session.
 
| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| AI Engine | Lovable AI | Intent processing and text generation |
| Frontend | React 18 | Modular, decoupled component architecture |
| Styling | Tailwind CSS | Utility-first responsive layout |
| State Management | React `useState` / `useReducer` | Session metrics, chat history, UI context |
| PDF Parsing | `pdfjs-dist` | Client-side PDF text extraction |
| DOCX Parsing | `mammoth.js` | Local `.docx` to plain-text conversion |
| TXT Ingestion | FileReader API | Async stream reading for `.txt` files |
| Build & Deploy | Lovable.ai | Optimised static production build |
 
---
 
## 🎨 Design System
 
A fully responsive split-screen layout — **left sidebar on desktop**, collapsing to a **bottom navigation bar on mobile** — with a smooth dual-theme toggle (`transition: all 0.2s ease-in-out`).
 
| Element | Dark Theme (Default) | Light Theme |
|:--------|:---------------------|:------------|
| Background | Deep Navy `#0D1B2A` | Off-White `#F8F9FA` |
| Content Cards | Dark Slate / Charcoal | Pure White `#FFFFFF` |
| Body Text | White / Light Gray | Deep Navy `#0D1B2A` |
| Accent (Universal) | Crimson Red `#C1121F` | Crimson Red `#C1121F` |
| Typography | Inter / system-ui | Inter / system-ui |
 
The header features a minimalist geometric `WM` brand mark, completely free of external platform branding.
 
---
 
## 🧭 Feature Modules
 
### 🏠 Dashboard
- **Welcome state:** *"Welcome to WorkMind AI — What would you like to do today?"*
- **Live session metrics:** Four stat cards — *Emails Drafted*, *Summaries Created*, *Schedules Optimized*, *Research Insights* — increment in real time as features are used
- **Navigation grid:** 3×2 modular layout linking all five tools with value-proposition summaries
- **Activity feed:** Chronological log of the last three actions with relative timestamps (e.g. *"Email generated from keywords — 2 mins ago"*), seeded with two defaults on load
---
 
### 1. 📧 Smart Email Draftsman
- Open-ended input: *"What is this email about? Enter raw key points, keywords, or context..."*
- **Audience selector:** Client · Manager · Team
- **Tone selector:** Formal · Informal · Persuasive
- Supports file upload for additional context
- Generates a complete email with an auto-created subject line and polished body copy
- Copy-to-clipboard with confirmation toast
---
 
### 2. 📋 Meeting Notes Summarizer
- Single input: *"Paste your raw, messy meeting notes, or upload a transcript."*
- Generates a structured three-section output:
  1. **Key Points** — bulleted extraction of core themes
  2. **Decisions Made** — numbered list of finalised outcomes
  3. **Action Items Table** — Task · Owner · Deadline (missing values flagged as `TBD`)
---
 
### 3. 📅 AI Task Planner & Optimizer
- Freeform input: *"Dump your tasks here in any order. Mention urgency if you like (e.g. 'Do today', 'High priority')."*
- Generates a time-blocked daily or weekly schedule
- High-priority tasks highlighted with a Crimson Red badge
- **AI Efficiency Insights** callout at the bottom with personalised optimisation tips
---
 
### 4. 🔍 AI Research Assistant
- Deep-query input: *"Enter a complex topic, paste an article, or upload a document you need decoded."*
- Generates a structured three-part output:
  - **Executive Summary** — concise 2-sentence abstract
  - **Core Insights** — 3 to 5 high-impact takeaways
  - **Layman's Terms Translation** — plain-language explanation of complex jargon
---
 
### 5. 💬 AI Chatbot Interface
- Full-height conversational chat stream with distinct message alignment (user right · assistant left)
- Inline file upload — upon indexing, the assistant responds: *"I've successfully indexed [Filename]. What specific questions can I answer for you about this data?"*
- Conversation history persists across all view switches for the duration of the session
---
 
### 📁 Global File Upload
- Drag-and-drop zone supporting `.pdf`, `.docx`, and `.txt`
- Available as context input across all five feature pages
- Displays filename, a clear button, and a 200-character text preview on upload
---
 
## 💬 Lovable AI Prompt
 
The following prompt was used to generate WorkMind AI on **Lovable.ai**:
 
---
 
> **Role & Core Objective**
> You are an expert Frontend Engineer and UI/UX Designer. Build a fully functional, production-ready Single Page Application (SPA) called "WorkMind AI" — an AI-Powered Workplace Productivity Assistant.
>
> The core UX philosophy of this app is **Intent-First & Generative**. Minimize user friction: instead of multi-field forms, rely on a primary, open-ended input where users provide raw keywords, unstructured text, or a document, and the AI intelligently infers the structure and generates accurate, polished results.
>
> **Critical Execution Rules:**
> - **Zero External Branding:** Completely remove all platform-specific badges, "Edit with Lovable" buttons, watermarks, or default developer footers from the UI.
> - **Dynamic Session State:** Implement local React state to persist data across views. Quick stats on the dashboard must dynamically increment when a user successfully runs a generator, and the recent activity feed must update in real-time.
> - **Realistic Mock Engine:** Simulate realistic AI processing with a 1.5-second `setTimeout` loading state. The generated mock data must be highly dynamic and directly mirror the user's input keywords or text to feel incredibly accurate.
>
> **1. Branding & Design System (Dual-Theme)**
> Implement a comprehensive, accessible Dark/Light mode toggle. Place a prominent theme switch icon (Sun/Moon) at the top or bottom of the persistent navigation bar.
> - Accent Color (Universal): Crimson Red (`#C1121F`)
> - Dark Theme (Default): App Background & Sidebar — Deep Navy (`#0D1B2A`). Content Cards — Dark Slate Blue / Charcoal. Typography — Crisp White (`#FFFFFF`) and High-Contrast Light Gray.
> - Light Theme: App Background — Clean Off-White (`#F8F9FA`). Sidebar & Cards — Pure White (`#FFFFFF`) with subtle borders. Typography — Deep Navy/Charcoal (`#0D1B2A`).
> - Typography: Modern sans-serif (Inter or system-ui).
> - Header/Logo: Minimalist "WM" or brain/lightning icon next to "WorkMind AI".
>
> **2. Layout & Global Navigation**
> - Responsive split-screen: left sidebar on desktop, bottom navigation bar on mobile. Includes Dark/Light toggle.
> - Global File Upload Component: drag-and-drop zone accepting `.pdf`, `.docx`, `.txt`. Show filename, "Clear File" button, and 200-character text preview. Integrate into Views 1, 2, 3, and 4.
>
> **3. Intent-Driven Page Specifications**
>
> *View 0 — Dashboard:* Hero welcome message. 4 live stat cards (Emails Drafted, Summaries Created, Schedules Optimized, Research Insights). 3×2 feature navigation grid. Live activity feed showing last 3 actions with relative timestamps, seeded with 2 defaults on load.
>
> *View 1 — Smart Email Draftsman:* Primary textarea: "What is this email about? Enter raw key points, keywords, or context..." Recipient Type and Tone selectors. Generates subject line and body copy. Copy-to-clipboard with success toast.
>
> *View 2 — Meeting Notes Summarizer:* Single textarea: "Paste your raw, messy meeting notes, or upload a transcript." Three-section output: Key Points, Decisions Made, and Action Items Table (Task / Owner / Deadline, with TBD for missing values).
>
> *View 3 — AI Task Planner & Optimizer:* Input: "Dump your tasks here in any order, or upload a project brief. Mention urgency if you like." Outputs a time-blocked timeline. High-priority items flagged with red badge. AI Efficiency Insights callout at the bottom.
>
> *View 4 — AI Research Assistant:* Input: "Enter a complex topic, paste an article, or upload a document you need decoded." Outputs: Executive Summary (2 sentences), Core Insights (3–5 bullets), Layman's Terms Translation.
>
> *View 5 — AI Chatbot Interface:* Full-height chat stream. User bubbles right, assistant bubbles left. Inline file-clip upload. Auto-response on file index: "I've successfully indexed [Filename]. What specific questions can I answer for you about this data?" History persists across view switches.
>
> **4. Edge Cases, UX Polish & Guardrails**
> - Smooth CSS theme transitions (`transition: all 0.2s ease-in-out`).
> - Every execution action triggers a loading state with disabled inputs and skeleton loaders.
> - Contextual empty states on all output cards before generation.
> - Every AI-generated output block must display: *"AI-generated content — please review before use."*
 
---
 
## ⚠️ Responsible AI
 
Every AI-generated output displays the following disclaimer:
 
> ⚠️ *AI-generated content — please review before use*
 
Additional safeguards built into the application:
 
| Safeguard | Implementation |
|:----------|:---------------|
| **No-hallucination policy** | Prompts instruct the model not to fabricate names, figures, or facts outside the provided input |
| **Human-in-the-loop** | All outputs are framed as drafts requiring user review before professional use |
| **Bias-aware prompting** | Tone and audience selectors give users control over context, reducing inappropriate outputs |
| **Data privacy** | Zero data egress — all context is cleared on browser reload or session end |
| **Transparent processing** | 1.5-second loading state with disabled inputs and skeleton loaders sets realistic expectations |
| **Contextual empty states** | Clean placeholder states explain each tool's purpose before any input is submitted |
 
---
 
## 🚀 Getting Started
 
1. Open the app via the deployed Lovable link
2. Navigate to any tool from the Dashboard
3. Enter raw keywords, paste text, or upload a document
4. Click **Generate** and review your AI-powered output
---
 
 
*WorkMind AI — One platform. Five AI-powered tools. Zero friction.*
 
