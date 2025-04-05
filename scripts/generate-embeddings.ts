import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { loadPersonalInfo } from './prepare-embeddings';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
const envFilePath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envFilePath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envFilePath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
} else {
  console.warn('.env.local file not found. Make sure your environment variables are set.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env.local file.');
  process.exit(1);
}

if (!openaiKey) {
  console.error('Missing OpenAI API key. Please set OPENAI_API_KEY in your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function generateEmbeddings() {
  const chunks = loadPersonalInfo();
  
  console.log(`Generating embeddings for ${chunks.length} chunks...`);
  
  for (const chunk of chunks) {
    try {
      // Generate embedding
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: chunk.content,
      });
      
      const embedding = response.data[0].embedding;
      
      // Store in Supabase
      const { error } = await supabase.from('personal_info_embeddings').insert({
        title: chunk.title,
        content: chunk.content,
        source: chunk.source,
        embedding
      });
      
      if (error) throw error;
      console.log(`Added embedding for "${chunk.title}" chunk`);
      
      // Rate limit to avoid OpenAI API limits
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error generating embedding for chunk:', chunk.title);
      console.error(error);
    }
  }
  
  console.log('Finished generating embeddings!');
}

generateEmbeddings(); 