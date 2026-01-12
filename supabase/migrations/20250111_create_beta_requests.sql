-- Create beta_requests table for storing access requests
CREATE TABLE IF NOT EXISTS public.beta_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS beta_requests_email_idx ON public.beta_requests(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS beta_requests_status_idx ON public.beta_requests(status);

-- Enable Row Level Security
ALTER TABLE public.beta_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public form submission)
CREATE POLICY "Anyone can request beta access"
    ON public.beta_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Only service_role can select/update/delete (admin operations)
CREATE POLICY "Service role has full access"
    ON public.beta_requests
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on row change
CREATE TRIGGER on_beta_requests_updated
    BEFORE UPDATE ON public.beta_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.beta_requests IS 'Stores beta access requests from users. Status is managed by admins via Supabase dashboard.';
