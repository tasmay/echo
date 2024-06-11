import dotenv from 'dotenv';
import { Pinecone } from '@pinecone-database/pinecone';

dotenv.config()

async function generateIndex() {
  try {
    // connect to pinecone and generate an empty index
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!
    });

    console.debug("  - creating vector store");

    await pc.createIndex({
      name: 'echo',
      dimension: 1024,
      metric: 'euclidean',
      spec: { 
        serverless: { 
          cloud: 'aws', 
          region: 'us-east-1' 
        }
      }
    });

    console.debug("  - done.");
  } catch (err) {
    console.error(err);
    console.log(
      "If your PineconeVectorStore connection failed, make sure to set env vars for PINECONE_API_KEY and PINECONE_ENVIRONMENT.  If the upserts failed, try setting PINECONE_CHUNK_SIZE to limit the content sent per chunk",
    );
    process.exit(1);
  }
  console.log(
    "Done. Try querying the API to ask questions against the imported embeddings.",
  );
  process.exit(0);
}

async function main() {
  await generateIndex()
}

main().catch((err) => console.error(err))