// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
        res.render("index", {
          msg: "Welcome!",
          userName: req.user.userName
        });
      //res.redirect("/game");
      
        return;
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/game");
      return;
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/game", isAuthenticated, function(req, res) {
    res.render("index", {
      msg: "Welcome!",
      userName: req.user.userName
    });
  });

  

  // // Load example page and pass in an example by id
  // app.get("/score/:id", function(req, res) {
  //   db.Game.findAll({ where: { gameId: req.params.id } }).then(function(
  //     dbExample
  //   ) {
  //     res.render("game" + req.params.id, {
  //       example: dbExample
  //     });
  //   });
  // });

  app.get("/game1", function(req, res) {
    db.Game.findAll({ where: { gameId: 1 } }).then(function(
      dbExample
    ) {
      res.render("game1", {
        example: dbExample
      });
    });
  });

  app.get("/game2", function(req, res) {
    db.Game.findAll({ where: { gameId: 2 } }).then(function(
      dbExample
    ) {
      res.render("game2", {
        example: dbExample
      });
    });
  });


  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
