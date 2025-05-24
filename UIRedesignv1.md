# UI Redesign v1: Dedicated Transcript Detail Pages - User Stories

## Project Goal

To enhance the user experience by creating a dedicated page for each transcript, allowing for focused interaction, clearer context for action items, and a more intuitive workflow.

## Instructions for the AI Builder

- **Prioritize Understanding:** Before writing or modifying any code, thoroughly read the relevant files and their dependencies. Validate assumptions about existing code structure and data flow.
- **Incremental Progress:** Mark each user story or sub-task as completed with an `[x]` in this document as you finish it.
- **Human Testing Checkpoints:** Specific user stories will include "⏸️ **HUMAN TEST POINT**". At these points, pause implementation and await human tester feedback on the UI/UX before proceeding.

## Epics & Features

- **Epic:** Enhanced Sales Process Management
  - **Feature:** Dedicated Transcript Detail Page with Transcript-Specific Action Items

## User Stories

---

### Sprint 1: Backend Foundations & Basic Page Structure

**Prioritization Rationale (WSJF-like for Sprint 1):** Foundational database and routing changes are critical blockers for all subsequent UI work (high time criticality/risk reduction).

**1. User Story: Modify Action Item Data Model**
_ **ID:** DB-001
_ **Story:** As a System, I need the `ActionItem` data model to include a link to a specific `Transcript`, so that action items can be directly associated with their source transcript.
_ **Acceptance Criteria:**
_ Given the database schema `lib/db/schema.ts` is accessed,
_ When the `actionItem` table definition is modified,
_ Then it must include a new nullable column `transcriptId` (UUID) which is a foreign key referencing `transcript.id` (with `onDelete: 'set null'` or `onDelete: 'cascade'` as appropriate, let's default to `set null` for now to avoid accidental data loss if a transcript is deleted but we want to keep the action item, though this might be revisited).
_ And the database migrations are successfully generated and applied.
_ **Dependencies:** None
_ **Priority:** High
_ **AI Builder Checklist:**
_ `[ ]` Read `lib/db/schema.ts`.
_ `[ ]` Modify `actionItem` table definition.
_ `[ ]` Generate database migration files (e.g., using Drizzle Kit: `pnpm drizzle-kit generate:pg`).
_ `[ ]` Apply migrations (e.g., `pnpm drizzle-kit push:pg` or custom migration script). \* `[ ]` Verify schema changes in the database.

**2. User Story: Update Server Actions for Action Item Creation/Retrieval**
_ **ID:** BE-001
_ **Story:** As a Backend System, I need to update server actions for creating and retrieving action items, so that they can handle the new `transcriptId` association.
_ **Acceptance Criteria:**
_ Given an action item is being created,
_ When the `addUserActionItemAction` (in `app/(main)/deals/[dealId]/actions.ts`) is called with a `transcriptId`,
_ Then the new action item is saved with the provided `transcriptId`.
_ Given action items are being fetched for a specific transcript,
_ When a new or modified query/action (e.g., `getActionItemsForTranscriptAction`) is called with a `transcriptId`,
_ Then only action items associated with that `transcriptId` are returned.
_ Given the `scanTranscriptsForActionItemsAction` is refactored to `scanSingleTranscriptForActionItemsAction`,
_ When it processes a single transcript,
_ Then any generated action items are saved with the corresponding `transcriptId`.
_ **Dependencies:** DB-001
_ **Priority:** High
_ **AI Builder Checklist:**
_ `[ ]` Read `app/(main)/deals/[dealId]/actions.ts` and relevant query files (e.g., `lib/db/queries.ts`).
_ `[ ]` Modify `addUserActionItemAction` to accept and store `transcriptId`.
_ `[ ]` Create `getActionItemsForTranscriptAction` (or modify existing ones) to filter by `transcriptId`.
_ `[ ]` Refactor `scanTranscriptsForActionItemsAction` to `scanSingleTranscriptForActionItemsAction(transcriptId: string, dealId: string)` and ensure it links new AI items to the `transcriptId`.
_ `[ ]` Update any calls to these actions if their signatures change.

**3. User Story: Establish Routing for Dedicated Transcript Page**
_ **ID:** FE-001
_ **Story:** As a Developer, I want to set up the file-based routing for a dedicated transcript page, so that users can navigate to a unique URL for each transcript.
_ **Acceptance Criteria:**
_ Given a deal ID `[dealId]` and a transcript ID `[transcriptId]`,
_ When a user navigates to `/deals/[dealId]/transcripts/[transcriptId]`,
_ Then a new page component is rendered.
_ **Dependencies:** None
_ **Priority:** High
_ **AI Builder Checklist:**
_ `[ ]` Create new directory structure: `app/(main)/deals/[dealId]/transcripts/[transcriptId]/`.
_ `[ ]` Create `page.tsx` within this new directory.
_ `[ ]` Implement a basic placeholder component in the new `page.tsx`.

---

### Sprint 2: Displaying Transcript & Associated Action Items

**Prioritization Rationale (WSJF-like for Sprint 2):** Displaying core content (transcript, existing actions) is the next most valuable step for user visibility.

**4. User Story: Display Full Transcript Content on Dedicated Page**
_ **ID:** FE-002
_ **Story:** As a User, I want to view the full content of a selected transcript on its dedicated page, so that I can read and analyze it.
_ **Acceptance Criteria:**
_ Given I am on the dedicated transcript page for transcript `[transcriptId]`,
_ When the page loads,
_ Then the full text content of transcript `[transcriptId]` is fetched and displayed.
_ And the transcript's file name and call date/time are displayed.
_ **Dependencies:** FE-001, (Implicitly) BE-001 (for fetching transcript data if not already available via existing queries).
_ **Priority:** High
_ **AI Builder Checklist:**
_ `[ ]` Read the new `page.tsx` for the transcript detail page.
_ `[ ]` Read `lib/db/queries.ts` to identify or create a function to fetch a single transcript by ID (e.g., `getTranscriptById`).
_ `[ ]` Implement data fetching in the transcript detail page component.
_ `[ ]` Design and implement the UI to display transcript metadata and content. \* `[ ]` ⏸️ **HUMAN TEST POINT:** Verify transcript content and metadata display correctly and legibly.

**5. User Story: List Transcript-Specific Action Items**
_ **ID:** FE-003
_ **Story:** As a User, I want to see a list of action items specifically associated with the current transcript on its dedicated page, so that I can understand tasks derived from this transcript.
_ **Acceptance Criteria:**
_ Given I am on the dedicated transcript page for transcript `[transcriptId]`,
_ When the page loads,
_ Then all action items linked to `[transcriptId]` (via the new `transcriptId` field) are fetched and displayed.
_ And each action item shows its description, completion status (checkbox), and if it was AI-suggested.
_ And existing functionalities like toggling completion, editing, and deleting individual action items work for this list.
_ **Dependencies:** DB-001, BE-001, FE-001
_ **Priority:** High
_ **AI Builder Checklist:**
_ `[ ]` Read the transcript detail page component (`page.tsx`).
_ `[ ]` Utilize `getActionItemsForTranscriptAction` (from BE-001) to fetch data.
_ `[ ]` Adapt or reuse UI components from `ActionItemsSection.tsx` for displaying and managing these action items, ensuring all interactions (toggle, edit, delete) target items by their unique ID and correctly update the state for _this transcript's items only_.
_ `[ ]` Ensure the `dealId` is still passed where necessary for context if action item components rely on it.
_ `[ ]` ⏸️ **HUMAN TEST POINT:** Verify action items for the specific transcript are listed correctly. Test completion toggle, edit, and delete functionalities.

---

### Sprint 3: Interaction - Adding & Generating Action Items

**Prioritization Rationale (WSJF-like for Sprint 3):** Core interactions for creating new action items are next.

**6. User Story: Manually Add Action Item to Specific Transcript**
_ **ID:** FE-004
_ **Story:** As a User, I want to manually add a new action item directly to the current transcript from its dedicated page, so that I can capture tasks relevant to this specific context.
_ **Acceptance Criteria:**
_ Given I am on the dedicated transcript page for transcript `[transcriptId]`,
_ When I use the "Add Action Item" feature on this page,
_ Then the new action item is created and associated with `[transcriptId]` and the current `dealId`.
_ And the new action item appears in the list of action items for this transcript.
_ **Dependencies:** FE-003
_ **Priority:** High
_ **AI Builder Checklist:**
_ `[ ]` Read the transcript detail page component.
_ `[ ]` Implement an "Add Action Item" button/form (can reuse/adapt UI from `ActionItemsSection.tsx`).
_ `[ ]` Ensure the `addUserActionItemAction` is called with the correct `dealId` AND the current `transcriptId`.
_ `[ ]` Update the local state to reflect the newly added action item. \* `[ ]` ⏸️ **HUMAN TEST POINT:** Verify manual addition of action items, ensuring they appear correctly and are linked to the current transcript.

**7. User Story: Scan Current Transcript for AI-Suggested Action Items**
_ **ID:** FE-005
_ **Story:** As a User, I want a button on the dedicated transcript page to scan _only the current transcript_ for AI-suggested action items, so that I can get targeted suggestions.
_ **Acceptance Criteria:**
_ Given I am on the dedicated transcript page for transcript `[transcriptId]`,
_ When I click the "Scan this Transcript for Suggestions" button,
_ Then the `scanSingleTranscriptForActionItemsAction` (from BE-001) is called with the current `transcriptId` and `dealId`.
_ And any newly generated AI action items are associated with `[transcriptId]`.
_ And these new items appear in the action item list for this transcript, marked as AI-suggested.
_ **Dependencies:** FE-003, BE-001
_ **Priority:** High
_ **AI Builder Checklist:**
_ `[ ]` Read the transcript detail page component.
_ `[ ]` Add a "Scan this Transcript for Suggestions" button.
_ `[ ]` Wire the button to call `scanSingleTranscriptForActionItemsAction` with the current `transcriptId` and `dealId`.
_ `[ ]` Handle the response and update the local list of action items.
_ `[ ]` ⏸️ **HUMAN TEST POINT:** Verify AI scan functionality for a single transcript. Check that new items are added to the correct list and marked as AI-suggested.

---

### Sprint 4: Integrating with Existing Deal Page & Cleanup

**Prioritization Rationale (WSJF-like for Sprint 4):** Connecting the new workflow with the existing UI and cleaning up old patterns.

**8. User Story: Navigate from Deal Page to Dedicated Transcript Page**
_ **ID:** FE-006
_ **Story:** As a User, when viewing the list of transcripts on a deal's main page, I want to click on a transcript to navigate to its new dedicated detail page, so that I can access its specific information and actions.
_ **Acceptance Criteria:**
_ Given I am on the main deal page (`/deals/[dealId]`), viewing the list of transcripts in `TranscriptSection.tsx`,
_ When I click on a specific transcript (e.g., its name or a "View Details" button),
_ Then I am navigated to `/deals/[dealId]/transcripts/[transcriptId]` for that selected transcript.
_ **Dependencies:** FE-001
_ **Priority:** Medium
_ **AI Builder Checklist:**
_ `[ ]` Read `app/(main)/deals/[dealId]/transcript-section.tsx`.
_ `[ ]` Modify the rendering of each transcript item to be a link or have a button that navigates to the new dedicated page URL.
_ `[ ]` Ensure `dealId` and `transcriptId` are correctly passed for navigation. \* `[ ]` ⏸️ **HUMAN TEST POINT:** Verify navigation from the deal page's transcript list to the dedicated transcript pages works correctly for multiple transcripts.

**9. User Story: Deprecate/Remove Old Action Item Section from Main Deal Page (or Adapt)**
_ **ID:** FE-007
_ **Story:** As a System Maintainer, I want to remove or adapt the old global "Action Items" section from the main deal page, so that users are directed to the new transcript-specific action item management and to avoid confusion (as per current requirement of no global items).
_ **Acceptance Criteria:**
_ Given the decision to focus only on transcript-specific action items for now,
_ When the main deal page (`app/(main)/deals/[dealId]/page.tsx`) is loaded,
_ Then the old `ActionItemsSection` component (which shows deal-wide action items) is no longer rendered or is clearly marked as deprecated/re-purposed if a future need for deal-level items is anticipated.
_ And the "Scan for Suggestions" button on the main deal page (if it was part of the old `ActionItemsSection`) is removed, as scanning is now transcript-specific.
_ **Dependencies:** All previous FE stories.
_ **Priority:** Medium
_ **AI Builder Checklist:**
_ `[ ]` Read `app/(main)/deals/[dealId]/page.tsx`.
_ `[ ]` Comment out or remove the `<ActionItemsSection dealId={deal.id} />` line.
_ `[ ]` If any global "Add Action Item" or "Scan All Transcripts" functionality was part of it, ensure it's removed to align with the current focus.
_ `[ ]` ⏸️ **HUMAN TEST POINT:** Verify the main deal page no longer shows the old, global action items section. Ensure the UI feels clean and directs users towards transcript-specific actions.

---

## Definition of Done (Per Story)

- All acceptance criteria met.
- Code written and reviewed (simulated for AI builder: AI builder re-reads its own code and cross-references with requirements).
- Relevant files read and understood before changes.
- Dependencies considered and addressed.
- Unit/integration tests written and passing (if applicable/feasible for AI builder).
- Manual UI testing checkpoint (if specified) passed by a human tester.
- This markdown checklist for the story is updated.

## Roadmap Integration

- **Iteration 1 (Sprint 1):** DB-001, BE-001, FE-001 (Focus: Backend and routing foundation)
- **Iteration 2 (Sprint 2):** FE-002, FE-003 (Focus: Displaying core information on the new page)
- **Iteration 3 (Sprint 3):** FE-004, FE-005 (Focus: Core interactions - adding/generating actions)
- **Iteration 4 (Sprint 4):** FE-006, FE-007 (Focus: Integration and cleanup)

This plan provides a structured approach to implementing the dedicated transcript detail page.
