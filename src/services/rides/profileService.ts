
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Upload a profile image
export const uploadProfileImage = async (file: File, userId: string) => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file to storage
    const { error: uploadError } = await supabase
      .storage
      .from('profiles')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw new Error(uploadError.message);
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('profiles')
      .getPublicUrl(filePath);
      
    // Update the user's profile with the image URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw new Error(updateError.message);
    }
    
    toast.success("Profile image updated successfully");
    return publicUrl;
  } catch (error: any) {
    console.error("Failed to upload profile image:", error);
    toast.error(error.message || "Failed to upload profile image");
    return null;
  }
};

// Get the user's feedback
export const getUserFeedbacks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select(`
        id,
        rating,
        comment,
        created_at,
        from_user_id,
        trip_id,
        profiles:from_user_id(full_name)
      `)
      .eq('to_user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching user feedbacks:", error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error("Failed to get user feedbacks:", error);
    return [];
  }
};
