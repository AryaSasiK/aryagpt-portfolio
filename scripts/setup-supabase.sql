-- Enable the vector extension
create extension if not exists vector;

-- Create a table for storing personal info with embeddings
create table if not exists personal_info_embeddings (
  id bigserial primary key,
  title text,
  content text,
  source text,
  embedding vector(1536) -- OpenAI embeddings are 1536 dimensions
);

-- Create a function to compute similarity
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  title text,
  content text,
  source text,
  similarity float
)
language sql stable
as $$
  select
    id,
    title,
    content,
    source,
    1 - (embedding <=> query_embedding) as similarity
  from personal_info_embeddings
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$; 