import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  // FIX: min 8 chars on login too — consistent with what signup enforces
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    // FIX: enforce 8 chars + at least one uppercase + one digit
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Address Schema
export const addressSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2, 'Full name is required').max(100, 'Name too long'),
  phone: z.string().regex(/^\+?[\d\s\-().]{7,20}$/, 'Invalid phone number'),
  streetAddress: z.string().min(5, 'Street address is required').max(200),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  // FIX: allow alphanumeric postal codes (e.g. UK: SW1A 1AA, India: 110001)
  postalCode: z.string().regex(/^[A-Z0-9][A-Z0-9\s\-]{2,9}$/i, 'Invalid postal code'),
  country: z.string().min(2, 'Country is required').max(100),
  isDefault: z.boolean().optional().default(false),
});

// Checkout Schema
export const checkoutSchema = z
  .object({
    shippingAddress: addressSchema,
    billingAddress: addressSchema.optional(),
    sameAsShipping: z.boolean().default(true),
    paymentMethod: z.enum(['credit-card', 'debit-card', 'paypal', 'bank-transfer']),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCVV: z.string().optional(),
  })
  // FIX: card fields are required and validated only when a card payment method is chosen
  .superRefine((data, ctx) => {
    const isCard = data.paymentMethod === 'credit-card' || data.paymentMethod === 'debit-card';
    if (!isCard) return;

    const rawCard = (data.cardNumber ?? '').replace(/\s/g, '');
    if (!rawCard || !/^\d{13,19}$/.test(rawCard)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Valid card number is required (13–19 digits)', path: ['cardNumber'] });
    }
    if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Valid expiry required (MM/YY)', path: ['cardExpiry'] });
    }
    if (!data.cardCVV || !/^\d{3,4}$/.test(data.cardCVV)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Valid CVV required (3–4 digits)', path: ['cardCVV'] });
    }
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
