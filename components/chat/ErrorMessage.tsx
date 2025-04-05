"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <motion.div
      className="flex flex-col items-start gap-3 p-4 text-red-400 bg-[#2a2a2a] rounded-lg max-w-xl mx-auto my-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Error occurred</span>
      </div>
      <p className="text-sm text-gray-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 text-sm bg-[#343541] hover:bg-[#40414f] rounded-md transition-colors"
        >
          Try Again
        </button>
      )}
    </motion.div>
  )
} 