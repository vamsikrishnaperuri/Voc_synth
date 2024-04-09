const express = require('express');
const app = express();
const multer = require('multer');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
const cloudinary = require('cloudinary').v2;
const fs = require("fs")
const path = require('path');
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
            responseType: 'stream',
            headers: {
                'Content-Type': 'multipart/form-data',
                
            },
        });

        if (response.status !== 200) {
            throw new Error(`Error fetching audio: ${response.statusText}`);
        }


        const filename = 'received_audio.wav'; // Adjust filename as needed

        const writeStream = fs.createWriteStream(filename);
        response.data.pipe(writeStream); // Pipe the audio stream to the file

        writeStream.on('finish', () => {
            console.log('Audio file received successfully.');
            // res.send('Audio received!'); // Send confirmation response to the Flask server
        });

        writeStream.on('error', (error) => {
            console.error('Error saving audio file:', error);
            res.status(500).send('Failed to receive audio.'); // Send error response
        });
        console.log("upload success to local storage");

        // const downloadFilePath = ('./received_audio.wav');

        // res.sendFile(downloadFilePath, (err) => {
        //     if (err) {
        //     console.error(err);
        //     res.status(500).send('Error downloading file');
        //     } else {
        //     console.log('File downloaded successfully');
        //     }
        // });
        
        res.send('File uploaded successfully.'+response.data);
        console.log("try executed");
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Failed to upload file.');
    }


});

// const downloadFilePath = './received_audio.wav';

// app.get('/download', (req, res) => {
//   res.sendFile(downloadFilePath, (err) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error downloading file');
//     } else {
//       console.log('File downloaded successfully');
//     }
//   });
// });

app.get('/t2isubmit', (req, res) => {
    res.render('t2isubmit',{
        text : req.body["Textt2i"]
    });
});
  

app.listen(port,()=>{
    console.log(`server running on port ${port}.`);
});