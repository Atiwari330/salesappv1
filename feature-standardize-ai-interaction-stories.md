# Epic: Standardize AI Interaction Patterns

**Goal:** To create reusable abstractions for client-side AI interaction management and server-side LLM invocation, improving maintainability, reusability, and developer experience when building deal-related AI features.

## 1. Assumption Validation & Codebase Familiarization

- [ ] **Story AV-1: Review Existing AI Context System**
  - **As a Developer, I want to thoroughly review the existing `getDealAIContext`, `formatDealContextForLLM` functions and `DealAIContextParams`, `DealAIContext`, `FormatDealContextOptions` types, so that I have a complete understanding of the current data aggregation and formatting logic.**
  - **Acceptance Criteria:**
    - Given the codebase, when the developer reviews `lib/ai/deal_context_builder.ts` and `lib/ai/deal_context_types.ts`, then they document key functionalities, data structures, and potential integration points for new abstractions.
- [ ] **Story AV-2: Analyze Refactored AI Features**
  - **As a Developer, I want to analyze the implementation of `answerTranscriptQuestionAction`, `draftFollowUpEmailAction` and their client components (`TranscriptQnASection`, `TranscriptEmailGeneratorClient`), so that I can identify common patterns and areas for abstraction.**
  - **Acceptance Criteria:**
    - Given the codebase, when the developer reviews `app/(main)/deals/[dealId]/actions.ts`, `app/(main)/deals/[dealId]/transcript-qna-section.tsx`, and `app/(main)/deals/[dealId]/transcripts/[transcriptId]/transcript-email-generator-client.tsx`, then they document the flow of data, state management, error handling, and LLM invocation for each feature.
- [ ] **Story AV-3: Document Core Dependencies for AI SDK**
  - **As a Developer, I want to review the usage of the `ai` SDK (specifically `generateText`) and `myProvider` for model instantiation, so that I understand the current LLM interaction mechanism.**
  - **Acceptance Criteria:**
    - Given the relevant server actions, when the developer examines how `generateText` and `myProvider.languageModel` are used, then they document the typical parameters, model selection, and error patterns associated with these calls.

## 2. Feature: Client-Side Abstraction (`useDealAIInteraction` Hook)

**Epic:** Standardize AI Interaction Patterns
**Feature Goal:** Create a reusable React hook to manage the lifecycle of an AI call from the client, simplifying state management, action invocation, and user feedback.

- [ ] **Story CS-1: Define `useDealAIInteraction` Hook Structure and Basic State**
  - **As a Developer, I want to define the basic structure and state variables (`data`, `isLoading`, `error`) for the `useDealAIInteraction` hook, so that I have a foundation for managing AI interaction lifecycle.**
  - **Acceptance Criteria:**
    - Given a new file `lib/hooks/useDealAIInteraction.ts`, when the hook is defined, then it initializes `data` to `null`, `isLoading` to `false`, and `error` to `null`.
    - The hook accepts generic types `TRequestData` and `TResponsePayload`.
    - The hook accepts an `options` object with at least an `action` function.
- [ ] **Story CS-2: Implement `execute` Function for Action Invocation**
  - **As a Developer, I want to implement the `execute` function within `useDealAIInteraction` to call the provided server action, so that client components can trigger AI operations.**
  - **Acceptance Criteria:**
    - Given the `useDealAIInteraction` hook, when the `execute` function is called with `requestData`, then `isLoading` is set to `true`, `error` and `data` are reset to `null`.
    - The `action` function (passed in options) is called with `requestData`.
- [ ] **Story CS-3: Implement Success Handling in `execute` Function**
  - **As a Developer, I want `useDealAIInteraction` to handle successful server action responses, so that client components can display results and provide feedback.**
  - **Acceptance Criteria:**
    - Given a successful response from the server action (`result.success === true` and `result.data` is defined), when `execute` completes, then the hook's `data` state is updated with `result.data`.
    - A success toast notification (using `sonner`) is displayed (e.g., "Operation successful!" or a custom message from options).
    - If an `onSuccess` callback is provided in options, it is called with `result.data` and `requestData`.
    - `isLoading` is set to `false`.
- [ ] **Story CS-4: Implement Error Handling in `execute` Function**
  - **As a Developer, I want `useDealAIInteraction` to handle failed server action responses and client-side errors, so that client components can display error messages.**
  - **Acceptance Criteria:**
    - Given a failed response from the server action (`result.success === false` or `result.error` is present), when `execute` completes, then the hook's `error` state is updated with `result.error`.
    - An error toast notification is displayed.
    - If an `onError` callback is provided in options, it is called with the error message and `requestData`.
    - Given a client-side exception during the `execute` function, then the hook's `error` state is updated.
    - An error toast notification is displayed.
    - `isLoading` is set to `false`.
- [ ] **Story CS-5: Implement `reset` Function for State Clearing**
  - **As a Developer, I want to implement a `reset` function in `useDealAIInteraction`, so that client components can clear the hook's state (data, error, loading).**
  - **Acceptance Criteria:**
    - Given the `useDealAIInteraction` hook, when the `reset` function is called, then `data` is set to `null`, `error` is set to `null`, and `isLoading` is set to `false`.
- [ ] **Story CS-6: Write Unit Tests for `useDealAIInteraction` Hook**
  - **As a Developer, I want to write comprehensive unit tests for `useDealAIInteraction`, so that I can ensure its reliability and prevent regressions.**
  - **Acceptance Criteria:**
    - Given the `useDealAIInteraction` hook, when unit tests are run, then all core functionalities (initial state, execute success, execute server error, execute client error, reset) are verified.
    - Mock server actions and toast notifications are used appropriately.
- [ ] **Story CS-7: Document `useDealAIInteraction` Hook Usage**
  - **As a Developer, I want to add JSDoc comments and a usage example for `useDealAIInteraction`, so that other developers can easily understand and use it.**
  - **Acceptance Criteria:**
    - Given the `useDealAIInteraction` hook, when documentation is reviewed, then it clearly explains the hook's purpose, parameters (options), returned values, and provides a concise usage example.

## 3. Feature: Server-Side Abstraction (`generateStandardizedAIDealResponse` Utility)

**Epic:** Standardize AI Interaction Patterns
**Feature Goal:** Create a reusable server-side utility function to encapsulate the common logic of fetching deal context, formatting it, and invoking the LLM.

- [ ] **Story SS-1: Define `generateStandardizedAIDealResponse` Utility Structure**
  - **As a Developer, I want to define the function signature and basic structure for `generateStandardizedAIDealResponse` in `lib/ai/utils.ts`, so that it can accept necessary parameters for AI interaction.**
  - **Acceptance Criteria:**
    - Given a new file `lib/ai/utils.ts`, when the utility function is defined, then it accepts a `params` object including `dealContextParams`, `formatContextOptions` (optional), `promptBuilder` function, and `model` (optional).
    - The function returns a Promise resolving to `{ success: boolean; text?: string; error?: string }`.
- [ ] **Story SS-2: Implement Deal Context Fetching and Formatting**
  - **As a Developer, I want `generateStandardizedAIDealResponse` to use `getDealAIContext` and `formatDealContextForLLM`, so that it correctly prepares data for the LLM.**
  - **Acceptance Criteria:**
    - Given valid `dealContextParams`, when the utility is called, then `getDealAIContext` is invoked.
    - If context fetching fails or returns no context, then the utility returns `{ success: false, error: '...' }`.
    - `formatDealContextForLLM` is invoked with the fetched context and `formatContextOptions`.
    - If context formatting fails or returns an error string, then the utility returns `{ success: false, error: '...' }`.
- [ ] **Story SS-3: Implement Prompt Construction**
  - **As a Developer, I want `generateStandardizedAIDealResponse` to use the provided `promptBuilder` function, so that feature-specific prompts can be constructed using the formatted context.**
  - **Acceptance Criteria:**
    - Given a `promptBuilder` function and formatted context, when the utility is called, then `promptBuilder` is invoked with the `formattedLLMContext` (and optionally the raw `dealAIContext`).
    - The result of `promptBuilder` is used as the final prompt for the LLM.
- [ ] **Story SS-4: Implement LLM Invocation using `generateText`**
  - **As a Developer, I want `generateStandardizedAIDealResponse` to call `generateText` from the `ai` SDK, so that it can interact with the configured LLM.**
  - **Acceptance Criteria:**
    - Given a constructed prompt, when the utility is called, then `generateText` is invoked with the prompt and the specified (or default `myProvider.languageModel('chat-model')`) LLM model.
- [ ] **Story SS-5: Implement Success and Error Handling for LLM Call**
  - **As a Developer, I want `generateStandardizedAIDealResponse` to handle successful LLM responses and potential errors, so that server actions receive a consistent outcome.**
  - **Acceptance Criteria:**
    - Given a successful response from `generateText` (non-empty text), then the utility returns `{ success: true, text: responseText.trim() }`.
    - If `generateText` returns empty text, then the utility returns `{ success: false, error: 'AI failed to generate a response.' }`.
    - If `generateText` throws an error (e.g., authentication, network), then the utility catches it and returns `{ success: false, error: '...' }`, providing a specific message for authentication errors.
- [ ] **Story SS-6: Write Unit/Integration Tests for `generateStandardizedAIDealResponse`**
  - **As a Developer, I want to write tests for `generateStandardizedAIDealResponse`, so that I can ensure its reliability across different scenarios.**
  - **Acceptance Criteria:**
    - Given the utility function, when tests are run, then scenarios covering successful execution, context fetching/formatting errors, prompt building, and LLM call errors are verified.
    - Mocks for `getDealAIContext`, `formatDealContextForLLM`, and `generateText` are used.
- [ ] **Story SS-7: Document `generateStandardizedAIDealResponse` Utility Usage**
  - **As a Developer, I want to add JSDoc comments and a usage example for `generateStandardizedAIDealResponse`, so that other developers can easily integrate it into server actions.**
  - **Acceptance Criteria:**
    - Given the utility function, when documentation is reviewed, then it clearly explains its purpose, parameters, return type, and provides a concise usage example within a server action context.

## 4. Refactoring Existing Features

- [ ] **Story REF-1: Refactor `TranscriptQnASection` Client Component**
  - **As a Developer, I want to refactor `TranscriptQnASection` to use the new `useDealAIInteraction` hook, so that its client-side logic is simplified and standardized.**
  - **Acceptance Criteria:**
    - Given `TranscriptQnASection`, when refactored, then it uses `useDealAIInteraction` to manage state (`answer`, `isLoading`, `error`) and to call `answerTranscriptQuestionAction`.
    - The component's local state management for these variables is removed.
    - Existing functionality remains unchanged.
- [ ] **Story REF-2: Refactor `TranscriptEmailGeneratorClient` Client Component**
  - **As a Developer, I want to refactor `TranscriptEmailGeneratorClient` to use `useDealAIInteraction`, so that its client-side logic is simplified and standardized.**
  - **Acceptance Criteria:**
    - Given `TranscriptEmailGeneratorClient`, when refactored, then it uses `useDealAIInteraction` to manage state (`generatedEmail`, `isLoading`, `error`) and to call `draftFollowUpEmailAction`.
    - The component's local state management for these variables is removed.
    - Existing functionality remains unchanged.
- [ ] **Story REF-3: Refactor `answerTranscriptQuestionAction` Server Action**
  - **As a Developer, I want to refactor `answerTranscriptQuestionAction` to use the new `generateStandardizedAIDealResponse` utility, so that its server-side logic is simplified and standardized.**
  - **Acceptance Criteria:**
    - Given `answerTranscriptQuestionAction`, when refactored, then it defines its `dealContextParams`, `promptBuilder`, and calls `generateStandardizedAIDealResponse`.
    - Direct calls to `getDealAIContext`, `formatDealContextForLLM`, and `generateText` are removed from the action.
    - Existing functionality remains unchanged.
- [ ] **Story REF-4: Refactor `draftFollowUpEmailAction` Server Action**
  - **As a Developer, I want to refactor `draftFollowUpEmailAction` to use `generateStandardizedAIDealResponse`, so that its server-side logic is simplified and standardized.**
  - **Acceptance Criteria:**
    - Given `draftFollowUpEmailAction`, when refactored, then it defines its `dealContextParams`, `formatContextOptions`, `promptBuilder`, and calls `generateStandardizedAIDealResponse`.
    - Direct calls to `getDealAIContext`, `formatDealContextForLLM`, and `generateText` are removed from the action.
    - Existing functionality remains unchanged.

## 5. Human Testing Checkpoints

- [ ] **Story HTC-1: Review Refactored AI Features for UX Consistency**
  - **As a Product Manager, I want to manually test the refactored Transcript Q&A and Draft Follow-up Email features, so that I can ensure the user experience remains consistent and correct after the underlying abstractions have been implemented.**
  - **Acceptance Criteria:**
    - Given the application with refactored AI features, when the Transcript Q&A section is used, then it correctly answers questions based on deal context, and loading/error states are handled gracefully.
    - Given the application, when the Draft Follow-up Email feature is used, then it correctly generates email drafts, and loading/error states are handled gracefully.
    - Feedback from the review is documented and any necessary adjustments are planned as follow-up stories.

## 6. Prioritization & Sequencing

**Note:** Prioritization is primarily sequential due to dependencies. Stories within a feature (Client-Side, Server-Side) are generally ordered to build upon each other. Assumption Validation (AV) stories should be done first. Refactoring (REF) stories depend on the completion of CS and SS stories.

1.  AV-1, AV-2, AV-3 (Can be done in parallel)
2.  CS-1 to CS-7 (Sequential for the hook development)
3.  SS-1 to SS-7 (Sequential for the utility development)
4.  REF-1 (Depends on CS-7)
5.  REF-2 (Depends on CS-7)
6.  REF-3 (Depends on SS-7)
7.  REF-4 (Depends on SS-7)
8.  HTC-1 (Depends on REF-1, REF-2, REF-3, REF-4)

This order ensures foundational understanding and abstractions are built before refactoring.

## 7. Dependency Identification

- **CS-1 to CS-7:** Internal sequential dependencies.
- **SS-1 to SS-7:** Internal sequential dependencies.
- **REF-1, REF-2:** Depend on the completion of all `useDealAIInteraction` (CS) stories.
- **REF-3, REF-4:** Depend on the completion of all `generateStandardizedAIDealResponse` (SS) stories.
- **HTC-1:** Depends on the completion of all refactoring (REF) stories.
- **External:** Dependencies on `sonner` for toasts, `ai` SDK for `generateText`.

## 8. Quality & Testing Considerations (Definition of Done - DoD)

A user story is considered "Done" when:

1.  All acceptance criteria for the story are met.
2.  Code is written and adheres to project coding standards (ESLint, Biome).
3.  Unit tests (and integration tests where applicable) are written and pass with sufficient coverage for new/modified logic.
4.  Code has been peer-reviewed and approved.
5.  Relevant JSDoc comments or other documentation (e.g., usage examples) are added/updated.
6.  The changes are merged into the main development branch.
7.  No regressions are introduced to existing functionality related to the story.
8.  For refactoring stories (REF), the end-to-end functionality of the refactored feature is manually verified to be unchanged.

## 9. Roadmap Integration

These stories represent a focused refactoring effort.

- **Iteration 1 (e.g., 1-2 days):** Assumption Validation (AV-1 to AV-3).
- **Iteration 2 (e.g., 2-3 days):** Develop `useDealAIInteraction` hook (CS-1 to CS-7).
- **Iteration 3 (e.g., 2-3 days):** Develop `generateStandardizedAIDealResponse` utility (SS-1 to SS-7).
- **Iteration 4 (e.g., 2-3 days):** Refactor existing features (REF-1 to REF-4) and perform Human Testing (HTC-1).

This effort aims to improve the codebase's health and prepare for more efficient development of future AI features. It aligns with the overall goal of building a robust and scalable AI interaction layer.
