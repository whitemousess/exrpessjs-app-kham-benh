const { db } = require("../model/Database.m");
module.exports = {
  getByUsername: async (Username) => {
    const rs = await db
      .collection("Admin")
      .find({ Username: Username })
      .toArray();
    return rs;
  },
};
