-- Create trigger function to call Edge Function when status changes to 'approved'
CREATE OR REPLACE FUNCTION public.notify_approved_beta_user()
RETURNS TRIGGER AS $$
DECLARE
    edge_function_url TEXT;
BEGIN
    -- Only trigger when status changes to 'approved'
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        -- Build the Edge Function URL dynamically using the Supabase project reference
        -- The actual URL will be: https://<project-ref>.supabase.co/functions/v1/notify-beta-user
        edge_function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-beta-user';
        
        -- Call the Edge Function via pg_net extension
        PERFORM net.http_post(
            url := edge_function_url,
            body := jsonb_build_object(
                'record', jsonb_build_object(
                    'id', NEW.id,
                    'email', NEW.email,
                    'status', NEW.status,
                    'created_at', NEW.created_at,
                    'updated_at', NEW.updated_at
                ),
                'old_record', jsonb_build_object(
                    'id', OLD.id,
                    'email', OLD.email,
                    'status', OLD.status,
                    'created_at', OLD.created_at,
                    'updated_at', OLD.updated_at
                )
            ),
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after status update
CREATE TRIGGER on_beta_request_approved
    AFTER UPDATE OF status ON public.beta_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_approved_beta_user();

-- Add comment for documentation
COMMENT ON FUNCTION public.notify_approved_beta_user() IS 'Calls the notify-beta-user Edge Function when a beta request is approved.';
