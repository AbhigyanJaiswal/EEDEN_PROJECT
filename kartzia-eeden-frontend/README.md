# Abhigyan - Flow, Usability & Logic Frontend

Welcome to the Kartzia Eeden e-commerce frontend! This codebase is owned by **Abhigyan**, the Flow, Usability & Logic Owner.

## Your Responsibilities 🎯

You own the **smooth, frictionless user experience** across:

- ✅ **Cart Management** - Add/remove items, update quantities
- ✅ **Checkout Flow** - Multi-step checkout process
- ✅ **Authentication** - Login, Signup, Session Management
- ✅ **Address Management** - Save, update, select addresses
- ✅ **Form Validation** - Real-time field validation
- ✅ **Error States** - Handle all error scenarios gracefully
- ✅ **API Integration** - Frontend data fetching & state sync
- ✅ **Performance** - Optimize bundle size, load times
- ✅ **Accessibility** - WCAG compliance, screen reader support

## Project Structure

```
src/
├── components/
│   ├── cart/              # Cart management UI
│   ├── checkout/          # Checkout flow (multi-step)
│   ├── auth/              # Login, Signup forms
│   ├── address/           # Address management
│   ├── order/             # Order confirmation & history
│   └── shared/
│       └── errors/        # ErrorState, EmptyState, LoadingState
├── context/               # Zustand stores
│   ├── authStore.ts       # User auth state
│   └── cartStore.ts       # Shopping cart state
├── hooks/                 # Custom React hooks
├── utils/
│   ├── validation/        # Form validation (Zod schemas)
│   ├── api/               # API client & endpoints
│   └── accessibility/     # A11y utilities
└── constants/             # App constants
```

## Key Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Zustand** - State management (minimal, performant)
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Framer Motion** - Animations

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Testing

```bash
npm test
```

## Git Workflow

### Branch Naming Convention

```
abhigyan-flow-<feature-name>
```

Examples:
- `abhigyan-flow-cart-optimization`
- `abhigyan-flow-checkout-validation`
- `abhigyan-flow-auth-errors`

### Before Pushing

```bash
npm run lint
npm run format
npm run type-check
npm test
```

### Pull Request

1. **Create PR** from `abhigyan-flow-*` → `main`
2. **Request review** from Ritvik (for any UI concerns) or other team members
3. **Ensure all checks pass** (lint, types, tests)
4. **One approval required** before merge
5. **Squash and merge** to keep history clean

## State Management (Zustand)

### Cart Store

```typescript
import { useCartStore } from '@context/cartStore';

const { items, total, addItem, removeItem, updateQuantity } = useCartStore();
```

### Auth Store

```typescript
import { useAuthStore } from '@context/authStore';

const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

## Form Validation

All forms use **Zod schemas** for type-safe validation:

```typescript
import { validate } from '@utils/validation/validator';
import { loginSchema } from '@utils/validation/schemas';

const validation = validate(loginSchema, formData);
if (!validation.success) {
  // Handle validation.errors
}
```

Available schemas:
- `loginSchema` - Email + password
- `signupSchema` - Full registration
- `addressSchema` - Shipping address
- `cartItemSchema` - Cart item validation

## API Integration

Use the `apiClient` for all HTTP requests:

```typescript
import { authApi, cartApi, orderApi } from '@utils/api/endpoints';

// Login
const response = await authApi.login(email, password);

// Cart operations
await cartApi.addItem(productId, quantity);

// Orders
await orderApi.createOrder(orderData);
```

## Error Handling

Three main error components:

### ErrorBoundary
Catches React component errors:
```typescript
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### ErrorState
Display error messages with retry:
```typescript
<ErrorState 
  message="Failed to load cart"
  retry={() => fetchCart()}
/>
```

### EmptyState
Show when no data:
```typescript
<EmptyState 
  message="Your cart is empty"
  actionLabel="Continue Shopping"
  onAction={() => navigate('/')}
/>
```

## Accessibility (A11y)

All components must follow WCAG 2.1 AA standards:

- ✅ Semantic HTML (`<button>`, `<label>`, `<form>`)
- ✅ ARIA attributes where needed
- ✅ Keyboard navigation support
- ✅ Screen reader announcements
- ✅ Color contrast ratios
- ✅ Focus management

Utility functions:
```typescript
import { announceToScreenReader, focusElement } from '@utils/accessibility/a11y';

announceToScreenReader('Item added to cart');
focusElement(element);
```

## Performance Optimization

### Code Splitting
Components are naturally split - each feature folder is independent.

### State Updates
Zustand provides fine-grained updates - only subscribed components re-render.

### API Caching
Implement in `useQuery`-like custom hooks for frequently fetched data.

### Bundle Size
Monitor with:
```bash
npm run build
# Check dist/ folder sizes
```

## Key KPIs (Your Success Metrics)

| Metric | Target | Status |
|--------|--------|--------|
| Zero broken checkout flows | 100% ✓ | |
| Form validation speed | < 50ms | |
| API response handling | < 3s | |
| Accessibility score | 90+ | |
| Mobile responsiveness | 100% | |
| Error recovery rate | 100% | |

## Common Tasks

### Add a new form field
1. Update Zod schema in `utils/validation/schemas.ts`
2. Add input to component
3. Add field to state
4. Add error handling in submit

### Add new API endpoint
1. Create method in `utils/api/endpoints.ts`
2. Use `apiClient.get|post|put|delete`
3. Handle response/error in component

### Create new component
1. Create folder in `src/components/<feature>`
2. Follow naming: `ComponentName.tsx`
3. Export from `index.ts` if needed
4. Add TypeScript types/props

## Testing

Write tests for:
- Form validation logic
- State management
- API integration
- Component rendering

Example:
```typescript
describe('LoginForm', () => {
  it('should validate email format', () => {
    // test
  });
});
```

## Debugging

### Redux DevTools
State updates are logged - useful for debugging Zustand.

### React DevTools
Profile components for performance issues.

### Network Tab
Check API requests/responses.

## Weekly Sync

**Friday 3 PM - 3:20 PM**

Topics:
- What shipped this week
- What's next sprint
- Any blockers or dependencies
- Code review feedback

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Zod Validation](https://zod.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Axios Documentation](https://axios-http.com/docs/intro)

## Quick Help

**"How do I add a new form?"**
1. Create schema in `utils/validation/schemas.ts`
2. Create component in `src/components/feature/FormName.tsx`
3. Use `validate()` on submit
4. Display errors with `aria-describedby`

**"How do I handle API errors?"**
1. Catch response error in component
2. Use `ErrorState` component
3. Provide retry mechanism
4. Announce to screen reader

**"How do I ensure mobile works?"**
1. Use semantic HTML
2. Mobile-first CSS
3. Test on actual devices
4. Use responsive breakpoints

---

## Contact

**Lead:** Abhigyan (Flow & Usability Owner)
**Partner:** Ritvik (Brand & UI Owner)

**Need help?** Check the docs or ask during weekly sync!
