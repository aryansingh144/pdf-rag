import { Worker } from 'bullmq';
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Document } from "@langchain/core/documents";
import { CharacterTextSplitter } from "@langchain/textsplitters";
// import { PDFLoader } from "langchain/document_loaders/fs/pdf"; 
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import dotenv from 'dotenv';

dotenv.config();




const worker = new Worker(
    'file-upload-queue', async job => {
        console.log(`Job:`, job.data)
        const data = JSON.parse(job.data);
        // const data = job.data;


console.log("Starting to load PDF at path:", data.path);
const loader = new PDFLoader(data.path);
const docs = await loader.load();
console.log("PDF loaded, number of docs:", docs.length);

// const textSplitter = new CharacterTextSplitter({
//   chunkSize: 300,
//   chunkOverlap: 0,
// });

// const texts = await textSplitter.splitText(docs);
// console.log(`Texts:`, texts);



//1111
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPEN_AI_API_KEY,
});
;


try {
  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: "langchainjs-testing",
  });
  console.log("Vector store initialized");

  await vectorStore.addDocuments(docs);
  console.log("All docs are added to vector store");
} catch (error) {
  console.error(" Error while setting up vector store:", error);
}


}, { concurrency: 100 ,
    connection: {
        host: 'localhost',
        port: 6379,
    },
});


