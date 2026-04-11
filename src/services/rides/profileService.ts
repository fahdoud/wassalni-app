
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getUserRole = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    if (error) return 'passenger';
    return data?.role || 'passenger';
  } catch {
    return 'passenger';
  }
};

export const uploadProfileImage = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage.from('profiles').upload(fileName, file);
    if (uploadError) throw new Error(uploadError.message);
    
    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(fileName);
    
    // Update profiles table
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId);
    
    toast.success("Profile image updated successfully");
    return publicUrl;
  } catch (error: any) {
    console.error("Failed to upload profile image:", error);
    toast.error(error.message || "Failed to upload profile image");
    return null;
  }
};

export const getUserFeedbacks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('id, note, commentaire, created_at, from_user_id, trip_id')
      .eq('to_driver_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(r => ({
      id: r.id,
      rating: r.note,
      comment: r.commentaire,
      created_at: r.created_at,
      profiles: { full_name: null }
    }));
  } catch {
    return [];
  }
};
