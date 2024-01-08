const userM = require("../model/Users.m");
const doctorM = require("../model/Doctors.m");
const adminM = require("../model/Admin.m");
const CryptoJS = require("crypto-js");
const hashLength = 64;

exports.render = async (req, res, next) => {
  try {
    res.render("login", {
      errWrongPassword: "none",
      errWrongUsername: "none",
      display1: "d-block",
      display2: "d-none",
      role: "patient",
    });
  } catch (err) {
    next(err);
  }
};

exports.check = async (req, res, next) => {
  try {
    var user = req.body;

    const notifications = () => {
      return res.render("login", {
        errWrongPassword: "block",
        errWrongUsername: "none",
        Username: user.Username,
        Password: user.Password,
        display1: "d-block",
        display2: "d-none",
        role: user.role,
      });
    };

    const checkUser = await userM.getByUsername(user.Username);
    const checkDoctor = await doctorM.getByUsername(user.Username);
    const checkAdmin = await adminM.getByUsername(user.Username);
    if (
      checkUser.length == 0 &&
      checkDoctor.length == 0 &&
      checkAdmin.length == 0
    ) {
      res.render("login", {
        errWrongPassword: "none",
        errWrongUsername: "block",
        Username: user.Username,
        Password: user.Password,
        display1: "d-block",
        display2: "d-none",
        role: user.role,
      });
    }

    if (checkUser.length > 0) {
      const pwDb = checkUser[0].Password;
      const salt = pwDb.slice(hashLength);
      const pwSalt = user.Password + salt;
      const pwHashed = CryptoJS.SHA3(pwSalt, {
        outputLength: hashLength * 4,
      }).toString(CryptoJS.enc.Hex);

      if (pwDb !== pwHashed + salt) {
        notifications();
      } else {
        req.session.Username = checkUser[0].Username;
        req.session.Name = checkUser[0].Name;
        res.redirect("/");
      }
    } else if (checkDoctor.length > 0) {
      if (checkDoctor[0].Password !== user.Password) {
        notifications();
      } else {
        req.session.Username = checkDoctor[0].Username;
        req.session.Name = checkDoctor[0].Name;
        req.session.Doctor = true;
        res.redirect("/");
      }
    } else if (checkAdmin.length > 0) {
      if (checkAdmin[0].Password !== user.Password) {
        notifications();
      } else {
        req.session.Username = checkAdmin[0].Username;
        req.session.Name = checkAdmin[0].Name;
        req.session.Admin = true;
        res.redirect("/");
      }
    }
  } catch (err) {
    next(err);
  }
};
