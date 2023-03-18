<h1 align="center">

  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="300" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/logo-down-og.svg" alt=""></a>
</h1>

# Mercury

> A Chat GPT Embedding Template - inspired by [gannonh](https://github.com/gannonh)

## Features

- Radix UI Primitives
- Tailwind CSS
- Fonts with `@next/font`
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Automatic import sorting with `@ianvs/prettier-plugin-sort-imports`

## Tailwind CSS Features

- Class merging with `taiwind-merge`
- Animation with `tailwindcss-animate`
- Conditional classes with `clsx`
- Variants with `class-variance-authority`
- Automatic class sorting with `eslint-plugin-tailwindcss`

<h1 align="center">
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc1.png" alt=""></a>
</h1>


## Getting Started

The following set-up guide assumes at least basic familiarity developing web apps with React and Nextjs. Experience with OpenAI APIs and Supabase is helpful but not required to get things working.

### Set-up Supabase

- Create a Supabase account and project at https://app.supabase.com/sign-in. NOTE: Supabase support for pgvector is relatively new (02/2023), so it's important to create a new project if your project was created before then.
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

- clone the repo: `gh repo clone Jordan-Gilliam/ai-template`

```bash
cd ai-template
code .
```

- install dependencies

```bash
npm install
```

- create a .env.local file in the root directory to store environment variables:

```bash
cp .env.local.example .env.local
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
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc2.png" alt=""></a>
</h2>

<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc3.png" alt=""></a>
</h2>

