const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

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
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// 📌 Pornirea serverului pe portul 3000
app.listen(3000, () => console.log("✅ Serverul rulează pe portul 3000"));
