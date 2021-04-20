const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('../db');
const cors = require('cors');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);
const SocketServer = require("../socket");
const db = require("./db.json");
const adminRouter = require("../router");
const path = require("path");
const main = require("./home.json")

app.use(cors());
app.use("*",(req,res,next)=>{
  res.cookie('cookie1', 'value1', { domain : main.admindomain , sameSite: 'lax',httpOnly : true ,expires : new Date(new Date().valueOf() + 30 * 24 * 60 * 60 * 1000),path : "/" });
  next();
});
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
