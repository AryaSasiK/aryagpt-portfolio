"use client"

import { motion } from "framer-motion"
import { FormattedContent } from "./FormattedContent"
import { useState, useEffect } from "react"

export interface ChatMessageProps {
  id: number | string
  content: string
  role: "user" | "assistant"
  isStreaming?: boolean
}

export function ChatMessage({ id, content, role, isStreaming = false }: ChatMessageProps) {
  const isUser = role === "user"
  const [showCursor, setShowCursor] = useState(false)
  
  // Blinking cursor effect for streaming messages
  useEffect(() => {
    if (!isStreaming) return
    
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    
    return () => clearInterval(interval)
  }, [isStreaming])

  return (
    <motion.div
      className={`flex py-4 ${isUser ? "justify-end" : "justify-start"} px-4 md:px-6`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${isUser ? "max-w-xl" : "max-w-3xl"}`}>
        <motion.div
          className={`px-4 py-3 ${
            isUser 
              ? "bg-[#343541] text-white rounded-2xl" 
              : "text-white"
          }`}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isUser ? content : (
            <>
              <FormattedContent content={content} />
              {isStreaming && (
                <span className="inline-block h-4 w-2 ml-1 bg-white animate-pulse" style={{ opacity: showCursor ? 1 : 0 }}></span>
              )}
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
} 