# MediChain: Integrated Hospital Management System

MediChain is a modern, real-time hospital management platform designed to streamline clinical, operational, and administrative workflows. Built on a robust, cloud-native architecture using Next.js and Firebase, it provides a unified and intuitive experience for healthcare professionals to manage patient care from admission to discharge.

## Key Features

The platform is organized into several dedicated modules, each tailored to a specific area of hospital operations:

-   **Dashboard (`/dashboard`):** A real-time command center displaying key performance indicators (KPIs) across clinical, operational, and financial domains. It includes live alerts for critical events like abnormal lab results or long wait times.

-   **Patients (`/patients`):** A comprehensive patient management system featuring a Kanban-style board to track the entire patient journey, from registration and vitals to labs, pharmacy, billing, and discharge.

-   **Outpatient (`/outpatient`):** Manages the outpatient clinic workflow, tracking patient status from check-in to consultation and follow-up procedures.

-   **Emergency (`/emergency`):** A dedicated dashboard for the Emergency Department, providing tools for rapid patient triage (ESI), tracking door-to-doctor times, and managing patient flow in a high-stakes environment.

-   **Inpatient (`/inpatient`):** A visual bed board for managing ward occupancy, patient assignments, nursing tasks, and the discharge process. It helps optimize bed turnover and resource allocation.

-   **Surgery (`/surgery`):** An end-to-end operating room management module that tracks surgical schedules, case statuses, OR utilization, and pre-operative checklists.

-   **Labs & Radiology (`/labs`):** A master log for tracking all diagnostic orders, from sample collection and processing to result finalization and provider notification.

-   **Inventory & Pharmacy (`/inventory`):** Manages the hospital's pharmacy and supply chain, including a queue for pending e-prescriptions, stock level monitoring, and reorder management.

-   **Reports & Analytics (`/reports`):** A powerful reporting tool for generating insights into hospital performance, tracking compliance, and exporting data for administrative or regulatory purposes.

-   **Settings (`/settings`):** Allows authenticated users to manage their profile information, including display name and profile picture.

## Technology Stack

-   **Frontend:** Next.js, React, TypeScript
-   **Backend & Database:** Firebase (Firestore, Firebase Authentication)
-   **UI Components:** ShadCN UI, Radix UI
-   **Styling:** Tailwind CSS
-   **Charting:** Recharts
-   **Icons:** Lucide React
