# Loan Management System

This project is a web-based loan management system built using Next.js, Prisma, and Shadcn/UI. It allows users to view, add, and manage loan products.

## Project Overview

The Loan Management System provides a user-friendly interface for managing loan products.  It includes the following features:

*   **Loan Product Listing:** Displays a list of available loan products with key details.
*   **Add Loan Product:**  Allows authorised users to add new loan products to the system.
*   **AI Loan Generation:** Allows users to enter a prompt to speed up the generation of a loan.
*   **Loan Details:** Provides a detailed view of individual loan products withthe ability to edit and delete them.
*   **User Listing:** Displays a list of all created users and allows users to be deleted.
*   **Add User:** Allows authorised users to create new users.

## Setup Instructions

1.  **Navigate to the Project Directory:**

    ```bash 
    cd path/to/project
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the Database:**

    *   Ensure you have a PostgreSQL database instance running.
    *   Create a `.env` file in the root directory of the project.
    *   Add the database connection URL to the `.env` file:

        ```
        DATABASE_URL=postgres://[user]:[password]@[host]:[port]/[database-name]
        ```
4.  **Add Gemini API Key:**

    *   Obtain an API Key from https://aistudio.google.com/
    *   Add the API Key to the `.env` file:

        ```bash
        GEMINI_API_KEY=YOUR_API_KEY
        ```


5.  **Run Prisma Migrations:**

    ```bash
    npx prisma migrate dev --name init
    ```

6.  **Generate Prisma Client:**

    ```bash
    npx prisma generate
    ```

7.  **Start the Development Server:**

    ```bash
    npm run dev
    ```

    Open your browser and navigate to `http://localhost:3000` to view the application.

## Assumptions and Decisions Made

*   **Technology Stack:** The project utilizes Next.js for the frontend and backend, Prisma for database access, and Shadcn/UI for UI components.  This stack was chosen for its performance, developer experience, and ease of use.
*   **Database:** PostgreSQL was selected as the database due to its robustness and compatibility with Prisma.
*   **Authentication:**  Basic login authentication has been implemented for pages. No authentication has been applied to routes but JWT authentication should be considered.
*   **UI Library:** Shadcn/UI was chosen for its unstyled components, allowing for easy customization and integration with Tailwind CSS.
*   **Decimal Handling:**  Prisma's `Decimal` type is used for currency values.  These values are converted to JavaScript numbers in the server actions before being sent to the client to avoid serialization issues.
*   **Error Handling:** Error handling is implemented in the server actions
*   **Styling:** Tailwind CSS is used for styling.
*   **API Interactions:** Server actions are used for database interactions. No authentication has been added due to timelines however this should be added before prod.
*   **AI Functionality:** A very basic AI functionality has been added in the hopes of streamlining product creation. This AI functionality could be extended throughout the app. For example, generating analytics data on products etc.

## Future Development

*   Implement advanced authentication and authorization.
*   Add more comprehensive error handling and user feedback.
*   Expand on the AI capabilities throughout the app.
*   Implement unit and integration tests.