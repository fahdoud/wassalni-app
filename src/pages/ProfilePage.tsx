
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { ChevronLeft, User, Phone, Camera, Star, MessageSquare } from "lucide-react";
import { uploadProfileImage, getUserFeedbacks } from "@/services/rides/profileService";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientText from "@/components/ui-components/GradientText";

const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(8, { message: "Phone number must be valid" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      phone: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      
      if (!data.user) {
        navigate("/passenger-signin");
        return;
      }
      
      setUserId(data.user.id);
      
      // Fetch profile data
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        return;
      }
      
      if (profile) {
        form.reset({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
        });
        
        if (profile.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
        
        // Fetch user feedbacks
        const feedbackData = await getUserFeedbacks(data.user.id);
        setFeedbacks(feedbackData);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!userId) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      
      if (error) throw error;
      
      toast.success(t('profile.updateSuccess'));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t('profile.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !userId) return;
    
    const file = e.target.files[0];
    
    // Check file size and type
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }
    
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '')) {
      toast.error("Only image files are allowed (JPG, PNG, GIF)");
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload the image
      const imageUrl = await uploadProfileImage(file, userId);
      
      if (imageUrl) {
        setAvatarUrl(imageUrl);
        toast.success("Profile picture updated successfully");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-24 px-4">
        <Card className="max-w-md mx-auto shadow-lg animate-pulse">
          <CardHeader className="text-center">
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const initials = form.watch("full_name")
    ? form.watch("full_name")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-wassalni-green hover:text-wassalni-green/80 transition-colors mb-6"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              <GradientText>My Profile</GradientText>
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage your personal information and feedback
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="feedback">Feedback ({feedbacks.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="shadow-xl border-wassalni-green/10 overflow-hidden">
                <div className="h-16 bg-gradient-to-r from-wassalni-green to-wassalni-blue opacity-90"></div>
                <CardHeader className="space-y-1 -mt-8 relative pb-0">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-background shadow-xl cursor-pointer" onClick={handleAvatarClick}>
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={form.watch("full_name")} />
                        ) : null}
                        <AvatarFallback className="bg-wassalni-green text-white text-2xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className="absolute bottom-0 right-0 bg-wassalni-green text-white rounded-full p-1 shadow-lg cursor-pointer"
                        onClick={handleAvatarClick}
                      >
                        <Camera className="h-4 w-4" />
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-center mt-4">
                    {form.watch("full_name") || "User Profile"}
                  </CardTitle>
                  <CardDescription className="text-center">
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4 text-wassalni-green" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                {...field} 
                                className="border-wassalni-green/30 focus-visible:ring-wassalni-green/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-wassalni-green" />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your phone number" 
                                {...field} 
                                className="border-wassalni-green/30 focus-visible:ring-wassalni-green/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-wassalni-green hover:bg-wassalni-green/90" 
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                
                <CardFooter className="flex justify-center border-t pt-6">
                  <Link to="/">
                    <Button variant="outline" className="text-wassalni-green border-wassalni-green/30 hover:bg-wassalni-green/10 hover:text-wassalni-green">
                      Return to Home
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback From Others</CardTitle>
                  <CardDescription>
                    See what other users think about your services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {feedbacks.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">You haven't received any feedback yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedbacks.map((feedback) => (
                        <Card key={feedback.id} className="bg-muted/30">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {feedback.profiles?.full_name ? 
                                    feedback.profiles.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 
                                    'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                  <div>
                                    <p className="font-medium">
                                      {feedback.profiles?.full_name || "Anonymous User"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(feedback.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center text-yellow-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1">{feedback.rating}</span>
                                  </div>
                                </div>
                                <p className="text-sm">{feedback.comment || "No comment provided."}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
