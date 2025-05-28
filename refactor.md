# Deal AI Workspace - UX & AI Enhancements: User Stories

This document outlines the prioritized user stories for enhancing the Deal AI Workspace based on the AI LLM's improvement plan.

## Prioritization Key

- **P1:** Highest priority, foundational or high-impact.
- **P2:** Medium priority, important for feature completeness or significant UX improvement.
- **P3:** Lower priority, polish, or less critical enhancements.

Prioritization is based on a qualitative assessment of impact, reach, strategic importance, and dependencies.

## Definition of Done (DoD)

For each user story, the Definition of Done includes:

- Code implemented as per acceptance criteria.
- Unit tests written and passing (where applicable).
- Integration tests updated/written and passing (where applicable).
- E2E tests updated/written and passing (for UI changes).
- Code reviewed and approved by at least one other developer.
- Functionality manually tested and verified against Acceptance Criteria.
- Relevant documentation (code comments, READMEs, ADRs if significant) updated.
- No known critical bugs related to the story.
- Story merged to the main development branch.
- (For UI stories) Responsive design checked on target breakpoints (sm, md, lg, xl).
- (For UI stories) Basic accessibility checks performed (e.g., keyboard navigation, ARIA attributes, color contrast).

---

## EPIC 0: Foundation & Familiarization

### Assumption Validation & Codebase Familiarization

_These initial tasks are crucial for the development team to understand the existing system before making changes. The builder/engineer will need to interact with the provided codebase directly for these tasks._

- [ ] **Story 0.1 (P1):** As a Developer, I want to thoroughly review and document the existing frontend routing structure (primarily within the `app/*` directories), so that I can plan the IA refactor accurately.

  - **Acceptance Criteria:**
    - Given: Access to the application's source code.
    - When: The developer reviews all page and layout files in `app/(main)/`, `app/(chat)/`, and `app/(auth)/`.
    - Then: A brief document (e.g., a Markdown file in a `docs/` folder or a shared team document) is created outlining the current route structure, key components used per route, and any observed patterns or complexities.
    - And: The developer confirms understanding of how Next.js App Router is utilized.
  - **Dependencies:** None.

- [ ] **Story 0.2 (P1):** As a Developer, I want to analyze and document the current state management and data fetching patterns (custom hooks, SWR usage), so that I can integrate new features consistently.

  - **Acceptance Criteria:**
    - Given: Access to the application's source code.
    - When: The developer reviews files in the `hooks/*` directory (e.g., `useDealAIInteraction.ts`, `useArtifact.ts`), and how SWR is used in client components.
    - Then: A brief document is created summarizing current state management strategies (global, local, SWR), data fetching patterns, and common custom hooks.
  - **Dependencies:** None.

- [ ] **Story 0.3 (P1):** As a Developer, I want to study and document the existing backend server actions and API routes, particularly those related to deals, transcripts, contacts, and action items, so that I understand data flow and can plan backend modifications.

  - **Acceptance Criteria:**
    - Given: Access to the application's source code.
    - When: The developer reviews server action files (e.g., `app/(main)/deals/[dealId]/actions.ts`, `app/(main)/contacts/actions.ts`) and API route handlers (e.g., `app/.../api/.../route.ts` files).
    - Then: A brief document is created outlining key server actions, their purposes, data transformations, and interactions with database queries.
  - **Dependencies:** None.

- [ ] **Story 0.4 (P1):** As a Developer, I want to examine and document the current database schema (typically found in `lib/db/schema.ts`) and key query functions (typically in `lib/db/queries.ts`), so that I can identify necessary schema changes and new queries.

  - **Acceptance Criteria:**
    - Given: Access to the application's source code.
    - When: The developer reviews `lib/db/schema.ts` and `lib/db/queries.ts`.
    - Then: A brief document is created summarizing the current data model (Deal, Transcript, Contact, DealContact, ActionItem, etc.), relationships, and common query patterns, noting any tables relevant to the new features.
  - **Dependencies:** None.

- [ ] **Story 0.5 (P1):** As a Developer, I want to review the existing AI integration points, specifically focusing on how deal context is built (e.g., `lib/ai/deal_context_builder.ts`), how LLM interactions are standardized (e.g., `lib/ai/utils.ts` containing `generateStandardizedAIDealResponse`), and how prompts are managed (e.g., `lib/ai/prompts.ts`), so that I can leverage and extend these abstractions for new AI features.

  - **Acceptance Criteria:**
    - Given: Access to the application's source code.
    - When: The developer reviews the specified AI-related files.
    - Then: A brief document is created explaining how deal context is built, how LLM prompts are constructed, and how standardized AI call utilities orchestrate AI interactions.
  - **Dependencies:** None.

- [ ] **Story 0.6 (P1):** As a Developer, I want to set up my local development environment, run the application, and successfully execute core existing user flows (login, create deal, upload transcript, view deal details), so that I have a working baseline for development.
  - **Acceptance Criteria:**
    - Given: Project setup instructions (e.g., from `package.json`, `.env.example`) and necessary environment variables.
    - When: The developer follows the setup guide.
    - Then: The application runs locally without errors.
    - And: The developer can successfully log in, create a new deal, upload a transcript to it, and view the deal detail page.
  - **Dependencies:** None.

---

## EPIC 1: Core IA & Navigation Refactor

### Feature: Collapsible Left Navigation Update & Workspace Tabs

- [ ] **Story 1.1 (P1):** As a User, I want the existing left sidebar (`AppSidebar`) to be updated to reflect new top-level navigation items: "Deals", "Contacts" (new), "Tasks" (new), and "Insights" (new), so that I can easily access these core areas of the application.

  - **Acceptance Criteria:**
    - Given: The `AppSidebar` component (typically found in `components/app-sidebar.tsx`).
    - When: The sidebar is rendered after login.
    - Then: The sidebar displays clickable links/buttons for "Deals", "Contacts", "Tasks", and "Insights".
    - And: "Deals" links to `/deals`.
    - And: "Contacts" links to `/contacts` (new placeholder page).
    - And: "Tasks" links to `/tasks` (new placeholder page).
    - And: "Insights" links to `/insights` (new placeholder page).
    - And: The existing "New Chat" (+) button functionality and "Deal AI Workspace" home link are preserved.
  - **Dependencies:** Story 0.1.
  - **Notes:** This story focuses on updating the sidebar links. Actual page creation for Contacts, Tasks, Insights will be separate stories.

- [ ] **Story 1.2 (P1):** As a Developer, I want to create basic placeholder pages for the new "Contacts", "Tasks", and "Insights" sections within the `app/(main)/` directory structure, so that the updated sidebar navigation links have valid destinations.
  - **Acceptance Criteria:**
    - Given: The main application layout (typically `app/(main)/layout.tsx`).
    - When: A user navigates to `/contacts`.
    - Then: A page is displayed with the title "Contacts" and a message like "Contacts management coming soon." using the main layout.
    - And: A similar placeholder page is created at `/tasks` titled "Tasks" with a "Tasks management coming soon." message.
    - And: A similar placeholder page is created at `/insights` titled "Insights" with an "AI Insights coming soon." message.
  - **Dependencies:** Story 1.1.

### Feature: Command-K Global Search Palette (Initial Setup)

- [ ] **Story 1.3 (P3):** As a Developer, I want to integrate a basic Command-K palette component (e.g., using `cmdk` and integrating with shadcn/ui's `<Command>` component), triggered by `⌘+K` or `Ctrl+K`, so that we have the UI foundation for global search.
  - **Acceptance Criteria:**
    - Given: The application is running.
    - When: The user presses `⌘+K` (or `Ctrl+K`).
    - Then: A modal search palette appears centered on the screen.
    - And: The palette can be dismissed by pressing `Esc` or clicking outside the palette.
    - And: Initially, the palette displays a static input field and a message "Search for deals, contacts, transcripts... (coming soon)". No actual search functionality is implemented in this story.
  - **Dependencies:** None.
  - **Notes:** Populating the palette with search results and actions will be in future stories.

---

## EPIC 2: Deals List Enhancement

### Feature: Deals List Page Redesign (`/deals`)

- [ ] **Story 2.1 (P1):** As an AE, I want the Deals List page (typically `app/(main)/deals/page.tsx` and its client component like `deals-client.tsx`) to display deals in a shadcn/ui `<DataTable>` component, showing columns for "Deal Name", "Date Created", and "Number of Transcripts", so I can view deal information in a more structured and sortable format.

  - **Acceptance Criteria:**
    - Given: The user is on the `/deals` page.
    - When: Deals are loaded (e.g., via `getDealsByUserId` which includes `transcriptCount`).
    - Then: Deals are displayed in a shadcn/ui DataTable.
    - And: The table has columns: "Deal Name", "Date Created" (formatted `toLocaleDateString`), "Number of Transcripts".
    - And: Columns are sortable by clicking their headers.
    - And: Clicking a row navigates to the deal detail page (`/deals/[dealId]`).
    - And: The "+ New Deal" button and its modal functionality (e.g., `createDeal` action) are preserved.
  - **Dependencies:** Story 0.4. The client component for deals list will be refactored.

- [ ] **Story 2.2 (P2):** As an AE, I want the Deals List data table to include a "Status" column displaying a text-based representation of the deal stage, so I can quickly assess the stage of each deal.

  - **Acceptance Criteria:**
    - Given: The Deals List data table from Story 2.1.
    - When: Deals are displayed.
    - Then: A "Status" column is present.
    - And: The column displays the `stage` field from the `Deal` object (e.g., "Discovery", "Proposal").
    - And: The `Deal` schema (e.g., in `lib/db/schema.ts`) is updated to include a `stage VARCHAR(50) NOT NULL` field (default 'Discovery').
    - And: The relevant deal creation query (e.g., `createDealQuery` in `lib/db/queries.ts`) is updated to set a default stage.
    - And: Existing deals in the database need a migration to add this field with a default value.
  - **Dependencies:** Story 2.1.
  - **Notes:** Color-coding or chips for status are a future enhancement.

- [ ] **Story 2.3 (P2):** As a Developer, I want to implement a right-drawer "peek view" (using shadcn/ui `<Drawer>`) on the Deals List page. When a deal row is clicked, the drawer slides in showing placeholder deal details and an "Open full deal" button, so users can quickly preview a deal.

  - **Acceptance Criteria:**
    - Given: The Deals List data table from Story 2.1.
    - When: A user clicks on a deal row.
    - Then: Instead of immediate navigation, a drawer slides in from the right side of the screen.
    - And: The drawer displays the clicked deal's name as a title.
    - And: The drawer body shows placeholder text like "Deal details loading..." or basic fields like "Stage: [stage_name]".
    - And: The drawer contains an "Open full deal" button that navigates to `/deals/[dealId]`.
    - And: The drawer can be closed (e.g., via an 'X' icon or clicking outside).
  - **Dependencies:** Story 2.1.
  - **Notes:** Populating the drawer with comprehensive, actual data will be part of EPIC 3.

- [ ] **Story 2.4 (P3):** As an AE, I want the Deals List data table to include an "AI Nudges" column displaying a placeholder spark icon, so I am aware of where future AI-generated suggestions will appear.
  - **Acceptance Criteria:**
    - Given: The Deals List data table from Story 2.1.
    - When: Deals are displayed.
    - Then: An "AI Nudges" column is present.
    - And: Each cell in this column displays a small spark icon (e.g., from `lucide-react`).
    - And: Hovering over the icon shows a default tooltip "AI Nudges (Coming Soon)".
  - **Dependencies:** Story 2.1.

---

## EPIC 3: Deal Overview Redesign (`/deals/[dealId]`)

### Feature: Deal Detail Page Layout & Hero Header

- [ ] **Story 3.1 (P1):** As a Developer, I want to refactor the Deal Detail page (typically `app/(main)/deals/[dealId]/page.tsx`) to use a 2-column responsive grid layout (main content left, sidebar-like content right), so that information can be organized more effectively as per the new design.

  - **Acceptance Criteria:**
    - Given: The user navigates to a Deal Detail page.
    - When: The page renders.
    - Then: The layout consists of a main content area (e.g., 65-70% width on desktop) and a right sidebar area (e.g., 30-35% width on desktop).
    - And: On smaller screens (e.g., `md` breakpoint and below), the right sidebar area stacks below the main content area.
    - And: The existing `DealHeaderClient` and `TranscriptSection` are initially placed in the main (left) content area. The right area can be a placeholder.
  - **Dependencies:** Story 0.1.

- [ ] **Story 3.2 (P1):** As an AE, I want the `DealHeaderClient` component on the Deal Detail page to be updated to prominently display the deal name (inline editable), a placeholder for deal status (dropdown), and text displays for monetary value and forecast close date, so I have key information at a glance.
  - **Acceptance Criteria:**
    - Given: The Deal Detail page with the new 2-column layout.
    - When: The `DealHeaderClient` component (e.g., `app/(main)/deals/[dealId]/deal-header-client.tsx`) renders.
    - Then: The deal name is displayed. Double-clicking the name allows inline editing, and saving updates the deal via the existing `updateDealName` server action.
    - And: A placeholder text "Status: [Stage Name]" is displayed (dropdown functionality later).
    - And: Text "Value: $[value]" is displayed (requires `value` field on `Deal` schema, type `DECIMAL(12,2)` nullable).
    - And: Text "Est. Close: [date]" is displayed (requires `close_date` field on `Deal` schema, type `DATE` nullable).
    - And: The `Deal` schema (e.g., in `lib/db/schema.ts`) is updated with `value` and `close_date`.
    - And: Relevant deal fetching queries (e.g., `getDealById` in `lib/db/queries.ts`) fetch these new fields.
    - And: A database migration is created for these schema changes.
  - **Dependencies:** Story 3.1.

### Feature: Deal Overview Sub-Tabs

- [ ] **Story 3.3 (P2):** As a Developer, I want to implement a tab navigation component (using shadcn/ui `<Tabs>`) within the main content area of the Deal Detail page, below the Hero Header, with initial tabs for "Overview" and "Transcripts", so users can switch between these primary views for a deal.
  - **Acceptance Criteria:**
    - Given: The Deal Detail page with the 2-column layout and updated Hero Header.
    - When: The page loads.
    - Then: A tab component is visible with "Overview" and "Transcripts" tabs.
    - And: "Overview" is selected by default. The content area for "Overview" will initially house components planned for the left column (e.g., Timeline).
    - And: The existing `TranscriptSection` component is moved to render under the "Transcripts" tab.
    - And: Placeholder tabs for "Emails", "Tasks", and "Files" are added but can be disabled or show "Coming Soon" content.
  - **Dependencies:** Story 3.1, Story 3.2.

### Feature: Overview Tab - Left Column Components

- [ ] **Story 3.4 (P2):** As an AE, on the "Overview" tab of the Deal Detail page, I want to see a basic Timeline component in the main content area that lists uploaded transcripts in reverse-chronological order (most recent first), showing filename and call date/time, so I can quickly see recent call activity.
  - **Acceptance Criteria:**
    - Given: The "Overview" tab is active on the Deal Detail page.
    - When: Transcripts exist for the deal (fetched by, e.g., `getTranscriptsByDealId`).
    - Then: A new "Timeline" component displays a list.
    - And: Each list item represents a transcript, showing its `fileName`, formatted `callDate`, and `callTime`.
    - And: Items are ordered by `createdAt` (descending) or `callDate`/`callTime` (descending).
    - And: Each timeline item is a link to the full transcript view (e.g., `/deals/[dealId]/transcripts/[transcriptId]`).
  - **Dependencies:** Story 3.3.

### Feature: Overview Tab - Right Column Cards

- [ ] **Story 3.5 (P2):** As an AE, on the "Overview" tab (right column), I want a "Next Steps" card that displays up to 3 open Action Items (Tasks) for the current deal, each with a checkbox for quick completion, so I can manage immediate tasks.

  - **Acceptance Criteria:**
    - Given: The "Overview" tab is active.
    - When: Open action items exist for the deal (fetched by, e.g., `getActionItemsForDealAction`).
    - Then: A card titled "Next Steps" is displayed in the right column.
    - And: It lists up to 3 open (isCompleted=false) action items, showing description and a checkbox.
    - And: Clicking a checkbox calls the relevant update action (e.g., `updateUserActionItemAction`) to toggle `isCompleted` status, with optimistic UI update (strikethrough/fade).
    - And: If more than 3 open tasks, a "View all tasks" link appears (links to the "Tasks" sub-tab, which is a placeholder for now).
  - **Dependencies:** Story 3.1. Existing action item queries and update actions are used.

- [ ] **Story 3.6 (P2):** As an AE, on the "Overview" tab (right column), I want a "Stakeholders" card that displays associated contacts as chips (Name + Role in Deal), so I can quickly identify key people.

  - **Acceptance Criteria:**
    - Given: The "Overview" tab is active.
    - When: Contacts are associated with the deal (fetched by, e.g., `getContactsForDealAction`).
    - Then: A card titled "Stakeholders" is displayed in the right column.
    - And: It displays each contact as a chip: "FirstName LastName (RoleInDeal)". If role is null, just name.
    - And: An "Add/Manage Contacts" button is present, which opens the existing contact management functionality (e.g., `DealContactsSection`, potentially refactored into a modal).
  - **Dependencies:** Story 3.1. Existing contact queries and components are used/refactored.

- [ ] **Story 3.7 (P3):** As an AE, on the "Overview" tab (right column), I want a basic "Insights" card that shows placeholders for "Sentiment Trend: [Coming Soon]" and "Meeting Cadence: [Coming Soon]", so I know where future AI insights will appear.
  - **Acceptance Criteria:**
    - Given: The "Overview" tab is active.
    - When: The page loads.
    - Then: A card titled "AI Insights" is displayed in the right column.
    - And: It contains placeholder text: "Sentiment Trend: Data unavailable" and "Meeting Cadence: Data unavailable".
  - **Dependencies:** Story 3.1.

### Feature: Floating Action Button (FAB) for Transcript Upload

- [ ] **Story 3.8 (P2):** As an AE, I want the "Upload Transcript" functionality on the Deal Detail page to be accessible via a Floating Action Button (FAB) with a "+" icon, positioned at the lower-right, so I can easily add transcripts.

  - **Acceptance Criteria:**
    - Given: The user is on the Deal Detail page (any sub-tab).
    - When: The page is rendered.
    - Then: A FAB with a "+" icon is visible in the lower-right corner of the viewport.
    - And: Clicking the FAB opens the existing transcript upload modal (logic currently in `TranscriptSection`).
    - And: The existing "Upload Transcript" button within the `TranscriptSection` (if still present after refactor for Story 3.3) can be removed or hidden to avoid duplication.
  - **Dependencies:** Story 3.1. Logic for triggering the upload modal is reused.

- [ ] **Story 3.9 (P1): Human Review: Deal Overview Page**
  - As a Product Manager, I want to conduct a human review of the redesigned Deal Overview page (Hero Header, 2-column layout, Tabs, initial Timeline, Next Steps card, Stakeholders card, FAB), so that I can gather UX feedback before further development on this epic.
  - **Acceptance Criteria:**
    - Given: Stories 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8 are completed and deployed to a staging environment.
    - When: The Product Manager and at least one target user (e.g., an AE persona) review the Deal Overview page and its initial tab functionality.
    - Then: Feedback on layout, information hierarchy, clarity, navigation between tabs, and ease of use for the implemented components is collected.
    - And: Any critical usability issues are identified and logged as new stories or bugs.
    - And: Development on dependent stories in EPIC 3 (e.g., other cards, more timeline details) pauses until this review is complete and feedback is triaged.
  - **Dependencies:** Stories 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8.

---

## EPIC 4: Transcripts Tab Enhancement (within Deal Detail)

### Feature: Transcript Summary Card & Inline Editable Action Items

- [ ] **Story 4.1 (P1):** As an AE, I want the "Transcripts" tab within a deal to display each transcript as a summary card showing filename, call date/time, AI Call Type, AI Sentiment, and a truncated AI Summary (with expand option), so I can quickly scan call insights.

  - **Acceptance Criteria:**
    - Given: The "Transcripts" tab on the Deal Detail page is active.
    - When: Transcripts (fetched by, e.g., `getTranscriptsByDealId`) are rendered.
    - Then: Each transcript is a distinct card.
    - And: Card displays: `fileName`, formatted `callDate` & `callTime`.
    - And: Card displays `ai_call_type` and `ai_sentiment` if available (e.g., "Call Type: Follow-up", "Sentiment: Positive"). Shows "Processing..." or "Unavailable" if null/error.
    - And: Card displays `ai_summary`, truncated to ~3 lines with a "Show more" link. Clicking "Show more" expands the summary inline within the card.
    - And: A "View Full Transcript" link/button on the card navigates to the dedicated transcript page (`/deals/[dealId]/transcripts/[transcriptId]`).
  - **Dependencies:** Story 3.3. The `TranscriptSection` component is refactored.

- [ ] **Story 4.2 (P2):** As an AE, on a transcript's summary card (Transcripts Tab), I want to see its linked Action Items as an inline checklist, with the ability to add new manual tasks specific to this transcript, so I can manage context-specific follow-ups.

  - **Acceptance Criteria:**
    - Given: A transcript summary card (from Story 4.1).
    - When: Action items are linked to this transcript (via `transcriptId` on `ActionItem`).
    - Then: These action items are displayed as a checklist below the transcript summary on its card.
    - And: Each item has a checkbox (toggles `isCompleted` via `updateUserActionItemAction`) and a description.
    - And: A small "+" or "Add task" button on the card allows adding a new manual action item, which calls `addUserActionItemAction` with the current `transcriptId` and `dealId`.
  - **Dependencies:** Story 4.1. `getActionItemsForTranscriptAction` is used. `TranscriptActionItemsClient` logic is refactored/integrated.

- [ ] **Story 4.3 (P2):** As an AE, on a transcript's summary card, I want "Draft Email" and "Scan for Tasks" buttons that use AI to act on that specific transcript's content, so I can generate follow-ups efficiently.

  - **Acceptance Criteria:**
    - Given: A transcript summary card (from Story 4.1).
    - When: The card is rendered.
    - Then: Buttons "Draft Email" and "Scan for Tasks" are visible on the card.
    - And: Clicking "Draft Email" calls `draftFollowUpEmailAction` with the `transcriptId`. The generated email is displayed in a modal (reusing/adapting `TranscriptEmailGeneratorClient` UI). This uses `useDealAIInteraction`.
    - And: Clicking "Scan for Tasks" calls `scanSingleTranscriptForActionItemsAction` with the `dealId` and `transcriptId`. New AI-suggested tasks are added to the inline checklist (Story 4.2) and persisted. This uses `useDealAIInteraction`.
  - **Dependencies:** Story 4.1, Story 4.2. `draftFollowUpEmailAction`, `scanSingleTranscriptForActionItemsAction`.

- [ ] **Story 4.4 (P1): Human Review: Transcript Card Interactions**
  - As a Product Manager, I want to conduct a human review of the new Transcript Summary Cards including AI insights display, inline action item checklists, and AI action buttons ("Draft Email", "Scan for Tasks"), so that I can ensure the workflow is intuitive and valuable.
  - **Acceptance Criteria:**
    - Given: Stories 4.1, 4.2, 4.3 are completed and deployed to a staging environment.
    - When: The Product Manager and at least one target user review the transcript cards on the "Transcripts" tab for a deal with multiple transcripts.
    - Then: Feedback on the clarity of AI insights, usability of inline task management, and effectiveness of the AI action buttons is collected.
    - And: Any critical usability issues or confusing AI interactions are identified and logged.
  - **Dependencies:** Stories 4.1, 4.2, 4.3.

---

## EPIC 5: Global Tasks Page Implementation (`/tasks`)

### Feature: Filterable List of All User's Tasks

- [ ] **Story 5.1 (P2):** As an AE, I want a new "Tasks" page (`/tasks`) that displays all my action items from all my deals in a list, showing description, completion status, due date (if any), and linked Deal Name, so I have a consolidated view of my to-dos.

  - **Acceptance Criteria:**
    - Given: The user navigates to the "/tasks" page (created in Story 1.2).
    - When: The page loads.
    - Then: A list of all action items where `actionItem.userId` matches the current user is displayed.
    - And: Each list item shows:
      - Action item description.
      - Checkbox for `isCompleted` status (clicking toggles status via `updateUserActionItemAction`).
      - `dueDate` (formatted, if present on `ActionItem` schema - to be added).
      - Linked Deal Name (clickable, navigates to `/deals/[dealId]`).
      - An icon indicating if it was AI-suggested (`isAISuggested`).
    - And: The `ActionItem` schema (e.g., in `lib/db/schema.ts`) is updated to include an optional `dueDate DATE` field.
    - And: A database migration is created for this schema change.
  - **Dependencies:** Story 1.2. `updateUserActionItemAction`. A new query `getActionItemsByUserId` is needed.

- [ ] **Story 5.2 (P3):** As an AE, on the Global Tasks page, I want to be able to filter tasks by status (e.g., "Open," "Completed") and sort them by Due Date or Creation Date, so I can better organize and prioritize my work.
  - **Acceptance Criteria:**
    - Given: The Global Tasks page with a list of tasks (Story 5.1).
    - When: The user interacts with filter controls (e.g., dropdowns or segmented buttons).
    - Then: The task list updates to show only items matching the selected filter (e.g., "Open", "Completed").
    - And: The user can sort the list by "Due Date" (ascending/descending) and "Creation Date" (ascending/descending).
  - **Dependencies:** Story 5.1.

---

## EPIC 6: Interaction Patterns & Micro-UX Polish (General Application)

- [ ] **Story 6.1 (P3):** As a User, when an AI operation is in progress (e.g., "Draft Email", "Scan for Tasks", initial transcript insights), I want to see a skeleton loader or pulsing placeholder in the UI area where the result will appear, and the triggering button should show a loading state, so the app feels responsive and I know something is happening.

  - **Acceptance Criteria:**
    - Given: An AI operation is triggered (e.g., from Story 4.3).
    - When: The `useDealAIInteraction` hook's `isLoading` state is true for that action.
    - Then: The button that triggered the action displays a loading spinner and is disabled.
    - And: The UI area designated for the result (e.g., a textarea for an email draft, an action item list) shows a relevant skeleton loader (e.g., `components/ui/skeleton.tsx`).
  - **Dependencies:** Various AI feature stories. This standardizes loading states.

- [ ] **Story 6.2 (P3):** As a User, when I perform an action that updates data (e.g., marking a task complete, adding a contact, updating deal name), I want the UI to provide immediate optimistic feedback where appropriate, while the change is synced with the backend, so the interaction feels instant.

  - **Acceptance Criteria:**
    - Given: A user clicks a checkbox to complete a task (Story 3.5, 4.2, 5.1).
    - When: The click event occurs.
    - Then: The task UI immediately reflects the change (e.g., strikethrough).
    - And: The server action (e.g., `updateUserActionItemAction`) is called in the background.
    - And: If the server action fails, the UI reverts to its previous state, and an error toast is shown.
    - And: This pattern is reviewed for other mutable actions (e.g., inline deal name editing).
  - **Dependencies:** Relevant feature stories.

- [ ] **Story 6.3 (P2):** As a User, I want consistent toast notifications for key operations (e.g., deal creation, transcript upload, contact addition, AI task success/failure), so I receive clear, non-intrusive feedback.
  - **Acceptance Criteria:**
    - Given: A user completes an action managed by `useDealAIInteraction` or a direct server action.
    - When: The action succeeds.
    - Then: A success toast (from `sonner` via `components/toast.tsx`) appears with a relevant message (e.g., "Contact added successfully!").
    - And: When the action fails.
    - Then: An error toast appears with a relevant message.
    - And: Toasts auto-dismiss after a short duration (e.g., 3-5 seconds).
  - **Dependencies:** This is a general polish item. `useDealAIInteraction` already supports this; ensure it's used consistently.

---

## EPIC 7: Quick Wins (from LLM Plan)

- [ ] **Story 7.1 (P1):** As an AE, on the `DealHeaderClient`, I want the "Edit Name" and "Delete Deal" actions to be grouped under a kebab menu (three vertical dots icon using shadcn/ui `<DropdownMenu>`), so the header UI is less cluttered.

  - **Acceptance Criteria:**
    - Given: The `DealHeaderClient` component (e.g., `app/(main)/deals/[dealId]/deal-header-client.tsx`).
    - When: The deal name is not in edit mode.
    - Then: The separate "Edit Pencil" and "Delete Trash" buttons are replaced by a single kebab menu icon button.
    - And: Clicking this kebab menu button opens a dropdown.
    - And: The dropdown contains "Edit Name" and "Delete Deal" menu items, triggering the existing respective functionalities.
  - **Dependencies:** `DealHeaderClient` component.

- [ ] **Story 7.2 (P2):** As an AE, I want to be able to edit the deal name inline by double-clicking the deal name text in the `DealHeaderClient`, so I can make quick changes without explicitly clicking an "Edit" button.

  - **Acceptance Criteria:**
    - Given: The `DealHeaderClient` displaying the deal name (not in edit mode).
    - When: The user double-clicks directly on the deal name text.
    - Then: The deal name text becomes an input field, pre-filled with the current name, and focuses.
    - And: Pressing Enter or blurring the input saves the change (using the existing `updateDealName` server action).
    - And: Pressing Escape cancels the edit and reverts to the previous name.
  - **Dependencies:** `DealHeaderClient` component, `updateDealName` action.

- [ ] **Story 7.3 (P3):** As a Developer, after a transcript is uploaded and its initial AI insights (summary, call type, sentiment from `generateAndStoreTranscriptInsights`) are available, I want to implement a non-blocking AI process that attempts to suggest which existing deal this transcript might belong to if it were uploaded without an explicit deal context (simulating an "unassigned" transcript scenario for future features), so we can explore auto-association capabilities.
  - **Acceptance Criteria:**
    - Given: A transcript has been uploaded (e.g., via Story 3.8) and `generateAndStoreTranscriptInsights` has completed for it.
    - When: The initial insight processing is finished.
    - Then: A new server action is triggered asynchronously (fire-and-forget for this story).
    - And: This action takes the transcript's summary (or full content if summary is short/unavailable) and `userId`.
    - And: It uses `generateStandardizedAIDealResponse`. The `promptBuilder` will be designed to ask the LLM: "Given this transcript summary: '[summary]', which of the following deals (if any) is it most likely related to? Deals: [list of user's deal names and brief context]. Respond with the Deal ID or 'None'."
    - And: The `dealContextParams` for `generateStandardizedAIDealResponse` will fetch all deals for the user (`includeTranscripts: false` for these context deals).
    - And: The result (suggested Deal ID or 'None') is logged to the server console for now.
    - And: No UI changes (like toast notifications) are implemented in this story; it's for backend exploration.
  - **Dependencies:** Transcript upload, `generateAndStoreTranscriptInsights`, `generateStandardizedAIDealResponse`.
  - **Notes:** This is an exploratory step towards a more advanced "auto-associate recordings" feature.

---

## Roadmap Integration (Illustrative Sprints)

_This is a high-level mapping and subject to change based on team velocity and evolving priorities._

**Sprint 1: Foundation & Core IA Setup**

- Stories: 0.1 - 0.6 (Familiarization & Setup)
- Story: 1.1 (Sidebar Update - Links)
- Story: 1.2 (Placeholder Pages for New Sections)
- Story: 2.1 (Deals List - Basic DataTable)
- Story: 3.1 (Deal Detail - 2-Column Layout Shell)
- Story: 3.2 (Deal Detail - Hero Header: Name (editable), placeholder Status, Value, Close Date; Schema changes)

**Sprint 2: Deal Overview - Part 1 & Quick Wins**

- Story: 3.3 (Deal Detail - Tabs: Overview, Transcripts (existing section moved))
- Story: 3.4 (Deal Overview Tab - Basic Transcript Timeline)
- Story: 3.5 (Deal Overview Tab - "Next Steps" Card with Action Item display & completion)
- Story: 3.6 (Deal Overview Tab - "Stakeholders" Card with Contact display & manage modal trigger)
- Story: 7.1 (Quick Win - Kebab Menu for Deal Header)
- Story: 7.2 (Quick Win - Inline Deal Name Editing)

**Sprint 3: Deal Overview - Part 2 & Transcript Tab Foundation**

- Story: 3.8 (Deal Detail - FAB for Transcript Upload)
- Story: 2.2 (Deals List - "Status" Column with Deal Stage text)
- Story: 4.1 (Transcripts Tab - Transcript Summary Cards with AI Insights display)
- Story: 3.9 (Human Review - Deal Overview Page)

**Sprint 4: Transcript Tab Interactivity & AI Actions**

- Story: 4.2 (Transcripts Tab - Inline Editable Action Items on Cards)
- Story: 4.3 (Transcripts Tab - "Draft Email" & "Scan for Tasks" buttons using existing actions)
- Story: 2.3 (Deals List - Drawer Peek View - Basic implementation)
- Story: 6.3 (Polish - Consistent Toast Notifications)

**Sprint 5: Global Tasks & Advanced Interactions**

- Story: 5.1 (Global Tasks Page - List view, schema update for `dueDate`)
- Story: 1.3 (Command-K Palette - Initial UI Setup)
- Story: 2.4 (Deals List - AI Nudges Column UI placeholder)
- Story: 4.4 (Human Review - Transcript Card Interactions)

**Sprint 6 onwards: Polish, Remaining P3s, Further AI Features**

- Story: 5.2 (Global Tasks Page - Filtering & Sorting)
- Story: 3.7 (Deal Overview Tab - Placeholder AI Insights Card)
- Story: 6.1 (Polish - Skeleton Loaders for AI ops)
- Story: 6.2 (Polish - Optimistic UI for task completion)
- Story: 7.3 (Quick Win - Exploratory AI for transcript-deal association backend)
- Further development of Command-K search functionality, AI Nudges content, etc.

_(Ongoing throughout all sprints: Adherence to general DoD, including accessibility and responsive design principles.)_
