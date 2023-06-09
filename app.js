const express = require("express");
const cors = require("cors");
const body_parser = require('body-parser');
const path = require('path');
const userRouter = require('./routers/index.router');

const app = express();

app.use(body_parser.json());
// app.use('/', userRouter(app));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.json());

app.use("/", express.static(path.join(__dirname, "/public")));

userRouter(app)

app.get("/", (req, res) => {
    res.json({ message: "Welcone to contact book application." });
});
 
module.exports = app;