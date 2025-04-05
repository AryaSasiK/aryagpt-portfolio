"use client"

import React from 'react'

interface FormattedContentProps {
  content: string
}

export function FormattedContent({ content }: FormattedContentProps) {
  // Split content by newlines to handle paragraph breaks
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0)
  
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, idx) => {
        // Check if this is a heading (starts with # or ##)
        if (paragraph.startsWith('# ')) {
          return (
            <h1 key={idx} className="text-2xl font-bold mb-4">
              {paragraph.slice(2)}
            </h1>
          )
        }
        
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl font-semibold mb-3">
              {paragraph.slice(3)}
            </h2>
          )
        }

        // Check if this is a bullet point
        if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-4">
              <span className="text-gray-400">•</span>
              <span className="flex-1">{paragraph.slice(1).trim()}</span>
            </div>
          )
        }

        // Check if this is a numbered list item (e.g., "1.", "2.", etc.)
        const numberedMatch = paragraph.match(/^(\d+)\.\s(.+)/)
        if (numberedMatch) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-4">
              <span className="text-gray-400 min-w-[1.5rem]">{numberedMatch[1]}.</span>
              <span className="flex-1">{numberedMatch[2]}</span>
            </div>
          )
        }
        
        // Process italics and emojis inside the paragraph
        const parts = []
        let currentText = ''
        let inItalic = false
        
        for (let i = 0; i < paragraph.length; i++) {
          const char = paragraph[i]
          const nextChar = paragraph[i + 1]
          
          // Check for underscore-based italics
          if (char === '_') {
            if (!inItalic) {
              // Start italic
              if (currentText) parts.push(<span key={parts.length}>{currentText}</span>)
              currentText = ''
              inItalic = true
            } else {
              // End italic
              if (currentText) parts.push(<em key={parts.length} className="italic">{currentText}</em>)
              currentText = ''
              inItalic = false
            }
          } else {
            // Handle emojis (they're already Unicode, so just add them to the text)
            currentText += char
          }
        }
        
        // Add any remaining text
        if (currentText) {
          if (inItalic) {
            parts.push(<em key={parts.length} className="italic">{currentText}</em>)
          } else {
            parts.push(<span key={parts.length}>{currentText}</span>)
          }
        }
        
        return <p key={idx} className="leading-relaxed">{parts.length > 0 ? parts : paragraph}</p>
      })}
    </div>
  )
} 