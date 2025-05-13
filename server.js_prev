const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const bodyParser = require("body-parser");
const simpleGit = require('simple-git');

const { google } = require('googleapis');
const { parse } = require('papaparse');

/*
var csvWriter = require('csv-write-stream');
var writer = csvWriter({sendHeaders: false}); //Instantiate var
*/
const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from different origins
// app.use(bodyParser.json());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

/*
// Granting both read and write permission to folder and file
const writeFile = "locations.csv";
console.log("\nGranting both read and write permission to user for " + writeFile); 
fs.chmod(writeFile, fs.constants.S_IRUSR | fs.constants.S_IWUSR, () => { 
    // Check the file mode 
    console.log("Current File Mode:", fs.statSync(writeFile).mode); 
    console.log("Trying to write to file"); 
    // fs.writeFileSync(writeFile, "This file now has been edited."); 
    // console.log("File Contents:", fs.readFileSync(writeFile, 'utf8')); 
}); 

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
                    console.log("File:" + fullpath);
                    if (--remaining === 0) {
                        cb(null, results);
                    }   
                };  
            fs.stat(fullpath, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    console.log("Directory:" + fullpath);
                    getFileTree(fullpath, addIt);
                } else {
                    addIt(null, null);
                }   
            }); 
        }); 
    }); 
};

const dir = "./uploads";
getFileTree( dir, (err, res) => {
    // res.forEach(function(fileName) {
    //    console.log("Found file:" + fileName);
    // });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Store in 'uploads' folder
        // cb(null, "./");
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
*/

const API_KEY = "AIzaSyBE4jeVMYnAio8DgHU8EudkIJyA_M3odFU"; // Replace with your actual API key

var locationsCsvFileId = null;
var listOfFiles = new Map();

async function getLocationsCsvFileId() {

    const fileNameLocationsCsv = "locations.csv";

    // searching it for the first time
    // if (!locationsCsvFileId ) {
    //     const folderId = "1lCpQoNRIPs6Q294Vt7JwDoq5GhPKEf6b";
    //     const url = "https://www.googleapis.com/drive/v3/files?q='" + folderId + "'+in+parents&key=" + API_KEY;
    //     const response = await fetch(url);
    //     const data = await response.json();
    
    //     console.log("Reading file list from GDrive folder: ");
        
    //     if (data.files && data.files.length > 0) {
    //         for(var i=0; i<data.files.length; i++)
    //         {
    //             listOfFiles.set(data.files[i].name, data.files[i].id);
    //             console.log("File: " + data.files[i].name);
    //         }
    //     }

        // get fiel id based on file name used as Key in the map data structure
        locationsCsvFileId = "1bUyyBCnJTHX7VnxaD5Kn18QFdiAPX2c9";//listOfFiles.get(fileNameLocationsCsv);
        if (locationsCsvFileId) {
          console.log("Found " + fileNameLocationsCsv + " file with G_ID: " + locationsCsvFileId);
        }
    //}
    
    return locationsCsvFileId;
}

async function appendToCsv(newRow) {

  getLocationsCsvFileId()
    .then( csvFileId => {
    
      // // Download the existing CSV file
      // const response = await drive.files.get({
      //   csvFileId,
      //   alt: 'media',
      // });
    
      // const csvData = response.data;
      // const rows = parse(csvData, { header: false }).data;
    
      // // Append new row
      // rows.push(newRow);
    
      // // Convert back to CSV format
      // const updatedCsv = rows.map(r => r.join(',')).join('\n');
    
      // // Upload the modified file back to Drive
      // const fileMetadata = { name: 'updated.csv' };
      // const media = { mimeType: 'text/csv', body: Buffer.from(updatedCsv) };
    
      // await drive.files.update({
      //   csvFileId,
      //   media,
      //   resource: fileMetadata,
      // });

      const auth = new google.auth.GoogleAuth({
        keyFile: 'service-account.json',
        scopes: ['https://www.googleapis.com/auth/drive'],
      });
      const drive = google.drive({ version: 'v3', auth });
      
      // Download the existing CSV file
      const getFilePromise = drive.files.get({
        csvFileId,
        alt: 'media',
      });
      getFilePromise. then ( csvData => {

        console.log("Parsing csv data ..");
        // const rows = parse(csvData, { header: false }).data;
        const rows = parse(csvData, { header: true }).data;
        
        console.log("Adding new row ..");
        // Append new row
        rows.push(newRow);
      
        // Convert back to CSV format
        console.log("Convert back to csv format ..");
        const updatedCsv = rows.map(r => r.join(',')).join('\n');
      
        // Upload the modified file back to Drive
        const fileMetadata = { name: 'updated.csv' };
        const media = { mimeType: 'text/csv', body: Buffer.from(updatedCsv) };

        console.log("Updating modified fiel back on G.Drive ..");
        const appedCsvPromise = drive.files.update({
          csvFileId,
          media,
          resource: fileMetadata,
        });
        appedCsvPromise.then( () => {
          console.log('CSV file updated successfully');
        });
      });
                            
    });
}

app.post("/data_append", (req, res) => { 
    
    const locationName = req.body.name;
    const severity = req.body.severity;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const image = req.body.image;

    console.log(`Received name, severity: (${locationName}, ${severity})`);
    console.log(`Received location: (${latitude}, ${longitude})`);
    console.log(`Received image: ${image}`);

    // New location data to append
    const newRow = [locationName, severity, latitude, longitude, image];
    // newRow.push(locationName);
    // newRow.push(severity);
    // newRow.push(latitude);
    // newRow.push(longitude);
    // newRow.push(image);
    
    // Call the function with the file ID
    appendToCsv(newRow);

    console.log("Returning from web service data_append ..");
    res.json({ message: "Append to CSV successful!", locationName, severity, latitude, longitude, image });
});

/*
// POST endpoint to receive image and location
app.post("/data_upload", upload.single("file"), (req, res) => { 

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

    // save data to server file
    var csvFilename = "./uploads/myfile.csv";
    
    // If CSV file does not exist, create it and add the headers
    if (!fs.existsSync(csvFilename)) {
      writer = csvWriter({sendHeaders: false});
      writer.pipe(fs.createWriteStream(csvFilename));
      writer.write({
        header1: 'DATE',
        header2: 'LASTNAME',
        header3: 'FIRSTNAME'
      });
      writer.end();
    } 
    
    // Append some data to CSV the file    
    writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream(csvFilename, {flags: 'a'}));
    writer.write({
      header1: '2018-12-31',
      header2: 'Smith',
      header3: 'John'
    });
    writer.end();
    
    // Append more data to CSV the file    
    writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream(csvFilename, {flags: 'a'}));
    writer.write({
      header1: '2019-01-01',
      header2: 'Jones',
      header3: 'Bob'
    });
    writer.end();
    
    // 📍 Salvăm locația în CSV
    // name	severity latitude longitude image
    const dataFile = './uploads/locations.csv';
    fs.appendFile(dataFile, `\n${locationName},${severity},${latitude},${longitude},${image}`, err => {
        if (err) {
            console.error("Eroare la salvare date:", err);
        //    res.status(500).send("Eroare la salvare date.");
        } else {
  //          res.send("Locație + Imagine salvate!");
            console.log(`New Image and data are saved!`);
        }
    });


    const { exec } = require('child_process');
    exec('git config --global user.email "maria.bunas@e-cdloga.ro"', (err, stdout, stderr) => {
        if (err) {
            console.error("Error setting Git email:", err);
        } else {
            console.log("Git email set successfully.");
        }
    });
    exec('git config --global user.name "MariaBunas"', (err, stdout, stderr) => {
        if (err) {
            console.error("Error setting Git user:", err);
        } else {
            console.log("Git user set successfully.");
        }
    });
        
    // save changes back to github repo as Renderer server doesn't store updates when restarted
    const repoPath = './uploads'; // path-to-your-cloned-repo'; // Replace with the correct path
    const git = simpleGit(repoPath);
    
    // Ensure the directory exists
    if (!fs.existsSync(repoPath)) {
        console.error("Repository path does not exist.");
        // process.exit(1);
    } else {

        // GitHub repository details
        const GITHUB_USERNAME = 'MariaBunas';
        const GITHUB_REPO = 'Cyberpeak-Backend';
        const GITHUB_PAT = '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';
        
        // Set repository URL with authentication
        const REPO_URL = `https://${GITHUB_USERNAME}:${GITHUB_PAT}@github.com/${GITHUB_USERNAME}/${GITHUB_REPO}.git`;
        
        // Configure the Git instance
        git.cwd('/uploads').addRemote('origin', REPO_URL); // '/path-to-your-local-repo') // Change to your repo directory
        
        // Function to commit and push files
        async function pushToGitHub() {
            try {
                await git.add('.');
                await git.commit(`Auto-update: ${new Date().toISOString()}`);
                await git.push('origin', 'main');
                console.log("Changes pushed to GitHub successfully.");
            } catch (err) {
                console.error("Error pushing changes:", err);
            }
        }
        
        // Run at startup or periodically
        pushToGitHub();
    }
    
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
*/

// 📌 Pornirea serverului pe portul 3000
app.listen(3000, () => console.log("✅ Serverul rulează pe portul 3000"));
