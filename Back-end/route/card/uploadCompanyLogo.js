const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './../image/companyLogo/');
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv5("https://visitcard.collectivitedemartinique.mq", uuidv5.URL)}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post("/uploadCompanyLogo", upload.single("image"), (req, res) => {
    res.send(JSON.stringify({ "result": true }));
});


module.exports = router;