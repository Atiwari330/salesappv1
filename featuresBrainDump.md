# Proposed New Features for Deal AI Workspace

## Feature: AI-Powered Transcript Q&A and Analysis

**Core Concept:** Enable users to ask natural language questions about the content of transcripts associated with a deal. The system will use the transcript data as context for an LLM to generate answers and insights.

**Key Capabilities:**

- An interface (e.g., a chat input within the deal view or a dedicated Q&A section) for users to submit questions.
- The system will gather the text from all (or selected) transcripts for the current deal.
- This transcript data will be provided as context to an LLM, along with the user's question as a prompt.
- The LLM will generate an answer or analysis based solely on the provided transcript context.
- Ability to potentially highlight or reference parts of the transcript(s) that informed the AI's answer (if feasible with the chosen LLM and prompting strategy).

**User Value:** Drastically reduces time spent manually searching through transcripts, allows users to quickly extract specific information, understand key themes, or recall past discussion points by directly querying the call content via an AI.

## Feature: Deal Contact Management

**Core Concept:** Introduce a system for creating, managing, and associating contact persons with specific deals.

**Key Capabilities:**

- Create new contact records with fields for First Name, Last Name, Email, and Job Title.
- Link multiple contacts to a single deal, potentially with a "role" on the deal (e.g., Decision Maker, Influencer).
- View associated contacts directly from the deal detail page.

**User Value:** Centralizes crucial stakeholder information, facilitates targeted communication, and lays the groundwork for future integrations (e.g., email, calendar).

## Feature: Email Integration & Intelligence (Phased Approach)

**Core Concept:** Connect with users' Gmail (and potentially other email providers) to bring email communication context into the Deal AI Workspace.

**Key Capabilities (Phase 1 - Last Correspondence):**

- Securely authenticate with user's Gmail account (OAuth).
- For contacts associated with a deal, display the date of the last email exchange.

**Key Capabilities (Phase 2 - Email Content Ingestion & Analysis):**

- Pull in relevant email thread content associated with deal contacts.
- Store or reference email data securely.
- Utilize email content as an additional data source for AI analysis, summarization, and Q&A (in conjunction with transcripts).

**User Value:** Provides a more holistic view of deal communications within the platform, reduces context switching, and enriches the data available for AI-powered insights.

## Feature: AI-Driven Pricing Proposal Generation

**Core Concept:** An AI-powered tool that analyzes a deal's transcript(s) to identify discussions around pricing, product/service configurations, or agreed-upon terms, and then generates a draft pricing proposal.

**Key Capabilities:**

- Dedicated button/action within the transcript viewer or deal detail page.
- AI analysis of transcript content to extract pricing-related information.
- Generation of a structured pricing proposal (e.g., as a text artifact, or a new "Proposal" artifact type).
- Allow user review and editing of the generated proposal.

**User Value:** Accelerates the proposal creation process, ensures proposals are grounded in actual conversations, and can help standardize proposal formats.

## Feature: Intelligent Action Item Management

**Core Concept:** A dynamic to-do list system integrated within each deal, with tasks suggested by AI and manageable by the user.

**Key Capabilities:**

- AI analysis of transcripts (and potentially emails later) to automatically suggest action items (e.g., "Follow up on X," "Send Y document").
- UI to display these tasks within the deal context.
- User ability to manually create, edit, and delete tasks.
- Ability to mark tasks as complete (with visual feedback, e.g., strikethrough).
- Persistence of task status.

**User Value:** Helps users stay organized, ensures follow-ups are not missed, and provides a clear overview of next steps for each deal.

## Feature: AI Sales Engagement Planner

**Core Concept:** An AI tool that analyzes the current deal context (stage, transcript insights, contact roles) and generates a recommended sequence of sales touchpoints for the near future.

**Key Capabilities:**

- Button/action to trigger engagement plan generation.
- AI generation of a 2-3 step outreach plan (e.g., "Day 1: Send personalized summary email," "Day 3: Call to discuss [key point]," "Day 5: Share relevant case study").
- Suggestions for message themes or content for each touchpoint.

**User Value:** Provides proactive strategic guidance, helps reps plan effective follow-up cadences, and can improve engagement consistency.

## Feature: AI Deal Health & Sentiment Analysis

**Core Concept:** AI-driven analysis to provide a qualitative assessment of a deal's current status, momentum, and prospect sentiment, complementing formal CRM stages.

**Key Capabilities:**

- Analysis of transcript content (and later, email data) for sentiment, engagement cues, and potential risks.
- Display of a deal health indicator (e.g., "Strong Interest," "Needs Nurturing," "At Risk," "Stalled").
- Potentially, a summary of reasons behind the assessment.

**User Value:** Offers a quick, data-driven pulse check on deals, helping sales reps and managers prioritize efforts and identify deals requiring immediate attention or a change in strategy.

## Feature: Integrated Meeting Scheduler

**Core Concept:** Allow users to create and send calendar invitations directly from the Deal AI Workspace, linking them to specific deals and contacts.

**Key Capabilities:**

- Integration with user's primary calendar service (e.g., Google Calendar, Outlook Calendar via APIs).
- Ability to pre-fill invitation details (attendees, deal context) based on selected contacts and deal information.
- Send calendar invitations to specified email addresses.

**User Value:** Streamlines the meeting scheduling workflow, reduces manual data entry, and keeps meeting context tied to the deal.

## Feature: Automated Prospect Intelligence Briefings

**Core Concept:** An AI agent that proactively researches relevant public information (news, industry updates, company announcements) about a prospect or their company, based on deal details.

**Key Capabilities:**

- Utilize deal information (prospect company name, industry, product/service interest) as research inputs.
- Automated querying of news APIs or targeted web searches.
- AI-powered filtering and summarization of relevant findings.
- Presentation of these "intelligence briefings" to the user within the deal context.

**User Value:** Equips sales reps with timely and pertinent information to personalize conversations, demonstrate industry awareness, and identify new value propositions or talking points.

AI-First CRM Platform Feature List

1. Gmail Integration for Deal Context & Smart Replies
   Description:
   Automatically link Gmail conversations to Deal Entities by matching contact emails.

Detect unread messages and highlight them in the deal view.

Fetch the last 2–3 emails per contact and store them contextually in the deal.

Use the combined email + transcript history to generate:

Context-aware replies

Follow-up suggestions

Summary of outstanding questions

Intelligent re-engagement nudges

Key Feature:
“Generate Smart Reply” button pulls from full historical context (emails + Zoom calls) to craft personalized responses.

2. Zoom Transcript Upload, Parsing & AI Engagement
   Description:
   Upload multiple Zoom call transcripts to a Deal.

Parse each transcript for:

Key points

Action items

Objections

Questions asked

Allow users to generate follow-up emails per individual transcript.

Key Feature:
Each transcript card can generate its own follow-up or be grouped for broader analysis.

3. Multi-Transcript Chat Interface (with Context Ingestion)
   Description:
   Users can select one, several, or all transcripts within a deal.

Upon selection, they are redirected to a chat UI (reusing your existing chatbot component).

Chatbot is injected with the selected transcripts and primed with instructions:

“Ingest this info and answer any questions across these conversations.”

LLM responds: “Ready,” then waits for user queries.

Context Handling:
No RAG. All selected transcript content is injected upfront or per-message.
Use Cases:
Ask “What were the major objections across these three calls?”

“Did I already discuss pricing with them?”

“Summarize the last meeting.”

4. LinkedIn Profile Scraper for Contact Enrichment
   Description:
   Allow the user to attach a LinkedIn profile URL to any contact.

A bot scrapes the profile for:

Title

Work history

Industry focus

About section

Data stored as enriched context for that contact and used in AI replies.

Key Feature:
“Generate outreach referencing contact’s role” uses scraped LinkedIn insights for more relevant emails.

5. Website Scraping & Intelligence Module (Deal-Level)
   Description:
   Tie a business website URL to each Deal Entity.

Run a bot that scrapes the website and summarizes:

Services offered

Payor model (e.g., self-pay, Medicaid, commercial)

Locations

Contact information

Leadership team if visible

Key Feature:
“Organization Summary” appears in deal view with key details and FAQs generated from the scraped content.

6. Website Watcher Bot for Dynamic Updates
   Description:
   Periodically re-scrape the client’s website and detect:

New blog posts

Press releases

Job openings

Location openings

Service expansion

Automatically flag deals when something new is found that could serve as a sales re-engagement hook.

Key Feature:
“Newsworthy Events” tab in the deal view with AI-written recommendations for how to engage based on updates.

7. AI-Powered Outreach Generator with Deep Context
   Description:
   Pull from any combination of:

Emails

Zoom call transcripts

LinkedIn details

Website info

Internal notes or deal tags

AI generates:

Cold re-engagement emails

Post-demo follow-ups

Upsell messages

Key Feature:
“Compose Outreach” uses a sliding toggle to select tone (friendly, formal, direct) and length.

8. Deal Activity Radar (Pending Emails & Opportunities)
   Description:
   Dashboard widget showing:

Which deals have unread emails

Which deals haven’t had engagement in X days

Deals with recent news detected via watcher bot

Key Feature:
“Radar Alerts” notify the user which deals need attention and why — e.g., “Unread email from CFO,” or “New location opened in AZ.”

9. Transcript-Centric Insight Pinning
   (Future Enhancement)
   Description:
   Let users “pin” AI-generated insights or takeaways from transcripts to the deal record.

These pins could be converted into tasks, reminders, or summary cards.

Example Use Case:
“Client said they need API access — pin this and remind me in 7 days.”

10. Real-Time Meeting Bot for Auto-Transcription & Deal Assignment
    Description:
    Leverage a service like RecallAI to create a virtual meeting bot that can join video calls across platforms (Zoom, Google Meet, Microsoft Teams, etc.).

The bot will automatically transcribe the conversation in real time.

Once the meeting ends, the transcript is:

Analyzed to detect participants, keywords, or context clues

Matched to an existing Deal Entity using contact email, meeting invite metadata, or fuzzy logic based on transcript content

Behavior:
If a match is found:

Transcript is automatically assigned to that deal

It becomes part of the “Transcripts” section inside the deal, just like manually uploaded ones

If no match is found:

The transcript is placed into a holding area titled “Unclassified Transcriptions”

User can view a queue of unassigned transcripts, preview the content, and manually assign them to the appropriate deal

Key Features:
Real-time cross-platform meeting recording (via RecallAI or similar)

Auto-deal association using email/contact matching or intelligent guessing

Manual assignment UI for any unlinked transcripts

All transcripts become searchable and usable in chat, summarization, and email generation features once linked

Future Enhancements (Post-MVP):
Confidence scoring for auto-assignment

Notification to user: “New transcript added to Unclassified queue”

Smart suggestions: “This transcript may belong to Deal X”
