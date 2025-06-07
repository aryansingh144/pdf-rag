import { Worker } from 'bullmq';
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { CharacterTextSplitter } from "@langchain/textsplitters";


const worker = new Worker(
    'Queue-for-file-processing', async job => {
        console.log(`Job:`, job.data)
        const data = JSON.parse(job.data);


const loader = new PDFLoader(data.path);
const docs = await loader.load();

// const textSplitter = new CharacterTextSplitter({
//   chunkSize: 300,
//   chunkOverlap: 0,
// });

// const texts = await textSplitter.splitText(docs);
// console.log(`Texts:`, texts);


const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPEN_AI_API_KEY,
});

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
  url: process.env.QDRANT_URL,
  collectionName: "langchainjs-testing",
});


await vectorStore.addDocuments(docs);
console.log(`Documents added to vector store:`, docs.length);

// const client = new QdrantClient({ url:`http://localhost:6333` });

// const embeddings = new OpenAIEmbeddings({
//     apiKey: process.env.OPEN_AI_API_KEY,
// });

// const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {

//   collectionName: 'pdf-docs',
// });


}, { concurrency: 100 ,
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

