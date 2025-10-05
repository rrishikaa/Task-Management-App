A responsive Kanban board application built with Next.js, TypeScript, and Tailwind CSS featuring task management with drag-and-drop functionality, priority filtering, and local storage persistence.

## Features

- Create, edit, and delete tasks
- Drag-and-drop between columns (To Do, In Progress, Done)
- Priority filtering (All, Low, Medium, High)
- Local storage persistence
- Responsive design
- Task sorting by priority

## Setup Instructions

### Prerequisites
- Node.js (v18 or later recommended)
- npm/yarn/pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]


### Install dependencies:

npm install
# or
yarn install
# or
pnpm install

#### Run the development server:
npm run dev

Open http://localhost:3000 in your browser


### Component Structure
components/
  kanban/
    KanbanBoard.tsx    # Main container
    KanbanColumn.tsx   # Column component
    KanbanTask.tsx     # Task card component
    AddTaskForm.tsx    # Form for adding/editing tasks
types/
  kanban.ts           # Type definitions

### Key Decisions:
1. Atomic Design: Components are organized hierarchically for reusability
2. State Management: React hooks with localStorage for persistence
3. Drag-and-Drop: Native HTML5 API implementation for lightweight solution
4. Filtering: Client-side filtering with memoization for performance


### Libraries & Tools
1. Next.js: React framework for server-side rendering and static generation
2. TypeScript: For type safety and better developer experience
3. Tailwind CSS: Utility-first CSS framework for responsive design
4. ESLint/Prettier: Code quality and formatting

### Future Improvements
With more time, I would implement:

## Backend Integration:
Connect to a REST API or GraphQL endpoint
Implement user authentication
Add real-time collaboration

## Enhanced Features:
Due dates and calendar view
Task labels/tags
Search functionality
Undo/redo functionality

## UI/UX Improvements:
Animations for smoother drag-and-drop
Custom scrollbars for columns
Keyboard shortcuts
Dark mode support

## Testing:
Unit tests with Jest
Integration tests with React Testing Library
E2E tests with Cypress

## Performance:
Virtualized lists for large task sets
Optimistic UI updates
Code splitting


### Deployment
The easiest way to deploy is via Vercel:



