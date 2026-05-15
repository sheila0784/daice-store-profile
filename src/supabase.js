import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://YOUR_PROJECT.supabase.co'
// const supabaseAnonKey = 'YOUR_ANON_KEY'

// const supabaseUrl = 'https://htvnhsewgejfrcdykhmg.supabase.co'
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dm5oc2V3Z2VqZnJjZHlraG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3ODE5NTcsImV4cCI6MjA5MTM1Nzk1N30.4yvdJ9F_7nlhvDIy8yNGUVRXasXhhNjKLXtr1Y8IFIA'


const supabaseUrl = 'https://dfhppiipdqaennapugrw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaHBwaWlwZHFhZW5uYXB1Z3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjgyNjAsImV4cCI6MjA4Nzc0NDI2MH0.KizLlgj8-ompZM6lldBQtPIeQb8mvdtJuhOhJ3cIeAI'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)