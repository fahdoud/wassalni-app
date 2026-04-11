
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FeedbackInput {
  toUserId: string | null;
  rating: number;
  comment?: string;
  tripId?: string;
  feedbackType?: string;
}

export const submitFeedback = async (feedback: FeedbackInput) => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("You must be logged in to submit feedback");

    const { data, error } = await supabase
      .from("feedbacks")
      .insert({
        user_id: userData.user.id,
        message: feedback.comment || '',
        type: feedback.feedbackType || 'general',
        statut: 'open'
      })
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error: any) {
    console.error("Error in submitFeedback:", error);
    toast.error(error.message || "Failed to submit feedback");
    throw error;
  }
};

export const getUserFeedback = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("feedbacks")
      .select('*')
      .eq("user_id", userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error in getUserFeedback:", error);
    toast.error(error.message || "Failed to retrieve feedback");
    throw error;
  }
};
