<h1 align="center">Mercury</h4>


<h4 align="center">

<img width="800" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-search.png" alt="">
</h4>

<h4 align="center">
<img width="200" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/logo-down-indigo.webp" alt="">

</h4>








## Chat with any Document or Website
> Train your own custom GPT

- Train on specific websites that you define
- Train on documents you upload
- Builds on dialog with Chat History 
- Cites sources
- [Perplexity](https://www.perplexity.ai/) style UI

<h2 align="center">
  <br>
<img width="1000" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-read-1.png" alt="">
</h2>




#### Supported Files
- [x] .pdf
- [x] .docx
- [x] .md
- [x] .txt
- [x] .png
- [x] .jpg
- [x] .html
- [x] .json

#### Coming Soon
- [ ] .csv
- [ ] .pptx
- [ ] notion
- [ ] next 13 app dir
- [ ] vercel ai sdk




## Train



#### 1. Upload: `/api/embed-file`

- file is uploaded -> cleaned to plain text, and split into 1000-character documents.
- OpenAI's embedding API is used to generate embeddings for each document using the "text-embedding-ada-002" model.
- The embeddings are stored in a Pinecone namespace.

#### 2. Scrape: `/api/embed-webpage`

- Web pages are scraped using [cheerio](https://github.com/cheeriojs/cheerio), cleaned to plain text, and split into 1000-character documents.
- OpenAI's embedding API is used to generate embeddings for each document using the "text-embedding-ada-002" model.
- The embeddings are stored in a Pinecone namespace.

<h4 align="center">
  <br>
<img width="1000" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-dark-train.png" alt="">
</h4>



## Query

#### Responding to queries: `/api/query`

- A single embedding is generated from the user prompt.
- The embedding is used to perform a similarity search against the vector database.
- The results of the similarity search are used to construct a prompt for GPT-3.
- The GTP-3 response is then streamed back to the user.


<h4 align="center">
  <br>
<img width="1000" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-2.gif" alt="">
</h4>


## Getting Started





### 1. Clone Repo and Install Deps

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


### 2. Set-up Pinecone

- Visit [pinecone](https://pinecone.io/) to create a free tier account and from the dashboard.
- Create a new Pinecone Index with Dimensions `1536`
eg: 
<h4 align="">
  <br>
<img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-pinecone.png" alt="">
</h4>

- Copy your API key
- Record your Enironment name ex: `us-central1-gcp`
- Record your index name ex: `mercury`

### 3. Set-up OpenAi API

- Visit [openai](https://platform.openai.com/account/api-keys) to create and copy your API key
> You can find this in the OpenAI web portal under `API Keys`

### 4. Open the `.env.local` file and configure your environment

```bash
cp .env.example .env.local
```

```bash
# OpenAI
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
# Pinecone
PINECONE_API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx"
PINECONE_ENVIRONMENT="us-central1-gcp"
PINECONE_INDEX_NAME="mercury"
```


### 5. Start the app

```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the app.

## Template Features

- OpenAI API (for generating embeddings and GPT-3 responses)
- Pinecone
- Nextjs API Routes (Edge runtime) - streaming
- Tailwind CSS
- Fonts with `@next/font`
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Radix UI Primitives
- Automatic import sorting with `@ianvs/prettier-plugin-sort-imports`

<h2 align="center">
  <br>
  <a href="https://github.com/Jordan-Gilliam/ai-template"><img width="700" src="https://github.com/Jordan-Gilliam/readme-assets/blob/master/merc-light.png" alt=""></a>
</h2>


## Inspiration:

> 🍴 Huge thanks to [@gannonh](https://github.com/gannonh) and [@mayooear](https://github.com/mayooear/gpt4-pdf-chatbot-langchain) for their fantastic work that helped inspire this template. 


- https://www.perplexity.ai/
- https://builtbyjesse.com/
- https://ui.shadcn.com/docs
- https://meodai.github.io/poline/
- https://github.com/gannonh/gpt3.5-turbo-pgvector
- https://github.com/vercel/examples/tree/main/solutions/ai-chatgpt

## How embeddings work:

ChatGPT is a great tool for answering general questions, but it falls short when it comes to answering domain-specific questions as it often makes up answers to fill its knowledge gaps and doesn't cite sources. To solve this issue, this starter app uses embeddings coupled with vector search. This app shows how OpenAI's GPT-3 API can be used to create conversational interfaces for domain-specific knowledge.

<b>Embeddings</b> are vectors of floating-point numbers that represent the "relatedness" of text strings. They are very useful for tasks like ranking search results, clustering, and classification. In text embeddings, a high cosine similarity between two embedding vectors indicates that the corresponding text strings are highly related.

This app uses embeddings to generate a vector representation of a document and then uses vector search to find the most similar documents to the query. The results of the vector search are then used to construct a prompt for GPT-3, which generates a response. The response is then streamed back to the user.
