const { ObjectID } = require("bson");
const { db } = require("../model/Database.m");
module.exports = {
  add: async (data) => {
    const rs = await db.collection("Appointments").insertOne({
      Username: data.Username,
      Name: data.Name,
      DOB: data.DOB,
      Gender: data.Gender,
      Phone: data.Phone,
      Email: data.Email,
      ID: data.Doctor.ID,
      Doctor: data.Doctor.Name,
      Date: data.Date,
      Time: data.Time,
      Status: data.Status,
      Desc: data.Desc,
      Note: data.Note,
    });
    return rs;
  },
  getAll: async () => {
    const rs = await db.collection("Appointments").find({}).toArray();
    return rs;
  },
  getByName: async (Name) => {
    const rs = await db
      .collection("Appointments")
      .find({ Name: Name })
      .toArray();
    return rs;
  },
  getByID: async (ID) => {
    const rs = await db.collection("Appointments").find({ ID: ID }).toArray();
    return rs;
  },

  getByIDDate: async ({ID,DATE}) => {
    const dateToFind = new Date(DATE);
    const rs = await db.collection("Appointments").find({ID: ID ,Date: dateToFind}).toArray();
    return rs;
  },

  getByUsername: async (Username) => {
    const rs = await db
      .collection("Appointments")
      .find({ Username: Username })
      .toArray();
    return rs;
  },
  changeStatus: async (ID, Status) => {
    const rs = await db
      .collection("Appointments")
      .updateOne({ _id: new ObjectID(ID) }, { $set: { Status: Status } });
    return rs;
  },
  changeNote: async (ID, Note) => {
    const rs = await db
      .collection("Appointments")
      .updateOne({ _id: new ObjectID(ID) }, { $set: { Note: Note } });
    return rs;
  },
  delete: async (ID) => {
    await db.collection("Appointments").deleteOne({ _id: ID });
  },
};
