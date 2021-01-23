// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

const { v4: uuidv4 } = require('uuid');
//uuidv4();

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    console.log("******hitting sign up");
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(user => db.UserDetails.create({ UserId: user.id }))
      .then(() => res.redirect(307, "/api/login"))
      .catch(err => {
        res.status(401).json(err);
      });
  });

  app.put("/api/userDetails", (req, res) => {
    if (req.user) {
      db.UserDetails.update(req.body, {
        where: { UserId: req.user.id }
      })
        .then(() => {
          res.status(200).end();
        })
        .catch(err => {
          res.status(500).json(err);
        });
    }
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      db.User.findByPk(req.user.id, {
        attributes: ["id", "email"],
        include: db.UserDetails
      })
        .then(data => res.status(200).json(data))
        .catch(() => res.status(500).end());
    }
  });

  /* trivia game routes */
  
  app.get("/api/myscores", (req, res) => {
    if (!req.user) {
      res.json({});
    }
    else {
      db.User.findByPk(req.user.id, {
        attributes: ["id", "email"],
        include: db.Scores,
        order: [ [db.Scores, "score", "desc"] ]
      })
        .then(data => res.json(data));
    }
  });

  app.get("/api/highscores", (req, res) => {
    db.Scores.findAll({
      include: {
        model: db.User,
        attributes: ["email"],
        include: {
          model: db.UserDetails,
          attributes: ["userName"]
        }
      },
      order: [ ["score", "desc"] ],
      limit: 10
    })
      .then(data => res.json(data));
  });

  app.post("/api/myscores", (req, res) => {
    if (req.user) {
      db.Scores.create({
        score: req.body.score,
        UserId: req.user.id
      })
        .then(data => res.json(data));
    }
  });
};
