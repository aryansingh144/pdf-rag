// import { Worker } from 'bullmq';
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { QdrantVectorStore } from "@langchain/qdrant";
// import { Document } from "@langchain/core/documents";
// import { CharacterTextSplitter } from "@langchain/textsplitters";
// // import { PDFLoader } from "langchain/document_loaders/fs/pdf"; 
// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// import dotenv from 'dotenv';

// dotenv.config();




// const worker = new Worker(
//     'Queue-for-file-processing', async job => {
//         console.log(`Job:`, job.data)
//         const data = JSON.parse(job.data);
//         // const data = job.data;


// console.log("Starting to load PDF at path:", data.path);
// const loader = new PDFLoader(data.path);
// const docs = await loader.load();
// console.log("PDF loaded, number of docs:", docs.length);

// // const textSplitter = new CharacterTextSplitter({
// //   chunkSize: 300,
// //   chunkOverlap: 0,
// // });

// // const texts = await textSplitter.splitText(docs);
// // console.log(`Texts:`, texts);


// const embeddings = new OpenAIEmbeddings({
//   model: "text-embedding-3-small",
//   apiKey: process.env.OPEN_AI_API_KEY,
// });

// try {
//   const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
//     url: process.env.QDRANT_URL,
//     collectionName: "langchainjs-testing",
//   });
//   console.log("Vector store initialized");

//   await vectorStore.addDocuments(docs);
//   console.log("All docs are added to vector store");
// } catch (error) {
//   console.error(" Error while setting up vector store:", error);
// }

// // console.log("Vector store initialized");

// //     await vectorStore.addDocuments(docs);
// //     console.log(`All docs are added to vector store`);





// // const client = new QdrantClient({ url:`http://localhost:6333` });

// // const embeddings = new OpenAIEmbeddings({
// //     apiKey: process.env.OPEN_AI_API_KEY,
// // });

// // const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {

// //   collectionName: 'pdf-docs',
// // });


// }, { concurrency: 100 ,
//     connection: {
//         host: 'localhost',
//         port: 6379,
//     },
// });



import { Worker } from 'bullmq';
import { VertexAIEmbeddings } from "@langchain/google-vertexai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import dotenv from 'dotenv';

dotenv.config();

const MAX_DOCS = 50; // Max docs per batch

// Helper to split array into chunks
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

const worker = new Worker(
  'Queue-for-file-processing',
  async job => {
    console.log(`Job:`, job.data);

    const data = JSON.parse(job.data);

    console.log("Starting to load PDF at path:", data.path);
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
    console.log("PDF loaded, number of docs:", docs.length);

    const embeddings = new VertexAIEmbeddings({
      model: "gemini-embedding-001",
      project: process.env.GCP_PROJECT_ID,
      location: "us-central1",
    });

    try {
      const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-testing",
      });
      console.log("Vector store initialized");

      // Split docs into chunks of MAX_DOCS
      const docChunks = chunkArray(docs, MAX_DOCS);

      for (let c = 0; c < docChunks.length; c++) {
        const chunk = docChunks[c];
        console.log(`Processing chunk ${c + 1} of ${docChunks.length} (${chunk.length} docs)`);

        // Add docs in this chunk one at a time (to avoid batch errors)
        for (let i = 0; i < chunk.length; i++) {
          try {
            await vectorStore.addDocuments([chunk[i]]);
            console.log(`Added doc ${i + 1} of chunk ${c + 1}`);
          } catch (err) {
            console.error(`Error adding doc ${i + 1} of chunk ${c + 1}:`, err);
          }
        }
      }
      console.log("All docs are added to vector store");
    } catch (err) {
      console.error("Error while setting up vector store:", err);
    }
  },
  {
    concurrency: 100,
    connection: {
      host: 'localhost',
      port: 6379,
    },
  }
);
