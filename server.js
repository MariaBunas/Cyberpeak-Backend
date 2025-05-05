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
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

const dir = "./";
var results = {}; 
fs.readdir(dir, function(err, list) {
    if (err) {
        console.log("Error:" + err);
    }  else { 
        var remaining = list.length;
        if (!remaining) {
            console.log("Results: none");
        } else { 
            list.forEach(function(file) {
                var fullpath = dir + '/' + file,
                    addIt = function(err, res) {
                        results[file] = res;
                        if (--remaining === 0) {
                            console.log("Results:" + results);
                        }   
                    };  
                fs.stat(fullpath, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        getFileTree(fullpath, addIt);
                    } else {
                        addIt(null, null);
                    }   
                }); 
            }); 
        }
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, "uploads/"); // Store in 'uploads' folder
        cb(null, "./");
    },
    filename: function (req, file, cb) {
        const customFilename = req.body.image || `image-${Date.now()}`; // Use user's filename or a default one
        // cb(null, customFilename + "." + file.mimetype.split("/")[1]); // Preserve file extension
        console.log(`Image filename for multer: ${customFilename}`);
        console.log(file);
        cb(null, customFilename);
    },
});
const upload = multer({ storage: storage });

// 📌 Configurare pentru salvarea imaginilor
// const upload = multer({ dest: 'uploads/' });

// POST endpoint to receive image and location
app.post("/data_upload", upload.single("file"), (req, res) => { 
// app.post("/data_upload", (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const locationName = req.body.name;
    const severity = req.body.severity;
    const image = req.body.image;
    const imagePath = req.file ? req.file.path : null;
    let imageNewPath = req.file ? `./${req.file.filename}` : "No Image";

    console.log("Entering data_upload service");
    console.log(`Image filename: ${imageNewPath}`);
    console.log(`Image file path: ${imagePath}`);
    
    if (!latitude || !longitude || !imagePath) {
        console.log("Invalid data received");
        return res.status(400).json({ message: "Invalid data received" });
    }

    console.log(`Received name, severity: (${locationName}, ${severity})`);
    console.log(`Received location: (${latitude}, ${longitude})`);
    console.log(`Received image: ${image}`);
    console.log(`Image saved at: ${imagePath}`);

function getFileTree(dir, cb) {
    var results = {}; 
    fs.readdir(dir, function(err, list) {
        if (err) {
            return cb(err);
        }   
        var remaining = list.length;
        if (!remaining) {
            return cb(null, results);
        }   
        list.forEach(function(file) {
            var fullpath = dir + '/' + file,
                addIt = function(err, res) {
                    results[file] = res;
                    if (--remaining === 0) {
                        cb(null, results);
                    }   
                };  
            fs.stat(fullpath, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    getFileTree(fullpath, addIt);
                } else {
                    addIt(null, null);
                }   
            }); 
        }); 
    }); 
};

    
    // 📍 Salvăm locația în CSV
    // name	severity latitude longitude image
    //const dataFile = 'https://raw.githubusercontent.com/MariaBunas/Cyberpeak-Backend/main/locations.csv';
    const dataFile = 'https://raw.githubusercontent.com/MariaBunas/Cyberpeak-Backend/refs/heads/main/locations.csv';
    fs.appendFile(dataFile, `\n${locationName},${severity},${latitude},${longitude},${image}`, err => {
        //if (err) {
       //     console.error("Eroare la salvare date:", err);
        //    res.status(500).send("Eroare la salvare date.");
       // } else {
            res.send("Locație + Imagine salvate!");
      // }
    });
    
    // res.json({ message: "Upload successful!", locationName, severity, imagePath, latitude, longitude });
    res.json({ message: "Upload successful!", locationName, severity, image, latitude, longitude });
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
