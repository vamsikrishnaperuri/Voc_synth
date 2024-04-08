const express = require('express');
const app = express();
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const cloudinary = require('cloudinary').v2;
const fs = require("fs")
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
app.post('/submit', upload.single('audiofile'), async(req, res) => {
    console.log(req.file);

    const fileStream = fs.createReadStream(req.file.path);
    const arrayBuffer = await new Promise((resolve, reject) => {
        const chunks = [];
        fileStream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        fileStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        fileStream.on('error', reject);
    });
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: req.file.type });
    console.log(blob);

    //Text data
    const textData = req.body.text;

    // Create a new FormData object
    const formData = new FormData();

    // Append the Blob to the formData
    formData.append('audiofile', blob);
    formData.append('text', textData);


    console.log(formData)
    try {
        const response = await axios.post('http://127.0.0.1:5000/upload-audio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        res.send('File uploaded successfully.'+response.data);
        console.log("upload success to flask");
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Failed to upload file.');
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