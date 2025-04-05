"use client"

import { createContext, useContext, ReactNode, useRef, useCallback, useEffect } from 'react';
import { useChatApi } from '@/hooks/use-chat-api';
import { Message } from '@/components/chat/ChatContainer';
import { ChatContainerRef } from '@/components/chat/ChatContainer';
import { DEFAULT_MODEL } from '@/lib/openai';

// Define the context value type
interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  streamingMessage: string | null; // Re-enable streaming
  streamingMessageId: string | null; // Re-enable streaming ID
  chatContainerRef: React.RefObject<ChatContainerRef | null>;
  sendMessage: (content: string) => Promise<void>;
  resetChat: () => void;
  loadConversation: (messages: Message[]) => void;
  abortStream: () => void;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Props for the provider
interface ChatProviderProps {
  children: ReactNode;
  initialMessages?: Message[];
  model?: string;
}

// Chat provider component
export function ChatProvider({ 
  children, 
  initialMessages = [],
  model = DEFAULT_MODEL
}: ChatProviderProps) {
  const chatContainerRef = useRef<ChatContainerRef>(null);
  
  const {
    messages,
    isLoading,
    error,
    streamingMessage,
    streamingMessageId,
    sendMessage,
    clearMessages,
    abortStream,
    setMessages
  } = useChatApi({
    model,
    initialMessages,
    onError: (error) => console.error('Chat API error:', error)
  });

  // Debug log when messages change
  useEffect(() => {
    console.log('ChatContext messages updated:', messages);
  }, [messages]);

  const resetChat = useCallback(() => {
    clearMessages();
    if (chatContainerRef.current) {
      chatContainerRef.current.resetChat();
    }
  }, [clearMessages]);

  const loadConversation = useCallback((loadedMessages: Message[]) => {
    // Clear current messages first
    clearMessages();
    
    // Use setTimeout to ensure state updates happen in sequence
    setTimeout(() => {
      // Update messages in the API hook
      // This needs to be updated directly since we don't have individual message sending
      setMessages(loadedMessages); // Add this function to the useChatApi hook
      
      // Update UI
      if (chatContainerRef.current) {
        chatContainerRef.current.loadConversation(loadedMessages);
      }
    }, 50);
  }, [clearMessages]);

  // Construct the context value
  const contextValue: ChatContextType = {
    messages,
    isLoading,
    error,
    streamingMessage,
    streamingMessageId,
    chatContainerRef,
    sendMessage,
    resetChat,
    loadConversation,
    abortStream
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

// Hook for using the chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export default ChatContext; 