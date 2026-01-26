import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const otpSchema = z.string().regex(/^\d{6}$/, 'OTP must be 6 digits');

export const authModeSchema = z.enum(['login', 'signup']);

export const emailAuthSchema = z.object({
  email: emailSchema,
  mode: authModeSchema,
});

export const otpVerificationSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export type EmailAuthInput = z.infer<typeof emailAuthSchema>;
export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;
