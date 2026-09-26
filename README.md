# Next Legacy Refresh

Senior Next.js 16 + Supabase Migration & Refactoring Task

Act as a senior frontend architect and full-stack engineer specializing in Next.js 16, React, TypeScript, Tailwind CSS, and Supabase.

I will provide you with an existing website in HTML/CSS/JS.

Your job is to convert and refactor the existing website into a clean, scalable, production-ready Next.js 16 application, while preserving the existing design and functionality as closely as possible.

1. PRIMARY OBJECTIVE

Convert my existing HTML website into:

Next.js 16

React

TypeScript

Tailwind CSS

Supabase for backend/database/auth/storage where required

Proper reusable React components

Proper Next.js App Router architecture

Clean, scalable folder structure

Responsive design

Production-ready code

VERY IMPORTANT

Do NOT redesign the website unnecessarily.

The existing HTML is the source of truth for the UI.

Preserve:

Layout

Spacing

Typography

Colors

Borders

Shadows

Buttons

Cards

Images

Icons

Sections

Navigation

Footer

Responsive behavior

Animations

Overall visual hierarchy

Only change the implementation from static HTML into a proper Next.js application.

2. NEXT.JS VERSION

Use:

Next.js 16

Use the App Router architecture.

Do NOT use the Pages Router.

Use modern Next.js 16 conventions wherever appropriate.

Prefer:

Server Components by default

Client Components only where interactivity/browser APIs are required

Server-side data fetching where appropriate

Route Handlers when API endpoints are required

Server Actions where appropriate

Proper metadata handling

next/image

next/link

Do not unnecessarily add "use client" to every component.

3. TYPESCRIPT

The project must use TypeScript.

Convert all JavaScript logic into properly typed TypeScript.

Avoid:

any


unless there is a legitimate technical reason.

Create proper interfaces/types for:

Users

Products

Blog posts

Categories

Forms

API responses

Database records

Component props

Keep types organized and reusable.

4. COMPONENT ARCHITECTURE

Do NOT put the entire website inside one page component.

Break the website into logical reusable components.

For example:

components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Card.tsx
│   └── ...
│
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── MobileMenu.tsx
│
├── sections/
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── About.tsx
│   ├── Testimonials.tsx
│   ├── CTA.tsx
│   └── ...
│
└── shared/
    ├── Logo.tsx
    └── ...


Create components based on the actual website.

Do not blindly create hundreds of tiny components.

A component should be extracted when:

It is reused

It represents a meaningful UI section

It contains significant logic

It improves maintainability

5. NEXT.JS FOLDER STRUCTURE

Use a clean App Router structure similar to:

src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── (public)/
│   │   ├── ...
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── ...
│   │
│   └── api/
│       └── ...
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   └── shared/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── utils.ts
│
├── types/
│   └── ...
│
├── hooks/
│   └── ...
│
├── services/
│   └── ...
│
└── config/
    └── ...


Adjust the structure based on the actual project.

Do not create unnecessary folders.

6. SUPABASE BACKEND

Use Supabase as the backend.

Use Supabase for functionality that requires a backend, such as:

Database

Authentication

User management

File/image storage

CRUD operations

Form submissions

Protected data

User-specific data

Use the official Supabase JavaScript/SSR approach appropriate for Next.js.

Create separate Supabase clients where required:

lib/supabase/client.ts
lib/supabase/server.ts


Use environment variables:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=


Never hardcode credentials.

Never expose service-role secrets to the browser.

7. DATABASE DESIGN

Analyze the existing website and determine what data should be stored in Supabase.

If the website contains dynamic entities such as:

Users

Products

Orders

Blog posts

Categories

Reviews

Contact submissions

Appointments

Leads

etc.

Create an appropriate relational database structure.

For each table consider:

Primary key

Foreign keys

Timestamps

Relationships

Required fields

Nullable fields

Indexes

Constraints

Prefer UUID primary keys where appropriate.

Also create appropriate:

Row Level Security (RLS) policies.

Security must be considered from the beginning.

8. AUTHENTICATION

If authentication exists or is required, use:

Supabase Auth

Support appropriate authentication flows such as:

Sign up

Sign in

Sign out

Forgot password

Reset password

Session handling

Protected routes

User profile

Do not implement custom password authentication if Supabase Auth can handle it.

Never store plain-text passwords.

9. SERVER VS CLIENT COMPONENTS

Follow this rule:

Server Component by default

Use Server Components for:

Static sections

SEO content

Data fetching

Database queries

Server-side rendering

Client Component only when necessary

Use "use client" for:

useState

useEffect

Event handlers

Browser APIs

Interactive menus

Modals

Forms requiring client state

Client-side animations where required

Do not make the whole application a Client Component.

10. IMAGES AND ASSETS

Use:

next/image


instead of regular <img> wherever appropriate.

Use:

next/link


instead of regular <a> for internal navigation.

Preserve the existing image assets.

Do not replace existing images with random placeholder images unless an asset is genuinely missing.

If an external image domain is required, configure it properly in Next.js.

11. RESPONSIVE DESIGN

The website must work correctly on:

Mobile

Tablet

Laptop

Desktop

Large screens

Preserve the responsive behavior of the original HTML.

Do not only make the desktop version work.

Test and fix:

Navbar

Mobile menu

Cards

Grids

Images

Typography

Buttons

Forms

Sections

Footer

at different screen sizes.

12. JAVASCRIPT FUNCTIONALITY

Analyze the original HTML/JS carefully.

Convert existing functionality into React/Next.js equivalents.

For example:

Vanilla JS

document.querySelector(...)


should generally become React state, props, refs, or event handlers.

DOM manipulation

Replace direct DOM manipulation with React patterns.

Event listeners

Convert them into React event handlers.

Modals

Use React state.

Tabs

Use React state.

Dropdowns

Use React state.

Forms

Use proper controlled/uncontrolled React form patterns depending on complexity.

Do not simply paste the old JavaScript into the Next.js project.

13. FORMS

For every form:

Validate input.

Show loading state.

Handle errors.

Show success feedback.

Prevent duplicate submissions.

Sanitize/validate data server-side where appropriate.

Store data in Supabase if required.

Use appropriate validation libraries if needed, such as:

Zod

React Hook Form

Do not add libraries unnecessarily.

14. ERROR HANDLING

Implement proper error handling.

Handle:

Supabase errors

Database errors

Authentication errors

Invalid form data

Network errors

Missing data

Unauthorized requests

Not found pages

Create appropriate:

loading.tsx
error.tsx
not-found.tsx


where they make sense.

Do not expose sensitive backend errors to users.

15. SEO

Implement proper Next.js SEO.

Use the Metadata API.

Include appropriate:

Title

Description

Open Graph metadata

Twitter metadata where appropriate

Canonical URLs where appropriate

Favicon

Robots configuration where appropriate

Sitemap where appropriate

Do not destroy the existing SEO content.

Preserve important headings and semantic HTML.

16. ACCESSIBILITY

Make the application accessible.

Follow good WCAG practices.

Ensure:

Semantic HTML

Proper heading hierarchy

Accessible buttons

Form labels

Alt text

Keyboard navigation

Focus states

ARIA only when necessary

Sufficient contrast

Do not remove accessibility features from the original website.

17. PERFORMANCE

Optimize the application for production.

Use:

Server Components where possible

next/image

Lazy loading where appropriate

Proper caching/revalidation

Efficient database queries

Avoid unnecessary client-side JavaScript

Avoid unnecessary dependencies

Do not over-engineer caching.

18. SECURITY

Follow production security practices.

Never:

Expose Supabase service-role keys

Hardcode secrets

Trust client-side authorization

Store passwords manually

Allow unauthorized database access

Disable RLS just to make functionality work

Use Supabase RLS appropriately.

Validate authorization on the server.

19. CODE QUALITY

Write code as a senior engineer, not as a quick prototype.

Code should be:

Clean

Readable

Modular

Reusable

Maintainable

Strongly typed

Consistent

Production-ready

Avoid:

Duplicate code

Giant components

Giant functions

Hardcoded repeated values

Unnecessary dependencies

Unnecessary abstractions

any

Dead code

Commenting obvious code

20. DO NOT BREAK THE DESIGN

This is extremely important.

When converting the HTML:

DO

Preserve the existing visual appearance

Preserve spacing

Preserve colors

Preserve typography

Preserve layout

Preserve animations

Preserve images

Preserve content

Preserve responsive behavior

DO NOT

Redesign the website

Change the color palette without reason

Replace the UI with generic Tailwind components

Remove sections

Remove functionality

Replace important content

Add random gradients

Add unnecessary animations

Make the design look like a template

The goal is:

Same website → better architecture + Next.js 16 + Supabase

not:

Same content → completely different website

21. ROUTING

Analyze all existing pages and convert them into proper Next.js routes.

For example:

Home
About
Services
Products
Blog
Contact
Login
Register
Dashboard


should become appropriate routes such as:

/
 /about
 /services
 /products
 /blog
 /contact
 /login
 /register
 /dashboard


Use route groups where they improve organization.

22. DATA FLOW

For every dynamic feature, clearly separate:

UI
 ↓
Component
 ↓
Server Action / Route Handler / Server Function
 ↓
Supabase
 ↓
Database


Do not put complex database logic directly inside presentation components.

Create reusable service/data-access functions when appropriate.

23. ENVIRONMENT VARIABLES

Create an appropriate .env.example.

Example:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=


Never commit actual credentials.

If additional services are required, document their environment variables in .env.example.

24. MIGRATION PROCESS

Before making changes:

Step 1

Analyze the complete HTML/CSS/JS.

Step 2

Identify:

Pages

Sections

Components

Reusable UI

Assets

Interactions

Forms

Dynamic data

Authentication requirements

Step 3

Create the Next.js 16 architecture.

Step 4

Convert the UI into reusable React components.

Step 5

Implement routing.

Step 6

Integrate Supabase.

Step 7

Implement authentication/data functionality where required.

Step 8

Implement validation and error handling.

Step 9

Optimize responsiveness.

Step 10

Perform a final UI and functionality comparison against the original HTML.

25. IMPORTANT: DO NOT GUESS BACKEND REQUIREMENTS

If the existing HTML is purely static and there is no obvious backend requirement:

Do not invent complex backend features.

However, if functionality clearly requires persistent data, authentication, CRUD, file uploads, or user-specific information, implement it using Supabase.

If something genuinely cannot be determined from the HTML, make the simplest reasonable implementation and clearly document the assumption.

26. FINAL QUALITY CHECK

Before considering the task complete, verify:

UI

Original design preserved

Responsive

Images working

Icons working

Animations working

Navigation working

Next.js

Next.js 16

App Router

Server Components used appropriately

Client Components only where necessary

Proper routing

Metadata implemented

TypeScript

No unnecessary any

Props typed

Database types handled properly

Supabase

Supabase configured correctly

Database schema created where required

RLS enabled where required

Authentication implemented where required

No secret keys exposed

Code quality

Reusable components

Clean folder structure

No unnecessary duplication

No dead code

No unnecessary dependencies

Production

Error handling

Loading states

Empty states

Security

Performance

SEO

Accessibility

27. MOST IMPORTANT INSTRUCTION

Do not start by rewriting everything blindly.

First inspect and understand the provided HTML, CSS, JavaScript, assets, pages, and functionality.

Then migrate it systematically.

The final result should feel like the same original website, but its codebase should look like it was built by a senior Next.js 16 + TypeScript + Supabase developer.

I will now provide the existing HTML/CSS/JS files.

Analyze them first and then perform the migration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/884b4cbf-12fd-4cf1-a77f-218d12a5fbdc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
