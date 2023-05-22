const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb://127.0.0.1:27017/Qly_ban_hoa').on('open', () =>{
    console.log("MoongDb Connected");
}).on('error',()=>{
    console.log("MoongDb Connection error");
});

module.exports= connection;