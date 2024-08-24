const express = require('express');
const router = express.Router();
const myDB = require("../../DB");
const checkData = require("../../checkData/checkData");
const token = require("../../token/token");
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");
const { writeFile } = require('fs/promises');

const storageTempory = multer.memoryStorage();

const readFiles = multer({
    storage: storageTempory,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2Mo
        files: 2
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seules les images sont jpeg, jpg ou png autorisées !'));
        }
    }
});


router.post("/addcard", readFiles.any(), (req, res) => {
    const data = req.body;
    const listdata = ["titleCard", "postName", "serviceName", "email", "companyName",
        "streetNumber", "districtName", "city", "postalCode", "phoneNumber"];
    const listFieldName = ["companyLogo", "profilPicture"];
    let retourFrontEnd = {};
    // vérifie que toutes les données sont présentes
    Promise.all([
        checkData.checkExistKeyDict(listdata, data),
        checkData.checkFileFieldName(listFieldName, req.files)
    ])
        .then(([valueSql, files]) => {
            //vérifie que l'utilisateur soit connecter
            req.files.buffer = null;
            return Promise.all([
                valueSql,
                files,
                token.checkConnecting(req.cookies)
            ]);
        })
        .then(([valueSql, files, result]) => {
            //ajout la carte de visite en base de donnée
            for (file of files) {
                const uuidName = `${crypto.randomUUID()}-${file.originalname}`;
                file["saveName"] = uuidName;
                valueSql.push(uuidName);
            }
            valueSql.unshift(result["id"]);
            return Promise.all([myDB.insUpdDelSql(
                "INSERT INTO visitCards(idUser, titleCard, postName, serviceName, email,\
                companyName, streetNumber, districtName, city,  postalCode, phoneNumber, companyLogo, profilPicture) \
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                valueSql), files]);
        })
        .then(([result, files]) => {
            //On upload les images sur le serveur
            let listPromise = [];
            for (file of files) {
                const fileSaveName = file.saveName;
                console.log(file);
                const pathStorage = "../../../image/" + file.fieldname;
                const filePath = path.join(__dirname, pathStorage, fileSaveName);
                listPromise.push(fs.writeFile(filePath, file.buffer));

            }
            return Promise.all(listPromise);
        })
        .then(() => {
            retourFrontEnd["result"] = true;
        })
        .catch(err => {
            req.files.buffer = null;
            console.log(err);
            retourFrontEnd["result"] = false;
            if (err.errno === -4058) {
                err.message = "Fichier non sauvegardé";
            }
            retourFrontEnd["message"] = err.message;
        })
        .finally(result => {
            res.send(JSON.stringify(retourFrontEnd));
        });
});

module.exports = router;