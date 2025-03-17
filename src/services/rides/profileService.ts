
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Determine user type (driver or passenger)
export const getUserRole = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching user role:", error);
      return 'passenger'; // Default to passenger
    }
    
    return data?.role || 'passenger';
  } catch (error) {
    console.error("Failed to get user role:", error);
    return 'passenger';
  }
};

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
    
    // Get user role
    const role = await getUserRole(userId);
    
    // Update the appropriate profile table
    if (role === 'driver') {
      const { error: driverUpdateError } = await supabase
        .from('drivers')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId);
        
      if (driverUpdateError) {
        console.error("Error updating driver profile:", driverUpdateError);
      }
    } else {
      const { error: passengerUpdateError } = await supabase
        .from('passengers')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId);
        
      if (passengerUpdateError) {
        console.error("Error updating passenger profile:", passengerUpdateError);
      }
    }
    
    // Also update the legacy profiles table
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);
      
    if (profileUpdateError) {
      console.error("Error updating legacy profile:", profileUpdateError);
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
