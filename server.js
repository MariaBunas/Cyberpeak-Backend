const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from different origins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up multer for handling file uploads
//const storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//        cb(null, "uploads/");
//    },
//    filename: function (req, file, cb) {
//        cb(null, Date.now() + "-" + file.originalname);
//    },
//});
//const upload = multer({ storage: storage });

// 📌 Configurare pentru salvarea imaginilor
const upload = multer({ dest: 'uploads/' });

// POST endpoint to receive image and location
app.post("/api_upload", upload.single("file"), (req, res) => {    
    // const latitude = req.body.latitude;
    // const longitude = req.body.longitude;
    // const name = req.body.name;
    // const severity = req.body.severity;
    // const image = req.body.image;
    // const imagePath = req.file ? req.file.path : null;

    console.log("Entering api_upload service");
    res.json({ message: "Upload successful!", "ok");

    // if (!latitude || !longitude || !imagePath) {
    //     console.log("Invalid data received");
    //     return res.status(400).json({ message: "Invalid data received" });
    // }

    // console.log(`Received name, severity: (${name}, ${severity})`);
    // console.log(`Received location: (${latitude}, ${longitude})`);
    // console.log(`Received image: ${image}`);
    // console.log(`Image saved at: ${imagePath}`);

    // res.json({ message: "Upload successful!", name, severity, imagePath, latitude, longitude });
});

// 📌 Endpoint pentru salvarea locației + imaginii
app.post('/upload', upload.single('image'), (req, res) => {
    let newLocation = req.body.location;
    let imagePath = req.file ? `images/${req.file.filename}` : "No Image";

    // 📍 Salvăm locația în CSV
    fs.appendFile('locations.csv', `\n${newLocation},${imagePath}`, err => {
        if (err) {
            console.error("Eroare la salvare:", err);
            res.status(500).send("Eroare la salvare.");
        } else {
            res.send("Locație + Imagine salvate!");
        }
    });
});

// 📌 Servirea imaginilor pentru frontend
// app.use('/images', express.static(path.join(__dirname, 'uploads')));


// GitHub repository details
const githubImgUrl = 'https://raw.githubusercontent.com/MariaBunas/Cyberpeak-Backend/main/uploads';

// Fetch available images dynamically from GitHub
app.get('/images', async (req, res) => {
    try {
        const response = await axios.get(githubImgUrl, { headers: { "User-Agent": "request" } });
        const imageFiles = response.data
            .filter(file => file.type === "file" && file.name.match(/\.(jpg|jpeg|png|gif)$/))
            .map(file => file.download_url);

        res.json(imageFiles);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).send("Error fetching image list");
    }
});

// Serve individual images dynamically
app.get('/image/:name', async (req, res) => {
    const imageName = req.params.name;
    try {
        const response = await axios.get(`${githubImgUrl}/${imageName}`, { responseType: "arraybuffer" });
        res.set("Content-Type", "image/jpeg");
        res.send(response.data);
    } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).send("Error fetching image");
    }
});

// 📌 Pornirea serverului pe portul 3000
app.listen(3000, () => console.log("✅ Serverul rulează pe portul 3000"));
