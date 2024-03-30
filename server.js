const express = require('express');
const app = express();
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const cloudinary = require('cloudinary').v2;
const fs = require("fs")

// cloudinary.config({
//   cloud_name: 'df6o3ijio',
//   api_key: '156859886331183',
//   api_secret: '8orEtDydmMM1gfFqbLBGC8VIqUg',
// //   url:'CLOUDINARY_URL=cloudinary://156859886331183:8orEtDydmMM1gfFqbLBGC8VIqUg@df6o3ijio'
// });
const upload = multer({ dest: 'uploads/' });
app.use(cors());


app.use(bodyParser.urlencoded({ extended: true}));
app.set("view engine", "ejs");
app.use(express.static("images"));
app.use(express.static("styles"));

app.get('/', (req, res) => {
    res.render('home.ejs');
});
  
app.get('/t2v', (req, res) => {
    res.render('t2v.ejs');
});
  
app.get('/t2i', (req, res) => {
    res.render('t2i.ejs');
});
  
// app.get('/submit', (req, res) => {
//     const text1 = req.body.text;
//     const audiofile1 = req.body.audiofile;
//     console.log(text1,audiofile1);
// });

app.post('/submit', upload.single('audiofile'), async (req, res) => {
    const binaryData = req.file.buffer.toString('base64');
    console.log(req.body,binaryData)
    try {
      const response = await axios.post('http://example.com/api', binaryData, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
  
      res.json({ message: 'File uploaded successfully', response });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload file' });
    }
});



app.get('/t2isubmit', (req, res) => {
    res.render('t2isubmit',{
        text : req.body["Textt2i"]
    });
});
  

app.listen(port,()=>{
    console.log(`server running on port ${port}.`);
});