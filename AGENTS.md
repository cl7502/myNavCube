# Agent Coding Guidelines

This document provides guidelines for AI agents working in this repository.

## Project Overview

This is a React 19 + TypeScript application with a Node.js/Express backend. It uses Vite for bundling, Tailwind CSS v4 for styling, Zustand for state management, and better-sqlite3 for the database.

## Build Commands

```bash
# Development
npm run dev          # Start dev server (runs server.ts with tsx)
npm run start        # Alias for dev

# Build
npm run build        # Vite production build
npm run preview      # Preview production build

# Linting
npm run lint         # TypeScript type check (tsc --noEmit)

# Utilities
npm run clean        # Remove dist directory
```

**Note**: No test framework is currently configured. If adding tests, use Vitest for React/TypeScript.

## Code Style Guidelines

### Imports

- Use absolute imports with `@/` prefix (configured in tsconfig.json)
- Group imports: external libs → internal imports → types
- Example:
  ```typescript
  import { useState, useEffect } from 'react';
  import { useStore, type Category } from '../store';
  import { ChevronRight, Plus } from 'lucide-react';
  import { Droppable, Draggable } from '@hello-pangea/dnd';
  import { useTranslation } from '../i18n';
  import { cn } from '@/lib/utils';
  ```

### TypeScript

- Always use explicit types for function parameters and return values
- Use interfaces for object shapes, types for unions/aliases
- Enable `strict: true` equivalent via tsconfig (noImplicitAny, strictNullChecks, etc.)
- Prefer `type` over `interface` for simple objects unless extending

### Naming Conventions

- **Components**: PascalCase (e.g., `Sidebar.tsx`, `UserModal.tsx`)
- **Functions/variables**: camelCase
- **Interfaces/Types**: PascalCase with descriptive names (e.g., `User`, `Category`, `UserSettings`)
- **Constants**: PascalCase for exported, camelCase for local
- **File names**: PascalCase for components, camelCase for utilities

### Component Patterns

- Use functional components with hooks
- Destructure props for clarity
- Keep components focused (single responsibility)
- Extract complex logic into custom hooks or utility functions

### Tailwind CSS

- Use `@tailwindcss/vite` plugin with Tailwind v4
- Use `cn()` utility from `@/lib/utils` for conditional classes:
  ```typescript
  import { cn } from '@/lib/utils';
  
  <div className={cn(
    "base-classes",
    condition && "conditional-class",
    isActive && "bg-blue-50"
  )} />
  ```
- Use arbitrary values sparingly
- Keep responsive classes inline rather than extracting to constants

### State Management (Zustand)

- Define store in `src/store.ts` with TypeScript interfaces
- Use `useStore()` hook for accessing state
- Use `useStore.getState()` for imperative updates outside React context
- Prefer selectors to avoid unnecessary re-renders

### Error Handling

- Use try/catch for async operations
- Throw descriptive Error objects with meaningful messages
- Handle API errors with user-friendly messages in UI
- Example:
  ```typescript
  try {
    await api.post('/api/endpoint', data);
  } catch (err) {
    console.error('Failed to save:', err);
    // Show error toast/notification to user
  }
  ```

### API Patterns

- Use the `api` object from `@/lib/api` for HTTP calls
- Always handle non-ok responses
- Use async/await consistently

### Database

- Use `better-sqlite3` for synchronous SQLite operations
- Define database schema in migrations/scripts
- Use parameterized queries to prevent SQL injection

### Server-Side (Express)

- Define routes in `server.ts` or route files
- Use middleware for authentication, error handling
- Store secrets in `.env` (never commit)

## File Structure

```
src/
├── components/     # React components
├── lib/            # Utilities (api.ts, utils.ts)
├── store.ts        # Zustand store
├── i18n.ts         # Internationalization
├── main.tsx        # Entry point
└── App.tsx         # Root component

server.ts           # Express server entry
vite.config.ts      # Vite configuration
```

## Common Patterns

### Conditional Classes
```typescript
// Good
<div className={cn("p-4", isActive && "bg-blue-500")} />

// Avoid
<div className={`p-4 ${isActive ? 'bg-blue-500' : ''}`} />
```

### Dynamic Icons
```typescript
const IconComp = (Icons as any)[iconName];
{IconComp && <IconComp size={16} />}
```

### Store Updates (Outside Components)
```typescript
// Direct state update
useStore.getState().setCategories(newCategories);

// With partial updates
useStore.getState().setSettings({ theme: 'dark' });
```

## Additional Notes

- This project uses React 19 with strict mode
- HMR is controlled by `DISABLE_HMR` env var (used in AI Studio environments)
- The project uses motion (formerly Framer Motion) for animations
- Radix UI components are used for accessible primitives