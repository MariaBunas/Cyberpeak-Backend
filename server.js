const express = require('express');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const bodyParser = require("body-parser");
const {GoogleAuth} = require('google-auth-library');

const { google } = require('googleapis');
const { parse } = require('papaparse');

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from different origins

// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
    // service account key file from Google Cloud console.
    const KEYFILEPATH = 'melodic-grail-459121-m8-3b0fe9793929.json';
    
    // Request full drive access.
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    
    // Create a service account initialize with the service account key file and scope needed
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES
    });
    
    const driveService = google.drive({version: 'v3', auth});

    console.log("Show current folder content: ");
    const testFolder = './';
    fs.readdirSync(testFolder).forEach(file => {
      console.log(file);
    });
    
    let fileMetadata = {
            'name': 'icon.jpg',
            'parents':  [  "1lCpQoNRIPs6Q294Vt7JwDoq5GhPKEf6b"  ]
        };
    
    let media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream('TestMe.jpg')
        };
    
    let response = await driveService.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
        supportsAllDrives: true
    });
    
    switch(response.status){
        case 200:
            let file = response.result;
            console.log('Created File Id: ', response.data.id);
            break;
        default:
            console.error('Error creating the file, ' + response.errors);
            break;
    }
})();

// 📌 Pornirea serverului pe portul 3000
app.listen(3000, () => console.log("✅ Serverul rulează pe portul 3000"));
