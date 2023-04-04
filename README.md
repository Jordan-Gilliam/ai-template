<h1 align="center">

<a href="https://github.com/Jordan-Gilliam/ai-template"><img width="300" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/logo-down-og.svg" alt=""></a>

</h1>

# Mercury

<i>A Chat GPT Embedding Template</i>

 <h1 align="center">
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-home.png" alt=""></a>
</h1>

## Chat with any Document or Website

> Train your own custom GPT

- [Perplexity](https://www.perplexity.ai/) style UI
- Train on specific websites that you define
- Train on documents you upload
- Cites sources

<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-lab-light.png" alt=""></a>
</h2>

## Train:

> `[model gpt-3.5-turbo]`

#### 1. Creating and storing the embeddings: `/api/embed-webpage`

- Web pages are scraped using [cheerio](https://github.com/cheeriojs/cheerio), cleaned to plain text, and split into 1000-character documents.
- OpenAI's embedding API is used to generate embeddings for each document using the "text-embedding-ada-002" model.
- The embeddings are stored in a Pinecone namespace.

#### 2. Creating embeddings from file: `/api/embed-file`

- file is uploaded -> cleaned to plain text, and split into 1000-character documents.
- OpenAI's embedding API is used to generate embeddings for each document using the "text-embedding-ada-002" model.
- The embeddings are stored in a Pinecone namespace.

#### 2. Responding to queries: `/api/query`

- A single embedding is generated from the user prompt.
- The embedding is used to perform a similarity search against the vector database.
- The results of the similarity search are used to construct a prompt for GPT-3.
- The GTP-3 response is then streamed back to the user.

<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-chat-3.png" alt=""></a>
</h2>

## Getting Started

> 🍴 Huge thanks to [@gannonh](https://github.com/gannonh) most of the scraping and embedding logic came from his [gpt3.5-turbo-pgvector repo](https://github.com/gannonh/gpt3.5-turbo-pgvector)

### Set-up Pinecone

- Visit [pinecone](https://pinecone.io/) to create and retrieve your API keys, and also retrieve your environment and index name from the dashboard.

### Set-up local environment

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit https://github.com/Jordan-Gilliam/ai-template ai-template
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

1. Create Open AI API account

- Add your OPENAI PI key to .env.local. You can find this in the OpenAI web portal under `API Keys`.
  Example:

2. Create Free Tier Pinecone Account

```bash
# OpenAI
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
# Pinecone
PINECONE_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx"
PINECONE_ENVIRONMENT="us-central1-gcp"
PINECONE_INDEX_NAME="ai-template"
```

3. open the `.env.local` file and configure your environment

- `OPENAI_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_ENVIRONMENT`
- `PINECONE_INDEX_NAME`

4. Start the app

```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the app.

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

## How embeddings work:

ChatGPT is a great tool for answering general questions, but it falls short when it comes to answering domain-specific questions as it often makes up answers to fill its knowledge gaps and doesn't cite sources. To solve this issue, this starter app uses embeddings coupled with vector search. This app shows how OpenAI's GPT-3 API can be used to create conversational interfaces for domain-specific knowledge.

<b>Embeddings</b> are vectors of floating-point numbers that represent the "relatedness" of text strings. They are very useful for tasks like ranking search results, clustering, and classification. In text embeddings, a high cosine similarity between two embedding vectors indicates that the corresponding text strings are highly related.

This app uses embeddings to generate a vector representation of a document and then uses vector search to find the most similar documents to the query. The results of the vector search are then used to construct a prompt for GPT-3, which generates a response. The response is then streamed back to the user.

## Inspiration:

- https://www.perplexity.ai/
- https://builtbyjesse.com/
- https://ui.shadcn.com/docs
- https://meodai.github.io/poline/
- https://github.com/gannonh/gpt3.5-turbo-pgvector
- https://github.com/vercel/examples/tree/main/solutions/ai-chatgpt
