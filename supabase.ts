import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hayjimhtghgkonfmevpt.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhheWppbWh0Z2hna29uZm1ldnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDc4NTIsImV4cCI6MjA5NDYyMzg1Mn0.OSaG122UBBNXvuvfnmueeYYYo8zrseb5Jgda5XRHn_g";

  export const supabase = createClient(
    supabaseUrl,
      supabaseKey
      );