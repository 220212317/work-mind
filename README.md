# 🧠 WorkMind AI
### *Your Intelligent Workplace Companion*

> Built for the **CAPACITI AI Skill Accelerator Programme-2026**

---

## 📌 Project Overview

WorkMind AI is an AI-powered workplace productivity assistant designed to automate repetitive professional tasks. It combines five intelligent tools into a single, seamless interface — helping professionals draft emails, summarize meetings, plan tasks, conduct research, and interact with an AI assistant, all powered by the **Anthropic Claude API**.

The app is built on an **Intent-First & Generative** UX philosophy: instead of filling out multi-field forms, users provide raw keywords, unstructured text, or an uploaded document, and the AI infers the structure and generates polished, accurate results.

---

## 🚨 Problem Statement

Professionals across industries lose hours every day to low-value, repetitive tasks:

| Task | Estimated Time Lost Daily |
|------|--------------------------|
| Drafting Emails | 2–3 hrs |
| Summarizing Meeting Notes | 1–2 hrs |
| Planning & Scheduling | ~45 min |
| Conducting Research | 1–2 hrs |

WorkMind AI solves this by acting as an always-on AI assistant that generates accurate, polished outputs from minimal input — drastically reducing time spent on routine work.

---

## ✨ Features

### 🏠 Dashboard
- Live session metrics tracking: Emails Drafted, Summaries Created, Schedules Optimized, and Research Insights — all updated dynamically as you use the app
- Recent activity feed with relative timestamps (e.g. *"Email generated — 2 mins ago"*)
- Quick-access navigation grid to all five tools

---

### 1. 📧 Smart Email Draftsman
- Enter raw keywords or context — the AI generates a complete professional email including a creative subject line
- Tone selector: **Formal**, **Informal**, **Persuasive**
- Audience targeting: **Client**, **Manager**, **Team**
- File upload for additional context (.pdf, .docx, .txt)
- Copy-to-clipboard with confirmation toast

---

### 2. 📋 Meeting Notes Summarizer
- Paste raw, unstructured meeting notes or upload a transcript — no cleanup required
- Generates a three-section structured output:
  - **Key Points** — core themes in bullet form
  - **Decisions Made** — numbered list of finalized outcomes
  - **Action Items Table** — Task, Owner, and Deadline (flags missing info as "TBD")

---

### 3. 📅 AI Task Planner & Optimizer
- Dump tasks in any order with optional urgency cues (e.g. "urgent", "do today", "low priority")
- Generates a time-blocked daily or weekly schedule
- High-priority tasks highlighted with a red accent badge
- **AI Efficiency Insights** callout at the bottom with personalized optimization tips

---

### 4. 🔍 AI Research Assistant
- Enter a topic, paste an article, or upload a document for instant analysis
- Generates a structured three-part output:
  - **Executive Summary** — concise 2-sentence breakdown
  - **Core Insights** — 3 to 5 high-impact takeaways
  - **Layman's Terms Translation** — complex jargon rewritten in plain, accessible language

---

### 5. 💬 AI Chatbot Interface
- Full-height, immersive conversational chat interface
- Upload files directly into the chat for contextual document Q&A
- Automatically acknowledges indexed files: *"I've successfully indexed [Filename]. What would you like to know?"*
- Chat history persists across view switches for the duration of the session

---

### 📁 Global File Upload
- Drag-and-drop zone supporting **.pdf**, **.docx**, and **.txt** files
- Available as context input across all five feature pages
- Displays filename, a clear button, and a 200-character text preview upon upload

---

## 🛠️ Tools & Technologies

| Category | Tool / Technology |
|----------|------------------|
| AI Engine | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Frontend Framework | React 18 (Single Page Application) |
| Styling | Tailwind CSS |
| State Management | React `useState` / `useReducer` (session-persistent) |
| PDF Parsing | pdfjs-dist |
| DOCX Parsing | mammoth.js |
| TXT Parsing | FileReader API |
| Build & Deployment | Lovable.ai |

---

## 💡 Sample Prompts

**Smart Email Draftsman**
```
Project delay, client, apologetic, reassure, offer revised timeline
```
*Output: Full professional apology email with an auto-generated subject line tailored to a client audience.*

---

**Meeting Notes Summarizer**
```
Discussed budget cuts. John to handle vendor comms by Friday.
No decision on new hire yet. Sarah leading design review next Tuesday.
```
*Output: Key Points · Decisions Made · Action Items table with owners and deadlines.*

---

**AI Task Planner**
```
Finish quarterly report (urgent), team standup 9am, review pull requests,
send client invoices, prepare presentation slides
```
*Output: Chronological time-blocked schedule with priority badges and efficiency tips.*

---

**AI Research Assistant**
```
Explain transformer architecture in AI and its impact on modern NLP
```
*Output: Executive Summary + Core Insights + plain-language translation of key concepts.*

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Default Theme | Dark mode |
| Primary Background | Deep Navy `#0D1B2A` |
| Accent Color | Crimson Red `#C1121F` |
| Light Theme Background | Off-White `#F8F9FA` |
| Typography | Inter / system-ui |
| Body Text (Dark) | White `#FFFFFF` / Light Gray |
| Body Text (Light) | Deep Navy `#0D1B2A` |
| Layout | Responsive — sidebar on desktop, bottom nav on mobile |
| Theme Transition | `transition: all 0.2s ease-in-out` |

---

## ⚠️ Responsible AI

Every AI-generated output block displays the following disclaimer:

> *"AI-generated content — please review before use."*

Additional safeguards built into the application:

- **No hallucination policy** — prompts explicitly instruct the model never to fabricate facts, names, or data outside of the user's input
- **Human-in-the-loop** — all outputs are framed as drafts requiring user review before professional use
- **Bias-aware prompting** — tone and audience selectors give users control over context, reducing the risk of inappropriate outputs
- **Data privacy** — no user data is stored or transmitted beyond the active browser session
- **Transparent processing** — a 1.5-second loading state with disabled inputs sets realistic expectations about AI response time
- **Limitation acknowledgement** — the app flags when context is insufficient rather than generating potentially misleading content

---

## 🚀 Getting Started

1. Open the app via the deployed Lovable link
2. Add your `ANTHROPIC_API_KEY` in the environment settings
3. Navigate to any feature from the Dashboard
4. Enter raw keywords, paste text, or upload a document
5. Click **Generate** and review your AI-powered output

---

## 👤 Author

**Athi Sintiya**
220212317@mycput.ac.za
CAPACITI AI Skill Accelerator Programme-2026

---

*WorkMind AI — One platform. Five AI-powered tools. Zero friction.*
