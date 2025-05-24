# Deal AI Workspace

## Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** May 23, 2025  
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Target Users & Personas](#target-users--personas)
5. [User Stories & Requirements](#user-stories--requirements)
6. [Functional Requirements](#functional-requirements)
7. [Technical Architecture](#technical-architecture)
8. [Data Model](#data-model)
9. [UI/UX Requirements](#uiux-requirements)
10. [Integration Requirements](#integration-requirements)
11. [Success Metrics](#success-metrics)
12. [Release Plan](#release-plan)
13. [Risks & Mitigations](#risks--mitigations)
14. [Appendices](#appendices)

---

## Executive Summary

Deal AI Workspace is a deal-centric sales workspace that integrates AI-powered insights with traditional CRM functionality. The platform centralizes all deal-related conversations, artifacts, and AI insights in one place, enabling sales teams to always know their next best move.

### Key Value Propositions

- **Unified Deal Intelligence**: All transcripts, emails, and documents linked to deals
- **AI-Powered Insights**: Automated summary generation, pricing suggestions, and momentum analysis
- **Action-Oriented Workflow**: Automatic task generation based on conversation analysis
- **Mobile-First Design**: Critical workflows accessible on any device

---

## Problem Statement

### Current Challenges

1. **Fragmented Information**: Sales conversations, documents, and insights scattered across multiple tools
2. **Manual Analysis**: Reps spend hours reviewing call recordings and notes to extract actionable insights
3. **Lost Context**: Critical details from customer conversations get buried or forgotten
4. **Reactive Follow-up**: Lack of proactive guidance on next best actions
5. **Pricing Inconsistency**: Manual pricing calculations lead to errors and missed optimization opportunities

### Impact

- 30% of rep time spent on administrative tasks instead of selling
- 25% of deals stall due to poor follow-up timing
- 15% revenue leakage from suboptimal pricing decisions

---

## Solution Overview

### Core Concept

> "A deal-centric workspace where every conversation, artifact, and AI insight lives in one place so I always know the next best move."

### Key Capabilities

1. **Centralized Deal Management**: Single source of truth for all deal information
2. **Automated Transcript Analysis**: AI extracts summaries, objections, and action items
3. **Intelligent Pricing Engine**: Context-aware pricing suggestions based on deal dynamics
4. **Momentum Tracking**: AI-powered deal health monitoring and next-step recommendations
5. **Conversational Intelligence**: RAG-powered chat interface for instant deal insights

---

## Target Users & Personas

### Primary Persona: Account Executive (AE)

- **Demographics**: 25-40 years old, 2-10 years sales experience
- **Goals**: Close more deals faster, maintain accurate pipeline, provide excellent customer experience
- **Pain Points**: Information overload, manual data entry, difficulty tracking multiple deals
- **Tech Comfort**: High - uses 5-10 SaaS tools daily

### Secondary Persona: Sales Manager

- **Demographics**: 30-50 years old, managing 5-15 reps
- **Goals**: Pipeline visibility, team performance optimization, accurate forecasting
- **Pain Points**: Lack of real-time deal insights, inconsistent rep behaviors
- **Tech Comfort**: Medium-High - prefers dashboards over detailed interfaces

### Tertiary Persona: Sales Operations

- **Demographics**: Various ages, process-focused
- **Goals**: Standardize sales processes, optimize pricing, ensure data quality
- **Pain Points**: Manual reporting, data silos, process compliance
- **Tech Comfort**: Very High - power users who configure systems

---

## User Stories & Requirements

### Epic 1: Deal Management

- As an AE, I want to create and manage deals in a centralized workspace
- As an AE, I want to quickly navigate between my active deals
- As a Manager, I want to see pipeline health at a glance

### Epic 2: Transcript Intelligence

- As an AE, I want to upload call transcripts and get instant AI analysis
- As an AE, I want to search across all conversations for specific topics
- As an AE, I want AI to identify key objections and concerns automatically

### Epic 3: Pricing Optimization

- As an AE, I want AI-suggested pricing based on deal context
- As an AE, I want to generate professional quotes with one click
- As a Sales Ops user, I want to configure pricing rules and guardrails

### Epic 4: Momentum Management

- As an AE, I want to see deal momentum scores and health indicators
- As an AE, I want AI-generated next best actions for each deal
- As a Manager, I want alerts for deals that are losing momentum

### Epic 5: Mobile Experience

- As an AE, I want to review deal status on my phone between meetings
- As an AE, I want to add quick notes and tasks from mobile
- As an AE, I want to access key insights during customer meetings

---

## Functional Requirements

### Deal Management

- **FR-DM-001**: Create, read, update, delete deals with standard fields
- **FR-DM-002**: Associate contacts with deals (many-to-many)
- **FR-DM-003**: Track deal stages with customizable pipeline
- **FR-DM-004**: Set and track close dates with automated reminders
- **FR-DM-005**: Bulk operations for stage updates and assignments

### Transcript Processing

- **FR-TP-001**: Upload transcripts in .txt, .vtt, .json formats
- **FR-TP-002**: Automatic speaker identification and tagging
- **FR-TP-003**: Generate embeddings for semantic search
- **FR-TP-004**: Extract and highlight key moments/topics
- **FR-TP-005**: Link transcripts to specific deals and contacts

### AI Analysis

- **FR-AI-001**: Generate executive summaries within 60 seconds
- **FR-AI-002**: Identify and categorize objections/concerns
- **FR-AI-003**: Extract commitments and next steps
- **FR-AI-004**: Calculate momentum scores based on conversation sentiment
- **FR-AI-005**: Suggest follow-up actions with priority and timing

### Pricing Engine

- **FR-PE-001**: Configure pricing rules and discount matrices
- **FR-PE-002**: Generate context-aware pricing suggestions
- **FR-PE-003**: Create professional PDF quotes
- **FR-PE-004**: Track pricing history and win/loss correlation
- **FR-PE-005**: Approval workflows for discounts beyond thresholds

### Action Management

- **FR-AM-001**: Auto-generate tasks from transcript analysis
- **FR-AM-002**: Manual task creation with due dates and assignments
- **FR-AM-003**: Task status tracking and notifications
- **FR-AM-004**: Distinguish AI-suggested vs manual tasks
- **FR-AM-005**: Bulk task operations and templates

### Chat Interface

- **FR-CI-001**: Natural language queries about deal information
- **FR-CI-002**: Context-aware responses using RAG
- **FR-CI-003**: Suggested prompts based on deal stage
- **FR-CI-004**: Persistent chat history per deal
- **FR-CI-005**: Export chat insights to notes

---

## Technical Architecture

### Technology Stack

| Layer             | Technology                   | Justification                                        |
| ----------------- | ---------------------------- | ---------------------------------------------------- |
| **Frontend**      | Next.js 14 (App Router, RSC) | Server-side rendering, file uploads, integrated auth |
| **UI Components** | shadcn/ui + Radix UI         | Accessible, customizable components                  |
| **Backend API**   | Next.js API routes / tRPC    | Type-safe API in same repo                           |
| **Database**      | Supabase (PostgreSQL)        | Built-in auth, RLS, vector search                    |
| **Vector Store**  | pgvector extension           | Native PostgreSQL integration                        |
| **File Storage**  | Supabase Storage             | Integrated with auth/database                        |
| **LLM Provider**  | OpenAI GPT-4                 | Function calling, embeddings                         |
| **Hosting**       | Vercel                       | Optimized for Next.js                                |
| **Task Queue**    | Supabase Edge Functions      | Serverless async processing                          |
| **Monitoring**    | Vercel Analytics + Sentry    | Performance and error tracking                       |

### Architecture Principles

1. **API-First**: All functionality exposed via documented APIs
2. **Event-Driven**: Async processing for heavy operations
3. **Secure by Default**: Row-level security on all data
4. **Scalable**: Serverless functions and edge computing
5. **Testable**: Comprehensive test coverage (unit, integration, e2e)

---

## Data Model

### Core Entities

```sql
-- Deals
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    stage VARCHAR(50) NOT NULL,
    value DECIMAL(10,2),
    close_date DATE,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    title VARCHAR(200),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Deal-Contact Relationship
CREATE TABLE deal_contacts (
    deal_id UUID REFERENCES deals(id),
    contact_id UUID REFERENCES contacts(id),
    role VARCHAR(50),
    PRIMARY KEY (deal_id, contact_id)
);

-- Transcripts
CREATE TABLE transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    call_date TIMESTAMP NOT NULL,
    raw_text TEXT NOT NULL,
    summary TEXT,
    embeddings vector(1536),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transcript-Contact Relationship
CREATE TABLE transcript_contacts (
    transcript_id UUID REFERENCES transcripts(id),
    contact_id UUID REFERENCES contacts(id),
    PRIMARY KEY (transcript_id, contact_id)
);

-- Analyses
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transcript_id UUID REFERENCES transcripts(id) UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'note', 'pricing', 'momentum'
    content_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Action Items
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    description TEXT NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'open',
    is_ai_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pricing Snapshots
CREATE TABLE pricing_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID REFERENCES deals(id),
    version INTEGER NOT NULL,
    calc_inputs_json JSONB NOT NULL,
    quote_pdf_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_deals_owner_stage ON deals(owner_id, stage);
CREATE INDEX idx_transcripts_deal ON transcripts(deal_id);
CREATE INDEX idx_action_items_deal_status ON action_items(deal_id, status);
CREATE INDEX idx_transcript_embeddings ON transcripts USING ivfflat (embeddings vector_cosine_ops);
```

---

## UI/UX Requirements

### Design Principles

1. **Deal-Centric Navigation**: Every entity accessible from deal context
2. **Two-Click Rule**: Critical actions reachable in ≤2 clicks
3. **Persistent Context**: Chat drawer maintains conversation per deal
4. **Progressive Disclosure**: Show only relevant data for current stage
5. **Mobile-Aware**: Core workflows optimized for handheld devices

### Global Layout

#### Desktop Layout

```
┌─────────────────────────────────────────────────────────────┐
│ TopBar: Logo │ Search │ Quick-Add ▼ │ Notifications │ User  │
├─────────────┼───────────────────────────────────────────────┤
│             │                                                 │
│  Sidebar    │                 Main Canvas                     │
│  • Pipeline │                                                 │
│  • Deals    │         (Content changes per route)             │
│  • Tasks    │                                                 │
│  • Pricing  │                                                 │
│             │                                                 │
└─────────────┴───────────────────────────────────────────────┘
                        [💬 Chat with AI]
```

#### Mobile Layout

- Bottom navigation bar replacing sidebar
- Collapsible headers to maximize content area
- Swipe gestures for navigation
- Full-screen modals for complex actions

### Key Screens

#### 1. Pipeline View (Deal List)

- **Layout**: Data grid with sortable columns
- **Filters**: Stage, Owner, Close Date, Value Range
- **Actions**: Quick stage update, bulk operations
- **Mobile**: Card-based layout with key metrics

#### 2. Deal Detail

- **Header**: Deal name, stage, value, close date, contacts
- **Tabs**: Overview, Transcripts, Action Items, Pricing
- **Actions**: Add Transcript, New Task, Generate Pricing
- **Mobile**: Dropdown tab selector, swipe between sections

#### 3. Transcript Viewer

- **Layout**: Split pane - list on left, viewer on right
- **Features**: Speaker tags, key moments chips, search
- **Actions**: Chat, Pricing, Momentum buttons per transcript
- **Mobile**: Full-screen viewer with bottom action bar

#### 4. Chat Drawer

- **Width**: 480px slide-over from right
- **Features**: Pre-loaded context, suggested prompts
- **Persistence**: Maintains state across navigation
- **Mobile**: Full-screen modal with native keyboard handling

### Component Library

- **Base**: shadcn/ui components for consistency
- **Tables**: React Table for data grids
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for visualizations
- **Icons**: Lucide React for iconography

### Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation for all interactions
- Screen reader support with ARIA labels
- Color contrast ratio ≥4.5:1
- Focus indicators on all interactive elements

---

## Integration Requirements

### Phase 1 (MVP)

- **Authentication**: Supabase Auth (email/password, OAuth)
- **File Upload**: Direct to Supabase Storage
- **LLM**: OpenAI API for analysis

### Phase 2

- **Email**: IMAP integration for email sync
- **Calendar**: Google Calendar / Outlook integration
- **Meeting Tools**: Zoom/Teams transcript auto-import

### Phase 3

- **CRM Sync**: Bidirectional sync with Salesforce/HubSpot
- **E-signature**: DocuSign/HelloSign integration
- **Analytics**: Mixpanel/Amplitude for usage tracking

---

## Success Metrics

### Business Metrics

- **Primary**: 20% increase in deal velocity
- **Secondary**: 15% improvement in win rate
- **Tertiary**: 30% reduction in admin time per rep

### Product Metrics

- **Adoption**: 80% daily active usage within 30 days
- **Engagement**: Average 5+ transcripts uploaded per week per user
- **Retention**: 90% monthly retention after 3 months

### Technical Metrics

- **Performance**: <2s page load time (p95)
- **Reliability**: 99.9% uptime
- **Scale**: Support 10,000 concurrent users

---

## Release Plan

### MVP (4 weeks)

- Basic deal CRUD operations
- Manual transcript upload
- AI summary generation
- Simple task management

### Version 1.0 (8 weeks)

- Full pricing engine
- Momentum scoring
- Advanced search
- Mobile web app

### Version 1.5 (12 weeks)

- Email integration
- Automated transcript import
- Bulk operations
- API for integrations

### Version 2.0 (16 weeks)

- CRM bidirectional sync
- E-signature integration
- Advanced analytics
- Custom workflows

---

## Risks & Mitigations

| Risk                                        | Impact | Likelihood | Mitigation                                       |
| ------------------------------------------- | ------ | ---------- | ------------------------------------------------ |
| LLM API costs exceed budget                 | High   | Medium     | Implement caching, usage limits, cost monitoring |
| Poor transcript quality affects AI accuracy | High   | Medium     | Multi-format support, preprocessing pipeline     |
| User adoption resistance                    | High   | Low        | Phased rollout, training program, champion users |
| Data security concerns                      | High   | Low        | SOC2 compliance, encryption, audit logs          |
| Performance at scale                        | Medium | Medium     | Load testing, caching strategy, CDN              |

---

## Appendices

### A. Competitive Analysis

- **Gong.io**: Strong on conversation intelligence, weak on deal workflow
- **Chorus.ai**: Good analytics, limited action management
- **HubSpot**: Broad CRM, lacks deep AI insights
- **Opportunity**: Integrated AI-powered deal workspace

### B. Technical Considerations

- Use pgvector for efficient similarity search
- Implement request debouncing for LLM calls
- Consider edge functions for transcript processing
- Plan for GDPR compliance from day one

### C. Future Enhancements

- Voice AI for real-time coaching
- Predictive deal scoring
- Automated email generation
- Multi-language support
- Industry-specific AI models

---

**Document Control**

- **Author**: Product Team
- **Reviewers**: Engineering, Sales, Leadership
- **Approval**: Pending
- **Next Review**: June 1, 2025
