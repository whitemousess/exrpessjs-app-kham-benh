const { MongoClient } = require("mongodb");
const uri = process.env.DB_URI;
const client = new MongoClient(uri);
const db = client.db("ClinicManagement");
module.exports = {
  db,
};
