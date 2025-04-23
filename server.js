const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/save-location', (req, res) => {
});

app.listen(3000, () => console.log("✅ Serverul rulează pe portul 3000"));
