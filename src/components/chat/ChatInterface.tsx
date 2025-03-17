
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Message {
  id: string;
  ride_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

interface ChatInterfaceProps {
  rideId: string;
  userId: string;
  userName: string;
}

const ChatInterface = ({ rideId, userId, userName }: ChatInterfaceProps) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('ride_messages')
          .select('*')
          .eq('ride_id', rideId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`ride_chat_${rideId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'ride_messages',
          filter: `ride_id=eq.${rideId}`
        }, 
        (payload) => {
          // @ts-ignore - payload.new is the new record
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      const { error } = await supabase
        .from('ride_messages')
        .insert({
          ride_id: rideId,
          sender_id: userId,
          sender_name: userName,
          content: newMessage.trim()
        });
        
      if (error) throw error;
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t('chat.sendError') || "Failed to send message");
    }
  };
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wassalni-green"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-t-lg">
        <h3 className="text-lg font-medium">{t('chat.groupChat')}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('chat.chatWithDriver')}
        </p>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4 max-h-80">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {t('chat.noMessages')}
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] ${
                  message.sender_id === userId 
                    ? 'bg-wassalni-green/90 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' 
                    : 'bg-gray-200 dark:bg-gray-700 rounded-tl-lg rounded-tr-lg rounded-br-lg'
                } px-4 py-2 shadow-sm`}
              >
                {message.sender_id !== userId && (
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {message.sender_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">
                      {message.sender_name}
                    </span>
                  </div>
                )}
                <p>{message.content}</p>
                <div 
                  className={`text-xs mt-1 text-right ${
                    message.sender_id === userId 
                      ? 'text-green-100' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-3 border-t dark:border-gray-700 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('chat.typeMessage') || "Type your message..."}
          className="flex-grow"
        />
        <Button type="submit" size="icon">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
