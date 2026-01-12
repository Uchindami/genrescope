import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const GENRESCOPE_URL =
  Deno.env.get("GENRESCOPE_URL") || "https://genrescope.app";

interface BetaRequestRecord {
  id: string;
  email: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface WebhookPayload {
  record: BetaRequestRecord;
  old_record: BetaRequestRecord;
}

Deno.serve(async (req) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload: WebhookPayload = await req.json();
    const { record, old_record } = payload;

    // Validate the status change
    if (record.status !== "approved") {
      return new Response(
        JSON.stringify({ message: "Status is not approved, skipping email" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (old_record.status === "approved") {
      return new Response(
        JSON.stringify({ message: "Already approved, skipping email" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send the approval email
    const { data, error } = await resend.emails.send({
      from: "Genrescope <noreply@genrescope.app>",
      to: [record.email],
      subject: "🎉 You're in! Your Genrescope Beta Access is Ready",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Genrescope Beta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 480px; width: 100%; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                🎵 Genrescope
              </h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #ffffff; text-align: center;">
                You're In! 🎉
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #a0a0a0; text-align: center;">
                Your beta access has been approved. You can now log in with your Spotify account and discover your unique music DNA.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 8px 0;">
                    <a href="${GENRESCOPE_URL}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%); color: #000000; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 50px;">
                      Start Exploring →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.5; color: #666666; text-align: center;">
                If you have any questions or feedback, just reply to this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 32px;">
              <p style="margin: 0; font-size: 12px; color: #666666;">
                © ${new Date().getFullYear()} Genrescope. Made with 💚 for music lovers.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Email sent successfully:", data);
    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
