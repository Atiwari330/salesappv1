---

### **Feature: AI-Powered Transcript Q&A and Analysis for Deals**

**Goal:** Allow users to ask natural language questions about the combined content of transcripts associated with a specific deal and receive AI-generated answers based solely on that transcript data.

---

**1. Epic & Feature Breakdown (User Story Mapping)**

[X] - **Epic:** Deal Intelligence Enhancements
[X] - **Feature:** AI-Powered Transcript Q&A
[X] - **Step 1:** UI for question input and answer display on Deal Detail page.
[X] - **Step 2:** Client-side logic to gather transcripts and call server action.
[X] - **Step 3:** Server-side action to process transcripts, construct LLM prompt, and call LLM.
[X] - **Step 4:** Basic loading and error handling.

---

**2. User Stories, 3. Acceptance Criteria, 4. Prioritization, 5. Dependencies**

**Prioritization Key (Simplified WSJF - Value/Effort):**

- **P1 (Highest):** Critical path for core functionality. High value, relatively low/medium effort.
- **P2 (High):** Essential for a complete user experience of this feature.
- **P3 (Medium):** Important for usability and robustness.

---

**User Stories:**

**Feature: AI-Powered Transcript Q&A and Analysis**

[X] - **Story TQA-01: Display Q&A Input Area on Deal Detail Page**
[] - _ **As a** Sales Rep (User),
[] - _ **I want** to see a dedicated input field and a submit button on the deal detail page, specifically for asking questions about the deal's transcripts,
[] - _ **so that** I can easily initiate the Q&A process for the current deal.
[] - _ **Acceptance Criteria:**
[] - _ **Given** I am on a deal detail page (`/deals/[dealId]`) that has at least one transcript,
[] - _ **When** the page content is displayed,
[] - _ **Then** a text input field (e.g., `Input` from `shadcn/ui`) labeled "Ask a question about these transcripts..." is visible.
[] - _ **And** a button labeled "Ask" (or similar) is visible next to or below the input field.
[] - _ **And** an area below the input/button is designated for displaying the AI's answer (can be empty initially).
[] - _ **Priority:** P1
[] - \* **Dependencies:** Relies on the existing Deal Detail page structure (`app/(main)/deals/[dealId]/page.tsx`).

[X] - **Story TQA-02: Implement Client-Side Handler for "Ask" Button**
[] - _ **As a** Sales Rep (User),
[] - _ **I want** the application to gather the necessary data and initiate a request to the backend when I click the "Ask" button,
[] - _ **so that** the system can start processing my question against the transcripts.
[] - _ **Acceptance Criteria:**
[] - _ **Given** the Q&A input field and "Ask" button are visible on the deal detail page,
[] - _ **And** I have typed a question into the input field,
[] - _ **When** I click the "Ask" button,
[] - _ **Then** a client-side JavaScript function (e.g., `handleAskTranscriptQuestion`) is invoked.
[] - _ **And** this function retrieves the array of `Transcript` objects already fetched for the deal detail page.
[] - _ **And** this function formats the content of all fetched transcripts into a single string, including delimiters (`--- START OF TRANSCRIPT ---`, `--- END OF TRANSCRIPT ---`) and metadata (File Name, Call Date, Call Time) for each transcript.
[] - _ **And** this function makes an asynchronous call to a new server action (`answerTranscriptQuestionAction`), passing the formatted transcript content string and my question.
[] - _ **Priority:** P1
[] - \* **Dependencies:** TQA-01.

[X] - **Story TQA-03: Implement Server Action for Transcript Q&A (LLM Call)**
[] - _ **As a** System,
[] - _ **I want** to securely process the user's question against the provided transcript content using an LLM,
[] - _ **so that** an accurate answer based solely on the transcripts can be generated.
[] - _ **Acceptance Criteria:**
[] - _ **Given** the `answerTranscriptQuestionAction` server action is called with `allTranscriptsContent` (formatted string) and `userQuestion`,
[] - _ **When** the action executes,
[] - _ **Then** it authenticates the user session (using `await auth()`).
[] - _ **And** it constructs a prompt for the LLM that includes:
[] - * An instruction to answer based *solely* on the provided "Transcript Context."
[] - * The `allTranscriptsContent` string.
[] - _ The `userQuestion`.
[] - _ **And** it calls the LLM (e.g., `generateText` with `myProvider.languageModel('chat-model')`) with this prompt.
[] - _ **And** upon successful generation, the action returns an object like `{ success: true, answer: "..." }`.
[] - _ **And** if the LLM call fails or returns no content, it returns an object like `{ success: false, error: "..." }`.
[] - _ **Priority:** P1
[] - _ **Dependencies:** TQA-02 (for invocation). Relies on existing `auth` and LLM provider setup.

[X] - **Story TQA-04: Display AI-Generated Answer in Q&A Area**
[] - _ **As a** Sales Rep (User),
[] - _ **I want** the AI's answer to my question about the transcripts to be displayed clearly on the deal detail page,
[] - _ **so that** I can read and utilize the information.
[] - _ **Acceptance Criteria:**
[] - _ **Given** the `answerTranscriptQuestionAction` server action successfully returns an answer,
[] - _ **When** the client-side handler (from TQA-02) receives the successful response,
[] - _ **Then** the `answer` text is displayed in the designated Q&A answer area on the deal detail page.
[] - _ **And** the previous answer (if any) is replaced.
[] - _ **And** the user's question input field is optionally cleared.
[] - _ **Priority:** P1
[] - \* **Dependencies:** TQA-02, TQA-03.

[X] - **Story TQA-05: Implement Basic Loading State for Q&A**
[] - _ **As a** Sales Rep (User),
[] - _ **I want** to see a loading indicator after submitting my question,
[] - _ **so that** I know the system is processing my request.
[] - _ **Acceptance Criteria:**
[] - _ **Given** I have typed a question and clicked the "Ask" button,
[] - _ **When** the system is calling the server action and waiting for the LLM response,
[] - _ **Then** the "Ask" button is disabled.
[] - _ **And** the button text changes to "Asking..." or shows a spinner icon.
[] - _ **And** the Q&A answer area might display a "Thinking..." or similar message.
[] - _ **And** once the response is received (success or error), the loading state on the button and answer area is removed/updated.
[] - _ **Priority:** P2
[] - _ **Dependencies:** TQA-02, TQA-03.

[X] - **Story TQA-06: Handle and Display Errors from Q&A Process**
[] - _ **As a** Sales Rep (User),
[] - _ **I want** to be informed if an error occurs during the transcript Q&A process,
[] - _ **so that** I understand why an answer wasn't generated and can try again if appropriate.
[] - _ **Acceptance Criteria:**
[] - _ **Given** an error occurs in the `answerTranscriptQuestionAction` server action (e.g., LLM error, unexpected issue),
[] - _ **When** the client-side handler receives an error response (e.g., `{ success: false, error: "..." }`),
[] - _ **Then** a toast notification (using existing `toast` component) is displayed to the user with an appropriate error message (e.g., "Failed to get answer: [error message from server]").
[] - _ **And** the loading state (from TQA-05) is reset.
[] - _ **And** the Q&A answer area might display a message like "Sorry, I couldn't answer that." or the error message.
[] - _ **Priority:** P2
[] - \* **Dependencies:** TQA-02, TQA-03, TQA-05.

[X] - **Story TQA-07: Conditionally Display Q&A Section**
[] - _ **As a** Sales Rep (User),
[] - _ **I want** the transcript Q&A input area to only be visible if there are transcripts associated with the deal,
[] - _ **so that** I am not presented with an unusable feature.
[] - _ **Acceptance Criteria:**
[] - _ **Given** I am on a deal detail page,
[] - _ **When** there are zero transcripts associated with the deal,
[] - _ **Then** the Q&A input field (from TQA-01) and "Ask" button are NOT visible.
[] - _ **And** a message like "Upload transcripts to ask questions about them." might be displayed instead.
[] - _ **When** there is at least one transcript associated with the deal,
[] - _ **Then** the Q&A input field and "Ask" button ARE visible.
[] - _ **Priority:** P3
[] - _ **Dependencies:** TQA-01.

---

**6. Quality & Testing Considerations (Definition of Done - DoD)**

[] - For each story, the following Definition of Done (DoD) must be met:
[] - _ **Code Complete:** All code for the story is written and adheres to project coding standards (Biome linting/formatting).
[] - _ **Functionality:** All acceptance criteria for the story are met.
[] - _ **Testing:**
[] - _ Relevant unit tests are written and passing for the new server action (`answerTranscriptQuestionAction`) and any critical client-side logic/utility functions (e.g., transcript formatting).
[] - _ Manual E2E testing of the user flow described in the story is completed successfully in a development environment (e.g., ask a question, see answer, see loading, see error).
[] - _ **UI/UX:**
[] - _ The UI is responsive on common screen sizes (desktop, tablet, mobile) for the new Q&A elements.
[] - _ Loading states and error messages are user-friendly.
[] - _ Accessibility considerations (ARIA attributes, keyboard navigability) are met for new UI elements, leveraging shadcn/ui defaults where possible.
[] - _ **Code Review:** Code has been reviewed and approved by at least one other team member.
[] - _ **Merge:** Changes are merged into the main development branch (e.g., `main` or `develop`).
[] - _ **No Regressions:** No known critical bugs or regressions are introduced into existing functionality.
[] - \* **Documentation (Minimal for this scope):** The new server action (`answerTranscriptQuestionAction`) has JSDoc comments explaining its purpose, parameters, and return values.

---

**7. Roadmap Integration**

[] - Assuming a team velocity where multiple 1-point stories can be completed per sprint, these stories can be grouped into logical development chunks. This feature is relatively self-contained.

[X] - **Sprint Y (Focus: Transcript Q&A MVP)**
[X] - _ TQA-01: Display Q&A Input Area on Deal Detail Page (UI Foundation)
[X] - _ TQA-02: Implement Client-Side Handler for "Ask" Button (Client-Side Logic)
[X] - _ TQA-03: Implement Server Action for Transcript Q&A (LLM Call) (Core Backend Logic)
[X] - _ TQA-04: Display AI-Generated Answer in Q&A Area (Completing the Loop)

[X] - **Sprint Y+1 (Focus: Transcript Q&A Polish & Robustness)**
[X] - _ TQA-05: Implement Basic Loading State for Q&A (UX Feedback)
[X] - _ TQA-06: Handle and Display Errors from Q&A Process (Robustness)
[X] - _ TQA-07: Conditionally Display Q&A Section (UX Polish)
[] - _ _(This sprint could also pick up other small, unrelated P2/P3 stories if capacity allows)_

[X] - **Alignment with Overall Release Timeline:**
[X] - _ **Milestone (End of Sprint Y):** Core Q&A functionality is in place. Users can ask questions about transcripts for a deal and receive answers. Basic UI is functional.
[X] - _ **Milestone (End of Sprint Y+1):** The Q&A feature is more robust with proper loading states, error handling, and conditional display. It's ready for wider user testing or inclusion in a release.

---

This breakdown provides a clear, actionable set of small stories to implement the AI-Powered Transcript Q&A feature.
