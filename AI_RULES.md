# DuaAI Application Rules

This document outlines the core technologies and best practices for developing the DuaAI application.

## Tech Stack Overview

The DuaAI application is built using a modern web development stack, focusing on performance, maintainability, and a rich user experience.

*   **Frontend Framework**: React (with TypeScript) for building dynamic and interactive user interfaces.
*   **Styling**: Tailwind CSS for a utility-first approach to styling, enabling rapid and consistent UI development.
*   **AI Integration**: Google Gemini API (`@google/genai`) powers all AI functionalities, including Dua generation, audio recitation, quiz generation, and AI coaching.
*   **Build Tool**: Vite provides a fast development server and an optimized build process for production.
*   **Icons**: Lucide React is used for a comprehensive and customizable set of SVG icons across the application.
*   **State Management**: React's built-in `useState` and `useEffect` hooks are utilized for managing component-level and application-wide state.
*   **Client-Side Data Persistence**: Browser's `localStorage` is used for storing user-specific data such as daily usage, premium status, and saved Duas.
*   **Audio Playback**: Native HTML5 Audio API is employed for playing AI-generated audio recitations.
*   **UI Components**: Shadcn/ui (built on Radix UI) is available and recommended for robust, accessible, and aesthetically pleasing UI components.

## Library Usage Rules

To maintain consistency and efficiency, please adhere to the following guidelines when developing:

*   **UI Components**:
    *   **Prioritize Shadcn/ui**: For all new UI elements, first check if a suitable component exists within the shadcn/ui library. These components are designed for accessibility and consistency.
    *   **Custom Components**: If a specific component is not available in shadcn/ui or requires significant custom styling/logic, create a new, focused React component in `src/components/`.
*   **Styling**:
    *   **Tailwind CSS Only**: All styling must be implemented using Tailwind CSS utility classes. Avoid writing custom CSS files or inline styles unless absolutely necessary for unique, non-Tailwind-compatible scenarios.
*   **AI Interactions**:
    *   **`geminiService.ts`**: All calls to the Google Gemini API must be encapsulated within the `src/services/geminiService.ts` file. Do not make direct API calls from components or other service files.
*   **Icons**:
    *   **Lucide React**: Use icons exclusively from the `lucide-react` library.
*   **State Management**:
    *   **React Hooks**: Utilize `useState` and `useEffect` for managing component state and simple global application state.
*   **Client-Side Data**:
    *   **`userService.ts`**: All interactions with `localStorage` for user data (e.g., daily usage, premium status, saved Duas) should go through the `src/services/userService.ts` module.
*   **Routing**:
    *   **`App.tsx` View Management**: The application currently manages views (HOME, PREMIUM, DONATE, etc.) through conditional rendering based on a `view` state in `src/App.tsx`. Continue to manage application views this way.