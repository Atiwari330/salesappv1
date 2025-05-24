# User Stories: Enhance Transcript Detail Page with Email Generation

**Instructions for the AI Agent Builder:**

- **Prioritize Validation:** Before writing or modifying code, always prioritize reading relevant files (including dependencies) to validate assumptions. Understand the existing structure and conventions.
- **Update Checkboxes:** As you complete each user story and its acceptance criteria are met, please update the corresponding checkbox in this file by changing `[ ]` to `[x]`.

---

## Epic: Enhance Transcript Detail Page with Email Generation Capability

**Feature:** Implement UI and Logic for Generating and Copying Follow-up Emails from Transcripts

---

### Phase 1: Create New Client Component for Email Generation (`transcript-email-generator-client.tsx`)

**User Story 1.1 (Component Shell & Props)**

- **ID:** TEG-001
- **Story:** As a Developer, I want to create the basic file structure and define props for the `TranscriptEmailGeneratorClient` component, so that I have a foundational client component for email generation functionality.
- **Priority:** High
- **Dependencies:** None
- **Checkbox:** `[ ]`
- **Acceptance Criteria:**
  - Given the project structure,
  - When the `transcript-email-generator-client.tsx` file is created in `app/(main)/deals/[dealId]/transcripts/[transcriptId]/`,
  - Then the file should start with `'use client';` and define an interface `TranscriptEmailGeneratorClientProps` that accepts `transcriptId: string`.
  - And the component should render a basic placeholder (e.g., a `div` with "Email Generator Placeholder").

**User Story 1.2 (State Management)**

- **ID:** TEG-002
- **Story:** As a Developer, I want to implement state management within `TranscriptEmailGeneratorClient` for the generated email, loading status, and error messages, so that the component can reactively display information to the user.
- **Priority:** High
- **Dependencies:** TEG-001
- **Checkbox:** `[ ]`
- **Acceptance Criteria:**
  - Given the `TranscriptEmailGeneratorClient` component,
  - When state variables are added using `useState`,
  - Then there should be states for `generatedEmail: string | null`, `isLoading: boolean` (default `false`), and `error: string | null`.

**User Story 1.3 (UI - Generate Button & Basic Layout)**

- **ID:** TEG-003
- **Story:** As a Sales Rep, I want to see a "Generate Email" button within a clearly defined section on the transcript detail page, so that I can initiate the email drafting process.
- **Priority:** High
- **Dependencies:** TEG-002
- **Checkbox:** `[ ]`
- **Acceptance Criteria:**
  - Given the `TranscriptEmailGeneratorClient` component,
  - When the UI is rendered,
  - Then it should display a `<Card>` containing a `<CardHeader>` with the title "Draft Follow-up Email".
  - And the `<CardContent>` should display a `<Button>` with the text "Generate Email".

**User Story 1.4 (Implement `handleGenerateEmail` Function - Call Server Action)**

- **ID:** TEG-004
- **Story:** As a Developer, I want to implement the `handleGenerateEmail` function to call the `draftFollowUpEmailAction` server action, so that the component can fetch the AI-generated email content.
- **Priority:** High
- **Dependencies:** TEG-003
- **Checkbox:** `[ ]`
- **Acceptance Criteria:**
  - Given the `TranscriptEmailGeneratorClient` component with the "Generate Email" button,
  - When the `handleGenerateEmail` function is implemented,
  - Then it should import `draftFollowUpEmailAction` from `../../actions`.
  - And clicking the "Generate Email" button should trigger this function.
  - And the function should set `isLoading` to `true` before the call and `false` after.
  - And it should call `draftFollowUpEmailAction` with the `transcriptId` prop.
  - And it should update the `generatedEmail` state with the successful response from the action.
  - And it should update the `error` state if the action returns an error.

**User Story 1.5 (UI - Display Generated Email)**

- **ID:** TEG-005
- **Story:** As a Sales Rep, I want to see the generated email displayed on the page after clicking the "Generate Email" button, so that I can review its content.
- **Priority:** High
- **Dependencies:** TEG-004
- **Checkbox:** `[ ]`
- **Acceptance Criteria:**
  - Given the `TranscriptEmailGeneratorClient` component and a successfully generated email,
  - When the `generatedEmail` state is populated,
  - Then the email content should be displayed within a read-only `<Textarea>` component.
  - And if `isLoading` is true, a loading message (e.g., "Generating email...") should be visible.
  - And if `error` state is populated, an error message should be visible.

**User Story 1.6 (UI - Copy to Clipboard Functionality)**

- **ID:** TEG-006
- **Story:** As a Sales Rep, I want a "Copy Email" button next to the displayed email, so that I can easily copy the generated content to my clipboard.
- **Priority:** Medium
- **Dependencies:** TEG-005
- **Checkbox:** `[ ]`
- **Acceptance Criteria:**
  - Given the `TranscriptEmailGeneratorClient` component with a displayed generated email,
  - When a "Copy Email" `<Button>` is present,
  - Then clicking this button should trigger a `handleCopyToClipboard` function.
  - And this function should use `navigator.clipboard.writeText()` to copy the `generatedEmail` content.
  - And a success notification (e.g., "Email copied to clipboard!") should be displayed using `toast`.

**User Story 1.7 (UI - Notifications for Actions)**

- **ID:** TEG-007
- **Story:** As a Sales Rep, I want to receive visual feedback (toasts/notifications) when an email is successfully generated or copied, or if an error occurs, so that I am aware of the system's status.
- **Priority:** Medium
- **Dependencies:** TEG-004, TEG-006
- **Checkbox:** `[ ]`
- **Acceptance Criteria:**
  - Given the `TranscriptEmailGeneratorClient` component,
  - When an email is successfully generated via `handleGenerateEmail`,
  - Then a success toast (e.g., "Email drafted successfully!") should appear.
  - When an error occurs during email generation,
  - Then an error toast detailing the error should appear.
  - When the email is successfully copied via `handleCopyToClipboard`,
  - Then a success toast (e.g., "Email copied to clipboard!") should appear.

---

### Phase 2: Integrate New Client Component into Transcript Detail Page

**User Story 2.1 (Import and Render Client Component)**

- **ID:** TEG-008
- **Story:** As a Developer, I want to import and render the `TranscriptEmailGeneratorClient` component within the `TranscriptDetailPage` (`page.tsx`), so that the email generation functionality is available to users on that page.
- **Priority:** High
- **Dependencies:** All Phase 1 stories (TEG-001 to TEG-007)
- **Checkbox:** `[ ]`
- **Acceptance Criteria:**
  - Given the `TranscriptDetailPage` at `app/(main)/deals/[dealId]/transcripts/[transcriptId]/page.tsx`,
  - When the `TranscriptEmailGeneratorClient` component is completed,
  - Then it should be imported into `page.tsx`.
  - And it should be rendered below the existing `TranscriptActionItemsClient` component.
  - And the `transcriptId` prop must be correctly passed to `TranscriptEmailGeneratorClient`.

---

### Prioritization & Sequencing Rationale:

The stories are sequenced logically for development:

1.  **Phase 1 (Client Component Creation):** Build the component in isolation first.
    - **High Priority:** Core structure, state, button, calling the action, and displaying the email are essential for basic functionality.
    - **Medium Priority:** Copy functionality and more detailed notifications are enhancements that can follow the core implementation.
2.  **Phase 2 (Integration):** Once the client component is functional, integrate it into the main page.
    - **High Priority:** This makes the feature visible and usable.

This approach ensures that foundational elements are built first, followed by enhancements and finally integration. Each story is small and aims to deliver a distinct piece of value.

---

### Quality & Testing Considerations (Definition of Done - per story):

- Code implemented as per the story and acceptance criteria.
- Unit tests written for client-side logic (e.g., state changes, utility functions within the client component) where applicable.
- Functionality manually tested in the browser to meet acceptance criteria.
- Code reviewed and approved.
- UI elements are responsive and visually consistent with the existing application.
- No new console errors or warnings introduced.
- The user story checkbox in this `generateemail.md` file is checked by the AI agent upon completion.

---

### Roadmap Integration (Illustrative - Assuming 1-week Sprints):

- **Sprint 1:**
  - TEG-001: Component Shell & Props
  - TEG-002: State Management
  - TEG-003: UI - Generate Button & Basic Layout
  - TEG-004: Implement `handleGenerateEmail` Function
  - TEG-005: UI - Display Generated Email
- **Sprint 2:**
  - TEG-006: UI - Copy to Clipboard Functionality
  - TEG-007: UI - Notifications for Actions
  - TEG-008: Import and Render Client Component (Integration)
  - End-to-end testing and refinement.

This breakdown assumes each story is roughly a "one-story-point" task, manageable within a short timeframe. The AI agent builder can tackle these sequentially.
