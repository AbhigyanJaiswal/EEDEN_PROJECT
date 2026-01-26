# API Integration Guide

## Overview

The frontend communicates with backend through a centralized API client with:
- Automatic error handling
- Request/response interceptors
- Token management
- Type-safe responses

## Client Setup

Located in `src/utils/api/client.ts`:

```typescript
import { apiClient } from '@utils/api/client';

const response = await apiClient.get<ResponseType>('/endpoint');
```

## API Endpoints

All endpoints are in `src/utils/api/endpoints.ts`:

### Authentication

```typescript
import { authApi } from '@utils/api/endpoints';

// Login
const response = await authApi.login(email, password);

// Signup
const response = await authApi.signup({
  email,
  password,
  firstName,
  lastName,
});

// Logout
await authApi.logout();

// Get Profile
const response = await authApi.getProfile();

// Update Profile
const response = await authApi.updateProfile(userData);
```

### Cart Operations

```typescript
import { cartApi } from '@utils/api/endpoints';

// Get Cart
const response = await cartApi.getCart();

// Add Item
await cartApi.addItem(productId, quantity);

// Update Item
await cartApi.updateItem(itemId, newQuantity);

// Remove Item
await cartApi.removeItem(itemId);

// Clear Cart
await cartApi.clearCart();
```

### Orders

```typescript
import { orderApi } from '@utils/api/endpoints';

// Create Order
const response = await orderApi.createOrder(orderData);

// Get Single Order
const response = await orderApi.getOrder(orderId);

// Get All Orders
const response = await orderApi.getOrders();

// Update Order Status
await orderApi.updateOrderStatus(orderId, newStatus);
```

### Addresses

```typescript
import { addressApi } from '@utils/api/endpoints';

// Get All Addresses
const response = await addressApi.getAddresses();

// Add Address
const response = await addressApi.addAddress(addressData);

// Update Address
const response = await addressApi.updateAddress(addressId, updatedData);

// Delete Address
await addressApi.deleteAddress(addressId);

// Set as Default
await addressApi.setDefault(addressId);
```

## Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;        // Only present if success is true
  error?: {
    message: string;
    code: string;
  };              // Only present if success is false
}
```

## Usage Pattern

```typescript
const response = await authApi.login(email, password);

if (response.success && response.data) {
  // Handle success
  const { token, user } = response.data;
} else {
  // Handle error
  const errorMessage = response.error?.message;
  const errorCode = response.error?.code;
}
```

## Error Handling

Errors are automatically caught and formatted:

```typescript
try {
  const response = await apiClient.post('/endpoint', data);
  
  if (!response.success) {
    console.error(response.error?.message); // "Invalid credentials"
  }
} catch (error) {
  // Network error
}
```

### HTTP Status Codes

- `401` - Unauthorized → Auto logout + redirect to /login
- `400` - Bad Request → Display validation errors
- `404` - Not Found → Display 404 page
- `500` - Server Error → Display error state

## Authentication Flow

Token is automatically managed:

```typescript
// 1. Login stores token
await authApi.login(email, password);
// Token saved to localStorage

// 2. Token auto-added to requests
// All subsequent requests include Authorization header

// 3. Logout removes token
await authApi.logout();
// Token cleared from localStorage
```

## Interceptors

### Request Interceptor
Adds auth token if available:

```typescript
// Automatically done by client
// No action needed in components
```

### Response Interceptor
Handles 401 errors:

```typescript
// If 401 is received:
// 1. Logout user
// 2. Clear localStorage
// 3. Redirect to /login
```

## Adding New Endpoints

### Step 1: Create Endpoint Function

```typescript
// src/utils/api/endpoints.ts

export const newFeatureApi = {
  fetchData: () => apiClient.get<DataType>('/new-feature'),
  
  createItem: (data: ItemInput) => 
    apiClient.post<ItemOutput>('/new-feature/items', data),
  
  updateItem: (id: string, data: ItemInput) =>
    apiClient.put<ItemOutput>(`/new-feature/items/${id}`, data),
  
  deleteItem: (id: string) =>
    apiClient.delete<void>(`/new-feature/items/${id}`),
};
```

### Step 2: Use in Component

```typescript
import { newFeatureApi } from '@utils/api/endpoints';

const handleFetch = async () => {
  const response = await newFeatureApi.fetchData();
  
  if (response.success) {
    // Handle data
  } else {
    // Handle error
  }
};
```

## Best Practices

### 1. Always Check Success
```typescript
// Good
if (response.success && response.data) {
  // Use response.data
}

// Bad
const data = response.data; // Could be undefined
```

### 2. Handle Both Success and Error
```typescript
// Good
const response = await api.call();
if (response.success) {
  // success
} else {
  setError(response.error?.message);
}

// Bad - only checking success
if (response.success) {
  // success
}
```

### 3. Type Your Responses
```typescript
// Good
const response = await authApi.login(email, password);
if (response.success && response.data) {
  const { token, user } = response.data; // Typed
}

// Bad
const data = response.data as any; // Loses types
```

### 4. Load State Management
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleAction = async () => {
  setIsLoading(true);
  
  try {
    const response = await api.call();
    // handle response
  } finally {
    setIsLoading(false);
  }
};
```

### 5. Error Boundary Wrapper
```typescript
{error && (
  <ErrorState 
    message={error} 
    retry={handleAction}
  />
)}
```

## Debugging API Calls

### Browser DevTools Network Tab
1. Open DevTools
2. Go to Network tab
3. Perform action
4. Check request/response headers and body

### Logging Responses
```typescript
const response = await api.call();
console.log('API Response:', response);
```

### Check Auth Token
```javascript
// In console
localStorage.getItem('authToken')
```

## Testing API Calls

Mock API responses in tests:

```typescript
vi.mock('@utils/api/endpoints', () => ({
  authApi: {
    login: vi.fn().mockResolvedValue({
      success: true,
      data: { token: 'test-token', user: { id: '1' } },
    }),
  },
}));
```

## Performance Optimization

### Request Debouncing
```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query) => {
  const response = await api.search(query);
}, 500);
```

### Request Cancellation
```typescript
const controller = new AbortController();

// Make request with abort signal
apiClient.get('/endpoint', { signal: controller.signal });

// Cancel if needed
controller.abort();
```

### Caching
```typescript
const useAddresses = () => {
  const [data, setData] = useState(null);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    if (cached) return;
    
    fetchAddresses().then(setData);
    setCached(true);
  }, [cached]);

  return data;
};
```

## Common Issues

### Issue: 401 on every request
**Solution:** Token might not be saved properly. Check localStorage.

### Issue: CORS errors
**Solution:** Backend needs CORS headers for frontend origin.

### Issue: Network timeout
**Solution:** Check API server is running. Timeout is set to 30s.

### Issue: Data not updating
**Solution:** Ensure response.success is true before using response.data.

---

**Questions?** Check the README or ask during weekly sync!
