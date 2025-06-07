import express from 'express';
import cors from 'cors';
import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
import { Queue } from "bullmq";

const queue = new Queue("Queue-for-file-processing", {
    connection: {
        host: 'localhost',
        port: 6379
    },
});


// const uploadDir = path.join(process.cwd(), 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

const upload =multer({
storage: storage
});

const app = express();
app.use(cors());



app.get('/', (req, res) => {
  return res.json({status : 'All good!'});
}
);

app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded'});
  }
  await queue.add("file-sent", JSON.stringify({
    filename:req.file.originalname,
    source:req.file.destination,
    path:req.file.path,
  }));

  return res.json({ status: 'File uploaded successfully', file: req.file });
}
);


app.listen(8000 || process.env.PORT, () => {
  console.log(`Server is running on port: ${8000 || process.env.PORT}`);
}
);

