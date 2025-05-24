# User Stories: Collapsible Transcript View

**Instructions for the AI Agent Builder:**

- **Prioritize Validation:** Before writing or modifying code, always prioritize reading relevant files (including dependencies) to validate assumptions. Understand the existing structure and conventions.
- **Update Checkboxes:** As you complete each user story and its acceptance criteria are met, please update the corresponding checkbox in this file by changing `[ ]` to `[x]`.

---

## Epic: Improve User Experience on Transcript Detail Page

**Feature:** Implement Collapsible Transcript View to declutter the page and allow users to expand content on demand.

---

### Assumption Validation & Codebase Familiarization

- **[x] CTV-001: Review Current Transcript Rendering**

  - **Story:** As a Developer, I want to review and document the current rendering logic for transcript content in `app/(main)/deals/[dealId]/transcripts/[transcriptId]/page.tsx`, so that I understand how to integrate the new collapsible component effectively.
  - **Priority:** 1 (Highest)
  - **Dependencies:** None
  - **Acceptance Criteria:**
    - Given the file `app/(main)/deals/[dealId]/transcripts/[transcriptId]/page.tsx`,
    - When the file content related to transcript display is reviewed,
    - Then key elements, props, and styling classes (e.g., `prose`, `whitespace-pre-wrap`, `bg-muted`, `p-4`, `rounded-md`) used for the current transcript content `div` are identified and noted for consistent integration.

- **[x] CTV-002: Review UI Button Component**
  - **Story:** As a Developer, I want to review the usage, props, and variants of the existing `Button` component from `components/ui/button.tsx`, so that I can use it correctly and consistently for the expand/collapse toggle.
  - **Priority:** 2
  - **Dependencies:** None
  - **Acceptance Criteria:**
    - Given the `Button` component file (`components/ui/button.tsx`) and its usage elsewhere in the project,
    - When reviewed,
    - Then common props (e.g., `variant`, `size`, `onClick`, `className`) and typical styling are understood for appropriate use.

---

### Phase 1: `TranscriptDisplay` Client Component Development

- **[x] CTV-003: Component Shell & Props Definition**

  - **Story:** As a Developer, I want to create the `TranscriptDisplay.tsx` file with its basic functional component structure and prop definitions, so that I have a foundational client component for the collapsible transcript viewer.
  - **Priority:** 3
  - **Dependencies:** CTV-001, CTV-002
  - **Acceptance Criteria:**
    - Given the project structure,
    - When the file `app/(main)/deals/[dealId]/transcripts/[transcriptId]/transcript-display.tsx` is created,
    - Then the file must start with `'use client';` and import `React` and `useState`.
    - And an interface `TranscriptDisplayProps` is defined, accepting:
      - `content: string` (required)
      - `defaultCollapsed?: boolean` (optional, defaults to `true` if not provided)
      - `collapsedHeight?: string` (optional, defaults to `"150px"` if not provided)
      - `showMoreText?: string` (optional, defaults to `"Show full transcript"` if not provided)
      - `showLessText?: string` (optional, defaults to `"Hide transcript"` if not provided)
    - And a functional component `TranscriptDisplay` is defined, accepting `TranscriptDisplayProps` and initially rendering a placeholder `div` (e.g., "Transcript Display Area").

- **[x] CTV-004: State Management for Expansion**

  - **Story:** As a Developer, I want to implement state management for the expansion state within `TranscriptDisplay.tsx`, so that the component can internally track and control whether the content is shown fully or partially.
  - **Priority:** 4
  - **Dependencies:** CTV-003
  - **Acceptance Criteria:**
    - Given the `TranscriptDisplay` component from CTV-003,
    - When `useState` is utilized,
    - Then an `isExpanded` state variable (boolean) is declared and initialized to `false` if `props.defaultCollapsed` is `true` or undefined, otherwise `true`.

- **[x] CTV-005: Content Rendering with Dynamic Collapse Styling**

  - **Story:** As a Developer, I want to render the transcript `content` within `TranscriptDisplay.tsx` and apply dynamic styling for collapse and expand states, so that the content is appropriately truncated or shown fully.
  - **Priority:** 5
  - **Dependencies:** CTV-004
  - **Acceptance Criteria:**
    - Given the `TranscriptDisplay` component with `isExpanded` state,
    - When the component renders,
    - Then the `content` prop is displayed within an inner `div`.
    - And this inner `div` applies the same styling as the original transcript display (e.g., `className="prose dark:prose-invert max-w-none whitespace-pre-wrap"`).
    - And if `isExpanded` is `false`, the inner `div` has inline styles `{ maxHeight: props.collapsedHeight, overflow: 'hidden' }`.
    - And if `isExpanded` is `true`, the inner `div` has inline styles `{ maxHeight: 'none' }`.

- **[x] CTV-006: Toggle Button Implementation & Logic**
  - **Story:** As a Developer, I want to add a toggle button to `TranscriptDisplay.tsx` that allows users to switch between the collapsed and expanded views of the transcript content.
  - **Priority:** 6
  - **Dependencies:** CTV-004, CTV-005
  - **Acceptance Criteria:**
    - Given the `TranscriptDisplay` component,
    - When the `Button` component from `components/ui/button` is imported and rendered below the content `div`,
    - Then clicking this button toggles the `isExpanded` state.
    - And the button's text dynamically updates to `props.showMoreText` when `!isExpanded`, and `props.showLessText` when `isExpanded`.
    - And the button is styled appropriately (e.g., `variant="link"` or `variant="outline"`, with `className="mt-2"` for spacing).

---

### Phase 2: Integration into Transcript Detail Page

- **[x] CTV-007: Integrate `TranscriptDisplay` into Page**
  - **Story:** As a Developer, I want to integrate the `TranscriptDisplay` component into the transcript detail page (`page.tsx`), so that the new collapsible transcript functionality is active for users.
  - **Priority:** 7
  - **Dependencies:** CTV-006
  - **Acceptance Criteria:**
    - Given the `app/(main)/deals/[dealId]/transcripts/[transcriptId]/page.tsx` file,
    - When the `TranscriptDisplay` component is imported,
    - Then the existing direct rendering of `transcript.content` (within the `div` with class `prose ...`) is replaced by `<TranscriptDisplay content={transcript.content} />`.
    - And the page renders without errors, with the transcript content initially collapsed by default.

---

### Phase 3: Refinement & Review

- **[x] CTV-008: Visual Polish and Consistency**

  - **Story:** As a Developer, I want to ensure the `TranscriptDisplay` component, including its content area and toggle button, is visually consistent with the surrounding UI elements on the transcript detail page, so that the feature provides a seamless user experience.
  - **Priority:** 8
  - **Dependencies:** CTV-007
  - **Acceptance Criteria:**
    - Given the integrated `TranscriptDisplay` component on the transcript detail page,
    - When viewed in a browser,
    - Then the spacing, button style (size, variant), and text presentation of the collapsible section align with the application's existing design language.
    - And the transition between collapsed and expanded states is visually clean (animations are optional but abrupt changes should be avoided if easily preventable).

- **[ ] CTV-009: Human Review & UX Feedback**
  - **Story:** As a Product Manager, I want to conduct a human review of the implemented collapsible transcript feature on a testable environment, so that I can gather UX feedback and identify any usability issues or areas for improvement.
  - **Priority:** 9
  - **Dependencies:** CTV-008
  - **Acceptance Criteria:**
    - Given the feature implemented and deployed to a staging/test environment,
    - When a user interacts with the expand/collapse functionality for various transcript lengths,
    - Then the interaction is intuitive, and the default collapsed state effectively declutters the page.
    - And feedback on the default `collapsedHeight`, clarity of button text, and overall usability is collected from at least one user.
    - And any critical UX issues or significant improvement suggestions identified are documented for consideration in future iterations.

---

### Prioritization & Sequencing Rationale

The stories are prioritized sequentially (CTV-001 to CTV-009) as they represent a logical build-up of the feature:

1.  **Assumption Validation (CTV-001, CTV-002):** Essential to understand the existing context before development.
2.  **Core Component Development (CTV-003 to CTV-006):** Building the `TranscriptDisplay` component in isolation. Each step depends on the previous one (shell -> state -> content rendering -> button logic).
3.  **Integration (CTV-007):** Placing the new component into the live page. Depends on the component being functional.
4.  **Refinement & Review (CTV-008, CTV-009):** Polishing the visual aspects and gathering user feedback. Depends on the feature being integrated and functional.

This sequence ensures foundational work is done first, minimizing rework. Each story is estimated as a "one-story-point" task, achievable within a short timeframe (e.g., less than a day).

---

### Quality & Testing Considerations (Definition of Done - per story)

For each user story, the Definition of Done includes:

- Code implemented as per the story's acceptance criteria.
- Component props are appropriately typed using TypeScript.
- Functionality manually tested in a development environment to meet all acceptance criteria for that story.
- Code is clean, readable, and follows existing project conventions.
- No new console errors or warnings are introduced by the changes.
- UI elements are reasonably responsive and visually consistent with the existing application design.
- (For relevant stories) The user story checkbox in this `feature-collapsible-transcript-view-stories.md` file is checked by the AI agent upon completion and confirmation.
- A brief code review by a peer or lead (if applicable in the workflow).

---

### Roadmap Integration (Illustrative)

This feature, broken down into the above user stories, is small enough to be targeted for completion within a single sprint (e.g., 1-week sprint).

- **Sprint X:**
  - CTV-001: Review Current Transcript Rendering
  - CTV-002: Review UI Button Component
  - CTV-003: Component Shell & Props Definition
  - CTV-004: State Management for Expansion
  - CTV-005: Content Rendering with Dynamic Collapse Styling
  - CTV-006: Toggle Button Implementation & Logic
  - CTV-007: Integrate `TranscriptDisplay` into Page
  - CTV-008: Visual Polish and Consistency
  - CTV-009: Human Review & UX Feedback (can overlap with development of CTV-008 or occur immediately after)

This allows for a focused effort to deliver the collapsible transcript view feature quickly.
