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
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
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

io.on("connection", (socket) => {
  
  console.log(socket);

  socket.on('send_message', (data) =>{
    io.sockets.emit('receive_message', {message: data.message, username : data.username})
  })

  });



// // tech namespace
// // var tech = io.of('/tech');

// io.sockets.on('connection', (socket) => {
//    socket.on('join', (data) => {
//        socket.join(data.room);
//        tech.in(data.room).emit('message', `New user joined ${data.room} room!`);
//    })

//    socket.on('message', (data) => {
//        console.log(`message: ${data.msg}`);
//        var translate = new Translate({projectId:'focus-nucleus-240701'});
//          var text = data.msg;
//          var target = 'am';
//          translate
//          .translate(text, target)
//          .then(results => {
//              console.log(results[0]);
//              tech.in(data.room).emit('message', results[0]);
//             }).catch(err => {console.error('ERROR:', err);});
//            });

//    socket.on('disconnect', () => {
//        console.log('user disconnected');

//        tech.emit('message', 'user disconnected');
//    })
// })
// //MINI CODE ***************************************************

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
