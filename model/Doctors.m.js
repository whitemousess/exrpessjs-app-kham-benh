const { db } = require("../model/Database.m");
module.exports = {
  add: async (data) => {
    const rs = await db.collection("Doctors").insertOne({
      Name: data.Name,
      Username: data.Username,
      Password: data.Password,
      Gender: data.Gender,
      Specialist: data.Specialist,
      Phone: data.Phone,
      Title: data.Title,
      ID: data.ID,
      ID_Sick: data.Sick.ID,
      Sick: data.Sick.SickName,
      Image: data.Image,
    });
    return rs;
  },
  getAll: async () => {
    const rs = await db.collection("Doctors").find({}).toArray();
    return rs;
  },
  getByName: async (Name) => {
    const rs = await db.collection("Doctors").find({ Name: Name }).toArray();
    return rs;
  },
  getByID: async (ID) => {
    const rs = await db.collection("Doctors").find({ ID: ID }).toArray();
    return rs;
  },
  getByUsername: async (Username) => {
    const rs = await db
      .collection("Doctors")
      .find({ Username: Username })
      .toArray();
    return rs;
  },
  update: async (ID, data) => {
    await db
      .collection("Doctors")
      .updateOne({ ID: ID }, { $set: data }, { upsert: true });
  },
  delete: async (ID) => {
    await db.collection("Doctors").deleteOne({ ID: ID });
  },
  getBySickName: async (partialName) => {
    const regex = new RegExp(partialName, "i");
    const rs = await db
      .collection("Doctors")
      .findOne({ Sick: { $regex: regex } });
    return rs;
  },
};
