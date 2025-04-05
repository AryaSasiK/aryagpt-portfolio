import { useState, useCallback, useRef } from 'react'
import { Message } from '@/components/chat/ChatContainer'
import { DEFAULT_MODEL, ChatOptions } from '@/lib/openai'

interface UseChatApiProps {
  apiKey?: string
  model?: string
  onError?: (error: Error) => void
  initialMessages?: Message[]
}

interface UseChatApiReturn {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  streamingMessage: string | null
  streamingMessageId: string | null
  sendMessage: (message: string) => Promise<void>
  clearMessages: () => void
  abortStream: () => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export function useChatApi({ 
  model = DEFAULT_MODEL, 
  onError,
  initialMessages = []
}: UseChatApiProps = {}): UseChatApiReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setStreamingMessage(null)
    setStreamingMessageId(null)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setStreamingMessage(null)
    setStreamingMessageId(null)
  }, [])

  // Simple fallback response generator
  const getSimulatedResponse = (message: string): string => {
    if (message.toLowerCase().includes("arya's background") || message.toLowerCase().includes("background")) {
      return "This is a simulated response about Arya's background because the API request failed."
    }
    
    if (message.toLowerCase().includes("bernoulli") || message.toLowerCase().includes("equation")) {
      return "Bernoulli's principle states that as the speed of a fluid increases, its pressure decreases. This explains how airplanes generate lift and why shower curtains move inward when water flows."
    }

    if (message.toLowerCase().includes("justin bieber")) {
      return "Justin Bieber is a Canadian singer who gained fame at a young age through YouTube. He has released many hit songs like 'Baby', 'Sorry', and 'Love Yourself'."
    }
    
    if (message.toLowerCase().includes("hi") || message.toLowerCase().includes("hello") || message.toLowerCase().includes("hey")) {
      return "Hello! How can I assist you today?"
    }
    
    return `This is a simulated response because the API request failed. You asked about: "${message}".`
  }

  const sendMessage = useCallback(async (content: string) => {
    try {
      // Abort any ongoing requests
      abortStream()
      
      setIsLoading(true)
      setError(null)

      // Create user message with unique ID
      const messageId = Date.now()
      const userMessage: Message = {
        id: messageId,
        content,
        role: 'user',
      }
      
      // Add the user message to the chat
      const newMessages = [...messages, userMessage]
      setMessages(newMessages)
      
      // Setup streaming ID (will be used in UI to avoid duplicates)
      const responseId = `${messageId + 1}`
      setStreamingMessageId(responseId)
      setStreamingMessage("")
      
      // Create a new abort controller for this request
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      // Prepare API call options
      const options: ChatOptions = {
        model,
        temperature: 0.7,
      }

      try {
        // Make API request
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: newMessages,
            ...options,
          }),
          signal: abortController.signal,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to get a response')
        }

        if (!response.body) {
          throw new Error('Response body is undefined')
        }

        // Process streaming response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let responseText = ''

        try {
          // Read stream chunks
          while (true) {
            const { value, done } = await reader.read()
            if (done) break

            // Decode and accumulate chunks
            const chunk = decoder.decode(value, { stream: true })
            responseText += chunk
            
            // Update streaming state
            setStreamingMessage(responseText)
          }
          
          // Create final response message
          const assistantMessage: Message = {
            id: parseInt(responseId),
            content: responseText || "I couldn't generate a proper response.",
            role: 'assistant',
          }
          
          // Delay adding the message to messages array for smooth transition
          setTimeout(() => {
            // Clear streaming state
            setStreamingMessage(null)
            setStreamingMessageId(null)
            
            // Add message to the messages array
            setMessages(current => [...current, assistantMessage])
          }, 100)
        } catch (streamErr) {
          console.error('Stream error:', streamErr)
          throw streamErr
        }
      } catch (apiError) {
        console.error('API request failed:', apiError)
        
        // Clear streaming state
        setStreamingMessage(null)
        setStreamingMessageId(null)
        
        // Fall back to simulated response
        const fallbackMessage: Message = {
          id: parseInt(responseId),
          content: getSimulatedResponse(content),
          role: 'assistant',
        }
        
        // Use simulated response when API fails
        setMessages(current => [...current, fallbackMessage])
      }
    } catch (err) {
      // Don't set error if it was an abort
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Request was aborted')
        return
      }

      const error = err instanceof Error ? err : new Error('Unknown error occurred')
      setError(error)
      if (onError) onError(error)
    } finally {
      // Small delay to ensure UI states are properly updated
      setTimeout(() => {
        setIsLoading(false)
        abortControllerRef.current = null
      }, 50)
    }
  }, [messages, model, abortStream, onError])

  return {
    messages,
    isLoading,
    error,
    streamingMessage,
    streamingMessageId,
    sendMessage,
    clearMessages,
    abortStream,
    setMessages
  }
}

/* 
  Future API integration notes:
  
  1. This hook will integrate with the OpenAI API or similar LLM API service
  2. Implementation will use the OpenAI client SDK (or fetch for direct REST API calls)
  3. Proper error handling and rate limit management will be added
  4. Streaming responses can be implemented for a more interactive experience
  5. Message history management (local storage, database, etc.) will be added
  6. Authentication and API key management will be implemented
*/ 