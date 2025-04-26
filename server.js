const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

// 📌 Configurare pentru salvarea imaginilor
const upload = multer({ dest: 'uploads/' });

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
const githubImgUrl = "https://raw.githubusercontent.com/MariaBunas/Cyberpeak-Backend/main/uploads";

// Fetch available images dynamically from GitHub
app.get("/images", async (req, res) => {
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
app.get("/image/:name", async (req, res) => {
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
