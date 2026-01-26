# Development Guidelines

## Code Style

### Naming Conventions

- **Components**: PascalCase (`CartPage.tsx`, `LoginForm.tsx`)
- **Hooks**: camelCase, prefix with `use` (`useCartStore.ts`)
- **Types/Interfaces**: PascalCase (`CartItem`, `AddressInput`)
- **Functions**: camelCase (`handleSubmit`, `validateEmail`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: Match export name

### TypeScript

- Always define prop types as interfaces
- Use `React.FC<Props>` for functional components
- Export types/interfaces for external use
- Avoid `any` type

```typescript
// Good
interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {};

// Bad
export const LoginForm = ({ onSuccess }: any) => {};
```

## Component Structure

```typescript
import React from 'react';
import { useStore } from '@context/store';
import { validate } from '@utils/validation/validator';
import { ErrorState } from '@components/shared/errors/ErrorState';

interface ComponentProps {
  title: string;
  onSuccess?: () => void;
}

export const Component: React.FC<ComponentProps> = ({ title, onSuccess }) => {
  // 1. Hooks
  const store = useStore();
  const [state, setState] = React.useState('');

  // 2. Effects
  React.useEffect(() => {
    // setup
  }, []);

  // 3. Handlers
  const handleClick = () => {
    // handle
  };

  // 4. Render
  return <div>{title}</div>;
};
```

## Error Handling Pattern

```typescript
// Always handle API errors
const handleSubmit = async () => {
  try {
    const response = await api.call();
    
    if (response.success) {
      // Success
    } else {
      // API error
      setError(response.error?.message || 'Failed');
    }
  } catch (err) {
    // Network/unexpected error
    setError('Something went wrong');
  }
};
```

## Form Validation Pattern

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const validation = validate(schema, formData);
  
  if (!validation.success) {
    setErrors(validation.errors || {});
    return; // Stop submission
  }

  // Proceed with validated data
  submitForm(validation.data!);
};
```

## Accessibility Checklist

Before submitting a component:

- [ ] All form inputs have labels
- [ ] Buttons are keyboard accessible
- [ ] Color is not the only indicator
- [ ] Focus states are visible
- [ ] Error messages use `aria-describedby`
- [ ] Loading states use `aria-busy`
- [ ] Modals have focus trap
- [ ] Semantic HTML is used
- [ ] Text has sufficient color contrast
- [ ] Touch targets are >= 44x44px

## Performance Tips

1. **Memoize expensive components**
   ```typescript
   export const MemoizedComponent = React.memo(Component);
   ```

2. **Use `useCallback` for event handlers**
   ```typescript
   const handleClick = React.useCallback(() => {
     // handler
   }, [dependency]);
   ```

3. **Code split routes**
   ```typescript
   const Cart = React.lazy(() => import('./Cart'));
   ```

4. **Avoid rendering in maps**
   ```typescript
   // Bad: recreates function on each render
   {items.map((i) => <Item onClick={() => handle(i)} />)}
   
   // Good
   const handleItem = (item) => { /* */ };
   {items.map((i) => <Item onClick={() => handleItem(i)} />)}
   ```

## Testing Guidelines

### Test Structure
```typescript
describe('ComponentName', () => {
  it('should do something', () => {
    // Arrange
    const props = { };
    
    // Act
    const { getByRole } = render(<Component {...props} />);
    
    // Assert
    expect(getByRole('button')).toBeInTheDocument();
  });
});
```

### What to Test
- ✅ User interactions
- ✅ Form validation
- ✅ State changes
- ✅ Error handling
- ✅ API calls (mocked)
- ❌ Implementation details
- ❌ Library internals

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
```
feat(cart): add item quantity selector

fix(checkout): handle payment validation errors

docs(readme): update setup instructions

perf(api): debounce address lookup
```

## Code Review Checklist

Reviewers should check:

- [ ] TypeScript types are correct
- [ ] No console errors/warnings
- [ ] Accessibility standards met
- [ ] No hardcoded API URLs
- [ ] Error handling is complete
- [ ] Comments explain "why", not "what"
- [ ] No unused imports/variables
- [ ] Tests cover happy & sad paths
- [ ] Performance optimizations where needed
- [ ] Security considerations (auth, validation)

## Environment Variables

Create `.env.local`:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_ENV=development
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Common Patterns

### Loading with Suspense
```typescript
<Suspense fallback={<LoadingState />}>
  <Component />
</Suspense>
```

### Error Boundary Wrapper
```typescript
<ErrorBoundary fallback={(error, retry) => (
  <ErrorState message={error.message} retry={retry} />
)}>
  <Component />
</ErrorBoundary>
```

### Conditional Rendering
```typescript
// Good
{isLoading && <LoadingState />}
{error && <ErrorState message={error} />}
{!isLoading && !error && <Content />}

// Avoid
{isLoading ? <LoadingState /> : error ? <ErrorState /> : <Content />}
```

## Browser Support

Target modern browsers:
- Chrome/Edge: latest 2 versions
- Firefox: latest 2 versions
- Safari: latest 2 versions
- Mobile: iOS 12+, Android 8+

## Documentation

Every exported function/component should have JSDoc:

```typescript
/**
 * Validates an email address format
 * @param email - The email to validate
 * @returns true if valid, false otherwise
 * @example
 * const isValid = validateEmail('user@example.com');
 */
export const validateEmail = (email: string): boolean => {
  // implementation
};
```

---

**Follow these guidelines to keep the codebase clean, maintainable, and performant!**
