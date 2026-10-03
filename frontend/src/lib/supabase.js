import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cjpwjloueqqdykocodmr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcHdqbG91ZXFxZHlrb2NvZG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MzQwOTksImV4cCI6MjEwNjQxMDA5OX0.eIuD49VrbsaXTvmbJ1LwrYsOr23HXdTo9DuUw86R8q4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);