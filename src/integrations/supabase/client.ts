
// This file re-exports all Supabase functionality for backward compatibility
import { supabase } from './base-client';
import { sendEmailVerification, sendWelcomeEmail, checkEmailVerified } from './email-services';
import { sendSMSVerification, sendSMSNotification, checkPhoneVerified } from './sms-services';
import type { Database } from './database-types';

// Re-export everything for backward compatibility
export {
  supabase,
  sendEmailVerification,
  sendWelcomeEmail,
  checkEmailVerified,
  sendSMSVerification,
  sendSMSNotification,
  checkPhoneVerified,
  type Database
};
