1. Epic & Feature Breakdown

Epic 1: Foundation & Authentication

Feature 1.1: Basic Application Shell & Navigation

Feature 1.2: User Authentication

Epic 2: Deal Management

Feature 2.1: Create Deals

Feature 2.2: View Deals

Feature 2.3: Edit Deals

Feature 2.4: Delete Deals

Epic 3: Transcript Management

Feature 3.1: Upload Transcripts

Feature 3.2: View Transcripts

Feature 3.3: Delete Transcripts

2. User Stories, 3. Acceptance Criteria, 4. Prioritization, 5. Dependencies

Prioritization Key (Simplified WSJF - Value/Effort, Effort ≈ 1 SP):

P1 (Highest): Critical path, core functionality enabler.

P2 (High): Essential for completing a basic user flow.

P3 (Medium): Important for usability or completing a secondary flow.

P4 (Low): Enhancements, less critical for MVP.

Epic 1: Foundation & Authentication

Feature 1.1: Basic Application Shell & Navigation

✅ Story FDN-01: Setup Basic App Shell with Top Bar

As a User,

I want to see a consistent top bar with the application logo,

so that I recognize the application and have a persistent point of reference.

Acceptance Criteria:

Given I open the application,

When the page loads,

Then I see a top bar.

And the top bar displays the "Deal AI Workspace" logo on the left.

Priority: P1

Dependencies: None

✅ Story FDN-02: Setup Basic App Shell with Collapsible Left Sidebar

As a User,

I want to see a collapsible left sidebar for navigation,

so that I can access different sections of the application.

Acceptance Criteria:

Given I open the application,

When the page loads,

Then I see a left sidebar.

And the sidebar is collapsible/expandable (leveraging template functionality).

Priority: P1

Dependencies: FDN-01

✅ Story FDN-03: Implement "Deals" Navigation Link in Sidebar

As a User,

I want to see a "Deals" link in the sidebar,

so that I can navigate to the deals list view.

Acceptance Criteria:

Given the sidebar is visible,

When I look at the navigation links,

Then I see a link labeled "Deals".

And clicking the "Deals" link navigates to the /deals route.

Priority: P1

Dependencies: FDN-02

Feature 1.2: User Authentication

✅ Story AUTH-01: Implement Basic User Registration Page

As a new User,

I want to access a registration page with email and password fields,

so that I can create an account.

Acceptance Criteria:

Given I am an unauthenticated user,

When I navigate to the /register route,

Then I see a form with fields for "Email" and "Password".

And I see a "Register" button.

Priority: P1

Dependencies: None (can be built in parallel with FDN, but login page needs it)

✅ Story AUTH-02: Implement User Registration Backend Logic

As a new User,

I want my registration details (email/password) to be securely saved when I submit the registration form,

so that I can log in later.

Acceptance Criteria:

Given I am on the registration page and have filled in valid email and password,

When I click "Register",

Then a new user account is created in the database (e.g., Supabase Auth).

And my password is securely hashed.

And I am redirected to the login page or automatically logged in and redirected to /deals.

Priority: P1

Dependencies: AUTH-01

✅ Story AUTH-03: Implement Basic User Login Page

As a registered User,

I want to access a login page with email and password fields,

so that I can log into my account.

Acceptance Criteria:

Given I am an unauthenticated user,

When I navigate to the /login route,

Then I see a form with fields for "Email" and "Password".

And I see a "Login" button.

Priority: P1

Dependencies: None (can be built in parallel with FDN)

✅ Story AUTH-04: Implement User Login Backend Logic

As a registered User,

I want to be authenticated when I submit correct credentials on the login page,

so that I can access the application's features.

Acceptance Criteria:

Given I am on the login page and have entered my registered email and correct password,

When I click "Login",

Then my session is authenticated.

And I am redirected to the /deals page.

Given I enter incorrect credentials, then an error message is displayed.

Priority: P1

Dependencies: AUTH-02, AUTH-03

✅ Story AUTH-05: Implement User Logout Functionality

As an authenticated User,

I want a "Logout" option in the user menu (top bar),

so that I can securely end my session.

Acceptance Criteria:

Given I am logged in,

When I click on my user avatar/menu in the top bar and select "Logout",

Then my session is terminated.

And I am redirected to the login page.

Priority: P1

Dependencies: AUTH-04, FDN-01 (for user menu placement)

✅ Story AUTH-06: Protect Application Routes

As a Product Owner,

I want application routes (e.g., /deals) to be accessible only by authenticated users,

so that application data is secure.

Acceptance Criteria:

Given I am an unauthenticated user,

When I attempt to navigate directly to /deals,

Then I am redirected to the /login page.

Given I am an authenticated user, when I navigate to /deals, then I can access the page.

Priority: P1

Dependencies: AUTH-04

Epic 2: Deal Management

Feature 2.1: Create Deals

✅ Story DEAL-01: Display "+ New Deal" Button on Deals List Page

As a User,

I want to see a "+ New Deal" button on the deals list page,

so that I can initiate the creation of a new deal.

Acceptance Criteria:

Given I am on the /deals page,

When the page loads,

Then I see a button labeled "+ New Deal".

Priority: P2

Dependencies: FDN-03, AUTH-06 (to access /deals)

✅ Story DEAL-02: Display "New Deal" Modal

As a User,

I want a modal to appear when I click "+ New Deal", with a field for "Deal Name",

so that I can enter the necessary information for a new deal.

Acceptance Criteria:

Given I am on the /deals page,

When I click the "+ New Deal" button,

Then a modal dialog appears.

And the modal contains a text input field labeled "Deal Name".

And the modal contains "Save Deal" and "Cancel" buttons.

Priority: P2

Dependencies: DEAL-01

✅ Story DEAL-03: Implement Deal Creation Backend Logic

As a User,

I want a new deal to be created with the entered name when I click "Save Deal" in the modal,

so that the deal is stored in the system.

Acceptance Criteria:

Given the "New Deal" modal is open and I have entered a "Deal Name",

When I click "Save Deal",

Then a new deal record is created in the database with the provided name and associated with my user ID.

And the modal closes.

And a success toast/message is displayed.

Priority: P2

Dependencies: DEAL-02

Feature 2.2: View Deals

✅ Story DEAL-04: Display Deals List Table Structure

As a User,

I want to see a table on the /deals page,

so that I can view my deals.

Acceptance Criteria:

Given I am on the /deals page,

When the page loads,

Then a table structure is displayed.

And the table has columns for "Deal Name", "Date Created", and "Number of Transcripts".

Priority: P2

Dependencies: DEAL-03 (to have deals to display)

✅ Story DEAL-05: Populate Deals List with User's Deals

As a User,

I want the deals list table to be populated with deals I have created,

so that I can see my current deals.

Acceptance Criteria:

Given I have created one or more deals,

When I navigate to the /deals page,

Then each of my deals is listed as a row in the table.

And the "Deal Name" and "Date Created" are correctly displayed for each deal.

(Number of Transcripts can be 0 initially).

Priority: P2

Dependencies: DEAL-04

✅ Story DEAL-06: Navigate to Deal Detail View from Deals List

As a User,

I want to click on a deal name in the deals list,

so that I can navigate to the detail view for that specific deal.

Acceptance Criteria:

Given I am on the /deals page with a list of deals,

When I click on a "Deal Name" in a table row,

Then I am navigated to the /deals/[dealId] route for that specific deal.

Priority: P2

Dependencies: DEAL-05

✅ Story DEAL-07: Display Deal Name on Deal Detail Page Header

As a User,

I want to see the name of the current deal prominently displayed on its detail page,

so that I know which deal I am viewing.

Acceptance Criteria:

Given I have navigated to a specific deal's detail page (/deals/[dealId]),

When the page loads,

Then the name of that deal is displayed in a header section.

Priority: P2

Dependencies: DEAL-06

Feature 2.3: Edit Deals

Story DEAL-08: Implement Inline Editing for Deal Name on Detail Page

As a User,

I want to be able to edit the deal name directly on the deal detail page,

so that I can quickly correct or update it.

Acceptance Criteria:

Given I am on a deal detail page,

When I click on the deal name (or an edit icon next to it),

Then the deal name becomes an editable input field.

When I change the name and click save (or press Enter/blur), then the deal name is updated in the database.

And a success toast/message is displayed.

Priority: P3

Dependencies: DEAL-07

Feature 2.4: Delete Deals

Story DEAL-09: Display "Delete Deal" Button on Deal Detail Page

As a User,

I want to see a "Delete Deal" button on the deal detail page,

so that I can remove deals I no longer need.

Acceptance Criteria:

Given I am on a deal detail page,

When the page loads,

Then a "Delete Deal" button is visible.

Priority: P3

Dependencies: DEAL-07

Story DEAL-10: Implement "Delete Deal" Confirmation Modal

As a User,

I want to see a confirmation modal when I click "Delete Deal",

so that I don't accidentally delete a deal.

Acceptance Criteria:

Given I am on a deal detail page,

When I click the "Delete Deal" button,

Then a confirmation modal appears asking "Are you sure you want to delete this deal?".

And the modal has "Confirm Delete" and "Cancel" buttons.

Priority: P3

Dependencies: DEAL-09

Story DEAL-11: Implement Deal Deletion Backend Logic

As a User,

I want the deal (and its associated transcripts) to be deleted when I confirm deletion,

so that it is removed from the system.

Acceptance Criteria:

Given the "Delete Deal" confirmation modal is open,

When I click "Confirm Delete",

Then the deal is deleted from the database.

And all transcripts associated with that deal are also deleted.

And I am redirected to the /deals list page.

And a success toast/message is displayed.

Priority: P3

Dependencies: DEAL-10

Epic 3: Transcript Management

Feature 3.1: Upload Transcripts

✅ Story TRN-01: Display "Transcripts" Section on Deal Detail Page

As a User,

I want to see a dedicated "Transcripts" section on the deal detail page,

so that I can manage transcripts related to that deal.

Acceptance Criteria:

Given I am on a deal detail page,

When the page loads,

Then a section titled "Transcripts for [Deal Name]" is visible.

Priority: P2

Dependencies: DEAL-07

✅ Story TRN-02: Display "+ Upload Transcript" Button in Transcripts Section

As a User,

I want to see an "+ Upload Transcript" button within the "Transcripts" section,

so that I can add new transcripts to the deal.

Acceptance Criteria:

Given I am in the "Transcripts" section on a deal detail page,

When the section loads,

Then a button labeled "+ Upload Transcript" is visible.

Priority: P2

Dependencies: TRN-01

✅ Story TRN-03: Display "Upload Transcript" Modal

As a User,

I want a modal to appear when I click "+ Upload Transcript", with fields for file selection and Call Date & Time,

so that I can provide the transcript file and its associated metadata.

Acceptance Criteria:

Given I click the "+ Upload Transcript" button,

Then a modal dialog appears.

And the modal contains a file input control (accepting .txt, .vtt).

And the modal contains input fields for "Call Date" and "Call Time".

And the modal contains "Upload Transcript" and "Cancel" buttons.

Priority: P2

Dependencies: TRN-02

✅ Story TRN-04: Implement Transcript File Upload and Storage

As a User,

I want the selected transcript file to be uploaded and stored when I submit the "Upload Transcript" modal,

so that the transcript content is saved.

Acceptance Criteria:

Given the "Upload Transcript" modal is open, a valid file is selected, and Call Date/Time are entered,

When I click "Upload Transcript",

Then the file is uploaded to the server/blob storage.

And a new transcript record is created in the database, associated with the current deal, storing the file reference/URL, file name, and the entered Call Date & Time.

And the modal closes.

And a success toast/message is displayed.

Priority: P2

Dependencies: TRN-03

Feature 3.2: View Transcripts

Story TRN-05: Display List of Uploaded Transcripts on Deal Detail Page

As a User,

I want to see a list of all transcripts uploaded for the current deal in the "Transcripts" section,

so that I can see what has been added.

Acceptance Criteria:

Given I have uploaded one or more transcripts for a deal,

When I view the deal detail page,

Then each uploaded transcript is listed in the "Transcripts" section.

And each list item displays the Transcript File Name (or title) and its Call Date & Time.

And each list item has a "View Transcript" button.

Priority: P2

Dependencies: TRN-04

Story TRN-06: Update "Number of Transcripts" on Deals List Page

As a User,

I want the "Number of Transcripts" column on the deals list page to accurately reflect the count of transcripts for each deal,

so that I have an at-a-glance overview.

Acceptance Criteria:

Given a deal has 'N' transcripts associated with it,

When I view the /deals list page,

Then the "Number of Transcripts" column for that deal displays 'N'.

Priority: P3

Dependencies: TRN-04, DEAL-05

Story TRN-07: Display Transcript Viewer Modal/Page

As a User,

I want to see the content of a transcript when I click "View Transcript",

so that I can read what was discussed.

Acceptance Criteria:

Given I am on a deal detail page with a list of transcripts,

When I click the "View Transcript" button for a specific transcript,

Then a modal or new simple page opens.

And this view displays the raw text content of the selected transcript.

And it displays the Transcript File Name and Call Date & Time in its header.

And there is a "Close" or "Back to Deal" button.

Priority: P2

Dependencies: TRN-05

Feature 3.3: Delete Transcripts

Story TRN-08: Display "Delete Transcript" Button for Each Transcript

As a User,

I want to see a "Delete Transcript" button next to each transcript in the list on the deal detail page,

so that I can remove individual transcripts.

Acceptance Criteria:

Given I am viewing the list of transcripts on a deal detail page,

When the list is displayed,

Then each transcript list item has a "Delete Transcript" button.

Priority: P3

Dependencies: TRN-05

Story TRN-09: Implement "Delete Transcript" Confirmation Modal

As a User,

I want to see a confirmation modal when I click "Delete Transcript",

so that I don't accidentally delete a transcript.

Acceptance Criteria:

Given I click the "Delete Transcript" button for a transcript,

Then a confirmation modal appears asking "Are you sure you want to delete this transcript?".

And the modal has "Confirm Delete" and "Cancel" buttons.

Priority: P3

Dependencies: TRN-08

Story TRN-10: Implement Transcript Deletion Backend Logic

As a User,

I want the transcript to be deleted when I confirm deletion,

so that it is removed from the system.

Acceptance Criteria:

Given the "Delete Transcript" confirmation modal is open,

When I click "Confirm Delete",

Then the transcript record is deleted from the database.

And the associated file is deleted from blob storage.

And the transcript list on the deal detail page refreshes.

And a success toast/message is displayed.

Priority: P3

Dependencies: TRN-09

6. Quality & Testing Considerations (Definition of Done - DoD)

For each story, the following Definition of Done must be met:

Code written and adheres to project coding standards (e.g., Biome for linting/formatting from template).

Unit tests written and passing for new backend logic and critical frontend components/hooks.

Acceptance Criteria for the story are met and verified through manual testing.

UI is responsive on common screen sizes (desktop, tablet, mobile) if UI is involved.

Code reviewed and approved by at least one other team member.

Changes merged to the main development branch (e.g., develop or main).

No known critical bugs introduced by the story.

Accessibility (a11y) considerations met for new UI elements (e.g., proper ARIA attributes, keyboard navigability - leveraging shadcn/ui defaults).

7. Roadmap Integration (Example Sprints/Iterations)

This assumes a team velocity where multiple 1-point stories can be completed per sprint.

Sprint 1: Foundation & Core Deal Viewing (Focus: Get something visible and navigable)

FDN-01: Setup Basic App Shell with Top Bar

FDN-02: Setup Basic App Shell with Collapsible Left Sidebar

FDN-03: Implement "Deals" Navigation Link in Sidebar

AUTH-01: Implement Basic User Registration Page

AUTH-03: Implement Basic User Login Page

AUTH-02: Implement User Registration Backend Logic

AUTH-04: Implement User Login Backend Logic

AUTH-05: Implement User Logout Functionality

AUTH-06: Protect Application Routes

DEAL-01: Display "+ New Deal" Button on Deals List Page

DEAL-02: Display "New Deal" Modal

DEAL-03: Implement Deal Creation Backend Logic

Sprint 2: Viewing Deals & Basic Transcript Structure (Focus: Complete the core deal loop)

DEAL-04: Display Deals List Table Structure

DEAL-05: Populate Deals List with User's Deals

DEAL-06: Navigate to Deal Detail View from Deals List

DEAL-07: Display Deal Name on Deal Detail Page Header

TRN-01: Display "Transcripts" Section on Deal Detail Page

TRN-02: Display "+ Upload Transcript" Button in Transcripts Section

TRN-03: Display "Upload Transcript" Modal

Sprint 3: Transcript Functionality & Deal Editing (Focus: Core transcript flow and deal management enhancements)

TRN-04: Implement Transcript File Upload and Storage

TRN-05: Display List of Uploaded Transcripts on Deal Detail Page

TRN-07: Display Transcript Viewer Modal/Page

DEAL-08: Implement Inline Editing for Deal Name on Detail Page

TRN-06: Update "Number of Transcripts" on Deals List Page

Sprint 4: Deletion & Polish (Focus: Completing CRUD and refining)

DEAL-09: Display "Delete Deal" Button on Deal Detail Page

DEAL-10: Implement "Delete Deal" Confirmation Modal

DEAL-11: Implement Deal Deletion Backend Logic

TRN-08: Display "Delete Transcript" Button for Each Transcript

TRN-09: Implement "Delete Transcript" Confirmation Modal

TRN-10: Implement Transcript Deletion Backend Logic

(Buffer for bug fixing, minor UI polish based on feedback)

This detailed list should provide a clear path for the development team to start building the simplified Deal AI Workspace iteratively. Each story is small, testable, and delivers incremental value.
