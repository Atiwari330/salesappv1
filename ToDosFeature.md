# Plan for Implementing: Intelligent Action Item Management

**To the AI Agent Builder (LLM):**

You are tasked with implementing the "Intelligent Action Item Management" feature. Please follow this plan meticulously.

**Critical Instructions for Implementation:**

1.  **Iterative Approach:** Implement the user stories in the order they are presented, especially respecting dependencies.
2.  **Validate Assumptions:** Before writing any code for a story, **ALWAYS** read relevant existing files (e.g., `lib/db/schema.ts`, `lib/db/queries.ts`, related `actions.ts` files, UI component structures) to understand current patterns, dependencies, and available utilities. This is crucial to avoid breaking existing functionality and to ensure your code integrates smoothly.
3.  **Read Dependencies:** Pay close attention to imports and how different parts of the application interact. If a story involves modifying or using existing functions/components, read their source code first.
4.  **Focus on One Story Point:** Each user story is designed to be a small, manageable piece of work. Complete one fully before moving to the next.
5.  **Check Off Work:** After successfully completing and testing each user story (as per its acceptance criteria and the Definition of Done), return to this `ToDosFeature.md` file and mark the corresponding checkbox with an `[x]`.
6.  **Error Handling & Robustness:** Implement appropriate error handling for server actions and UI interactions.
7.  **Code Style & Consistency:** Adhere to the existing code style, patterns, and conventions found in the project.
8.  **Ask for Clarification (If Human-Assisted):** If any part of a user story or acceptance criteria is unclear, and if you have a human supervisor, please ask for clarification before proceeding. (For autonomous operation, make the best-informed decision based on existing patterns).

---

## 1. Epic & Feature Overview

**Epic:** Intelligent Action Item Management

**Feature Description:** Develop a system within each deal that allows users to manage a to-do list. Action items can be created manually by the user or suggested by an AI analyzing deal transcripts (triggered by user). Users can mark items as complete, edit, and delete them.

**Core User Value:** Helps sales professionals stay organized, ensures follow-ups are not missed, and provides a clear overview of next steps for each deal, enhancing productivity and deal progression.

---

## 2. Feature Breakdown, User Stories, Acceptance Criteria & Prioritization

_(Stories are prioritized based on foundational needs and dependencies. P1 = Highest Priority)_

### Phase 1: Backend - Database & Core Logic

**Feature: Action Item Data Persistence**

- **[x] US1.1: Define ActionItem Database Schema**

  - **User Story:** As a developer, I want to define the Drizzle schema for the `ActionItem` table, so that action item data (description, completion status, AI suggestion flag, associations) can be persisted correctly.
  - **Acceptance Criteria:**
    - Given the `ActionItem` schema is added to `lib/db/schema.ts` with fields: `id` (UUID, PK), `dealId` (UUID, FK to Deal, cascade delete), `description` (TEXT, NOT NULL), `isCompleted` (BOOLEAN, NOT NULL, DEFAULT false), `isAISuggested` (BOOLEAN, NOT NULL, DEFAULT false), `userId` (UUID, FK to User, NOT NULL), `createdAt` (TIMESTAMP, DEFAULT NOW()), `updatedAt` (TIMESTAMP, DEFAULT NOW()).
    - When database migrations are generated and applied (developer will handle migration generation, LLM should only update schema file).
    - Then the `ActionItem` table exists in the database with the correct structure and constraints.
  - **Priority:** P1
  - **Dependencies:** None

- **[x] US1.2: Implement `createActionItem` Database Query**

  - **User Story:** As a developer, I want to implement a `createActionItem` database query function, so that new action items can be saved to the database.
  - **Acceptance Criteria:**
    - Given valid action item data (dealId, description, userId, isAISuggested),
    - When `createActionItem` in `lib/db/queries.ts` is called,
    - Then a new record is inserted into the `ActionItem` table, and the created action item object is returned.
  - **Priority:** P1
  - **Dependencies:** US1.1

- **[x] US1.3: Implement `getActionItemsByDealId` Database Query**

  - **User Story:** As a developer, I want to implement a `getActionItemsByDealId` database query function, so that all action items associated with a specific deal can be retrieved for display.
  - **Acceptance Criteria:**
    - Given a `dealId` and `userId`,
    - When `getActionItemsByDealId` in `lib/db/queries.ts` is called,
    - Then it first verifies the `userId` owns the `dealId` (reuse existing patterns for this check, e.g., `findDealByIdAndUserId`).
    - And if authorized, an array of `ActionItem` objects for that deal is returned, ordered by `createdAt` (e.g., ascending).
    - And if not authorized or deal not found, an empty array or appropriate error/indicator is handled.
  - **Priority:** P1
  - **Dependencies:** US1.1

- **[x] US1.4: Implement `updateActionItem` Database Query**

  - **User Story:** As a developer, I want to implement an `updateActionItem` database query function, so that an existing action item's description or completion status can be modified.
  - **Acceptance Criteria:**
    - Given an `actionItemId`, `userId`, and update data (e.g., new description, new `isCompleted` status),
    - When `updateActionItem` in `lib/db/queries.ts` is called,
    - Then it verifies the user (via `userId`) has rights to update the item (e.g., by checking ownership of the associated deal).
    - And if authorized, the specified fields of the action item are updated in the database, `updatedAt` is refreshed, and the updated action item object is returned.
  - **Priority:** P1
  - **Dependencies:** US1.1

- **[x] US1.5: Implement `deleteActionItem` Database Query**

  - **User Story:** As a developer, I want to implement a `deleteActionItem` database query function, so that an action item can be removed from the system.
  - **Acceptance Criteria:**
    - Given an `actionItemId` and `userId`,
    - When `deleteActionItem` in `lib/db/queries.ts` is called,
    - Then it verifies the user (via `userId`) has rights to delete the item.
    - And if authorized, the action item is deleted from the database.
  - **Priority:** P1
  - **Dependencies:** US1.1

- **[x] US1.6: Implement `createMultipleActionItems` Database Query**
  - **User Story:** As a developer, I want to implement a `createMultipleActionItems` database query function, so that AI-suggested action items can be batch-inserted efficiently.
  - **Acceptance Criteria:**
    - Given an array of valid action item data objects (each with dealId, description, userId, isAISuggested),
    - When `createMultipleActionItems` in `lib/db/queries.ts` is called,
    - Then all provided action items are inserted into the `ActionItem` table, and an array of the created action item objects is returned.
  - **Priority:** P1
  - **Dependencies:** US1.1

### Phase 2: Backend - Server Actions

**Feature: Manual Action Item Management API**

- **[x] US2.1: Create Server Action `addUserActionItemAction`**

  - **User Story:** As a sales rep, I want to manually add a new action item to a deal, so I can track my custom to-dos.
  - **Acceptance Criteria:**
    - Given a `dealId`, `description`, and authenticated `userId`,
    - When the `addUserActionItemAction` server action (e.g., in `app/(main)/deals/[dealId]/actions.ts` or a new `app/(main)/action-items/actions.ts`) is called,
    - Then it validates input (e.g., description not empty).
    - And it calls `createActionItem` query with `isAISuggested: false`.
    - And it calls `revalidatePath` for the relevant deal page.
    - And it returns a success status and the created action item.
  - **Priority:** P2
  - **Dependencies:** US1.2

- **[x] US2.2: Create Server Action `updateUserActionItemAction`**

  - **User Story:** As a sales rep, I want to update the description or mark an action item as complete/incomplete, so I can manage its lifecycle.
  - **Acceptance Criteria:**
    - Given an `itemId`, authenticated `userId`, and update data (new `description` or `isCompleted` status),
    - When the `updateUserActionItemAction` server action is called,
    - Then it validates input.
    - And it calls `updateActionItem` query.
    - And it calls `revalidatePath` for the relevant deal page.
    - And it returns a success status and the updated action item.
  - **Priority:** P2
  - **Dependencies:** US1.4

- **[x] US2.3: Create Server Action `deleteUserActionItemAction`**

  - **User Story:** As a sales rep, I want to delete an action item I no longer need, so I can keep my to-do list clean.
  - **Acceptance Criteria:**
    - Given an `itemId` and authenticated `userId`,
    - When the `deleteUserActionItemAction` server action is called,
    - Then it calls `deleteActionItem` query.
    - And it calls `revalidatePath` for the relevant deal page.
    - And it returns a success status.
  - **Priority:** P2
  - **Dependencies:** US1.5

- **[x] US2.4: Create Server Action `scanTranscriptsForActionItemsAction`**
  - **User Story:** As a sales rep, I want to initiate a scan of a deal's transcripts, so that the AI can suggest relevant action items.
  - **Acceptance Criteria:**
    - Given a `dealId` and authenticated `userId`,
    - When the `scanTranscriptsForActionItemsAction` server action (in `app/(main)/deals/[dealId]/actions.ts`) is called:
      1. It verifies user ownership of the `dealId`.
      2. It fetches all transcripts for the `dealId` (using `getTranscriptsByDealId`).
      3. It combines content from all transcripts. If none, it returns an appropriate message/status.
      4. It constructs a prompt for an LLM (e.g., `myProvider.languageModel('chat-model')`) to extract actionable tasks. The prompt should request a list of short, clear action items (e.g., as a JSON array of strings or a clearly parseable list).
      5. It uses `generateText` (from `ai` SDK) to get suggestions from the LLM.
      6. It parses the LLM's response.
      7. For each valid suggestion, it prepares an `ActionItem` object (with `isAISuggested: true`, `dealId`, `userId`).
      8. It calls `createMultipleActionItems` (US1.6) to save them.
      9. It calls `revalidatePath` for the deal page.
      10. It returns a success status and a count of new suggestions found (or an appropriate error message).
  - **Priority:** P2
  - **Dependencies:** US1.3, US1.6, `getTranscriptsByDealId` (existing), AI provider setup (existing).

### Phase 3: Frontend - User Interface

**Feature: Action Item Display and Interaction**

- **[x] US3.1: Create Basic `ActionItemsSection` UI Component**

  - **User Story:** As a sales rep, I want to see a dedicated "Action Items" section on the deal page, so I can view my tasks.
  - **Acceptance Criteria:**
    - Given a new client component `app/(main)/deals/[dealId]/action-items-section.tsx` is created.
    - When this component is added to the `app/(main)/deals/[dealId]/page.tsx`.
    - Then it renders a card with the title "Action Items".
    - And it initially displays a loading state or "No action items yet." message.
  - **Priority:** P3
  - **Dependencies:** None (for basic shell)

- **[x] US3.2: Fetch and Display Action Items**

  - **User Story:** As a sales rep, I want the "Action Items" section to display all tasks associated with the current deal, so I know what needs to be done.
  - **Acceptance Criteria:**
    - Given the `ActionItemsSection` component,
    - When it mounts or `dealId` changes,
    - Then it calls a server action (wrapper around `getActionItemsByDealId`) to fetch action items.
    - And each fetched action item is displayed as a list item showing its description and a checkbox.
    - And completed items are visually distinct (e.g., strikethrough description, checked box).
    - And AI-suggested items have a small visual indicator (e.g., an icon).
  - **Priority:** P3
  - **Dependencies:** US1.3, US3.1

- **[x] US3.3: Implement "Add Action Item" UI and Functionality**

  - **User Story:** As a sales rep, I want an "Add Action Item" button and form within the "Action Items" section, so I can quickly create new manual tasks.
  - **Acceptance Criteria:**
    - Given the `ActionItemsSection` component,
    - When the "Add Action Item" button is clicked, a form (e.g., inline or in a dialog) appears with an input field for the description.
    - When the form is submitted,
    - Then it calls `addUserActionItemAction` (US2.1).
    - And upon success, the new action item appears in the list, and the form is cleared/closed.
    - And appropriate loading states and toast notifications are shown.
  - **Priority:** P3
  - **Dependencies:** US2.1, US3.2

- **[x] US3.4: Implement "Toggle Completion" UI and Functionality**

  - **User Story:** As a sales rep, I want to click a checkbox next to an action item to mark it as complete or incomplete, so I can track my progress.
  - **Acceptance Criteria:**
    - Given an action item is displayed in the list,
    - When its checkbox is clicked,
    - Then it calls `updateUserActionItemAction` (US2.2) with the new `isCompleted` status.
    - And upon success, the item's visual state (checkbox, strikethrough) updates in the list.
    - And appropriate loading states and toast notifications are shown.
  - **Priority:** P3
  - **Dependencies:** US2.2, US3.2

- **[x] US3.5: Implement "Edit Action Item" UI and Functionality (Basic)**

  - **User Story:** As a sales rep, I want to edit the description of an existing action item, so I can correct mistakes or add details.
  - **Acceptance Criteria:**
    - Given an action item is displayed, an "Edit" button/icon is present.
    - When "Edit" is clicked, the description becomes editable (e.g., inline input or small dialog).
    - When changes are saved,
    - Then it calls `updateUserActionItemAction` (US2.2) with the new description.
    - And upon success, the updated description is shown in the list.
    - And appropriate loading states and toast notifications are shown.
  - **Priority:** P3
  - **Dependencies:** US2.2, US3.2

- **[x] US3.6: Implement "Delete Action Item" UI and Functionality**

  - **User Story:** As a sales rep, I want to delete an action item, so I can remove tasks that are no longer relevant.
  - **Acceptance Criteria:**
    - Given an action item is displayed, a "Delete" button/icon is present.
    - When "Delete" is clicked, a confirmation dialog appears.
    - When deletion is confirmed,
    - Then it calls `deleteUserActionItemAction` (US2.3).
    - And upon success, the item is removed from the list.
    - And appropriate loading states and toast notifications are shown.
  - **Priority:** P3
  - **Dependencies:** US2.3, US3.2

- **[x] US3.7: Implement "Scan Transcripts for Action Items" Button and Functionality**
  - **User Story:** As a sales rep, I want a button in the "Action Items" section to trigger an AI scan of deal transcripts, so I can get automated task suggestions.
  - **Acceptance Criteria:**
    - Given the `ActionItemsSection` component,
    - When the "Scan Transcripts for Action Items" button is clicked,
    - Then it calls the `scanTranscriptsForActionItemsAction` server action (US2.4).
    - And a loading indicator is shown (e.g., "Scanning...").
    - And upon success, any newly suggested action items appear in the list.
    - And a toast notification indicates success (e.g., "Found X new suggestions") or failure.
  - **Priority:** P3
  - **Dependencies:** US2.4, US3.2

---

## 3. Definition of Done (DoD) for Each Story

- Code implemented as per acceptance criteria.
- Code adheres to existing project style and conventions.
- Relevant files (schema, queries, actions, components) have been read and understood before making changes.
- Functionality manually tested by the developer (or AI agent) to ensure it works as expected.
- No existing functionality is broken (regression testing, if applicable).
- Error handling is implemented for user-facing operations.
- UI is responsive and consistent with the existing design.
- Code is reviewed (if a review process is in place).
- This `ToDosFeature.md` file is updated with a checkmark `[x]` for the completed story.

---

## 4. Roadmap & Sequencing

The user stories are already sequenced by phase and priority. It's recommended to implement them in this order:

- **Sprint 1 (Backend Foundation):** Focus on all Phase 1 stories (US1.1 - US1.6). This establishes the database structure and core data access logic.
- **Sprint 2 (Backend Actions & AI Logic):** Focus on all Phase 2 stories (US2.1 - US2.4). This builds the API layer for manual management and the AI suggestion capability.
- **Sprint 3 (Frontend UI - Part 1):** Focus on US3.1, US3.2, US3.3, US3.4. This brings the basic display and core manual interactions to the user.
- **Sprint 4 (Frontend UI - Part 2 & AI Integration):** Focus on US3.5, US3.6, US3.7. This completes the manual management UI and integrates the AI scanning feature.

This phased approach ensures that foundational elements are built first, followed by backend logic, and then the user-facing interface. Each sprint delivers a testable increment of functionality.

---

**Final Reminder to AI Agent Builder:**
Remember to frequently refer back to this document, validate your understanding of the codebase before implementing, and mark stories as complete once they meet the Definition of Done. Good luck!
