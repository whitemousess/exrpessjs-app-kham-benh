const { db } = require("./Database.m");
module.exports = {
  add: async (data) => {
    const rs = await db.collection("Sicks").insertOne({
      SickName: data.SickName,
      Symptom: data.Symptom,
      Desc: data.Desc,
      ID: data.ID,
    });
    return rs;
  },
  getAll: async () => {
    const rs = await db.collection("Sicks").find({}).toArray();
    return rs;
  },
  getByName: async (Name) => {
    const rs = await db.collection("Sicks").find({ SickName: Name }).toArray();
    return rs;
  },
  getByID: async (ID) => {
    const rs = await db.collection("Sicks").find({ ID: ID }).toArray();
    return rs;
  },
  update: async (ID, data) => {
    await db
      .collection("Sicks")
      .updateOne({ ID: ID }, { $set: data }, { upsert: true });
  },
  delete: async (ID) => {
    await db.collection("Sicks").deleteOne({ ID: ID });
  },
  getBySymptoms: async (symptoms) => {
    const rs = await db
      .collection("Sicks")
      .find({ Symptom: { $in: symptoms } })
      .toArray();
    return rs;
  },
  getBySickName: async (partialName) => {
    const regex = new RegExp(partialName, "i");
    const rs = await db
      .collection("Sicks")
      .findOne({ SickName: { $regex: regex } });
    return rs;
  },
};
