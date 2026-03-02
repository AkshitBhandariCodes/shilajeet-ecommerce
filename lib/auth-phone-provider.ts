/**
 * Custom Phone Authentication Utilities
 * This module provides helpers for phone-based authentication
 */

import type { User } from 'next-auth';

export interface PhoneAuthUser extends User {
  phone?: string;
  phoneVerified?: boolean;
  authMethod?: 'phone' | 'email';
}

/**
 * Helper function to create a phone-based session
 * Used after OTP verification
 */
export async function createPhoneSession(userId: string, phoneNumber: string) {
  return {
    user: {
      id: userId,
      phone: phoneNumber,
      authMethod: 'phone',
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
  };
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  return phone;
}
