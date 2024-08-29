const express = require('express');
const router = express.Router();
const myDB = require("../../DB");
const token = require("../../token/token");
const path = require("path");
const fs = require("fs");

const fileExtension = {
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".jpeg": "image/jpeg"
};

function extractPicturesFromSqlRequest(Pictures) {
    let companyLogo = "companyLogo";
    let profilPicture = "profilPicture";
    let listCompanyLogo = [];
    let listProfilPicture = [];
    let dictPictures = {};
    for (picture of Pictures) {
        listCompanyLogo.push(picture[companyLogo]);
        listProfilPicture.push(picture[profilPicture]);
    }
    dictPictures[companyLogo] = listCompanyLogo;
    dictPictures[profilPicture] = listProfilPicture;
    return dictPictures;
}

function createListPathPicture(dict) {
    let companyLogo = "companyLogo";
    let profilPicture = "profilPicture";
    let listCompanyLogo = [];
    let listProfilPicture = [];
    let pathImage = __dirname + "../../../../image/";
    if (dict[companyLogo] != undefined) {
        for (file of dict[companyLogo]) {
            let fullPath = path.join(pathImage + companyLogo + '/' + file);
            listCompanyLogo.push(fullPath);
        }

    }
    if (dict[profilPicture] != undefined) {
        for (file of dict[profilPicture]) {
            let fullPath = path.join(pathImage + profilPicture + '/' + file);
            listProfilPicture.push(fullPath);
        }
    }
    let listFiles = [];
    if (listProfilPicture.length === listCompanyLogo.length) {
        for (let i = 0; i < listProfilPicture.length; i++) {
            listFiles.push(listProfilPicture[i]);
            listFiles.push(listCompanyLogo[i]);
        }
    }
    return listFiles;
}

async function sendImg(files, res) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (fs.existsSync(file)) {
            let readStream = fs.createReadStream(file, '');

            let result = await new Promise((resolve, reject) => {
                readStream.on('data', (chunk) => {
                    resolve(chunk);
                })
            })
            let contentType = fileExtension[path.extname(file)];
            if (contentType != undefined) {
                res.write(`--frame\r\n`);
                res.write(`Content-Type: ${contentType}\r\n\r\n`);
                res.write(result);
            }

        }
    }
    return;
}

router.get("/getCardsImg", (req, res) => {
    let retourFrontEnd = {};
    token.checkConnecting(req.cookies)
        .then(result => {
            return myDB.selSql(
                "SELECT companyLogo, profilPicture FROM visitCards \
                WHERE idUser=?", [result["id"]], allRows = true
            );
        })
        .then((result) => {
            console.log(result);
            let pictures = extractPicturesFromSqlRequest(result);
            let files = createListPathPicture(pictures);

            res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');

            return sendImg(files, res);

        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            res.end();
        });
});

module.exports = router;