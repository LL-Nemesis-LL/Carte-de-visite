const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require('crypto');
const { v5: uuidv5 } = require('uuid');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './../image/profilePicture/');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv5("https://visitcard.collectivitedemartinique.mq", uuidv5.URL)}-${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },// 2Mo
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            console.log('ok')
            return cb(null, true);
        } else {
            console.log("une erreur");
            cb('Erreur: Seules les images sont jpeg, jpg ou png autorisées !');
        }
    }
});

router.post("/uploadProfilPicture", upload.single("image"), (req, res) => {
    console.log(req);
    res.send("image reçu");
});


module.exports = router;