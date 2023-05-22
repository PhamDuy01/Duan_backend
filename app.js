const express = require("express");
// const cors = require("cors");
const body_parser = require ('body-parser');
const userRouter = require('./routers/user.router');

const app = express();

app.use(body_parser.json());
app.use('/', userRouter);
// app.use(cors());
// app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcone to contact book application."});

});


module.exports= app;