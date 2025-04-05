import { createClient } from '@supabase/supabase-js';
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

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteOldEmbeddings() {
  try {
    // Delete all rows from the table
    const { error: deleteError } = await supabase
      .from('personal_info_embeddings')
      .delete()
      .neq('id', 0) // This will match all rows since id is always > 0

    if (deleteError) {
      throw deleteError;
    }

    console.log('Successfully deleted all existing embeddings.');
  } catch (error) {
    console.error('Error deleting old embeddings:', error);
  }
}

deleteOldEmbeddings(); 