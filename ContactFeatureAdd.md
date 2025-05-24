# Epic: Deal Contact Management

**Feature: Basic Contact Storage and Association with Deals**

This document outlines the user stories for implementing the foundational Deal Contact Management feature. The goal is to allow users to create, view, and associate basic contact information with specific deals.

## Overall Definition of Done (DoD) for all stories:

- Code implemented as per the story and acceptance criteria.
- Unit tests written and passing for backend logic (actions).
- Basic UI/E2E tests considered for critical user flows (e.g., adding a contact).
- Code reviewed and approved by at least one other team member.
- Drizzle schema changes are made, and migrations are generated and successfully applied to a development environment.
- UI components are responsive and adhere to existing styling.
- No known critical bugs related to the implemented story.
- Documentation (e.g., inline code comments, schema descriptions) updated if necessary.

## User Stories & Prioritization

---

### Sprint 1: Database & Core Backend Logic

**Story 1.1 (P0)**

- **User Story:** As a System, I need a `contact` table in the database, so that I can store individual contact information.
- **Acceptance Criteria:**
  - Given the database schema is defined in `lib/db/schema.ts`,
  - When the schema is updated,
  - Then a new table named `contact` exists with the following columns:
    - `id` (UUID, primary key, not null, defaultRandom)
    - `firstName` (varchar, 100)
    - `lastName` (varchar, 100)
    - `email` (varchar, 255, not null, unique)
    - `jobTitle` (varchar, 150, nullable)
    - `userId` (UUID, not null, foreign key to `user.id`)
    - `createdAt` (timestamp, not null, defaultNow)
    - `updatedAt` (timestamp, not null, defaultNow)
  - And a Drizzle migration is successfully generated and can be applied.
- **Dependencies:** None
- **Checkbox:** `[ ]`

**Story 1.2 (P0)**

- **User Story:** As a System, I need a `dealContact` join table in the database, so that I can associate multiple contacts with multiple deals and define their roles.
- **Acceptance Criteria:**
  - Given the database schema is defined in `lib/db/schema.ts`,
  - When the schema is updated,
  - Then a new table named `dealContact` exists with the following columns:
    - `dealId` (UUID, not null, foreign key to `deal.id`)
    - `contactId` (UUID, not null, foreign key to `contact.id`)
    - `roleInDeal` (varchar, 100, nullable)
  - And a composite primary key is defined on (`dealId`, `contactId`).
  - And a Drizzle migration is successfully generated and can be applied.
- **Dependencies:** Story 1.1 (for `contact.id` foreign key)
- **Checkbox:** `[ ]`

**Story 1.3 (P1)**

- **User Story:** As a Sales Rep (User), I want a backend action to create a new contact and associate it with a specific deal, so that I can start tracking key people involved in my deals.
- **Acceptance Criteria:**
  - Given a `dealId` and contact details (firstName, lastName, email, optional jobTitle, optional roleInDeal),
  - When the `addContactToDealAction` server action is called,
  - Then:
    - If a contact with the given email does not exist for the user, a new record is created in the `contact` table.
    - A new record is created in the `dealContact` table linking the deal and the (new or existing) contact, including the `roleInDeal` if provided.
    - The action returns a success status and the details of the associated contact.
    - Input validation is performed for required fields (e.g., email, dealId).
    - If an error occurs (e.g., database error, validation failure), the action returns an appropriate error message.
- **Dependencies:** Story 1.1, Story 1.2
- **Checkbox:** `[ ]`

**Story 1.4 (P1)**

- **User Story:** As a Sales Rep (User), I want a backend action to retrieve all contacts associated with a specific deal, so that I can see who is involved in that deal.
- **Acceptance Criteria:**
  - Given a `dealId`,
  - When the `getContactsForDealAction` server action is called,
  - Then the action returns a list of all contact objects (including their `firstName`, `lastName`, `email`, `jobTitle`, and `roleInDeal` from the join table) associated with that `dealId`.
  - If no contacts are associated, an empty list is returned.
  - If the deal does not exist or an error occurs, an appropriate error or empty list is returned.
- **Dependencies:** Story 1.1, Story 1.2
- **Checkbox:** `[ ]`

---

### Sprint 2: User Interface for Viewing and Adding Contacts

**Story 2.1 (P1)**

- **User Story:** As a Sales Rep (User), I want to see a list of associated contacts on the deal details page, so that I can quickly identify key stakeholders for a deal.
- **Acceptance Criteria:**
  - Given I am viewing the deal details page (`app/(main)/deals/[dealId]/page.tsx`),
  - When contacts are associated with the deal,
  - Then a new section titled "Contacts" (or similar) is displayed.
  - And this section lists each associated contact, showing their Full Name, Email, Job Title, and their Role in Deal.
  - And the list is populated by calling the `getContactsForDealAction`.
  - If there are no contacts, a message like "No contacts added yet." is displayed.
- **Dependencies:** Story 1.4
- **UI Component:** `app/(main)/deals/[dealId]/deal-contacts-section.tsx`
- **Checkbox:** `[ ]`

**Story 2.2 (P2)**

- **User Story:** As a Sales Rep (User), I want an "Add Contact" button on the deal details page (within the contacts section), so that I can initiate the process of adding a new contact to the deal.
- **Acceptance Criteria:**
  - Given I am viewing the "Contacts" section on the deal details page,
  - When the section is displayed,
  - Then an "Add Contact" button is visible.
- **Dependencies:** Story 2.1 (for the section to exist)
- **Checkbox:** `[ ]`

**Story 2.3 (P2)**

- **User Story:** As a Sales Rep (User), I want to use a modal form to enter and submit new contact details for a deal, so that I can easily add contacts without leaving the deal page.
- **Acceptance Criteria:**
  - Given I have clicked the "Add Contact" button,
  - When the action is triggered,
  - Then a modal dialog (using `components/ui/dialog.tsx`) appears.
  - And the modal contains a form with input fields for: First Name (required), Last Name (required), Email (required, validated for format), Job Title (optional), Role in Deal (optional).
  - And the form has "Save" and "Cancel" buttons.
  - When I fill the form and click "Save",
  - Then the `addContactToDealAction` is called with the form data and the current `dealId`.
  - And upon successful addition, the modal closes, and the contact list in `deal-contacts-section.tsx` updates to show the new contact.
  - And if there's an error, an error message is displayed within the modal or as a toast notification.
  - When I click "Cancel", the modal closes without saving.
- **Dependencies:** Story 1.3, Story 2.2
- **Checkbox:** `[ ]`

---

### Sprint 3: Managing Contact Associations

**Story 3.1 (P1)**

- **User Story:** As a Sales Rep (User), I want a backend action to remove a contact's association from a specific deal, so that I can correct mistakes or update deal stakeholders without deleting the contact globally.
- **Acceptance Criteria:**
  - Given a `dealId` and a `contactId`,
  - When the `removeContactFromDealAction` server action is called,
  - Then the corresponding entry in the `dealContact` table is deleted.
  - And the `contact` record itself is not deleted.
  - And the action returns a success status.
  - If an error occurs (e.g., association not found), the action returns an appropriate error message.
- **Dependencies:** Story 1.2
- **Checkbox:** `[ ]`

**Story 3.2 (P2)**

- **User Story:** As a Sales Rep (User), I want a "Remove" button next to each contact in the deal's contact list, so that I can easily disassociate a contact from the current deal.
- **Acceptance Criteria:**
  - Given I am viewing the list of contacts associated with a deal,
  - When each contact item is displayed,
  - Then a "Remove" (or an icon button for remove) is visible next to each contact.
  - When I click the "Remove" button for a specific contact,
  - Then a confirmation prompt is shown (e.g., "Are you sure you want to remove this contact from the deal?").
  - And upon confirmation, the `removeContactFromDealAction` is called with the current `dealId` and the selected `contactId`.
  - And upon successful removal, the contact list updates to remove the contact.
  - And if there's an error, an error message is displayed (e.g., as a toast).
- **Dependencies:** Story 2.1, Story 3.1
- **Checkbox:** `[ ]`

## Roadmap Integration

These stories are designed to be small and manageable.

- **Sprint 1:** Focus on the foundational database schema and core backend logic for creating and retrieving contacts. This sprint sets the stage for UI development.
- **Sprint 2:** Focus on the UI for displaying contacts and the form/modal for adding new contacts to a deal.
- **Sprint 3:** Focus on the functionality to remove a contact's association from a deal.

This phased approach ensures that backend capabilities are in place before frontend development begins for a particular piece of functionality, minimizing rework and allowing for incremental delivery and testing. Each sprint delivers a tangible piece of the overall feature.
