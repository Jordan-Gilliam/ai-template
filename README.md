<h1 align="center">

<a href="https://github.com/Jordan-Gilliam/ai-template"><img width="300" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/logo-down-og.svg" alt=""></a>

</h1>

# Mercury

<i>A Chat GPT Embedding Template - inspired by [gannonh](https://github.com/gannonh)</i>

 <h1 align="center">
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-home.png" alt=""></a>
</h1>

> ### This template gives you two sandboxes to explore the [openAI chat api](https://platform.openai.com/docs/guides/chat):

### 1. Domain-Specific - [perplexity clone]

- [Perplexity](https://www.perplexity.ai/) style sandbbox
- Trained on specific websites that you define
- Sites sources

### 2. Chat - [chatGPT clone]

- Conversational chatGPT sandbox with in chat memory
- Markdown Renderer built in for code snippets

## Domain-Specific Overview: `/pages/embed`

ChatGPT is a great tool for answering general questions, but it falls short when it comes to answering domain-specific questions as it often makes up answers to fill its knowledge gaps and doesn't cite sources. To solve this issue, this starter app uses embeddings coupled with vector search. This app shows how OpenAI's GPT-3 API can be used to create conversational interfaces for domain-specific knowledge.

<b>Embeddings</b> are vectors of floating-point numbers that represent the "relatedness" of text strings. They are very useful for tasks like ranking search results, clustering, and classification. In text embeddings, a high cosine similarity between two embedding vectors indicates that the corresponding text strings are highly related.

This app uses embeddings to generate a vector representation of a document and then uses vector search to find the most similar documents to the query. The results of the vector search are then used to construct a prompt for GPT-3, which generates a response. The response is then streamed back to the user.


<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-lab-light.png" alt=""></a>
</h2>

## Domain-Specific Details: `/pages/embed`

> `[model gpt-3.5-turbo]`

#### 1. Creating and storing the embeddings: `/api/generate-embeddings`

- Web pages are scraped using [cheerio](https://github.com/cheeriojs/cheerio), cleaned to plain text, and split into 1000-character documents.
- OpenAI's embedding API is used to generate embeddings for each document using the "text-embedding-ada-002" model.
- The embeddings are stored in a Supabase postgres table using pgvector. The table has three columns: the document text, the source URL, and the embedding vectors returned from the OpenAI API.

#### 2. Responding to queries: `/api/get-embeddings`

- A single embedding is generated from the user prompt.
- The embedding is used to perform a similarity search against the vector database.
- The results of the similarity search are used to construct a prompt for GPT-3.
- The GTP-3 response is then streamed back to the user.

## Chat Overview: `/pages/chat`
> `[model gpt-3.5-turbo]`

The OpenAI API chat feature uses a machine learning model to generate responses to user input. It can be fine-tuned on specific datasets and scenarios to create chatbots that provide contextually-relevant and effective responses.

<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-chat-3.png" alt=""></a>
</h2>

- OpenAI API (ChatGPT) - streaming `/api/chat`

## Template Features

- OpenAI API (for generating embeddings and GPT-3 responses)
- Supabase (using their pgvector implementation as the vector database)
- Nextjs API Routes (Edge runtime) - streaming
- Tailwind CSS
- Fonts with `@next/font`
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Radix UI Primitives
- Automatic import sorting with `@ianvs/prettier-plugin-sort-imports`

## Getting Started
> 🍴 Huge thanks to [@gannonh](https://github.com/gannonh) most of the scraping and embedding logic came from his [gpt3.5-turbo-pgvector repo](https://github.com/gannonh/gpt3.5-turbo-pgvector)

### Set-up Supabase

- Create a Supabase account and project at https://app.supabase.com/sign-in.
- First we'll enable the Vector extension. In Supabase, this can be done from the web portal through `Database` → `Extensions`. You can also do this in SQL by running:

```
create extension vector;
```

- Next let's create a table to store our documents and their embeddings. Head over to the SQL Editor and run the following query:

```sql
create table documents (
  id bigserial primary key,
  content text,
  url text,
  embedding vector (1536)
);
```

- Finally, we'll create a function that will be used to perform similarity searches. Head over to the SQL Editor and run the following query:

```sql
create or replace function match_documents (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  url text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.url,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > similarity_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

### Set-up local environment

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit Jordan-Gilliam/ai-template ai-template
```

```bash
cd ai-template
code .
```

- install dependencies

```bash
npm i
```

- create a .env.local file in the root directory to store environment variables:

```bash
cp .env.example .env.local
```

- open the .env.local file and add your Supabase project URL and API key.
  > You can find these in the Supabase web portal under `Project` → `API`. The API key should be stored in the `SUPABASE_ANON_KEY` variable and project URL should be stored under `NEXT_PUBLIC_SUPABASE_URL`.
- Add your OPENAI PI key to .env.local. You can find this in the OpenAI web portal under `API Keys`. The API key should be stored in the `OPENAI_API_KEY` variable.
- Start the app

```bash
npm run dev
```

- Open http://localhost:3000 in your browser to view the app.


<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-evoke.png" alt=""></a>
</h2>

<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-invoke.png" alt=""></a>
</h2>


<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-home-light.png" alt=""></a>
</h2>

## Inspiration: 
- https://www.perplexity.ai/
- https://builtbyjesse.com/
- https://ui.shadcn.com/docs
- https://meodai.github.io/poline/
- https://github.com/gannonh/gpt3.5-turbo-pgvector
- https://github.com/vercel/examples/tree/main/solutions/ai-chatgpt
