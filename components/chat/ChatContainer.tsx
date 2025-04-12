"use client"

import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatMessage, ChatMessageProps } from "@/components/chat/ChatMessage"
import { ChatInput } from "@/components/chat/ChatInput"
import { LoadingIndicator } from './LoadingIndicator'
import { ErrorMessage } from './ErrorMessage'

export interface Message extends ChatMessageProps {
  id: number | string
  content: string 
  role: "user" | "assistant"
}

export interface ChatContainerRef {
  resetChat: () => void;
  loadConversation: (messages: Message[]) => void;
}

// Update the props to include a callback for new conversations
type ChatContainerProps = {
  onConversationStart?: (title: string, messages: Message[]) => void;
  onMessagesUpdate?: (messages: Message[]) => void;
  initialMessages?: Message[];
  isLoading?: boolean;
  streamingContent?: string | null;
  streamingMessageId?: string | null;
  error?: Error | null;
  onRetry?: () => void;
  onSendMessage?: (message: string) => void;
}

export const ChatContainer = forwardRef<ChatContainerRef, ChatContainerProps>(
  ({ 
    onConversationStart, 
    onMessagesUpdate, 
    initialMessages = [], 
    isLoading = false, 
    streamingContent = null,
    streamingMessageId = null,
    error = null,
    onRetry,
    onSendMessage
  }, ref) => {
  // Use a simpler state model - messages come from initialMessages prop
  const [hasStartedConversation, setHasStartedConversation] = useState(initialMessages.length > 0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const forceUpdateRef = useRef(0)
  
  // Force a re-render when needed
  const forceUpdate = useCallback(() => {
    forceUpdateRef.current += 1
  }, [])

  useImperativeHandle(ref, () => ({
    resetChat: () => {
      setHasStartedConversation(false)
      forceUpdate()
    },
    loadConversation: (loadedMessages: Message[]) => {
      setHasStartedConversation(loadedMessages.length > 0)
      forceUpdate()
    }
  }))

  // When initialMessages change, update the conversation state
  useEffect(() => {
    setHasStartedConversation(initialMessages.length > 0)
    if (initialMessages.length > 0 && onMessagesUpdate) {
      onMessagesUpdate(initialMessages)
    }
  }, [initialMessages, onMessagesUpdate])

  // Scroll to bottom when messages, streaming content, or loading state changes
  useEffect(() => {
    scrollToBottom()
  }, [initialMessages, streamingContent, isLoading, error])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // When the first user message comes in, notify the parent
  useEffect(() => {
    if (initialMessages.length === 1 && initialMessages[0].role === "user" && !hasStartedConversation) {
      setHasStartedConversation(true)
      
      // Notify parent with the first few words as the chat title
      if (onConversationStart) {
        const title = initialMessages[0].content.slice(0, 20) + (initialMessages[0].content.length > 20 ? '...' : '');
        onConversationStart(title, initialMessages);
      }
    }
  }, [initialMessages, hasStartedConversation, onConversationStart]);

  const handleSendMessage = (message: string) => {
    // If external message handler is provided, use it
    if (onSendMessage) {
      onSendMessage(message);
      return;
    }
  }

  // renderKey will force a re-render when it changes
  const renderKey = `chat-${initialMessages.length}-${forceUpdateRef.current}-${isLoading ? 'loading' : 'idle'}`

  return (
    <div className="flex flex-col h-[calc(100dvh-56px)] overflow-hidden" key={renderKey}>
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto bg-[#212121] pb-16 sm:pb-24">
        {initialMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-3 py-2 sm:py-8">
            <div className="text-center mb-3 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-6 text-white">
                Welcome to Arya's Digital Portfolio
              </h1>
              <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-6 rounded-full overflow-hidden border-2 border-[#2a2b32]">
                <img
                  src="/images/profile.png"
                  alt="Arya Sasikumar"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-6">
                I'm AryaGPT, an AI-powered digital twin of Arya Sasikumar. Ask me anything about him!
              </p>
              <div className="flex justify-center gap-2 sm:gap-4 mb-1">
                <span className="px-2 py-1 sm:px-4 sm:py-2 bg-[#2a2b32] rounded-full text-xs sm:text-sm text-gray-300">🎓 UC Berkeley</span>
                <span className="px-2 py-1 sm:px-4 sm:py-2 bg-[#2a2b32] rounded-full text-xs sm:text-sm text-gray-300">💻 Robotics</span>
                <span className="px-2 py-1 sm:px-4 sm:py-2 bg-[#2a2b32] rounded-full text-xs sm:text-sm text-gray-300">🚀 Entrepreneur</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-center">What can I help with?</h2>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-xl px-1">
              <button
                onClick={() => handleSendMessage("Tell me about Arya's background")}
                className="p-2 sm:p-4 bg-[#2a2b32] rounded-xl hover:bg-[#3a3b42] transition-colors text-left h-auto flex flex-col"
              >
                <h3 className="font-medium text-xs sm:text-base">Arya's background</h3>
                <p className="text-xs text-gray-400 hidden sm:block">Learn about education and experiences</p>
              </button>

              <button
                onClick={() => handleSendMessage("What projects has Arya worked on?")}
                className="p-2 sm:p-4 bg-[#2a2b32] rounded-xl hover:bg-[#3a3b42] transition-colors text-left h-auto flex flex-col"
              >
                <h3 className="font-medium text-xs sm:text-base">Arya's projects</h3>
                <p className="text-xs text-gray-400 hidden sm:block">Explore technical projects and achievements</p>
              </button>

              <button
                onClick={() => handleSendMessage("How can I contact Arya?")}
                className="p-2 sm:p-4 bg-[#2a2b32] rounded-xl hover:bg-[#3a3b42] transition-colors text-left h-auto flex flex-col"
              >
                <h3 className="font-medium text-xs sm:text-base">Contact Arya</h3>
                <p className="text-xs text-gray-400 hidden sm:block">Get contact info and social links</p>
              </button>

              <button
                onClick={() => handleSendMessage("What are Arya's skills?")}
                className="p-2 sm:p-4 bg-[#2a2b32] rounded-xl hover:bg-[#3a3b42] transition-colors text-left h-auto flex flex-col"
              >
                <h3 className="font-medium text-xs sm:text-base">Arya's skills</h3>
                <p className="text-xs text-gray-400 hidden sm:block">Discover technical and professional skills</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-4 max-w-3xl mx-auto">
            {/* Display all messages */}
            {initialMessages.map((message) => (
              // Skip rendering messages that would duplicate the streaming message
              (streamingMessageId && message.id.toString() === streamingMessageId) ? null : (
                <div key={`message-${message.id}`} className="animate-appear">
                  <ChatMessage {...message} />
                </div>
              )
            ))}
            
            {/* Show streaming content if available */}
            {streamingContent && (
              <div key={`streaming-${streamingMessageId || 'message'}`} className="animate-appear">
                <ChatMessage
                  id={streamingMessageId || "streaming"}
                  role="assistant"
                  content={streamingContent}
                  isStreaming={true}
                />
              </div>
            )}
            
            {/* Show loading indicator */}
            {isLoading && !streamingContent && (
              <div key="loading-indicator" className="animate-appear">
                <LoadingIndicator />
              </div>
            )}
            
            {/* Show error message if any */}
            {error && (
              <div key="error-message" className="animate-appear">
                <ErrorMessage message={error.message} onRetry={onRetry} />
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-px" />
          </div>
        )}
      </div>

      {/* Input area */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading}
      />
    </div>
  )
}) 