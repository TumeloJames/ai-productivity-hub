# AI Workplace Productivity Assistant

A modern, responsive SaaS-style web application designed to help professionals complete everyday workplace tasks faster using AI.

The **AI Workplace Productivity Assistant** provides AI-powered tools for email writing, research assistance and workplace conversations, combined with a clean productivity dashboard and local activity analytics.

## 🚀 Features

### ✉️ Smart Email Generator

Generate professional emails based on the user's actual input.

**Features:**
- Recipient/context input
- Email subject input
- Key points input
- Tone selection:
  - Formal
  - Friendly
  - Persuasive
- AI-generated content based on the user's provided information
- Editable generated emails
- Copy-to-clipboard functionality
- Loading and error states

The application does not rely on generic or hardcoded email responses.

---

### 🔎 AI Research Assistant

Analyse topics, questions or provided text using AI.

**Features:**
- Enter a research topic or question
- Paste an article or other text
- Generate an AI-powered summary
- Generate key insights
- Provide practical recommendations
- Editable AI results
- Copy-to-clipboard functionality
- Loading and error states

Research outputs are generated from the user's actual input rather than predefined responses.

---

### 💬 AI Workplace Chatbot

An interactive AI assistant for workplace-related questions and tasks.

**Features:**
- Interactive chat interface
- User and AI message separation
- Contextual AI-generated responses
- Conversation history during the current browser session
- Clear and responsive chat layout
- Loading and error states

The chatbot responds to the user's actual prompts rather than using hardcoded demo responses.

---

## 📊 Productivity Dashboard

The dashboard provides an overview of activity within the current browser/application.

### Dashboard Components

- Welcome heading
- Productivity tagline
- KPI cards
- Productivity Activity chart
- AI Tool Usage chart
- Recent Activity list

### Welcome Section

The dashboard includes a prominent welcome heading above the existing tagline:

> Get the writing, reading and thinking done faster.

The welcome heading is:
- Black
- Slightly larger
- Prominent

The tagline is:
- Smaller
- Regular weight
- Non-bold

### KPI Metrics

The dashboard tracks:

- **AI Tasks Completed**
- **Emails Generated**
- **Research Tasks**
- **Chat Interactions**

Analytics are based on actual user activity within the current browser/application.

The application uses `localStorage` to track activity when users:

- Generate emails
- Complete research tasks
- Interact with the AI chatbot

No fake company-wide statistics are displayed.

---

## 🎨 Design System

The application follows a minimal, professional SaaS design system.

| Element | Colour |
|---|---|
| Background | `#F7F7F5` |
| Cards | `#FFFFFF` |
| Sidebar | `#1C1C1C` |
| Primary Text | `#242424` |
| Secondary Text | `#737373` |
| Borders | `#E7E7E3` |
| Primary Accent | `#8FAF9A` |
| Accent Background | `#EAF1EC` |
| Hover | `#F0F0ED` |

### Design Principles

- Clean
- Minimal
- Spacious
- Professional
- Modern SaaS appearance
- Strong visual hierarchy
- Consistent spacing
- Subtle borders
- Subtle shadows
- Responsive layouts
- Desktop, tablet and mobile support

Sage green is used sparingly for:

- Active navigation states
- Charts
- Highlights
- Important UI states

The application avoids:

- Gradients
- Neon colours
- Excessive colours
- Visually cluttered layouts

---

## 🧭 Application Layout

The application uses a left sidebar containing:

- Dashboard
- Smart Email Generator
- AI Research Assistant
- AI Chatbot

The dashboard contains:

1. Welcome section
2. KPI cards
3. Analytics
4. Recent activity

The layout is responsive across desktop, tablet and mobile devices.

---

## 🤖 AI Outputs

All AI-generated outputs should:

- Be based on the user's actual input
- Be editable
- Be copyable
- Be clearly separated from input fields
- Include appropriate loading states
- Include appropriate error states

The application should preserve working AI functionality and should never replace functional AI features with hardcoded demonstration responses.

---

## 🛡️ Responsible AI

The application includes a small Responsible AI disclaimer informing users that:

> AI-generated content may contain errors and should be reviewed before being used professionally.

Users should review AI-generated emails, summaries, recommendations and other content before relying on them in professional situations.

---

## ⚙️ Technical Requirements

The application is designed as a frontend-only SaaS project.

### Architecture

- Frontend only
- No backend
- No database
- No authentication
- Browser-based functionality
- `localStorage` for local analytics and current-session data

### Data & Privacy

The application should not use fake company-wide analytics.

Analytics should represent activity within the user's current browser/application.

Secret API keys must never be exposed in frontend code.

### Stability

The application should:

- Maintain existing working AI functionality
- Avoid unnecessary features or pages
- Remain responsive
- Maintain a stable build
- Provide appropriate loading and error states
- Avoid breaking existing functionality

---

## 📱 Responsive Design

The application should provide a consistent experience across:

- Desktop
- Laptop
- Tablet
- Mobile

The sidebar, dashboard cards, charts, forms, AI outputs and chat interface should adapt appropriately to different screen sizes.

---

## 🎯 Project Goal

The goal of the **AI Workplace Productivity Assistant** is to provide a polished, practical and professional SaaS-style productivity platform that demonstrates how AI can assist with everyday workplace tasks.

The final application should be:

- Functional
- Responsive
- Visually polished
- Easy to use
- Professional
- Portfolio-ready

---

## 📌 Current Scope

The project focuses on three core AI productivity tools:

| Tool | Purpose |
|---|---|
| Smart Email Generator | Create professional workplace emails |
| AI Research Assistant | Summarise and analyse information |
| AI Workplace Chatbot | Assist with workplace questions and tasks |

These tools are supported by a local productivity dashboard that visualises the user's activity.

---

## 🔒 Important Notes

This application is intended as a frontend portfolio/project application.

It does not include:

- Backend infrastructure
- Database storage
- User authentication
- Company-wide analytics
- Unnecessary additional features

The application should remain focused on AI-powered workplace productivity while maintaining a clean and professional SaaS experience.

---

## 📄 Project Status

**Status:** Final / Portfolio Ready

The project is intended to demonstrate:

- AI integration
- Frontend development
- SaaS UI/UX design
- Responsive web design
- Local browser storage
- Productivity analytics
- AI-assisted workplace workflows
- Responsible AI principles
