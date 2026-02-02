import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Address Schema
export const addressSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z
    .string()
    .regex(/^[0-9\-\+\(\)]{7,}$/, 'Invalid phone number'),
  streetAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^[0-9\-]{4,}$/, 'Invalid postal code'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().optional(),
});

// Checkout Schema
export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  sameAsShipping: z.boolean().default(true),
  paymentMethod: z.enum(['credit-card', 'debit-card', 'paypal', 'bank-transfer']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVV: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
