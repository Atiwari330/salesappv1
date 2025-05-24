Okay, here's the detailed list of one-story-point user stories, formatted in Markdown with []- before each line item as requested:

Feature: AI-Powered Email Draft from Transcript

Goal: Allow users to generate a draft follow-up email based on the content of an uploaded deal transcript.

1. Epic & Feature Breakdown (User Story Mapping)

[]- _ Epic: Transcript Actions
[]- _ Feature: Draft Follow-up Email from Transcript
[]- _ Step 1: UI for initiating email draft
[]- _ Step 2: Client-side logic to call server action
[]- _ Step 3: Server-side logic to process transcript and call LLM
[]- _ Step 4: UI for displaying drafted email
[]- \* Step 5: Loading and error states

2. User Stories, 3. Acceptance Criteria, 4. Prioritization, 5. Dependencies

Prioritization Key (Simplified WSJF - Value/Effort):
[]- _ P1 (Highest): Critical path for core functionality. High value, relatively low/medium effort.
[]- _ P2 (High): Essential for a complete user experience of this feature.
[]- \* P3 (Medium): Important for usability and robustness.

User Stories:
Feature: Draft Follow-up Email from Transcript

Story TDE-01: Display "Draft Follow-up Email" Button in Transcript Viewer
[x]- _ As a Sales Rep (User),
[x]- _ I want to see a "Draft Follow-up Email" button within the transcript viewer modal,
[x]- _ so that I can easily initiate the email drafting process for the current transcript.
[x]- _ Acceptance Criteria:
[x]- _ Given I have opened the transcript viewer modal for a specific transcript,
[x]- _ When the modal content is displayed,
[x]- _ Then a button labeled "Draft Follow-up Email" is visible within the modal (e.g., in the footer or near the transcript content).
[x]- _ Priority: P1
[x]- \* Dependencies: Relies on the existing TranscriptViewerModal component (app/(main)/deals/[dealId]/transcript-viewer-modal.tsx).

Story TDE-02: Implement Client-Side Handler for "Draft Follow-up Email" Button
[x]- _ As a Sales Rep (User),
[x]- _ I want the application to initiate a request to draft an email when I click the "Draft Follow-up Email" button,
[x]- _ so that the system can start generating the email content.
[x]- _ Acceptance Criteria:
[x]- _ Given the "Draft Follow-up Email" button is visible in the transcript viewer modal,
[x]- _ When I click the button,
[x]- _ Then a client-side JavaScript function (handleDraftEmail) is invoked.
[x]- _ And this function makes an asynchronous call to a new server action, passing the current transcript.id.
[x]- _ Priority: P1
[x]- _ Dependencies: TDE-01

Story TDE-03: Implement Server Action to Fetch Transcript and Construct LLM Prompt
[x]- _ As a System,
[x]- _ I want to securely fetch the specified transcript content and construct a precise prompt for the LLM,
[x]- _ so that the LLM has the correct context to draft a relevant follow-up email.
[x]- _ Acceptance Criteria:
[x]- _ Given the server action draftFollowUpEmailAction is called with a transcriptId,
[x]- _ When the action executes,
[x]- _ Then it authenticates the user session.
[x]- _ And it fetches the transcript content from the database using getTranscriptById.
[x]- _ And if the transcript is not found or empty, it returns an appropriate error.
[x]- _ And it constructs a prompt including the role ("expert email writer"), the goal ("keep momentum going"), and the full transcript content.
[x]- _ Priority: P1
[x]- _ Dependencies: Relies on existing auth and getTranscriptById from lib/db/queries.ts.

Story TDE-04: Implement LLM Call within Server Action to Generate Email Draft
[x]- _ As a System,
[x]- _ I want to send the constructed prompt to the OpenAI LLM and receive the generated email text,
[x]- _ so that a draft email can be created based on the transcript.
[x]- _ Acceptance Criteria:
[x]- _ Given a valid prompt has been constructed in the draftFollowUpEmailAction server action,
[x]- _ When the LLM is called (using generateText from AI SDK and myProvider.languageModel('chat-model')),
[x]- _ Then the server action awaits the LLM's response.
[x]- _ And upon successful generation, the action returns an object like { success: true, emailText: "..." }.
[x]- _ And if the LLM call fails, it returns an object like { success: false, error: "..." }.
[x]- _ Priority: P1
[x]- \* Dependencies: TDE-03

Story TDE-05: Display Loading State for Email Drafting
[x]- _ As a Sales Rep (User),
[x]- _ I want to see a loading indicator after clicking "Draft Follow-up Email",
[x]- _ so that I know the system is processing my request.
[x]- _ Acceptance Criteria:
[x]- _ Given I have clicked the "Draft Follow-up Email" button,
[x]- _ When the system is calling the server action and waiting for the LLM response,
[x]- _ Then the "Draft Follow-up Email" button is disabled.
[x]- _ And the button text changes to "Drafting..." or shows a spinner icon.
[x]- _ Priority: P2
[x]- _ Dependencies: TDE-02

Story TDE-06: Display Drafted Email in a New Modal
[x]- _ As a Sales Rep (User),
[x]- _ I want the drafted follow-up email to be displayed clearly in a new modal,
[x]- _ so that I can review it.
[x]- _ Acceptance Criteria:
[x]- _ Given the server action successfully returns a drafted email text,
[x]- _ When the client-side handler receives the successful response,
[x]- _ Then a new modal dialog opens.
[x]- _ And the modal displays the emailText received from the server action.
[x]- _ And the modal has a "Close" button.
[x]- _ Priority: P1
[x]- \* Dependencies: TDE-02, TDE-04

Story TDE-07: Implement "Copy to Clipboard" for Drafted Email
[x]- _ As a Sales Rep (User),
[x]- _ I want a "Copy to Clipboard" button in the drafted email modal,
[x]- _ so that I can easily copy the generated email text for use in my email client.
[x]- _ Acceptance Criteria:
[x]- _ Given the drafted email is displayed in a modal,
[x]- _ When I click the "Copy to Clipboard" button,
[x]- _ Then the entire emailText is copied to my system clipboard.
[x]- _ And a success toast notification (e.g., "Email copied to clipboard!") is displayed.
[x]- _ Priority: P1
[x]- _ Dependencies: TDE-06

Story TDE-08: Handle and Display Errors from Email Drafting Process
[x]- _ As a Sales Rep (User),
[x]- _ I want to be informed if an error occurs during the email drafting process,
[x]- _ so that I understand why the email wasn't generated and can try again if appropriate.
[x]- _ Acceptance Criteria:
[x]- _ Given an error occurs in the draftFollowUpEmailAction server action (e.g., transcript not found, LLM error),
[x]- _ When the client-side handler receives an error response,
[x]- _ Then a toast notification is displayed to the user with an appropriate error message (e.g., "Failed to draft email: [error message from server]").
[x]- _ And the loading state on the "Draft Follow-up Email" button is reset.
[x]- _ Priority: P2
[x]- _ Dependencies: TDE-02, TDE-04

6. Quality & Testing Considerations (Definition of Done - DoD)

For each story, the following Definition of Done (DoD) must be met:

[]- _ Code Complete: All code for the story is written and adheres to project coding standards (Biome linting/formatting).
[]- _ Functionality: All acceptance criteria for the story are met.
[]- _ Testing:
[]- _ Relevant unit tests are written and passing for new server actions and critical client-side logic/utility functions.
[]- _ Manual E2E testing of the user flow described in the story is completed successfully in a development environment.
[]- _ UI/UX:
[]- _ The UI is responsive on common screen sizes (desktop, tablet, mobile) if UI elements are involved.
[]- _ Loading states and error messages are user-friendly.
[]- _ Accessibility considerations (ARIA attributes, keyboard navigability) are met for new UI elements, leveraging shadcn/ui defaults where possible.
[]- _ Code Review: Code has been reviewed and approved by at least one other team member.
[]- _ Merge: Changes are merged into the main development branch (e.g., main or develop).
[]- _ No Regressions: No known critical bugs or regressions are introduced into existing functionality.
[]- \* Documentation (Minimal for this scope): Any new server actions or significant client-side hooks have JSDoc comments explaining their purpose, parameters, and return values.

7. Roadmap Integration

Assuming a team velocity where multiple 1-point stories can be completed per sprint, these stories can be grouped into logical development chunks.

Sprint X (Focus: Core Email Drafting Logic)

[x]- _ TDE-03: Implement Server Action to Fetch Transcript and Construct LLM Prompt (Backend Foundation)
[x]- _ TDE-04: Implement LLM Call within Server Action to Generate Email Draft (Core AI Logic)
[x]- _ TDE-01: Display "Draft Follow-up Email" Button in Transcript Viewer (Basic UI Hook)
[x]- _ TDE-02: Implement Client-Side Handler for "Draft Follow-up Email" Button (Connecting UI to Backend)

Sprint X+1 (Focus: User Experience and Polish)

[x]- _ TDE-05: Display Loading State for Email Drafting (UX Feedback)
[x]- _ TDE-06: Display Drafted Email in a New Modal (Presenting Result)
[x]- _ TDE-07: Implement "Copy to Clipboard" for Drafted Email (Core User Action)
[x]- _ TDE-08: Handle and Display Errors from Email Drafting Process (Robustness)

Alignment with Overall Release Timeline:

This feature, broken down as above, can be delivered incrementally.
[x]- _ Milestone 1 (End of Sprint X): Basic backend functionality is in place, and a user can trigger the email draft, though the display might be rudimentary or logged to console for testing. This proves the core LLM integration.
[x]- _ Milestone 2 (End of Sprint X+1): The full user experience is complete, including proper display, copy functionality, loading states, and error handling. The feature is ready for user testing/release.
