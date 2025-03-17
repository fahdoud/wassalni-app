
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import twilio from "npm:twilio";

// Get environment variables
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Initialize Twilio and Supabase
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
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
    const { userId, phone, message, type = "verification" } = await req.json();

    if (!userId || !phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${type} SMS request for user ${userId} to phone ${phone}`);

    // For verification type
    if (type === "verification") {
      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Calculate expiration (10 minutes from now)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      // Store verification data in database
      const { error: dbError } = await supabase
        .from("phone_verification")
        .upsert({
          id: userId,
          phone: phone,
          verified: false,
          verification_code: verificationCode,
          code_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to store verification data");
      }

      // Send SMS using Twilio
      const smsMessage = await twilioClient.messages.create({
        body: `Your Wassalni verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
        from: twilioPhoneNumber,
        to: phone,
      });

      if (!smsMessage.sid) {
        throw new Error("Failed to send SMS");
      }

      console.log(`Verification SMS sent successfully to ${phone}, SID: ${smsMessage.sid}`);
      
      return new Response(
        JSON.stringify({ success: true, message: "Verification SMS sent" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } 
    // For notification type
    else if (type === "notification") {
      if (!message) {
        return new Response(
          JSON.stringify({ error: "Missing message content" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Sending notification SMS to ${phone}: "${message}"`);

      // Send notification SMS using Twilio
      const smsMessage = await twilioClient.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: phone,
      });

      if (!smsMessage.sid) {
        throw new Error("Failed to send notification SMS");
      }

      console.log(`Notification SMS sent successfully to ${phone}, SID: ${smsMessage.sid}`);

      // Log the notification in the database if needed
      const { error: logError } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          phone: phone,
          message: message,
          sent_at: new Date().toISOString(),
          type: "sms"
        });

      if (logError) {
        console.error("Error logging notification:", logError);
        // Continue even if logging fails
      }

      return new Response(
        JSON.stringify({ success: true, message: "Notification SMS sent" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid message type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in send-sms-verification function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
