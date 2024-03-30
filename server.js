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

    const formData = new FormData();
    console.log(req.body.audiofile);
    formData.append('audiofile', fs.createReadStream(req.body.audiofile));

    try {
        const response = await axios.post('http://127.0.0.1:5000/upload-audio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        res.send('File uploaded successfully.');
        console.log("upload success to flask");
    } catch (error) {
        console.error(error);
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