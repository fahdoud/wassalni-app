
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FeedbackInput {
  toUserId: string;
  rating: number;
  comment?: string;
  tripId?: string;
}

export const submitFeedback = async (feedback: FeedbackInput) => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error("You must be logged in to submit feedback");
    }

    const fromUserId = userData.user.id;

    // Check if the target user exists (especially for admin user)
    const { data: userExists } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", feedback.toUserId)
      .single();

    if (!userExists) {
      // Create a system feedback entry without using foreign key
      const { data, error } = await supabase
        .from("feedback")
        .insert({
          from_user_id: fromUserId,
          to_user_id: null, // Set to null to avoid foreign key constraint
          rating: feedback.rating,
          comment: feedback.comment,
          trip_id: feedback.tripId,
        })
        .select();

      if (error) {
        console.error("Error submitting feedback:", error);
        throw error;
      }

      return data[0];
    }

    // Normal feedback submission with valid to_user_id
    const { data, error } = await supabase
      .from("feedback")
      .insert({
        from_user_id: fromUserId,
        to_user_id: feedback.toUserId,
        rating: feedback.rating,
        comment: feedback.comment,
        trip_id: feedback.tripId,
      })
      .select();

    if (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }

    return data[0];
  } catch (error: any) {
    console.error("Error in submitFeedback:", error);
    toast.error(error.message || "Failed to submit feedback");
    throw error;
  }
};

export const getUserFeedback = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select(`
        *,
        from_profiles:profiles!from_user_id(full_name),
        to_profiles:profiles!to_user_id(full_name),
        trips(id, origin, destination, departure_time)
      `)
      .eq("to_user_id", userId);

    if (error) {
      console.error("Error retrieving feedback:", error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error("Error in getUserFeedback:", error);
    toast.error(error.message || "Failed to retrieve feedback");
    throw error;
  }
};
