require('dotenv').config();
const host = process.env.host_back;
const port = parseInt(process.env.port_back);
const errTab = ["pas de base de données", "E-mail pas enregistrer", "mauvais mot de passe"];

const cors = require("cors");
const cookie = require("cookie-parser");
/*
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '/image/profilePicture');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname);
    }
});
*/
const express = require("express");
const app = express();
app.use(express.json());
var corsOptions = {
    origin: process.env.scheme_front + '://' + process.env.host_front + ':' + process.env.port_front,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
}
app.use(cors(corsOptions));
app.use(cookie());

//require route
const signUp = require("./route/signUp");
const signIn = require("./route/signIn");
const logOut = require("./route/logOut");
const addCard = require("./route/addCard");
const getCards = require("./route/getCards");


app.post('/signup', signUp);

app.post("/signin", signIn);

app.post("/addcard", addCard);

app.get("/getCards", getCards);

app.get("/logout", logOut);

// Middleware d'erreur
app.use((err, req, res, next) => {
    console.error(`Erreur capturée: ${err.message}`);
    res.status(500).send('Quelque chose a mal tourné!');
});


app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
