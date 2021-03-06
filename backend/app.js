// app.js
// Mafia Project RESTful API Backend

try{
    var express = require('express');               // Call express
    var mongoose = require('mongoose');             // Interface for mongodb
    var bodyParser = require('body-parser');        // Middle wear to parse Request Bodies
    var hat = require('hat');                       // Library for generating random ids
    require('dotenv').config();                     // Library to allow the importing of  enviromental variables in .env files
    var cors = require('cors');                     // Cross origin resource sharing
    var colors =require('colors')
    var io = require('socket.io')();                // Define socketio
    console.clear();
} catch(error){
    console.error("ERROR are all the Dependencies installed?");
    console.log(error);
    process.exit(1);
}

// Config
var port = 3001;

// Mongodb Config
mongoose.connect(process.env.DB_URL,{useMongoClient:true}); // Connect to database on Server
console.log("Connecting to " + process.env.DB_URL)
var db = mongoose.connection;

db.once('open', function() {
  // we're connected!
  console.info("Status Code " + mongoose.connection.readyState + " Connected");
});

// When the connection is disconnected
db.on('disconnected', function () {
  console.info( 'Mongoose default connection disconnected'.red);
});

db.on('error', function(){
  console.info( "ERROR Status Code ".Red + mongoose.connection.readyState);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  db.close(function () {
    console.error( 'Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


console.info("Server Starting");


var app = express();                                // Define our app

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));    // Configure app to use bodyParser()
app.use(bodyParser.json());                         // This will let us get data from a POST

// ROUTES FOR API
// ===============================================
var apiRouter = require('./routes/api');
// REGISTER ROUTES --------------------------
// All api routes will be prefixed with /api
app.use('/api', apiRouter);


io.on('connection', (client)=> {
  console.log('a user connected');
  io.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.listen(3002);

app.listen(port);
// console.clear();
console.log("Mafia RESTful API Server Started on PORT ".green + port);
