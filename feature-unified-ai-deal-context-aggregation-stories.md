# Epic: Unified AI Deal Context Aggregation

**Goal:** To create a standardized, robust, and maintainable system for gathering and structuring all relevant context for a deal (deal details, selected transcripts, contact info, associated action items, etc.) to be provided to AI models, improving the consistency, capability, and development efficiency of AI-driven features.

---

## Overall Definition of Done (DoD) for all stories:

- Code written and adheres to project coding standards (including Biome.jsonc).
- Unit tests written and pass with sufficient coverage for new logic (e.g., builder functions, formatter).
- Integration tests updated/passed for any refactored features.
- Code reviewed and approved by at least one other team member.
- Relevant JSDoc comments added for new functions, interfaces, and modules.
- User story acceptance criteria are met.
- Functionality demonstrated to Product Owner/stakeholders if applicable (especially for Human Review stories or major refactors).
- Changes deployed to a staging/test environment successfully.

---

## Assumption Validation & Codebase Familiarization (Sprint 0 / Initial Tasks)

These stories are critical to execute before starting development on the core features to ensure the plan is sound.

- [ ] **Story 0.1: Document Deal Data Fetching Queries**

  - **As a Developer,** I want to thoroughly review and document the existing data fetching functions in `lib/db/queries.ts` related to deals, transcripts, contacts, and action items, **so that** I have a clear understanding of how deal-related data is currently retrieved and can identify any gaps or necessary modifications for the context builder.
  - **Acceptance Criteria:**
    - Given `lib/db/queries.ts` is available.
    - When the developer reviews functions like `getDealById`, `getTranscriptsByDealId`, `getContactsForDeal`, `getActionItemsByDealId`.
    - Then a summary document (e.g., internal wiki page or markdown notes) is created outlining their parameters, return types, and any observed patterns or limitations relevant to context aggregation.
  - **Priority:** P1 (Highest)
  - **Dependencies:** None

- [ ] **Story 0.2: Document Relevant Database Schema**

  - **As a Developer,** I want to review and document the Drizzle schema definitions in `lib/db/schema.ts` for `Deal`, `Transcript`, `Contact`, `DealContact`, and `ActionItem` tables, **so that** I fully understand the data structures, relationships, and constraints I'll be working with for context aggregation.
  - **Acceptance Criteria:**
    - Given `lib/db/schema.ts` is available.
    - When the developer reviews the specified table schemas.
    - Then a summary document is updated/created detailing key fields, types, relationships (foreign keys), and any constraints relevant to building a comprehensive deal context.
  - **Priority:** P1 (Highest)
  - **Dependencies:** None

- [ ] **Story 0.3: Analyze Existing AI Feature Context Usage**

  - **As a Developer,** I want to select one existing AI feature that uses deal context (e.g., backend for `transcript-qna-section.tsx` or `transcript-email-generator-client.tsx`), review its code, and document how it currently gathers and prepares context, **so that** I understand current practices and can effectively plan its refactoring to use the new context builder.
  - **Acceptance Criteria:**
    - Given access to the codebase for an existing deal-related AI feature.
    - When the developer analyzes its data fetching and context preparation logic.
    - Then a document is produced outlining the current approach, data sources used, and any transformations applied before sending to the AI.
  - **Priority:** P1 (Highest)
  - **Dependencies:** None

- [ ] **Story 0.4: Validate Engineering Assumptions**
  - **As a Developer,** I want to consolidate findings from stories 0.1, 0.2, and 0.3 to validate or adjust the engineering assumptions made in the initial plan for the Unified Context Aggregation feature, **so that** the subsequent development stories are based on accurate codebase understanding.
  - **Acceptance Criteria:**
    - Given completion of stories 0.1, 0.2, and 0.3.
    - When the developer compares findings with the proposed plan (interfaces, builder function logic).
    - Then a brief report is created confirming/updating assumptions, and any necessary adjustments to subsequent user stories are proposed to the Product Manager.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Stories 0.1, 0.2, 0.3

---

## Phase 1: Define the Core Structure and Service

**Feature 1.1: Core `DealAIContext` Type Definitions**

- [ ] **Story 1.1.1: Define `DealAIContext` and `DealAIContextParams` Interfaces**
  - **As a Developer,** I want to define the `DealAIContext` and `DealAIContextParams` TypeScript interfaces in a new file (e.g., `lib/ai/deal_context_types.ts`), **so that** there's a clear, typed contract for the structure of the aggregated deal context and the parameters for requesting it.
  - **Acceptance Criteria:**
    - Given the need for structured deal context.
    - When the developer creates `lib/ai/deal_context_types.ts`.
    - Then the file contains the `DealAIContext` interface (including `deal`, `transcripts`, `contacts`, `actionItems` fields with appropriate types from `lib/db/schema.ts`) and the `DealAIContextParams` interface (including `dealId`, `userId`, and placeholders for future optional params).
    - And the interfaces are well-documented with JSDoc comments.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 0.2 (for type references)

**Feature 1.2: Initial `DealContextBuilder` Service Implementation**

- [ ] **Story 1.2.1: Implement `getDealAIContext` Skeleton and Authorization**

  - **As a Developer,** I want to create the `deal_context_builder.ts` file and implement the basic skeleton for the `getDealAIContext(params: DealAIContextParams)` function, including an initial authorization check, **so that** the foundation for the context aggregation service is in place and secure.
  - **Acceptance Criteria:**
    - Given `lib/db/queries.ts` and `deal_context_types.ts` are available.
    - When the `getDealAIContext` function is implemented in `lib/ai/deal_context_builder.ts`.
    - Then the function accepts `DealAIContextParams`.
    - And it uses `findDealByIdAndUserId` from `queries.ts` to verify user access to the deal.
    - And it returns `null` (or throws an auth error) if the user is not authorized or the deal is not found.
    - And it has a placeholder to return a `DealAIContext` object.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 1.1.1

- [ ] **Story 1.2.2: Integrate Fetching `Deal` Details**

  - **As a Developer,** I want to integrate the fetching of core `Deal` details into the `getDealAIContext` function, **so that** the basic deal information is part of the aggregated context.
  - **Acceptance Criteria:**
    - Given `getDealAIContext` function (from Story 1.2.1) and `getDealById` from `queries.ts`.
    - When `getDealAIContext` is called for an authorized deal.
    - Then it fetches the `Deal` object using `getDealById`.
    - And the fetched `Deal` object is correctly assigned to the `deal` property of the returned `DealAIContext`.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 1.2.1

- [ ] **Story 1.2.3: Integrate Fetching All `Transcript` Details**

  - **As a Developer,** I want to integrate the fetching of all `Transcript` details associated with the deal into `getDealAIContext`, **so that** all transcript data is available in the aggregated context.
  - **Acceptance Criteria:**
    - Given `getDealAIContext` function and `getTranscriptsByDealId` from `queries.ts`.
    - When `getDealAIContext` is called for an authorized deal.
    - Then it fetches all `Transcript` objects for the deal using `getTranscriptsByDealId`.
    - And the fetched `Transcript[]` is assigned to the `transcripts` property of `DealAIContext`.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 1.2.1

- [ ] **Story 1.2.4: Integrate Fetching `ContactWithRole` Details**

  - **As a Developer,** I want to integrate the fetching of all `ContactWithRole` details associated with the deal into `getDealAIContext`, **so that** contact information is part of the aggregated context.
  - **Acceptance Criteria:**
    - Given `getDealAIContext` function and `getContactsForDeal` from `queries.ts`.
    - When `getDealAIContext` is called for an authorized deal.
    - Then it fetches all `ContactWithRole` objects for the deal using `getContactsForDeal`.
    - And the fetched `ContactWithRole[]` is assigned to the `contacts` property of `DealAIContext`.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 1.2.1

- [ ] **Story 1.2.5: Integrate Fetching `ActionItem` Details**

  - **As a Developer,** I want to integrate the fetching of all `ActionItem` details associated with the deal into `getDealAIContext`, **so that** action item data is available in the aggregated context.
  - **Acceptance Criteria:**
    - Given `getDealAIContext` function and `getActionItemsByDealId` from `queries.ts`.
    - When `getDealAIContext` is called for an authorized deal.
    - Then it fetches all `ActionItem` objects for the deal using `getActionItemsByDealId`.
    - And the fetched `ActionItem[]` is assigned to the `actionItems` property of `DealAIContext`.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 1.2.1

- [ ] **Story 1.2.6: Assemble and Return Full `DealAIContext`**
  - **As a Developer,** I want `getDealAIContext` to correctly assemble and return the complete `DealAIContext` object containing all fetched data (deal, transcripts, contacts, action items), **so that** a comprehensive context object is available for further processing.
  - **Acceptance Criteria:**
    - Given successful completion of stories 1.2.2, 1.2.3, 1.2.4, and 1.2.5.
    - When `getDealAIContext` is called for an authorized deal.
    - Then it returns a `DealAIContext` object where `deal`, `transcripts`, `contacts`, and `actionItems` properties are populated with the correctly fetched data.
    - And the function signature and return type match the `DealAIContext` interface.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Stories 1.2.2, 1.2.3, 1.2.4, 1.2.5

---

## Phase 2: Formatting for LLMs and Initial Integration

**Feature 2.1: Basic LLM Context Formatter**

- [ ] **Story 2.1.1: Implement `formatDealContextForLLM` Skeleton**

  - **As a Developer,** I want to implement the skeleton for the `formatDealContextForLLM(context: DealAIContext, options?: {...})` function within `deal_context_builder.ts`, **so that** there's a dedicated function to convert the structured context object into an LLM-friendly string.
  - **Acceptance Criteria:**
    - Given `DealAIContext` interface is defined.
    - When the `formatDealContextForLLM` function is created.
    - Then it accepts a `DealAIContext` object and an optional `options` parameter.
    - And it returns a string.
    - And it has a placeholder for formatting logic.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 1.1.1

- [ ] **Story 2.1.2: Add `Deal` Details Formatting to `formatDealContextForLLM`**

  - **As a Developer,** I want to add logic to `formatDealContextForLLM` to include formatted `Deal` details (e.g., name, ID, creation date) in the output string, **so that** basic deal information is presented to the LLM.
  - **Acceptance Criteria:**
    - Given `formatDealContextForLLM` function and a `DealAIContext` object.
    - When the function is called.
    - Then the output string includes clearly labeled `Deal` information (e.g., "Deal: [Name] (ID: [ID])\nCreated: [Date]").
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 2.1.1

- [ ] **Story 2.1.3: Add `ContactWithRole` List Formatting to `formatDealContextForLLM`**

  - **As a Developer,** I want to add logic to `formatDealContextForLLM` to include a formatted list of `ContactWithRole` (e.g., name, role, email) in the output string, **so that** associated contacts are part of the LLM context.
  - **Acceptance Criteria:**
    - Given `formatDealContextForLLM` function and a `DealAIContext` object with contacts.
    - When the function is called.
    - Then the output string includes a clearly labeled section for "Contacts" listing each contact's details.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 2.1.1

- [ ] **Story 2.1.4: Add `Transcript` List Formatting with Basic Truncation to `formatDealContextForLLM`**

  - **As a Developer,** I want to add logic to `formatDealContextForLLM` to include a formatted list of `Transcript` details (e.g., filename, call date, content snippet) with basic content truncation (e.g., first 500 chars), **so that** transcript information is presented to the LLM concisely.
  - **Acceptance Criteria:**
    - Given `formatDealContextForLLM` function and a `DealAIContext` object with transcripts.
    - When the function is called.
    - Then the output string includes a clearly labeled section for "Transcripts".
    - And each transcript entry includes metadata and a truncated content snippet (e.g., `content.substring(0, 500) + '...'`).
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 2.1.1

- [ ] **Story 2.1.5: Add `ActionItem` List Formatting to `formatDealContextForLLM`**
  - **As a Developer,** I want to add logic to `formatDealContextForLLM` to include a formatted list of `ActionItem` details (e.g., description, status) in the output string, **so that** action items are part of the LLM context.
  - **Acceptance Criteria:**
    - Given `formatDealContextForLLM` function and a `DealAIContext` object with action items.
    - When the function is called.
    - Then the output string includes a clearly labeled section for "Action Items" listing each item's details.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 2.1.1

**Feature 2.2: Initial Integration with an Existing AI Feature**

- [ ] **Story 2.2.1: Identify and Document Target AI Feature for Refactoring**

  - **As a Developer,** I want to identify one existing AI feature (e.g., backend for `transcript-qna-section.tsx` or `transcript-email-generator-client.tsx`) that currently fetches deal context disparately and document its current context gathering mechanism, **so that** it can be targeted for refactoring to use the new `DealContextBuilder`.
  - **Acceptance Criteria:**
    - Given the existing codebase.
    - When an AI feature is selected.
    - Then a brief document or comment is created outlining which feature will be refactored and how it currently gets its context.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 0.3 (provides initial analysis)

- [ ] **Story 2.2.2: Refactor Chosen AI Feature to Call `getDealAIContext`**

  - **As a Developer,** I want to refactor the backend logic of the chosen AI feature (from Story 2.2.1) to call the new `getDealAIContext` function instead of its previous data fetching methods, **so that** it utilizes the unified context aggregation service.
  - **Acceptance Criteria:**
    - Given the chosen AI feature and the `getDealAIContext` function.
    - When the feature's backend logic is modified.
    - Then it calls `getDealAIContext` with the correct `dealId` and `userId`.
    - And it correctly handles the returned `DealAIContext` object or null/error state.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 1.2.6, Story 2.2.1

- [ ] **Story 2.2.3: Integrate `formatDealContextForLLM` into Refactored AI Feature**

  - **As a Developer,** I want to integrate the `formatDealContextForLLM` function into the refactored AI feature (from Story 2.2.2) to prepare the context string for the LLM, **so that** the LLM receives context in the new standardized format.
  - **Acceptance Criteria:**
    - Given the refactored AI feature using `getDealAIContext`.
    - When the feature prepares data for the LLM.
    - Then it calls `formatDealContextForLLM` with the `DealAIContext` object.
    - And the resulting string is used as input to the LLM.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 2.1.5 (or completion of all 2.1.x stories), Story 2.2.2

- [ ] **Story 2.2.4: Test Refactored AI Feature with New Context Builder**
  - **As a Developer,** I want to thoroughly test the refactored AI feature, ensuring it functions correctly with the context provided by `DealContextBuilder` and `formatDealContextForLLM`, **so that** the initial integration is validated and performs as expected or better.
  - **Acceptance Criteria:**
    - Given the fully refactored AI feature.
    - When the feature is tested with various deal data (e.g., deals with many/few transcripts, contacts, action items).
    - Then the feature produces correct and relevant AI outputs.
    - And any issues related to context aggregation or formatting are identified and logged.
    - And relevant unit/integration tests are updated or created.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 2.2.3

---

## Human Testing Checkpoints

- [ ] **Story H.1: Human Review of Initial Context Aggregation Integration**
  - **As a Product Manager,** I want to manually test and review the AI feature refactored in Phase 2 (Story 2.2.4) after it's deployed to a staging environment, **so that** I can verify the unified context aggregation is working correctly and the AI's performance with the new context is acceptable before further rollout.
  - **Acceptance Criteria:**
    - Given the refactored AI feature is deployed to staging.
    - When I test the feature with several representative deals.
    - Then the AI responses are relevant and demonstrate appropriate use of the aggregated context (deal details, transcripts, contacts, action items).
    - And any observed regressions or issues with context handling are documented.
    - And feedback is provided to the development team.
    - And development on Phase 3 proceeds only after this review is satisfactory or issues are addressed.
  - **Priority:** P1 (Highest)
  - **Dependencies:** Story 2.2.4

---

## Phase 3: Enhancements and Broader Adoption

**Feature 3.1: Advanced `DealAIContextParams` and Fetching Logic**

- [ ] **Story 3.1.1: Add `transcriptIds` Param to `DealAIContextParams`**

  - **As a Developer,** I want to enhance `DealAIContextParams` to include an optional `transcriptIds` string array, **so that** specific transcripts can be requested for context, rather than always fetching all.
  - **Acceptance Criteria:**
    - Given `DealAIContextParams` interface.
    - When the interface is updated.
    - Then it includes an optional `transcriptIds?: string[]` field.
  - **Priority:** P2 (Medium)
  - **Dependencies:** Story 1.1.1

- [ ] **Story 3.1.2: Implement Fetching Specific Transcripts in `getDealAIContext`**

  - **As a Developer,** I want to update `getDealAIContext` to fetch only specified transcripts if `transcriptIds` is provided in `DealAIContextParams`, **so that** context is more targeted and efficient.
  - **Acceptance Criteria:**
    - Given `getDealAIContext` and `DealAIContextParams` (from Story 3.1.1).
    - When `getDealAIContext` is called with `transcriptIds` populated.
    - Then only the transcripts matching the provided IDs are fetched and included in `DealAIContext.transcripts`. (This may require a new query in `lib/db/queries.ts` like `getTranscriptsByIdsAndDealId`).
  - **Priority:** P2 (Medium)
  - **Dependencies:** Story 3.1.1

- [ ] **Story 3.1.3: Add `limitTranscripts` Param to `DealAIContextParams`**

  - **As a Developer,** I want to enhance `DealAIContextParams` to include an optional `limitTranscripts` number, **so that** the maximum number of transcripts included in the context can be controlled.
  - **Acceptance Criteria:**
    - Given `DealAIContextParams` interface.
    - When the interface is updated.
    - Then it includes an optional `limitTranscripts?: number` field.
  - **Priority:** P2 (Medium)
  - **Dependencies:** Story 1.1.1

- [ ] **Story 3.1.4: Implement Transcript Limiting in `getDealAIContext`**

  - **As a Developer,** I want to update `getDealAIContext` to limit the number of transcripts fetched/included based on the `limitTranscripts` param (e.g., newest N transcripts), **so that** token usage for LLMs can be better managed.
  - **Acceptance Criteria:**
    - Given `getDealAIContext` and `DealAIContextParams` (from Story 3.1.3).
    - When `getDealAIContext` is called with `limitTranscripts` populated.
    - Then no more than `limitTranscripts` are included in `DealAIContext.transcripts`.
  - **Priority:** P2 (Medium)
  - **Dependencies:** Story 3.1.3

- [ ] **Story 3.1.5: Add Selective Inclusion Flags to `DealAIContextParams`**

  - **As a Developer,** I want to enhance `DealAIContextParams` to include optional boolean flags (e.g., `includeContacts?: boolean`, `includeActionItems?: boolean`, `includeTranscripts?: boolean`), **so that** major sections of the context can be selectively included or excluded.
  - **Acceptance Criteria:**
    - Given `DealAIContextParams` interface.
    - When the interface is updated.
    - Then it includes optional boolean flags for `contacts`, `actionItems`, and `transcripts`.
  - **Priority:** P2 (Medium)
  - **Dependencies:** Story 1.1.1

- [ ] **Story 3.1.6: Implement Selective Inclusion Logic in `getDealAIContext`**
  - **As a Developer,** I want to update `getDealAIContext` to respect the selective inclusion flags from `DealAIContextParams`, fetching and including data only for sections marked as true (or default to true if flag not present), **so that** context can be tailored for specific AI tasks that may not need all data types.
  - **Acceptance Criteria:**
    - Given `getDealAIContext` and `DealAIContextParams` (from Story 3.1.5).
    - When `getDealAIContext` is called with flags like `includeContacts: false`.
    - Then the corresponding data (e.g., `contacts`) is an empty array or not fetched, and not included in the `DealAIContext` object or its formatted string output.
  - **Priority:** P2 (Medium)
  - **Dependencies:** Story 3.1.5

**Feature 3.2: Improved LLM Context Formatter**

- [ ] **Story 3.2.1: Research Transcript Summarization Strategies (Spike)**

  - **As a Developer,** I want to research and document viable strategies for smarter transcript summarization or advanced truncation for LLM context (e.g., extractive summaries, abstractive summaries via a quick LLM call, key phrase extraction), **so that** token limits are managed effectively for very long transcripts while retaining maximal relevant information.
  - **Acceptance Criteria:**
    - Given the need for better long-transcript handling.
    - When research is conducted.
    - Then a document is produced outlining 2-3 potential strategies, their pros/cons, and a recommendation.
  - **Priority:** P2 (Medium)
  - **Dependencies:** Story 2.1.4

- [ ] **Story 3.2.2: Implement Chosen Transcript Summarization/Truncation Strategy**

  - **As a Developer,** I want to implement the chosen strategy (from Story 3.2.1) for improved transcript summarization/truncation within `formatDealContextForLLM`, **so that** context from long transcripts is more concise yet useful for the LLM.
  - **Acceptance Criteria:**
    - Given `formatDealContextForLLM` and the chosen strategy.
    - When the function processes a `DealAIContext` with long transcripts.
    - Then the transcript content in the output string is appropriately summarized or truncated according to the strategy.
  - **Priority:** P2 (Medium)
  - **Dependencies:** Story 3.2.1

- [ ] **Story 3.2.3: Add Formatting `options` to `formatDealContextForLLM`**
  - **As a Developer,** I want to add an `options` parameter to `formatDealContextForLLM` (e.g., `options: { transcriptFormat: 'summary' | 'full_truncated' | 'titles_only', includeSections: string[] }`), **so that** the output string format can be tailored by the calling AI feature based on its specific needs.
  - **Acceptance Criteria:**
    - Given `formatDealContextForLLM`.
    - When the function signature is updated to include an `options` parameter.
    - Then the formatting logic respects these options (e.g., only includes transcript titles if specified).
  - **Priority:** P2 (Medium)
  - **Dependencies:** Story 2.1.1

**Feature 3.3: Refactor Other AI Features (Ongoing)**

- [ ] **Story 3.3.1: Identify and Document Second AI Feature for Refactoring**

  - **As a Developer,** I want to identify and document a second existing AI feature that processes deal context, **so that** it can be scheduled for refactoring to use the `DealContextBuilder`.
  - **Acceptance Criteria:**
    - Given the list of AI features.
    - When another feature is analyzed.
    - Then its name and current context handling are documented.
  - **Priority:** P3 (Low for initial epic, becomes P2 as builder matures)
  - **Dependencies:** Completion of Phase 1 and 2.

- [ ] **Story 3.3.2: Refactor Second AI Feature**
  - **As a Developer,** I want to refactor the second identified AI feature to use `DealContextBuilder` and `formatDealContextForLLM`, **so that** more of the application benefits from unified context aggregation.
  - **Acceptance Criteria:**
    - Given the identified feature and the mature `DealContextBuilder`.
    - When the feature is refactored.
    - Then it correctly uses the builder and formatter, and passes integration tests.
  - **Priority:** P3 (Low for initial epic)
  - **Dependencies:** Story 3.3.1, and maturity of the context builder from other Phase 3 stories.

---

## Roadmap Integration Sketch:

- **Sprint 1 (Focus: Foundation & Core Service):**
  - Stories: 0.1, 0.2, 0.3, 0.4 (Assumption Validation)
  - Stories: 1.1.1 (Interfaces)
  - Stories: 1.2.1, 1.2.2, 1.2.3, 1.2.4, 1.2.5, 1.2.6 (Core `getDealAIContext` build-out)
- **Sprint 2 (Focus: Formatting & Initial Proof of Concept):**
  - Stories: 2.1.1, 2.1.2, 2.1.3, 2.1.4, 2.1.5 (Core `formatDealContextForLLM` build-out)
  - Stories: 2.2.1, 2.2.2, 2.2.3, 2.2.4 (Refactor first AI feature & Test)
  - Story: H.1 (Human Review of POC)
- **Sprint 3+ (Focus: Enhancements & Wider Adoption):**
  - Stories from Feature 3.1 (Advanced Params & Fetching) - can be interleaved.
  - Stories from Feature 3.2 (Improved Formatter) - can be interleaved.
  - Stories from Feature 3.3 (Refactor more features) - ongoing as capacity allows.

This roadmap prioritizes establishing the core service and validating it with one feature before expanding its capabilities and refactoring other parts of the system.
