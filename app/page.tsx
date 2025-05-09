"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import { Header } from "@/components/layout/Header"
import { ChatContainer } from "@/components/chat/ChatContainer"
import { Message } from "@/components/chat/ChatContainer"
import { ChatProvider, useChat } from "@/contexts/ChatContext"

// Define a type for a complete conversation
interface Conversation {
  id: number;
  title: string;
  date: string;
  messages: Message[];
}

// MainApp component that uses the chat context
function MainApp() {
  const isMobile = useIsMobile()
  console.log('Is mobile device:', isMobile)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
  console.log('Initial sidebar state:', sidebarOpen)
  
  // Update sidebar state when mobile status changes
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, title: "AryaGPT Portfolio Concept", date: "today", messages: [] }
  ])
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)
  const [renderKey, setRenderKey] = useState(0) // Used to force re-renders
  
  // Get chat context
  const { 
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
  } = useChat()

  // Force a re-render when needed
  const forceUpdate = useCallback(() => {
    setRenderKey(prev => prev + 1)
  }, [])

  // Format conversations for the sidebar display (without messages)
  const sidebarChats = conversations.map(({ id, title, date }) => ({ id, title, date }))

  // Debug log when component renders
  useEffect(() => {
    console.log('MainApp rendered with messages:', messages)
  }, [messages, renderKey])

  const handleNewChat = useCallback(() => {
    // Reset the chat
    resetChat()
    
    // Clear active conversation to show landing page
    setActiveConversationId(null)
    forceUpdate()
  }, [resetChat, forceUpdate])

  const handleConversationStart = useCallback((title: string, newMessages: Message[]) => {
    // Create a new conversation
    const newConversation: Conversation = {
      id: Date.now(),
      title,
      date: "today",
      messages: newMessages
    }
    
    // Add to conversations and set as active
    setConversations(prev => [...prev, newConversation])
    setActiveConversationId(newConversation.id)
    forceUpdate()
  }, [forceUpdate])

  const handleChatSelected = useCallback((chatId: number) => {
    // Find the selected conversation
    const conversation = conversations.find(c => c.id === chatId)
    if (conversation) {
      // Set as active conversation
      setActiveConversationId(chatId)
      
      // Load messages into chat container
      loadConversation(conversation.messages)
    }
  }, [conversations, loadConversation])

  // Handler to update messages in the active conversation
  const handleMessagesUpdate = useCallback((updatedMessages: Message[]) => {
    if (activeConversationId) {
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages: updatedMessages } 
            : conv
        )
      )
    }
  }, [activeConversationId])

  // Update messages when they change in the context
  useEffect(() => {
    if (messages.length > 0) {
      handleMessagesUpdate(messages)
      console.log("Messages updated:", messages)
    }
  }, [messages, handleMessagesUpdate])

  // Add retry handler
  const handleRetry = useCallback(() => {
    if (messages.length > 0) {
      // Get the last user message
      const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.role === 'user');
      if (lastUserMessageIndex !== -1) {
        const lastUserMessage = [...messages].reverse()[lastUserMessageIndex];
        // Resend the last user message
        sendMessage(lastUserMessage.content);
      }
    }
  }, [messages, sendMessage]);

  return (
    <div className="flex h-screen bg-[#212121] text-white" key={`main-app-${renderKey}`}>
      {/* Sidebar with animation - fixed positioning */}
      <motion.div
        className="fixed left-0 top-0 z-40 h-full"
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Sidebar 
          isOpen={sidebarOpen} 
          onNewChat={handleNewChat}
          chats={sidebarChats}
          onChatSelected={handleChatSelected}
          onClose={() => setSidebarOpen(false)}
        />
      </motion.div>

      {/* Main content area */}
      <motion.main
        className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#212121]"
        initial={{ marginLeft: isMobile ? 0 : 256 }}
        animate={{ marginLeft: isMobile ? 0 : (sidebarOpen ? 256 : 0) }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          onNewChat={handleNewChat}
        />
        
        {/* Chat interface */}
        <div className="flex-1 overflow-hidden">
          <ChatContainer 
            ref={chatContainerRef}
            initialMessages={messages}
            onConversationStart={handleConversationStart}
            onMessagesUpdate={handleMessagesUpdate}
            isLoading={isLoading}
            streamingContent={streamingMessage}
            streamingMessageId={streamingMessageId}
            error={error}
            onRetry={handleRetry}
            onSendMessage={sendMessage}
          />
        </div>
      </motion.main>
    </div>
  )
}

// Root component that provides the chat context
export default function Home() {
  return (
    <ThemeProvider defaultTheme="dark" forcedTheme="dark">
      <ChatProvider>
        <MainApp />
      </ChatProvider>
    </ThemeProvider>
  )
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Handle SSR
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      
      // Check on initial render
      checkIfMobile()
      
      // Add event listener for window resize
      window.addEventListener('resize', checkIfMobile)
      
      // Clean up
      return () => window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // For SSR, default to false, for client, return current state
  return typeof window !== 'undefined' ? window.innerWidth < 768 : isMobile
}

