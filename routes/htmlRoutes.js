// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    // If the user already has an account send them to the game page
    if (req.user) {
      res.render("index", {
        msg: "Welcome,",
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
      msg: "Welcome,",
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

  app.get("/game1", isAuthenticated, function(req, res) {
    db.Game.findAll({
      where: { gameId: 1 },
      include: [db.User]
    }).then(function(dbGame) {
      ordered = dbGame.map(item => {
        return {user: item.User.userName, score:item.score}
      }).sort((s1, s2) => {
        return s2.score - s1.score
      })
      res.render("game1", {
        game: ordered
      });
    });
  });

  app.get("/game2", isAuthenticated, function(req, res) {
    db.Game.findAll({
      where: { gameId: 2 },
      // order: 'score DESC',
      include: [db.User]
    }).then(function(dbGame) {
      ordered = dbGame.map(item => {
        return {user: item.User.userName, score:item.score}
      }).sort((s1, s2) => {
        return s2.score - s1.score
      })
      res.render("game2", {
        game: ordered
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
