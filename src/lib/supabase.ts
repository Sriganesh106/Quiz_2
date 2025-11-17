import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://axoqioctnzpeqwmvkswd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4b3Fpb2N0bnpwZXF3bXZrc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NzAxMDIsImV4cCI6MjA3ODU0NjEwMn0.l9ahjJm83rSymn_N3NEPA-dOzMobQEYFypXnasSW1ec';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});