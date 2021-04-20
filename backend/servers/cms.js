const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('../db');
const cors = require('cors');
const app = express();
// const fs = require('fs');
// const certDIR = require("../../../../../dir")
// console.log(certDIR.DIR + 'etc/pki/tls/cert.pem')

// var options = {
//   key: fs.readFileSync(certDIR.DIR +'etc/pki/tls/cert.pem').toString(),
//   cert: fs.readFileSync(certDIR.DIR +'etc/pki/tls/private/hostname.pem').toString(),
//   requestCert: true
// };


const server = require('http').Server( app);
const io  = require('socket.io').listen(server);

const SocketServer = require("../socket");
const db = require("./db.json");
const adminRouter = require("../router");
const path = require("path");

// const main = require("./home.json")
// var redis = require('socket.io-redis');
// io.origins("*:*")
// io.adapter(redis({ host: '51.79.167.211', port: 6379 ,auth_pass : "Kiranku123$"}));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(cors());
app.use(express.static('../clients'));
app.use(express.static('../clients/builds'));
app.use(express.static('../clients/uploads'));
app.use(express.static('../clients/apps'));
app.use(bodyParser.json({limit: "15360mb", type:'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("socketio", io);
app.use('/admin',adminRouter);

SocketServer(io);

app.get('*', (req, res) => {
  res.sendFile(path.join(config.DIR, 'clients/builds/index.html'));  
});


//    start server

mongoose.connect(db.DBCONNECT, { useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true,useCreateIndex : true}).then(() => {
  console.log('Database is connected');
  server.listen(db.ServerPort, () => {
    console.log(`Started server on => http://localhost:${db.ServerPort}`);
  });
  },
  err => { console.log('Can not connect to the database'+ err)}
);
