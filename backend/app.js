const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./db');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);
const db = require("./servers/db.json");
const adminRouter = require("./router");
const path = require("path");

app.use(cors());
app.use(express.static('./clients'));
app.use(express.static('./clients/pokerbuild'));
app.use(express.static('./clients/uploads'));
app.use(express.static('./clients/apps'));
app.use(bodyParser.json({limit: "15360mb", type:'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("io", io);
app.use('/admin',adminRouter);
 
// SocketServer(io);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(config.DIR, 'clients/pokerbuild/index.html'));
// });


//    start server

mongoose.connect(db.TESTDB, { useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true,useCreateIndex : true}).then(() => {
  console.log('Database is connected');
  server.listen(db.ServerPort, () => {
    console.log(`Started server on => http://localhost:${db.ServerPort}`);
  });
  },
  err => { console.log('Can not connect to the database'+ err)}
);
