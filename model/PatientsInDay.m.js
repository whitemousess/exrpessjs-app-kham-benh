const { ObjectId } = require("mongodb");
const { db } = require("../model/Database.m");
module.exports = {
  add: async (data) => {
    const rs = await db.collection("PatientsInDay").insertOne({
      Username: data.Username,
      Name: data.Name,
      DOB: data.DOB,
      Gender: data.Gender,
      Address: data.Address,
      Note: data.Note,
      Time: data.Time,
      Day: data.Day,
    });
    return rs;
  },
  deleteID: async (ID) => {
    return await db
      .collection("PatientsInDay")
      .deleteOne({ _id: ObjectId(ID) });
  },

  update: async (ID, data) => {
    return await db
      .collection("PatientsInDay")
      .updateOne({ _id: ObjectId(ID) }, { $set: data }, { upsert: true });
  },

  getAll: async () => {
    const rs = await db.collection("PatientsInDay").find({}).toArray();
    return rs;
  },

  getById: async (ID) => {
    const rs = await db.collection("Doctors").findOne({ _id: ObjectId(ID) });
    return rs;
  },

  getByDateUser: async (DATE, Username) => {
    const rs = await db
      .collection("PatientsInDay")
      .find({ Day: DATE, Username: Username })
      .toArray();
    return rs;
  },
};
