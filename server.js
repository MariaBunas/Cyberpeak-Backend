const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/save-location', (req, res) => {
    let newLocation = req.body.location;
    fs.appendFile('locations.csv', `\n${newLocation}`, err => {
        if (err) {
            console.error("Eroare la salvare:", err);
            res.status(500).send("Eroare la salvare.");
        } else {
            res.send("Locație salvată cu succes!");
        }
    });
});

app.listen(3000, () => console.log("✅ Serverul rulează pe portul 3000"));
