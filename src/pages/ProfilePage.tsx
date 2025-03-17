
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { ChevronLeft, User, Phone } from "lucide-react";

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

const profileFormSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(8, { message: "Phone number must be valid" }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
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
    <div className="container mx-auto py-12 px-4 min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Link 
        to="/" 
        className="inline-flex items-center text-wassalni-green hover:text-wassalni-green/80 transition-colors mb-6"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Home
      </Link>
      
      <Card className="max-w-md mx-auto shadow-xl border-wassalni-green/10 overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-wassalni-green to-wassalni-blue opacity-90"></div>
        <CardHeader className="space-y-1 -mt-8 relative pb-0">
          <div className="flex justify-center">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarFallback className="bg-wassalni-green text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl text-center mt-4">
            My Profile
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
    </div>
  );
};

export default ProfilePage;
