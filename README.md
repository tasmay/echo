# Echo

Echo is a tool that enables you to retrieve information faster and ask questions about your documents with the power of AI. This project is built using [Retrieval Augmented Generation (RAG)](https://research.ibm.com/blog/retrieval-augmented-generation-RAG) techniques. This project is built on the [Next.js](https://nextjs.org/) framework and uses [LlamaIndex](https://www.llamaindex.ai/) for RAG, [Supabase](https://supabase.com/) for authentication and file storage, and [Pinecone](https://www.pinecone.io/) for storing vector embeddings.

This project uses the Meta Llama 3 model as the underlying LLM via the Hugging Face Inference API (rate limits apply).

## Getting Started

To run this project locally, make sure all environment variables are setup properly (see .env.example). You will need a Supabase account, a Pinecone account and a Hugging Face API token. All API keys and tokens can be found in the account settings of the respective services. See individual documentation for more help.

### Supabase Setup

1. Go to [Supabase website](https://supabase.com/) and create a free account. Then create a new project.
2. In _Settings -> Configuration -> Authentication_, make sure "*Allow anonymous sign-ins*" is turned on.
3. In Storage, create a new bucket, "*echo-bucket*".
4. In _Storage -> Configuration -> Policies_, create 4 new policies as follows:

```
CREATE POLICY "Give users access to own folder SELECT"
ON storage.objects FOR select {USING | WITH CHECK} (
    -- restrict bucket
    ((bucket_id = 'echo-bucket'::text)
    -- only allow if authenticated user's id matches the folder name
    AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1]))
);

CREATE POLICY "Give users access to own folder INSERT"
ON storage.objects FOR insert {USING | WITH CHECK} (
    -- restrict bucket
    ((bucket_id = 'echo-bucket'::text)
    -- only allow if authenticated user's id matches the folder name
    AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1]))
);

CREATE POLICY "Give users access to own folder UPDATE"
ON storage.objects FOR update {USING | WITH CHECK} (
    -- restrict bucket
    ((bucket_id = 'echo-bucket'::text)
    -- only allow if authenticated user's id matches the folder name
    AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1]))
);

CREATE POLICY "Give users access to own folder DELETE"
ON storage.objects FOR delete {USING | WITH CHECK} (
    -- restrict bucket
    ((bucket_id = 'echo-bucket'::text)
    -- only allow if authenticated user's id matches the folder name
    AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1]))
);
```
5. Lastly, you need to set the following environment variables in your Next.js project's .env file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
STORAGE_BUCKET=your-bucket-name
```

### Pinecone Setup

1. Setup a Pinecone account and create a new project in the account dashboard. Copy the API key value from the dashboard to your .env file as ```PINECONE_API_KEY=your-api-key```.
2. Create a new index by running the following command in your Next.js project directory:

```bash
npx tsx app/lib/generate-index.ts
```

### Hugging Face Setup

1. Go to [meta-llama/Meta-Llama-3-8B-Instruct](https://huggingface.co/meta-llama/Meta-Llama-3-8B-Instruct) on Hugging Face. This is a gated model, so you will need to apply for access. Don't worry, access is approved almost instantly once you provide your information.
2. Next, go to your HF account settings and create a new access token from _Account -> Settings -> Access Token_. Copy the value of this access token in your .env file as ```HF_TOKEN=your-token```

### Install and run the project

Firstly,

```bash
npm install
```
then...

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

For more information, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [LlamaIndex Documentation](https://www.llamaindex.ai/)
- [Supabase Documentation](https://supabase.com/docs)
- [Pinecone Documentation](https://docs.pinecone.io/home)

## Known Issues

- Parsing takes too long on PDFs with large number of pages
- LLM response truncates if it’s long

Please report any issues you come across while using this tool - your feedback and contributions are welcome!
