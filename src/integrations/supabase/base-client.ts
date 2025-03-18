
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supabase connection settings
export const SUPABASE_URL = "https://rayrfitltjfymcngveiq.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJheXJmaXRsdGpmeW1jbmd2ZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTk4NDMsImV4cCI6MjA1Nzc5NTg0M30.GUzaIk0WUy0N6JZjfA-fMJiYsmhENpc-N87babqf8_w";

// Create the base Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
