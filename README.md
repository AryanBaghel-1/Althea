# Althea

Althea is a browser-only healthcare workspace demonstration built with Next.js. It gives a patient a calm place to explore appointment scheduling, fictional medical records, medication check-ins, and profile settings.

> Althea is not a healthcare service. Doctors, appointments, records, and medications are demo data. Use fictional information only.

## Features

- Landing page with product overview and demo safety information
- Local demo account creation and login
- Dashboard overview with appointment, record, and medication summaries
- Static demo doctor directory with specialty and location details
- Demo appointment booking, upcoming/history views, and cancellation
- Fictional medical record creation, search, deletion, and `.txt` downloads
- Once-daily medication reminder checklist
- Editable demo profile with name, phone, and blood group fields
- Responsive dashboard navigation and light/dark theme toggle
- Client-side password hashing with PBKDF2 before local storage

## Getting Started

The repository declares Bun `1.4.0` as its package manager.

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser, then create a demo account.

Useful commands:

```bash
bun run lint     # Run ESLint
bun run build    # Create a production build
bun start        # Serve the production build
```

The equivalent `npm run ...` commands also work when dependencies are installed with npm.

## Routes

| Route                     | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| `/`                       | Public landing page                         |
| `/login`                  | Log in to a local demo account              |
| `/signup`                 | Create a local demo account                 |
| `/dashboard`              | Care overview                               |
| `/dashboard/doctors`      | Browse demo doctors and book an appointment |
| `/dashboard/appointments` | Manage upcoming and past demo appointments  |
| `/dashboard/records`      | Manage fictional record summaries           |
| `/dashboard/medications`  | Manage daily demo reminders                 |
| `/dashboard/settings`     | Edit the local demo profile and sign out    |

## How Data Works

Althea has no backend, API, database, or external authentication service. Accounts, sessions, profiles, appointments, records, and medication entries are stored in the browser using `localStorage`:

- `althea.database.v1` stores new local accounts and patient data.
- `althea.session.v1` stores the active local session.
- Existing data from the former `careflow.*` keys is read as legacy data.
- Clearing site data removes the local accounts and entries.
- Data does not sync across browsers or devices.
- Anyone with access to the browser profile can inspect or change the stored data.

The app uses the Web Crypto API for client-side PBKDF2 password hashing. Password hashing requires `localhost` or an HTTPS connection.

## Project Structure

```text
src/
  app/                 Next.js routes and layouts
  components/          Shared UI, auth, shell, and page components
  components/pages/    Dashboard feature views
  lib/data.ts          Static demo doctors and empty patient state
  lib/storage.ts       Browser storage and password hashing
  lib/types.ts         Shared TypeScript models
  lib/utils.ts         Formatting and UI helpers
public/                Static assets
```

## Limitations

This demo does not provide real medical advice, provider contact, video meeting links, notifications, file uploads, email verification, password recovery, server authentication, or cross-device synchronization. Do not enter real patient or health information.

## Tech Stack

- Next.js `16.3.5` with the App Router
- React `19.2.8` and TypeScript
- Tailwind CSS `4`
- Lucide React icons
- ESLint with the Next.js configuration

## Future Plans

The current release is intentionally a frontend-only demo. Planned work includes:

- Integrate a real-time database for appointments, records, medications, and profile data.
- Add a backend API to centralize business rules, validation, and data access.
- Replace browser-only accounts with secure server-side authentication, sessions, password recovery, and email verification.
- Sync data across devices and support real-time updates between active sessions.
- Add secure file storage for medical documents with access controls and audit history.
- Introduce opt-in notifications for appointments and reminders.
- Add provider workflows, availability management, and real appointment integrations.
- Complete the privacy, security, compliance, monitoring, and backup work required before handling real patient information.

These capabilities are not implemented yet. Until they are available, Althea should remain a fictional-data demonstration.
