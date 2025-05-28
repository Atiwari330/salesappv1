# EPIC 1: Core IA & Navigation Refactor - Detailed Implementation Plan

## 1. Introduction

This document provides a detailed, granular implementation plan for **EPIC 1: Core IA & Navigation Refactor**, as outlined in the `refactor.md` document. It is designed to be executed by an AI agent, providing sufficient context and step-by-step instructions to achieve the epic's goals. This plan focuses on breaking down the original user stories into smaller, "one-story-point" tasks that are independently actionable and testable.

## 2. Overall Goal of EPIC 1

EPIC 1 aims to update the core information architecture and navigation of the Deal AI Workspace. This includes:

- Refactoring the main application sidebar (`AppSidebar`) to include new top-level navigation items.
- Creating placeholder pages for these new sections.
- Integrating a basic Command-K global search palette as a foundation for future search functionality.

## 3. Definition of Done (DoD)

For each user story, the Definition of Done includes:

- Code implemented as per acceptance criteria.
- Unit tests written and passing (where applicable for UI components or logic).
- Integration tests updated/written and passing (where applicable).
- E2E tests updated/written and passing (for UI changes, if feasible at this stage).
- Code reviewed and approved (simulated by successful execution and verification against ACs).
- Functionality manually tested (simulated by AI agent verifying against ACs, possibly with browser interaction if needed) and verified against Acceptance Criteria.
- Relevant documentation (code comments) updated.
- No known critical bugs related to the story.
- Story merged to the main development branch (simulated by successful file write/modification).
- (For UI stories) Responsive design checked on target breakpoints (sm, md, lg, xl) - AI agent should be mindful of responsive patterns if modifying CSS or layout.
- (For UI stories) Basic accessibility checks performed (e.g., keyboard navigation, ARIA attributes, color contrast) - AI agent should ensure semantic HTML and appropriate ARIA attributes are used.

## 4. Assumption Validation & Codebase Familiarization (for AI Agent)

Before starting any implementation tasks for EPIC 1, the AI agent **must** familiarize itself with the following aspects of the codebase. This step is crucial for successful execution.

- [ ] **Task 0.A (P1): Review `refactor.md` - EPIC 1 Section.**

  - **Action:** Read and understand the original user stories (1.1, 1.2, 1.3) for EPIC 1 in the `refactor.md` document to grasp the high-level objectives.
  - **Verification:** Agent confirms understanding of the goals for `AppSidebar` changes, placeholder page creation, and Command-K palette integration.

- [ ] **Task 0.B (P1): Analyze `components/app-sidebar.tsx`.**

  - **Action:** Read the contents of `components/app-sidebar.tsx`.
  - **Focus Points:**
    - Identify the current structure for navigation links (e.g., usage of `<SidebarMenu>`, `<SidebarMenuItem>`, `<SidebarMenuButton>`, `next/link`).
    - Note how existing links like "Deals", "New Chat" (+ icon), and "Deal AI Workspace" are implemented.
    - Understand how `onClick` handlers (e.g., `setOpenMobile(false)`) are used.
  - **File Content (as of last review):** (Agent should re-read if necessary, but key structure involves `SidebarMenuItem` and `SidebarMenuButton` with `next/link`.)
  - **Verification:** Agent can describe the pattern for adding new navigation items to this sidebar.

- [ ] **Task 0.C (P1): Analyze `app/(main)/layout.tsx`.**

  - **Action:** Read the contents of `app/(main)/layout.tsx`.
  - **Focus Points:**
    - Understand that this layout wraps all pages under `app/(main)/`.
    - Note the usage of `<AppSidebar />` and `<SidebarInset>{children}</SidebarInset>`. This confirms that new pages created in `app/(main)/` will automatically inherit the sidebar and main content area structure.
  - **Verification:** Agent confirms understanding that new pages in `app/(main)/` will use this layout.

- [ ] **Task 0.D (P1): Understand Next.js App Router for Page Creation.**

  - **Action:** Recall or review Next.js App Router conventions for creating new routes and pages.
  - **Focus Points:**
    - Creating a new folder under `app/(main)/` (e.g., `app/(main)/contacts/`).
    - Creating a `page.tsx` file within that folder to define the page component.
  - **Verification:** Agent can describe the steps to create a new page at a specific route like `/contacts`.

- [ ] **Task 0.E (P2): Research `cmdk` and shadcn/ui `<Command>` component (for Story 1.3).**

  - **Action:** If unfamiliar, briefly research the `cmdk` library and how it's typically integrated with shadcn/ui's `<Command>` component. (The AI agent may need to simulate this by accessing its knowledge base or provided documentation snippets if available).
  - **Focus Points:**
    - Basic setup of `<CommandDialog>` or a custom modal containing `<Command>`.
    - Structure for `<CommandInput>`, `<CommandList>`, `<CommandEmpty>`, `<CommandGroup>`, `<CommandItem>`.
  - **Verification:** Agent has a basic understanding of how to structure a `cmdk`-powered command palette.

- [ ] **Task 0.F (P1): Check for `cmdk` dependency.**
  - **Action:** Read `package.json`.
  - **Focus Points:** Check if `cmdk` is listed under `dependencies` or `devDependencies`.
  - **Verification:** Agent notes whether `cmdk` needs to be installed.

## 5. Detailed User Stories for EPIC 1

### Feature 1.A: Collapsible Left Navigation Update (`AppSidebar`)

(Corresponds to original Story 1.1)

- [ ] **Story 1.1.1 (P1): Verify "Deals" navigation link in `AppSidebar`.**

  - **As a Developer,** I want to verify the existing "Deals" navigation link in `components/app-sidebar.tsx`,
  - **so that** I ensure it aligns with the IA refactor baseline and functions correctly.
  - **Acceptance Criteria:**
    - Given: The AI agent has reviewed `components/app-sidebar.tsx`.
    - When: The agent inspects the code for the "Deals" link.
    - Then: The "Deals" link is present, uses `next/link` component, and correctly points to `/deals`.
    - And: The link includes an `onClick` handler to close the mobile sidebar (`setOpenMobile(false)`).
  - **Dependencies:** Task 0.B.
  - **Notes for AI Agent:** This is primarily a verification step. The "Deals" link is expected to exist.

- [ ] **Story 1.1.2 (P1): Add "Contacts" navigation link to `AppSidebar`.**

  - **As a Developer,** I want to add a new "Contacts" navigation link to `components/app-sidebar.tsx`,
  - **so that** users can access the new "Contacts" section.
  - **Acceptance Criteria:**
    - Given: The `components/app-sidebar.tsx` file.
    - When: The AI agent modifies the `SidebarContent` section.
    - Then: A new `SidebarMenuItem` containing a `SidebarMenuButton` with a `next/link` is added for "Contacts".
    - And: The link text is "Contacts".
    - And: The `href` attribute for the link is `/contacts`.
    - And: The link includes an `onClick` handler: `() => { setOpenMobile(false); }`.
    - And: The new "Contacts" link appears below "Deals" (or in a logical order as per design, for now, assume below "Deals").
  - **Dependencies:** Task 0.B.
  - **Notes for AI Agent:** Follow the pattern of the existing "Deals" link. Place it within the main `<SidebarMenu>` in `<SidebarContent>`.

- [ ] **Story 1.1.3 (P1): Add "Tasks" navigation link to `AppSidebar`.**

  - **As a Developer,** I want to add a new "Tasks" navigation link to `components/app-sidebar.tsx`,
  - **so that** users can access the new "Tasks" section.
  - **Acceptance Criteria:**
    - Given: The `components/app-sidebar.tsx` file has been updated with the "Contacts" link.
    - When: The AI agent modifies the `SidebarContent` section.
    - Then: A new `SidebarMenuItem` containing a `SidebarMenuButton` with a `next/link` is added for "Tasks".
    - And: The link text is "Tasks".
    - And: The `href` attribute for the link is `/tasks`.
    - And: The link includes an `onClick` handler: `() => { setOpenMobile(false); }`.
    - And: The new "Tasks" link appears below "Contacts".
  - **Dependencies:** Story 1.1.2.
  - **Notes for AI Agent:** Follow the pattern of the existing "Deals" and newly added "Contacts" link.

- [ ] **Story 1.1.4 (P1): Add "Insights" navigation link to `AppSidebar`.**

  - **As a Developer,** I want to add a new "Insights" navigation link to `components/app-sidebar.tsx`,
  - **so that** users can access the new "Insights" section.
  - **Acceptance Criteria:**
    - Given: The `components/app-sidebar.tsx` file has been updated with "Contacts" and "Tasks" links.
    - When: The AI agent modifies the `SidebarContent` section.
    - Then: A new `SidebarMenuItem` containing a `SidebarMenuButton` with a `next/link` is added for "Insights".
    - And: The link text is "Insights".
    - And: The `href` attribute for the link is `/insights`.
    - And: The link includes an `onClick` handler: `() => { setOpenMobile(false); }`.
    - And: The new "Insights" link appears below "Tasks".
  - **Dependencies:** Story 1.1.3.
  - **Notes for AI Agent:** Follow the pattern of the previously added links.

- [ ] **Story 1.1.5 (P1): Verify existing "New Chat" and "Deal AI Workspace" functionalities in `AppSidebar`.**
  - **As a Developer,** I want to verify that the existing "New Chat" button and "Deal AI Workspace" home link in `components/app-sidebar.tsx` are preserved and functional after adding new links,
  - **so that** core existing navigation is not broken.
  - **Acceptance Criteria:**
    - Given: `components/app-sidebar.tsx` has been updated with new navigation links.
    - When: The AI agent inspects the code.
    - Then: The "Deal AI Workspace" link in `SidebarHeader` still points to `/` and has its `onClick` handler.
    - And: The "New Chat" button (PlusIcon with Tooltip) in `SidebarHeader` still has its `onClick` handler to navigate to `/` and refresh.
  - **Dependencies:** Story 1.1.4.
  - **Notes for AI Agent:** This is a verification step. No changes are expected to these elements unless they were inadvertently affected.

### Feature 1.B: Placeholder Pages for New Sections

(Corresponds to original Story 1.2)

- [ ] **Story 1.2.1 (P1): Create placeholder page for "Contacts" section.**

  - **As a Developer,** I want to create a basic placeholder page at `app/(main)/contacts/page.tsx`,
  - **so that** the "Contacts" navigation link has a valid destination.
  - **Acceptance Criteria:**
    - Given: The AI agent understands Next.js App Router page creation (Task 0.D) and the main layout (Task 0.C).
    - When: The AI agent creates the file `app/(main)/contacts/page.tsx`.
    - Then: The file defines a React functional component (e.g., `ContactsPage`).
    - And: The component renders a `<h1>` with the text "Contacts".
    - And: The component renders a `<p>` with the text "Contacts management coming soon."
    - And: The page implicitly uses the layout from `app/(main)/layout.tsx`.
  - **Dependencies:** Task 0.C, Task 0.D, Story 1.1.2.
  - **Notes for AI Agent:** Create a simple React component. Example:
    ```tsx
    // app/(main)/contacts/page.tsx
    export default function ContactsPage() {
      return (
        <div>
          <h1>Contacts</h1>
          <p>Contacts management coming soon.</p>
        </div>
      );
    }
    ```

- [ ] **Story 1.2.2 (P1): Create placeholder page for "Tasks" section.**

  - **As a Developer,** I want to create a basic placeholder page at `app/(main)/tasks/page.tsx`,
  - **so that** the "Tasks" navigation link has a valid destination.
  - **Acceptance Criteria:**
    - Given: The AI agent understands Next.js App Router page creation and the main layout.
    - When: The AI agent creates the file `app/(main)/tasks/page.tsx`.
    - Then: The file defines a React functional component (e.g., `TasksPage`).
    - And: The component renders a `<h1>` with the text "Tasks".
    - And: The component renders a `<p>` with the text "Tasks management coming soon."
    - And: The page implicitly uses the layout from `app/(main)/layout.tsx`.
  - **Dependencies:** Task 0.C, Task 0.D, Story 1.1.3.
  - **Notes for AI Agent:** Similar structure to `ContactsPage`.

- [ ] **Story 1.2.3 (P1): Create placeholder page for "Insights" section.**
  - **As a Developer,** I want to create a basic placeholder page at `app/(main)/insights/page.tsx`,
  - **so that** the "Insights" navigation link has a valid destination.
  - **Acceptance Criteria:**
    - Given: The AI agent understands Next.js App Router page creation and the main layout.
    - When: The AI agent creates the file `app/(main)/insights/page.tsx`.
    - Then: The file defines a React functional component (e.g., `InsightsPage`).
    - And: The component renders a `<h1>` with the text "Insights".
    - And: The component renders a `<p>` with the text "AI Insights coming soon."
    - And: The page implicitly uses the layout from `app/(main)/layout.tsx`.
  - **Dependencies:** Task 0.C, Task 0.D, Story 1.1.4.
  - **Notes for AI Agent:** Similar structure to `ContactsPage` and `TasksPage`.

### Feature 1.C: Command-K Global Search Palette (Initial Setup)

(Corresponds to original Story 1.3)

- [ ] **Story 1.3.1 (P3): Install `cmdk` package if not present.**

  - **As a Developer,** I want to ensure the `cmdk` package is a project dependency,
  - **so that** I can use it to build the Command-K palette.
  - **Acceptance Criteria:**
    - Given: The AI agent has checked `package.json` (Task 0.F).
    - When: `cmdk` is not listed as a dependency.
    - Then: The AI agent executes the command `pnpm add cmdk`.
    - And: `package.json` and `pnpm-lock.yaml` are updated to include `cmdk`.
    - ***
    - Given: `cmdk` is already listed as a dependency.
    - When: The AI agent checks.
    - Then: No action is taken regarding installation.
  - **Dependencies:** Task 0.F.
  - **Notes for AI Agent:** Use `pnpm add cmdk` if installation is needed. This story might only involve a check or an installation command.

- [ ] **Story 1.3.2 (P3): Create basic Command Palette UI component.**

  - **As a Developer,** I want to create a new React component for the Command-K palette using `cmdk` and shadcn/ui's `<Command>` component,
  - **so that** I have the foundational UI structure for the global search.
  - **Acceptance Criteria:**
    - Given: `cmdk` is available.
    - When: The AI agent creates a new file, e.g., `components/command-palette.tsx`.
    - Then: The file defines a React component (e.g., `CommandPalette`).
    - And: The component uses shadcn/ui's `<CommandDialog>` (or a custom modal with `<Command>`).
    - And: It includes `<CommandInput placeholder="Type a command or search..." />`.
    - And: It includes `<CommandList>` containing `<CommandEmpty>No results found.</CommandEmpty>`.
    - And: For this initial story, it includes a static message within `<CommandList>` or `<CommandEmpty>` like "Search for deals, contacts, transcripts... (coming soon)".
  - **Dependencies:** Story 1.3.1, Task 0.E.
  - **Notes for AI Agent:**

    - Refer to shadcn/ui documentation for `<Command>` and `cmdk` examples.
    - The component should manage its own open/close state initially (e.g., via `React.useState`).
    - Example structure:

      ```tsx
      // components/command-palette.tsx
      "use client";
      import * as React from "react";
      import {
        Command,
        CommandDialog,
        CommandInput,
        CommandList,
        CommandEmpty,
        CommandGroup,
        CommandItem,
      } from "@/components/ui/command"; // Adjust import path

      export function CommandPalette({
        open,
        setOpen,
      }: {
        open: boolean;
        setOpen: (open: boolean) => void;
      }) {
        return (
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>
                Search for deals, contacts, transcripts... (coming soon)
              </CommandEmpty>
              {/* Future: Add CommandGroup and CommandItem here */}
            </CommandList>
          </CommandDialog>
        );
      }
      ```

- [ ] **Story 1.3.3 (P3): Implement global keyboard shortcut to toggle Command Palette.**

  - **As a Developer,** I want to enable users to open and close the Command Palette using `⌘+K` (or `Ctrl+K`),
  - **so that** it's easily accessible.
  - **Acceptance Criteria:**
    - Given: The `CommandPalette` component (from Story 1.3.2) exists.
    - When: The AI agent modifies a global layout component (e.g., `app/(main)/layout.tsx` or a client-side provider within it).
    - Then: A `React.useEffect` hook is added to listen for `keydown` events.
    - And: Pressing `⌘+K` (metaKey + k) or `Ctrl+K` (ctrlKey + k) toggles the visibility state of the `CommandPalette`.
    - And: The `CommandPalette` component is rendered in this global layout/provider, and its `open` state is controlled by this new logic.
    - And: The palette can also be dismissed by pressing `Esc` (handled by `CommandDialog` or needs to be added if custom modal).
  - **Dependencies:** Story 1.3.2.
  - **Notes for AI Agent:**
    - The state for `open` will likely need to be managed in the component where the event listener is set up (e.g., `app/(main)/layout.tsx` might need to become a client component or use a client component wrapper if it's a Server Component).
    - Ensure `e.preventDefault()` is called in the event handler to avoid default browser behavior for the shortcut.
    - Example for handling open state and event listener (conceptual, adapt to project structure):
      ```tsx
      // In a suitable client component (e.g., a wrapper in app/(main)/layout.tsx or a new provider)
      // const [openPalette, setOpenPalette] = React.useState(false);
      // React.useEffect(() => {
      //   const down = (e: KeyboardEvent) => {
      //     if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      //       e.preventDefault();
      //       setOpenPalette((open) => !open);
      //     }
      //   };
      //   document.addEventListener('keydown', down);
      //   return () => document.removeEventListener('keydown', down);
      // }, []);
      // ... render <CommandPalette open={openPalette} setOpen={setOpenPalette} />
      ```

- [ ] **Story 1.3.4 (P3): Style Command Palette and ensure dismiss functionality.**
  - **As a Developer,** I want to ensure the Command Palette is appropriately styled (centered modal) and can be dismissed by clicking outside or pressing `Esc`,
  - **so that** it provides a good user experience.
  - **Acceptance Criteria:**
    - Given: The Command Palette can be toggled (Story 1.3.3).
    - When: The palette is open.
    - Then: It appears as a modal, typically centered on the screen (shadcn/ui `CommandDialog` should handle this).
    - And: Pressing the `Esc` key closes the palette.
    - And: Clicking outside the palette area (if `CommandDialog` is used, this is often default behavior) closes the palette.
  - **Dependencies:** Story 1.3.3.
  - **Notes for AI Agent:** Most of this should be handled by `CommandDialog` from shadcn/ui. This story is mainly for verification and minor styling tweaks if needed.

## 6. Prioritization & Sequencing Rationale

- **P1 stories are foundational:**
  - Updating the sidebar (1.1.x) and creating corresponding placeholder pages (1.2.x) are essential for the new IA to be functional at a basic level. These must be done first.
  - Familiarization tasks (0.A - 0.F) are prerequisites for any implementation.
- **P3 story (Command-K Palette - 1.3.x) is a lower priority enhancement:** It can be implemented after the core navigation changes are in place. Its sub-stories are sequential.
- **Within each feature, stories are sequenced logically:** For example, adding sidebar links one by one, then creating pages for them. For Command-K, installing the dependency, then creating the component, then wiring it up.

## 7. Roadmap Integration (Illustrative Sprint Plan for EPIC 1)

This EPIC can be targeted for a single sprint, given the granularity of the stories.

**Sprint X: EPIC 1 - Core IA & Navigation Foundation**

- **Day 1-2: Familiarization & Sidebar**
  - Task 0.A, 0.B, 0.C, 0.D, 0.E, 0.F (Codebase Review & Prep)
  - Story 1.1.1 (Verify "Deals" link)
  - Story 1.1.2 (Add "Contacts" link)
  - Story 1.1.3 (Add "Tasks" link)
  - Story 1.1.4 (Add "Insights" link)
  - Story 1.1.5 (Verify existing links)
- **Day 3: Placeholder Pages**
  - Story 1.2.1 (Create Contacts placeholder page)
  - Story 1.2.2 (Create Tasks placeholder page)
  - Story 1.2.3 (Create Insights placeholder page)
- **Day 4-5: Command-K Palette (Initial Setup)**
  - Story 1.3.1 (Install `cmdk`)
  - Story 1.3.2 (Create Command Palette UI)
  - Story 1.3.3 (Implement global shortcut)
  - Story 1.3.4 (Style and verify dismiss functionality)
- **Buffer/Testing:** Remainder of Day 5 for testing and addressing any minor issues from EPIC 1.

This assumes each "one-story-point" task is small enough to be completed quickly, allowing multiple to be tackled per day.

## 8. Human Testing Checkpoints

No explicit "Human Review" user stories are defined _within_ this detailed plan for EPIC 1, as the changes are primarily structural or placeholders. The original `refactor.md` schedules human reviews after more substantial UI/UX features are built in later epics. However, the AI agent should ensure each story's acceptance criteria are met, which serves as a form of automated/simulated testing.
