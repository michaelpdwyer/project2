require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var session = require("express-session");





// Requiring passport as we've configured it
var passport = require("./config/passport");

var db = require("./models");

var app = express();

var PORT = process.env.PORT || 3000;

// var server = app.listen(PORT);
// //app.set('port', PORT);
 var http = require('http').Server(app);

// var server = http.createServer(app);
// var io = require('socket.io').listen(server);
// server.listen(8085);
// var {Translate} = require('@google-cloud/translate');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: process.env.SECRET, resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// //MINI CODE ***************************************************
//socket io connection 
var io = require('socket.io')(http);
var game = io.of('/game');

game.on("connection", (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    game.in(data.room).emit('message', `New user joined ${data.room} room!`)
  })
  
  socket.on('send_message', (data) =>{
    console.log(data.message);
    console.log(data.room);
    game.in(data.room).emit('receive_message', {message: data.message, username : data.username})

    // io.sockets.emit('receive_message', {message: data.message, username : data.username})
  })

  });


// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  http.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
