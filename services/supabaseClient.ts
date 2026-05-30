
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://olzqkvwtvgjqdslerimd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9senFrdnd0dmdqcWRzbGVyaW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjMzNTMsImV4cCI6MjA4MTE5OTM1M30.3ExM20gTflApGu6dBJRXpHeRwfSQEyl2RVO7tR-8_kc';

export const supabase = createClient(supabaseUrl, supabaseKey);
