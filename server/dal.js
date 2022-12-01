const mongoose = require("mongoose");
require('dotenv').config();

const url = process.env.DATABASE_URL;
const userModel = require("./userModel");
//  const url = 'mongodb://localhost:27017';  //Local development

//Connect to mongodb
mongoose
  .connect(url)
  .then(() => console.log("Connected successfully to db server"))
  .catch((error) => {
    console.log(error);
  });

// create user account using the Model.insertOne function
function create(name, email) {
  return new Promise((resolve, reject) => {
    //const collection = db.collection("users"); //Creating or searching a new collection called users
    const doc = { name, email, balance: 0, movements: [] }; //we don't need the password because firebase is managing it
    userModel.create(doc, function (err) {
      err ? reject(err) : resolve(doc);
    });
  });
}
// find user account
function findOne(email) {
  return new Promise((resolve, reject) => {
    userModel.findOne({ email: email }, function (err, user) {
      err ? reject(err) : resolve(user);
    });
  });
}

// update - deposit/withdraw amount
function update(email, balance, tracking) {
  return new Promise((resolve, reject) => {
    userModel
      .updateOne(
        { email: email },
        { $set: { balance: balance }, $push: { movements: tracking } },
        function (err, document) {
          err ? reject(err) : resolve(document);
        }
      );
  });
}

// return all users by using the collection.find method
function allMovements(email) {
  return new Promise((resolve, reject) => {

    userModel.findOne({ email: email }, function (err, user) {
      err ? reject(err) : resolve(user.movements);
    });
  });
}

module.exports = { create, findOne, update, allMovements };
