import cors from "cors";
import axios from "axios";
import express from "express";
import bodyParser from "body-parser"

const app = express();
app.use(cors());
const port = 3000;
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

app.post('/submit', (req, res) => {
    const text = req.body.text;
    const audioFile = req.body.files.audiofile;
    console.log('Text: ${text}');
    console.log('Audio file path: ${audioFile}');
    res.redirect('/t2v');
  });

app.get('/t2isubmit', (req, res) => {
    res.render('t2isubmit',{
        text : req.body["Textt2i"]
    });
});
  

app.listen(port,()=>{
    console.log('server running on port ${port}.');
});