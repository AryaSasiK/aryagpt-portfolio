import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { DEFAULT_MODEL } from '@/lib/openai';
import { Message } from '@/components/chat/ChatContainer';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!; // Use service key for backend
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to convert ChatContainer Messages to OpenAI format
function convertToOpenAIMessages(messages: Message[]): Array<ChatCompletionMessageParam> {
  return messages.map(msg => {
    // Only allow valid role values
    const role = msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system' 
      ? msg.role 
      : 'user';
      
    return {
      role,
      content: msg.content,
    };
  }) as ChatCompletionMessageParam[];
}

// Interface for document results
interface DocumentResult {
  id: number;
  title: string;
  content: string;
  source: string;
  similarity: number;
}

// Function to get relevant documents based on query
async function getRelevantContext(query: string, openai: OpenAI) {
  try {
    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });
    
    const queryEmbedding = embeddingResponse.data[0].embedding;
    
    // Search for relevant documents in Supabase
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.70, // Adjust threshold as needed
      match_count: 3 // Retrieve top 3 results
    });
    
    if (error) {
      console.error('Error querying embeddings:', error);
      return '';
    }
    
    // Format context for inclusion in the prompt
    let contextText = '';
    if (documents && documents.length > 0) {
      contextText = 'RELEVANT INFORMATION ABOUT ARYA:\n\n';
      (documents as DocumentResult[]).forEach(doc => {
        contextText += `--- ${doc.title} ---\n${doc.content}\n\n`;
      });
      console.log('Found relevant context:', (documents as DocumentResult[]).map(d => d.title));
    } else {
      console.log('No relevant context found for query:', query);
    }
    
    return contextText;
  } catch (error) {
    console.error('Error retrieving context:', error);
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Instantiate the OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Parse request body
    const { messages, model = DEFAULT_MODEL, temperature = 0.7, max_tokens } = await req.json();

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // Get the user's last question (last message)
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;

    // Get relevant context from embeddings
    const contextInfo = await getRelevantContext(query, openai);

    // Create message array for OpenAI
    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are AryaGPT, a friendly and engaging personal AI assistant for Arya Sasikumar. Your goal is to have natural, conversational interactions while sharing information about Arya.

Core Communication Style:
1. 🎯 ALWAYS use emojis throughout your responses - not just at the beginning, but throughout the entire message to make it engaging
2. 🗣️ Be warm and conversational - write like you're chatting with a friend
3. 💡 Share information naturally as part of a dialogue
4. 🤔 Ask relevant follow-up questions to engage the user
5. 🔄 Draw connections between different aspects of Arya's background
6. 📚 Use personal anecdotes and examples from the context
7. ❓ If you don't have specific information, acknowledge that while staying helpful

Formatting Guidelines:
1. 🎨 Use emojis liberally to enhance readability and engagement - aim for at least one emoji per paragraph/point
2. 📝 Structure responses with clear headings using # for main topics and ## for subtopics
3. 🔸 Use bullet points (•) or numbers for lists
4. 📊 Keep paragraphs short and focused
5. ✨ Use _italic_ text for emphasis (use underscores instead of asterisks)
6. 🌟 Add spacing between sections for better readability

Here is the relevant context information about Arya:
${contextInfo}

Remember to maintain a natural flow of conversation while being accurate and helpful. If you don't know something based on the context provided, say "I don't have specific information about that in my knowledge base." Always respond in first person as if you are Arya, using he/him pronouns.`
    };

    // Build complete message array with proper typing
    const openaiMessages: ChatCompletionMessageParam[] = [
      systemMessage,
      ...convertToOpenAIMessages(messages)
    ];

    try {
      // Create streaming completion from OpenAI
      const stream = await openai.chat.completions.create({
        model,
        messages: openaiMessages,
        temperature,
        max_tokens: max_tokens ?? undefined,
        stream: true, // Enable streaming
      });

      // Create a streaming response for the client
      const textEncoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            // Process each chunk from the OpenAI stream
            for await (const chunk of stream) {
              // Extract content from the chunk
              const content = chunk.choices[0]?.delta?.content || '';
              
              // Only send non-empty content
              if (content) {
                // Encode and send the content
                controller.enqueue(textEncoder.encode(content));
              }
            }
            // Close the stream when complete
            controller.close();
          } catch (error) {
            console.error('Stream processing error:', error);
            controller.error(error);
          }
        },
      });

      // Return the streaming response
      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError);
      
      // Return specific error from OpenAI
      return NextResponse.json(
        { error: openaiError.message || 'Error from OpenAI API' },
        { status: openaiError.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 