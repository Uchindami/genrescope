import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!(supabaseUrl && supabasePublishableKey)) {
  console.warn(
    "Supabase environment variables not configured. Beta request form will not work."
  );
}

export const supabase = createClient(
  supabaseUrl || "",
  supabasePublishableKey || ""
);

export type BetaRequestStatus = "pending" | "approved" | "rejected";

export interface BetaRequest {
  id: string;
  email: string;
  status: BetaRequestStatus;
  created_at: string;
  updated_at: string;
}
