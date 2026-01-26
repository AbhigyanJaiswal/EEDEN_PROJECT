# Kartzia Eeden - Frontend Contributor Guide

Welcome to the Kartzia Eeden e-commerce frontend! This guide will help you understand how we're organizing the codebase and which owner is responsible for what.

## Project Ownership

This is a **two-person team** frontend project:

### 1. **Ritvik** - Brand & UI Owner
- Visual design and branding
- Component aesthetics and polish
- Page layouts (home, about, products)
- Design system (buttons, cards, typography)
- Mobile responsiveness from a design perspective

### 2. **Abhigyan** - Flow & Usability Owner
- User workflows and interactions
- Form validation and submission
- API integration and state management
- Error handling and edge cases
- Accessibility (WCAG compliance)
- Performance optimization

## Codebase Structure

```
kartzia-eeden-frontend/
├── src/
│   ├── components/          # All UI components
│   │   ├── cart/            # Abhigyan: Cart logic & flow
│   │   ├── checkout/        # Abhigyan: Checkout process
│   │   ├── auth/            # Abhigyan: Login/Signup forms
│   │   ├── address/         # Abhigyan: Address management
│   │   ├── order/           # Abhigyan: Order confirmation
│   │   └── shared/
│   │       └── errors/      # Abhigyan: Error & empty states
│   ├── context/             # Abhigyan: State management
│   ├── hooks/               # Abhigyan: Custom React hooks
│   ├── utils/
│   │   ├── api/             # Abhigyan: API integration
│   │   ├── validation/      # Abhigyan: Form validation
│   │   └── accessibility/   # Abhigyan: A11y utilities
│   └── constants/           # Shared constants
├── docs/                    # Documentation
├── package.json             # Dependencies
└── README.md               # Project overview
```

## Working Together

### Shared Responsibilities

**Design System** (Located in shared components)
- Primary Owner: Ritvik (defines look)
- Contributor: Abhigyan (ensures usability & performance)
- Components: Buttons, Inputs, Cards, Modals, etc.

### Ritvik Owns

```
src/components/
├── hero/                 # Home page hero
├── productGrid/         # Product listing display
├── productCard/         # Individual product card
├── navbar/              # Top navigation
├── footer/              # Footer
└── about/               # Brand story pages
```

### Abhigyan Owns

```
src/components/
├── cart/                # Shopping cart management
├── checkout/            # Multi-step checkout
├── auth/                # Login & signup forms
├── address/             # Address form & management
├── order/               # Order confirmation & history
└── shared/
    └── errors/          # Error, Empty, Loading states
```

## Git Workflow

### Branch Naming

```
ritvik-ui-<feature>           # Ritvik's UI work
abhigyan-flow-<feature>       # Abhigyan's logic work
```

### Examples

```
ritvik-ui-hero-redesign
ritvik-ui-product-card-animation

abhigyan-flow-cart-optimization
abhigyan-flow-checkout-validation
abhigyan-flow-auth-error-handling
```

### Pull Request Process

1. **Create feature branch** from `main`
2. **Make changes** in your area
3. **Test thoroughly** (run npm run lint, type-check, test)
4. **Create PR** with clear description
5. **Request review:**
   - Ritvik reviews UI-focused PRs
   - Abhigyan reviews logic-focused PRs
6. **One approval required** before merge
7. **Squash and merge** to keep history clean

## Weekly Sync

**Every Friday 3:00 PM - 3:20 PM**

**Agenda:**
- What shipped this week?
- What's the plan for next week?
- Any blockers or dependencies?
- Code review feedback?

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Zustand** - State management
- **Zod** - Schema validation
- **Axios** - HTTP requests
- **Vite** - Build tool
- **Vitest** - Testing

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run tests
npm test
```

## Code Quality Standards

Before pushing:

```bash
npm run lint      # Check code style
npm run format    # Fix formatting
npm run type-check # Check TypeScript
npm test          # Run tests
```

## File Structure Template

```typescript
// src/components/feature/ComponentName.tsx
import React from 'react';
import { useStore } from '@context/store';
import { validate } from '@utils/validation/validator';
import { ErrorState } from '@components/shared/errors/ErrorState';

interface ComponentProps {
  onSuccess?: () => void;
}

/**
 * Brief description of what this component does
 */
export const ComponentName: React.FC<ComponentProps> = ({ onSuccess }) => {
  // Implementation
  return null;
};
```

## Common Questions

**Q: Who should I ask about the checkout flow?**
A: Abhigyan handles all checkout logic and flow.

**Q: Who handles form validation?**
A: Abhigyan manages all form validation schemas and logic.

**Q: Can I modify Abhigyan's components?**
A: Yes, but create a PR and request review before merging.

**Q: Who should I ask about styling?**
A: Ritvik for visual design, Abhigyan for accessibility.

**Q: How do I add a new form?**
A: Follow Abhigyan's pattern in `src/components/auth/` or `src/components/address/`.

## Resources

- [README.md](./README.md) - Full project documentation
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Development guidelines
- [docs/API_INTEGRATION.md](./docs/API_INTEGRATION.md) - API documentation

## Support

- **Questions about logic/flow?** Ask Abhigyan
- **Questions about UI/design?** Ask Ritvik
- **General questions?** Check docs first, then ask during sync

---

**Let's build something amazing together!** 🚀
