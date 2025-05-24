# Epic: Implement "Scan Transcript for AI-Suggested Action Items" Button

**Goal:** To allow users to easily trigger an AI-powered scan of deal transcripts to generate and add suggested action items to their list, completing the "Intelligent Action Item Management" feature.

**As a:** Salesperson or Sales Manager
**I want to:** Have a clear button/option within the Action Items section of a deal
**So that I can:** Initiate an AI analysis of the deal's transcripts to automatically suggest relevant action items, saving me time and ensuring important follow-ups aren't missed.

---

## User Stories:

### Story 1: Add "Scan for Suggestions" Button to UI

- **As a user,** I want to see a clearly labeled button, such as "Scan for Suggestions" or "Get AI Suggestions," within the Action Items section header.
- **Acceptance Criteria:**
  - A new button is present in the `CardHeader` of the `ActionItemsSection` component, preferably next to the "Add Action Item" button.
  - The button should have an appropriate icon (e.g., `Sparkle` or `ScanEyeIcon`).
  - The button should be styled consistently with other buttons in the section (e.g., `size="sm"`, `variant="outline"`).
  - The button should be disabled if action items are currently being loaded (`isLoading` is true).

### Story 2: Implement Client-Side Logic for Button Click

- **As a user,** when I click the "Scan for Suggestions" button, I want the system to initiate the transcript scanning process.
- **Acceptance Criteria:**
  - An `onClick` handler (`handleScanTranscripts`) is implemented for the new button in `action-items-section.tsx`.
  - This handler calls the `scanTranscriptsForActionItemsAction` server action, passing the current `dealId`.
  - The `scanTranscriptsForActionItemsAction` function is correctly imported from `./actions.ts`.

### Story 3: Provide User Feedback During Scanning

- **As a user,** while the transcript scan is in progress, I want to see visual feedback indicating that the system is working.
- **Acceptance Criteria:**
  - A state variable (e.g., `isScanning`) is used to track the scanning status.
  - When scanning begins, `isScanning` is set to `true`.
  - The "Scan for Suggestions" button text changes to "Scanning..." (or similar) and is disabled to prevent multiple clicks.
  - An initial toast notification (e.g., "Scanning transcripts for action items...") can be shown to confirm the process has started.
  - When scanning completes (success or failure), `isScanning` is set back to `false`.

### Story 4: Handle Successful Scan and Display New AI-Suggested Items

- **As a user,** upon successful completion of the scan, I want to see any newly suggested action items added to my list.
- **Acceptance Criteria:**
  - If `scanTranscriptsForActionItemsAction` returns successfully with new items:
    - The `actionItems` state in `action-items-section.tsx` is updated to include the new AI-suggested items.
    - New items are clearly marked as AI-suggested (this is already handled by the `isAISuggested` flag and `Sparkle` icon).
    - A success toast notification is displayed (e.g., "X new AI-suggested action item(s) added!").
    - If no new suggestions are found, an informational toast is displayed (e.g., "No new action item suggestions found.").

### Story 5: Handle Errors During Scanning

- **As a user,** if an error occurs during the transcript scan, I want to be informed so I can understand what happened.
- **Acceptance Criteria:**
  - If `scanTranscriptsForActionItemsAction` returns an error, or if a client-side error occurs:
    - An error toast notification is displayed to the user, showing a relevant error message.
    - The system gracefully handles the error without crashing.
    - The `isScanning` state is correctly reset to `false`.

### Story 6: Ensure Server Action (`scanTranscriptsForActionItemsAction`) Compatibility

- **As a developer,** I need to ensure the `scanTranscriptsForActionItemsAction` server action in `app/(main)/deals/[dealId]/actions.ts` is correctly structured to support the new UI button.
- **Acceptance Criteria:**
  - The action correctly fetches deal transcripts (details of transcript fetching are internal to the action).
  - It calls the AI service to get suggestions.
  - It creates new `ActionItem` records in the database with `isAISuggested: true`.
  - It returns a clear success/error status.
  - **Crucially:** Upon success, it returns an array of the _newly created_ AI-suggested action items (e.g., in a `newItems` property of the response object) so the client can efficiently update the UI without needing a full re-fetch of all action items. If it currently returns all items, this might need adjustment for better UX.

---

## Non-Functional Requirements / Considerations:

- **Performance:** The scanning process should not block the UI excessively. The button disabling and loading state are important.
- **Idempotency (Optional but good):** Consider if running the scan multiple times should add duplicate suggestions or if the backend should handle de-duplication or only add truly new suggestions. For a first pass, adding all returned suggestions is acceptable.
- **Clarity:** Ensure button labels and toast messages are clear and informative.
- **Error Handling:** Robust error handling on both client and server sides.
