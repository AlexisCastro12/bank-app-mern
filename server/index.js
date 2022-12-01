const express = require("express");
const app = express();
const cors = require("cors");
const dal = require("./dal.js");

//  used to serve static files from public directory
//app.use(express.static());
app.use(cors());
app.use(express.json());

// create user account
app.post("/account/create", function (req, res) {
  // check if account exists
  console.log("CREANDO USUARIO CON PASSWORD Y EMAIL....");
  dal.findOne(req.body.email).then((user) => {
    // if user exists, return error message
    if (user != null) {
      console.log("User already in exists");
      res.send("User already in exists");
    } else {
      // else create user
      dal.create(req.body.name, req.body.email).then((user) => {
        console.log(user);
      });
    }
  });
});

// login user with OAuth2, if exist, not create user, else, create a new entry
app.post("/account/loginGoogle", function (req, res) {
  console.log("CREANDO USUARIO CON LOGIN DE GOOGLE....");
  dal.findOne(req.body.email).then((user) => {
    // if user not exists then create a new entry in Database
    if (user == null) {
      dal.create(req.body.name, req.body.email).then((user) => {
        console.log(user);
      });
    }
  });
});

// find user account
app.get("/account/find", function (req, res) {
  console.log("BUSCANDO USUARIO....");
  console.log(req.query.email);
  dal.findOne(req.query.email).then((user) => {
    console.log(user);
    res.send(user);
  });
});

// update balance - deposit/withdraw amount
app.post("/account/update", function (req, res) {
  console.log("ACTUALIZANDO BALANCE....");
  var balance = Number(req.body.balance);
  var tracking = req.body.tracking;
  dal.update(req.body.email, balance, tracking).then((response) => {
    console.log(response);
  });
});

// all accounts
app.get("/account/movements", function (req, res) {
  console.log("SOLICITANDO MOVIMIENTOS....");
  dal.findOne(req.query.email).then((user) => {
    // if user exists then extract is movements
    if (user != null) {
      dal.allMovements(req.query.email).then((movements) => {
        console.log(movements);
        res.send(movements);
      });
    }
  });
});

var port = 3001;
app.listen(port, () => console.log("Running on port: " + port));
