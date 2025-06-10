
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wbdzzqugyjomkrvukeuf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZHp6cXVneWpvbWtydnVrZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NTk4MzUsImV4cCI6MjA2NTEzNTgzNX0.2shLruAPPMf0Ygxw0DVW59vBj_i_ttJ8690le7GFBPQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
