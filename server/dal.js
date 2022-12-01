const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db = null;

// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    console.log("Connected successfully to db server");

    // connect to myproject database
    db = client.db('bankMERN');
});

// create user account using the collection.insertOne function
function create(name, email) {
    return new Promise((resolve, reject) => {
      const collection = db.collection('users');  //Creating or searching a new collection called users
      const doc = {name, email, balance:0, movements: []}; //we don't need the password because firebase is managing it
      collection.insertOne(doc, {w:1}, function(err,result){
        err ? reject(err) : resolve(doc);
      });
    });
}
// find user account
function findOne(email) {
    return new Promise((resolve, reject) => {
        const customers = db
            .collection('users')
            .findOne({ email: email })
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));
    })
}

// update - deposit/withdraw amount
function update(email, balance, tracking) {
    return new Promise((resolve, reject) => {
        const customers = db
            .collection('users')
            .updateOne(
                { email: email },
                { $set: { balance: balance }, $push:{movements: tracking} },
                { returnOriginal: false },
                function (err, documents) {
                    err ? reject(err) : resolve(documents);
                }
            );


    });
}

// return all users by using the collection.find method
function allMovements(email) {
    return new Promise((resolve, reject) => {
      const customers = db
      .collection('users')  //Accessing to collection
      .findOne({email: email})
      .then((doc) => {
        resolve(doc.movements)
      })  //Send documents by promise
      .catch((err) => reject(err));
    })
}


module.exports = { create, findOne, update, allMovements };