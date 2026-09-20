import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wktlvivqkenlqygzrkhs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdGx2aXZxa2VubHF5Z3pya2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3OTg4MjMsImV4cCI6MjEwNDM3NDgyM30.ZuJfuBPATClQT2hkLuzA1UHm2gRP_r21UN4zqHBou1s';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. Check your .env file or Vercel environment variables.'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

