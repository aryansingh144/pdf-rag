import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
app.use(cors());

 const upload =multer({
  dest: 'uploads/'
});


app.get('/', (req, res) => {
  return res.json({status : 'All good!'});
}
);

app.post('/photos/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded'});
  }
  return res.json({ status: 'File uploaded successfully', file: req.file });
}
);


app.listen(8000 || process.env.PORT, () => {
  console.log(`Server is running on port: ${8000 || process.env.PORT}`);
}
);

