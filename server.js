require("dotenv").config();
var express = require("express");
var server = require('http').Server(app);
var exphbs = require("express-handlebars");
var io = require('socket.io')(server);
var {Translate} = require('@google-cloud/translate');
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

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



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
  res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/HTML', (req, res) => {
  res.sendFile(__dirname + '/public/HTML.html');
});

app.get('/css', (req, res) => {
  res.sendFile(__dirname + '/public/css.html');
});
var tech = io.of('/tech');

tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room} room!`);
    })

    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        var translate = new Translate({projectId:'focus-nucleus-240701'});    
         
          var text = data.msg;  
          var target = 'ar';     
          translate
          .translate(text, target)
          .then(results => {
              console.log(results[0]);
              tech.in(data.room).emit(data.msg, results[0]);
             }).catch(err => {console.error('ERROR:', err);});
            });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        tech.emit('message', 'user disconnected');
    })
})



// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
