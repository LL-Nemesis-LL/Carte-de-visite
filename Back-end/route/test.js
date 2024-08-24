const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");

async function sendImg(files, res) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let readStream = fs.createReadStream(file, '');

        let result = await new Promise((resolve, reject) => {
            readStream.on('data', (chunk) => {
                resolve(chunk);
            })
        })

        res.write(`--frame\r\n`);
        res.write(`Content-Type: image/jpg\r\n\r\n`);
        res.write(result);

    }
    return;
}

router.post("/test", (req, res) => {
    console.log("fait");
    const files = req.body["files"];
    let filesFull = [];
    for (file of files) {
        const filePath = path.join(__dirname, "../../image/companyLogo", file);
        filesFull.push(filePath);
    }
    res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');
    console.log(filesFull);
    sendImg(filesFull, res)
        .then((result) => {
            res.end();
        })
        .catch(err => {
            console.error(err);
            res.end();
        })

});

module.exports = router;