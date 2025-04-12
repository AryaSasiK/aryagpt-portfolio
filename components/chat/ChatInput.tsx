"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PlusCircle, Mic, Send } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ChatInput({ 
  onSendMessage, 
  placeholder = "Message AryaGPT...",
  disabled = false
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    onSendMessage(inputValue)
    setInputValue("")
  }

  return (
    <div className="fixed md:absolute bottom-0 left-0 right-0 bg-[#212121] pt-1 pb-3 px-2 md:pt-2 md:pb-4 md:px-4 flex justify-center z-10 border-t border-[#343541]">
      <motion.div 
        className="w-full max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className={`relative flex items-center bg-[#343541] rounded-2xl shadow-lg ${disabled ? 'opacity-70' : ''}`}>
            {/* Left icons */}
            <div className="flex items-center pl-3">
              <motion.button 
                type="button" 
                className="p-2 rounded-full hover:bg-[#404152] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={disabled}
              >
                <PlusCircle size={20} className="text-gray-400" />
              </motion.button>
            </div>

            {/* Input field */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-0 outline-none py-4 px-3 text-white placeholder-gray-400"
              disabled={disabled}
            />

            {/* Right icons */}
            <div className="flex items-center pr-3 gap-1">
              <motion.button 
                type="button" 
                className="p-2 rounded-full hover:bg-[#404152] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={disabled}
              >
                <Mic size={20} className="text-gray-400" />
              </motion.button>
              <motion.button 
                type="submit" 
                className="p-2 rounded-full hover:bg-[#404152] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={disabled || !inputValue.trim()}
              >
                <Send size={20} className={inputValue.trim() && !disabled ? "text-white" : "text-gray-400"} />
              </motion.button>
            </div>
          </div>
        </form>

        {/* Disclaimer text - hide on very small screens */}
        <p className="text-xs text-center text-gray-500 mt-2 hidden sm:block">
          AryaGPT can make mistakes. Consider checking important information.
        </p>
      </motion.div>
    </div>
  )
} 