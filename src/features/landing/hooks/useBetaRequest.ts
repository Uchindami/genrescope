import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const emailSchema = z.string().email("Please enter a valid email address.");

export interface UseBetaRequestResult {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  submitRequest: (email: string) => Promise<void>;
  reset: () => void;
}

export const useBetaRequest = (): UseBetaRequestResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitRequest = async (email: string) => {
    setIsLoading(true);
    setError(null);

    // 1. Validation
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      // 2. Database Insert
      const { error: dbError } = await supabase.from("beta_requests").insert({
        email: email.trim().toLowerCase(),
        status: "pending", // Explicitly set pending, enforced by RLS
      });

      if (dbError) {
        // Handle duplicate email (assuming unique constraint on email)
        if (dbError.code === "23505") {
          // 3. User Experience for Duplicates
          // Treat as success to avoid leaking registration status or confusing users
          // But logically it's "already done"
          setIsSuccess(true);
          return;
        }
        throw dbError;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Beta request failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setError(null);
  };

  return { isLoading, isSuccess, error, submitRequest, reset };
};
