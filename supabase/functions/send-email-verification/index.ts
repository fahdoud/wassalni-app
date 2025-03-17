
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "npm:resend@2.0.0";

// Get environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize Resend and Supabase
const resend = new Resend(resendApiKey);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { userId, email, redirectUrl, type = "verification", fullName = "" } = await req.json();

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a secure random token if it's a verification email
    let token = "";
    let hashedToken = "";
    let verificationUrl = "";
    let emailTemplate = "";
    let emailSubject = "";

    if (type === "verification") {
      token = crypto.randomUUID();
      hashedToken = await hashToken(token);
      
      // Calculate expiration (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Store verification data in database
      const { error: dbError } = await supabase
        .from("email_verification")
        .upsert({
          id: userId,
          email: email,
          verified: false,
          verification_token: hashedToken,
          token_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to store verification data");
      }

      // Create verification URL (application will handle the verification)
      const baseUrl = redirectUrl || "https://wassalni.app";
      verificationUrl = `${baseUrl}/verify-email?token=${token}&userId=${userId}`;
      
      emailSubject = "Verify your email address";
      emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Wassalni Email Verification</h2>
          <p>Thank you for signing up with Wassalni. Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email Address</a>
          <p>Or copy and paste the following URL into your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not sign up for Wassalni, please ignore this email.</p>
          <p>Thank you,<br>The Wassalni Team</p>
        </div>
      `;
    } else if (type === "welcome") {
      // Welcome email doesn't need verification token
      emailSubject = "Welcome to Wassalni";
      emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Welcome to Wassalni!</h2>
          <p>Hello ${fullName || "there"},</p>
          <p>Thank you for joining Wassalni! We're excited to have you as part of our community.</p>
          <p>With Wassalni, you can:</p>
          <ul>
            <li>Find rides easily and efficiently</li>
            <li>Connect with trusted drivers in your area</li>
            <li>Travel safely and comfortably</li>
            <li>Save money on your transportation needs</li>
          </ul>
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          <p>Happy travels!<br>The Wassalni Team</p>
        </div>
      `;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid email type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email using Resend
    const { data, error: emailError } = await resend.emails.send({
      from: "Wassalni <noreply@wassalni.app>",
      to: [email],
      subject: emailSubject,
      html: emailTemplate,
    });

    if (emailError) {
      console.error("Email sending error:", emailError);
      throw new Error("Failed to send email");
    }

    // Log success for debugging
    console.log(`Email sent successfully: ${type} email to ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: `${type === "verification" ? "Verification" : "Welcome"} email sent` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-email-verification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Helper function to hash the token
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
