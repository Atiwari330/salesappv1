# AI Transcript Insights Feature - User Stories

## Epic: AI-Powered Deal Intelligence

**Feature:** AI Transcript Insights (Call Type, Sentiment, Summary)
**Primary User Persona:** Sales Representative

---

## Prioritization Legend:

- **P0:** Prerequisite - Must be completed before other development starts.
- **P1:** Core Functionality (MVP) - Essential for the basic feature to work.
- **P2:** Enhancements & Robustness - Important for usability, error handling, and feedback.

## Definition of Done (DoD) for each story:

- Code implemented and adheres to project coding standards.
- Unit tests written and passing (covering new logic).
- Integration tests (if applicable) written and passing.
- Code reviewed and approved by at least one other team member.
- Functionality manually tested and meets acceptance criteria.
- Relevant documentation (e.g., code comments, README updates if significant) updated.
- Story merged to the main development branch.

---

## Phase 0: Assumption Validation & Codebase Familiarization

- [ ] **Story 0.1: Review Core Abstractions & Database Schema**

  - **User Story:** As a Developer, I want to thoroughly review and document my understanding of `lib/db/schema.ts`, `lib/ai/utils.ts` (specifically `generateStandardizedAIDealResponse`), and `lib/hooks/useDealAIInteraction.ts`, so that I can effectively integrate the new AI transcript insights feature and validate initial technical assumptions.
  - **Acceptance Criteria:**
    - Given I have access to the codebase, when I review `lib/db/schema.ts`, then I can identify the existing `transcripts` table structure and how to extend it.
    - Given I have access to the codebase, when I review `lib/ai/utils.ts`, then I understand how `generateStandardizedAIDealResponse` fetches context, builds prompts, and calls the LLM, and how a new `promptBuilder` for transcript insights would fit in.
    - Given I have access to the codebase, when I review `lib/hooks/useDealAIInteraction.ts`, then I understand how to use it to manage a server action for displaying AI insights on the client (though direct use might be for user-initiated actions, the patterns for server action responses are relevant).
    - Given I have reviewed these files, when I document my findings, then this documentation is available for team reference and confirms/updates assumptions about integrating the new feature.
  - **Priority:** P0
  - **Dependencies:** None

- [ ] **Story 0.2: Analyze UI Components & Backend Integration Points**
  - **User Story:** As a Developer, I want to analyze `app/(main)/deals/[dealId]/transcript-section.tsx` (or the relevant component displaying transcript cards) and the server action file responsible for transcript uploads (likely in `app/(main)/deals/[dealId]/actions.ts`), so that I can plan the UI modifications and backend integration points for AI transcript insights.
  - **Acceptance Criteria:**
    - Given I have access to the codebase, when I review the transcript card rendering component, then I can identify where to display the new AI insights (call type, sentiment, summary).
    - Given I have access to the codebase, when I review the transcript upload server action, then I can identify where to trigger the asynchronous AI insight generation process.
    - Given I have reviewed these files, when I document my findings, then this documentation outlines the proposed changes and integration points.
  - **Priority:** P0
  - **Dependencies:** Story 0.1

---

## Phase 1: Backend Implementation (Core Logic & Data) - Sprint 1 Target

- [ ] **Story 1.1: Database Schema Update for Transcript Insights**

  - **User Story:** As a Developer, I want to update the database schema for transcripts to include fields for AI-generated call type, sentiment, and summary, so that these insights can be stored and retrieved.
  - **Acceptance Criteria:**
    - Given the `transcripts` table definition in `lib/db/schema.ts`, when I add `ai_call_type` (TEXT, nullable), `ai_sentiment` (TEXT, nullable), and `ai_summary` (TEXT, nullable) columns, then the schema is updated.
    - Given the schema is updated, when a database migration file is generated (e.g., using Drizzle Kit), then the migration correctly reflects these new columns.
    - Given the migration is applied by the user, then the database table `transcripts` contains the new columns.
  - **Priority:** P1
  - **Dependencies:** Story 0.1

- [ ] **Story 1.2: AI Insights Generation - Prompt Builder Implementation**

  - **User Story:** As a Developer, I want to create a `promptBuilder` function specifically for generating transcript insights (call type, sentiment, 2-3 sentence summary), so that it can be used with the `generateStandardizedAIDealResponse` utility.
  - **Acceptance Criteria:**
    - Given a transcript text as input, when the `promptBuilderTranscriptInsights(transcriptText: string, rawDealAIContext?: DealAIContext)` function is called, then it constructs a prompt instructing the LLM to:
      1.  Identify if the call is a 'first call' or a 'follow-up call' (or 'unknown').
      2.  Determine the overall sentiment ('positive', 'negative', 'neutral', 'mixed', or 'unknown').
      3.  Provide a concise 2-3 sentence summary.
    - The prompt should request the LLM to return this information in a parseable JSON string format (e.g., `{"call_type": "first call", "sentiment": "positive", "summary": "..."}`).
    - The prompt is designed for accuracy and performance, making educated assumptions about common call patterns.
  - **Priority:** P1
  - **Dependencies:** Story 0.1 (understanding `generateStandardizedAIDealResponse` and `DealAIContext`)

- [ ] **Story 1.3: Server Action for AI Insights Generation & Storage**

  - **User Story:** As a Developer, I want to create a new server action `generateAndStoreTranscriptInsights(transcriptId: string, transcriptText: string)` that uses `generateStandardizedAIDealResponse` with the new `promptBuilder` to get AI insights and then saves these insights to the database.
  - **Acceptance Criteria:**
    - Given a `transcriptId` and `transcriptText`, when the server action `generateAndStoreTranscriptInsights` is invoked, then it calls `generateStandardizedAIDealResponse`. The `dealContextParams` for `generateStandardizedAIDealResponse` will be minimal or perhaps not even use deal-specific context if the transcript text itself is sufficient. The `promptBuilder` used will be the one from Story 1.2, passing `transcriptText` to it (potentially as part of a simplified context if `generateStandardizedAIDealResponse` requires it).
    - Given `generateStandardizedAIDealResponse` returns a successful response containing a JSON string with call type, sentiment, and summary, when the server action parses this JSON, then it updates the corresponding transcript record in the database (identified by `transcriptId`) with these values in the `ai_call_type`, `ai_sentiment`, and `ai_summary` fields.
    - Given the AI processing or database update fails, or JSON parsing fails, then the server action logs the error and completes without throwing an unhandled exception (as it's likely called asynchronously).
    - The server action should be defined in an appropriate actions file, e.g., `app/(main)/deals/[dealId]/actions.ts` or a more general AI actions file if applicable.
  - **Priority:** P1
  - **Dependencies:** Story 1.1, Story 1.2

- [ ] **Story 1.4: Trigger AI Insights Generation on Transcript Upload**
  - **User Story:** As a Developer, I want to modify the existing transcript upload process to asynchronously trigger the `generateAndStoreTranscriptInsights` server action after a new transcript is successfully uploaded and its text is available, so that AI insights are automatically generated for new transcripts.
  - **Acceptance Criteria:**
    - Given a new transcript is successfully uploaded and its text content is processed by the existing upload server action, when the upload server action completes its primary tasks (saving transcript, etc.), then it asynchronously calls/invokes the `generateAndStoreTranscriptInsights` action (from Story 1.3) with the new transcript's ID and text. (Note: "fire-and-forget" style, no `await` if it blocks the main response).
    - The primary transcript upload process completes and returns to the user quickly, not blocked by the AI insights generation.
    - Failures in the asynchronous AI insights generation are logged server-side but do not cause the primary transcript upload to appear as failed to the user.
  - **Priority:** P1
  - **Dependencies:** Story 0.2, Story 1.3

---

## Phase 2: Frontend Implementation (Displaying Insights) - Sprint 1/2 Target

- [ ] **Story 2.1: Update Transcript Data Fetching to Include AI Insights**

  - **User Story:** As a Sales Representative, I want the application to fetch the AI-generated call type, sentiment, and summary along with other transcript details, so that this information is available for display on the transcript card.
  - **Acceptance Criteria:**
    - Given a deal view with a transcript section, when transcript data is fetched from the backend (e.g., via queries in `lib/db/queries.ts`), then the query is updated to include the new `ai_call_type`, `ai_sentiment`, and `ai_summary` fields from the `transcripts` table.
    - The data types/interfaces used on the client-side for transcripts (e.g., in `app/(main)/deals/[dealId]/transcript-section.tsx`) are updated to include these new optional fields.
  - **Priority:** P2
  - **Dependencies:** Story 1.1

- [ ] **Story 2.2: Display AI Insights on Transcript Card - Initial Version**

  - **User Story:** As a Sales Representative, I want to see the AI-generated call type, sentiment, and summary displayed on each transcript card for new transcripts, so that I can quickly understand key insights from the call.
  - **Acceptance Criteria:**
    - Given a transcript card in the UI (e.g., in `app/(main)/deals/[dealId]/transcript-section.tsx`) for a transcript that has AI insights (`ai_call_type`, `ai_sentiment`, `ai_summary` are populated), when the card is rendered, then it displays:
      - "Call Type: [value]" (e.g., "First Call", "Follow-up", "Unknown")
      - "Sentiment: [value]" (e.g., "Positive", "Neutral", "Negative", "Unknown")
      - "AI Summary: [2-3 sentence summary]"
    - The information is displayed clearly below the "Call Date".
    - If AI insights fields are null or empty (e.g., processing, not generated, or error during generation), these specific labels/values are not shown, or a placeholder (from Story 2.3/2.4) is shown.
  - **Priority:** P1
  - **Dependencies:** Story 0.2, Story 2.1

- [ ] **Story 2.3: UI for "Processing" State on Transcript Card**

  - **User Story:** As a Sales Representative, I want to see a visual indicator on the transcript card when AI insights are being generated (for a newly uploaded transcript), so that I know the system is working and when to expect the summary.
  - **Acceptance Criteria:**
    - Given a new transcript has been uploaded and its `ai_summary` (and other AI fields) are initially null in the database, when the transcript card is displayed, then it shows a message like "AI summary generating..." in the space where the insights will appear.
    - This state is shown if `ai_summary` is null and the transcript is recent (e.g., uploaded in the last few minutes, to differentiate from older transcripts that simply don't have summaries). A simpler approach might be to show this if `ai_summary` is null and the transcript object has a temporary client-side flag indicating it was just uploaded.
    - Once processing is complete and the data is updated (requiring a data re-fetch or real-time update mechanism), this indicator is replaced by the actual insights or an error message (Story 2.4).
  - **Priority:** P2
  - **Dependencies:** Story 1.4, Story 2.2

- [ ] **Story 2.4: UI for Error/Unavailable State on Transcript Card**
  - **User Story:** As a Sales Representative, I want to see a clear message if AI insights could not be generated for a transcript, or if the AI returned an "unknown" status, so that I understand why the information might be incomplete or missing.
  - **Acceptance Criteria:**
    - Given AI insight generation failed for a transcript (e.g., `ai_summary` remains null after a reasonable time, or a specific error flag is set if we choose to implement one), when the transcript card is displayed, then it shows a user-friendly message like "AI summary unavailable."
    - If `ai_call_type` or `ai_sentiment` is "unknown" or "N/A" as returned by the AI, then this value is displayed as such (e.g., "Call Type: Unknown").
  - **Priority:** P2
  - **Dependencies:** Story 2.2

---

## Phase 3: Human Review & Iteration - Sprint 2 Target

- [ ] **Story 3.1: Human Review of AI Insights Display and Content**
  - **User Story:** As a Product Manager, I want to conduct a human review of the AI transcript insights feature on the deal view, focusing on the accuracy of AI-generated content (call type, sentiment, summary) and the clarity of its presentation, so that I can gather UX feedback before wider rollout.
  - **Acceptance Criteria:**
    - Given the AI insights are displayed on transcript cards for several diverse test transcripts (covering various call types, sentiments, lengths; including successful generation, processing state, and error state), when a human reviewer interacts with the feature, then they can provide feedback.
    - Feedback is collected on:
      - Perceived accuracy and usefulness of the AI-generated call type.
      - Perceived accuracy and usefulness of the AI-generated sentiment.
      - Quality, conciseness, and relevance of the AI-generated summary.
      - Clarity, readability, and placement of the insights on the card.
      - Effectiveness of "processing" and "error/unavailable" state indicators.
    - Development pauses on further UI refinements or new AI features related to transcripts until this feedback is reviewed and any critical adjustments are planned.
  - **Priority:** P2
  - **Dependencies:** Story 2.2, Story 2.3, Story 2.4

---

## Roadmap Integration (Conceptual Sprints):

- **Sprint 1:** Focus on P0 and P1 stories. Goal: Backend logic complete, basic display of AI insights for new transcripts.
  - 0.1, 0.2, 1.1, 1.2, 1.3, 1.4, 2.2
- **Sprint 2:** Focus on P2 stories. Goal: Refine UI, handle all states gracefully, conduct human review, and iterate based on feedback.
  - 2.1, 2.3, 2.4, 3.1

This structure should provide a clear path for development.
