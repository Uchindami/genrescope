-- Secure beta_requests policy to enforce pending status on insert
DROP POLICY IF EXISTS "Anyone can request beta access" ON public.beta_requests;

CREATE POLICY "Anyone can request beta access"
    ON public.beta_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        -- Can only insert if status is pending
        status = 'pending'
    );
