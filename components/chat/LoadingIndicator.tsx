"use client"

import { motion } from "framer-motion"

interface LoadingIndicatorProps {
  text?: string
}

export function LoadingIndicator({ text = "AryaGPT is thinking..." }: LoadingIndicatorProps) {
  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-1">
        <motion.div
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0
          }}
        />
        <motion.div
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.2
          }}
        />
        <motion.div
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.4
          }}
        />
      </div>
      <span>{text}</span>
    </motion.div>
  )
} 