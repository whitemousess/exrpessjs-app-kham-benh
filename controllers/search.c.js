const drugM = require("../model/Drugs.m");
const doctorM = require("../model/Doctors.m");
const serviceM = require("../model/Services.m");
const sickM = require("../model/Sicks.m");
const userM = require("../model/Users.m");
const RecordsM = require("../model/Records.m");
const UsersM = require("../model/Users.m");
const DrugReportM = require("../model/Drug-Report.m");
const AppointmentM = require("../model/Appointment.m");

exports.viewAllDrugs = async (req, res, next) => {
  try {
    const rs = await drugM.getAll();
    let login = false;

    if (req.session.Username) {
      login = true;
    }
    let role = "patient";

    if (req.session.Doctor) {
      role = "doctor";
    }

    if (req.session.Admin) {
      role = "admin";
    }

    if (req.session.Username) {
      res.render("search-drug", {
        drugs: rs,
        display1: "d-none",
        display2: "d-block",
        role: role,
        login: login,
      });
    } else {
      res.render("search-drug", {
        drugs: rs,
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.viewAllDoctors = async (req, res, next) => {
  try {
    const rs = await doctorM.getAll();
    const rs2 = await sickM.getAll();
    let login = false;

    if (req.session.Username) {
      login = true;
    }
    let role = "patient";

    if (req.session.Doctor) {
      role = "doctor";
    }

    if (req.session.Admin) {
      role = "admin";
    }

    if (req.session.Username) {
      res.render("search-doctor", {
        doctors: rs,
        sicks: rs2,
        display1: "d-none",
        display2: "d-block",
        role: role,
        login: login,
      });
    } else {
      res.render("search-doctor", {
        doctors: rs,
        sicks: rs2,
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.viewAllUser = async (req, res, next) => {
  try {
    const rs = await UsersM.getAll();
    const resAp = await AppointmentM.getAll();
    let role = "patient";
    if (req.session.Admin) {
      role = "admin";
    }
    if (req.session.Username && req.session.Admin) {
      res.render("manager-user", {
        user: rs,
        Appointments: resAp,
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.viewAllServices = async (req, res, next) => {
  try {
    const rs = await serviceM.getAll();
    let login = false;

    if (req.session.Username) {
      login = true;
    }
    let role = "patient";

    if (req.session.Doctor) {
      role = "doctor";
    }
    if (req.session.Admin) {
      role = "admin";
    }

    var info = "";

    if (req.session.info) {
      info = req.session.info;

      delete req.session.info;
    }

    if (req.session.Username) {
      res.render("search-service", {
        services: rs,
        display1: "d-none",
        display2: "d-block",
        role: role,
        info: info,
        login: login,
      });
    } else {
      res.render("search-service", {
        services: rs,
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.viewAllSicks = async (req, res, next) => {
  try {
    const rs = await sickM.getAll();

    let role = "patient";
    let login = false;

    if (req.session.Username) {
      login = true;
    }
    if (req.session.Doctor) {
      role = "doctor";
    }

    if (req.session.Admin) {
      role = "admin";
    }

    var info = "";

    if (req.session.info) {
      info = req.session.info;

      delete req.session.info;
    }

    if (req.session.Username) {
      res.render("search-sick", {
        sicks: rs,
        display1: "d-none",
        display2: "d-block",
        role: role,
        info: info,
        login: login,
      });
    } else {
      res.render("search-sick", {
        sicks: rs,
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.viewAllPatients = async (req, res, next) => {
  try {
    const rs = await userM.getAll();

    let role = "patient";

    if (req.session.Doctor) {
      role = "doctor";
    }

    if (req.session.Admin) {
      role = "admin";
    }

    for (let i = 0; i < rs.length; i++) {
      rs[i].DOB =
        typeof rs[i].DOB == "object"
          ? rs[i].DOB.toLocaleDateString("vi-VN")
          : "";
    }

    if (req.session.Username && req.session.Doctor) {
      res.render("search-patient", {
        patients: rs,
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      res.render("error", {
        patients: rs,
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.viewAllRecords = async (req, res, next) => {
  try {
    const rs = await RecordsM.getAll();

    let role = "patient";

    if (req.session.Doctor) {
      role = "doctor";
    }

    if (req.session.Username && req.session.Doctor) {
      res.render("search-record", {
        records: rs,
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.viewRecordsUser = async (req, res, next) => {
  try {
    // const rs = await RecordsM.getAll();
    // let role = "patient";
    // let login = false;

    // if (req.session.Username) {
    //   login = true;
    // }

    // if (req.session.Username && role == "patient") {
    //   res.render("search-user-record", {
    //     records: rs,
    //     display1: "d-none",
    //     display2: "d-block",
    //     role: role,
    //     login: login,
    //   });
    // } else {
    //   res.render("error", {
    //     display1: "d-block",
    //     display2: "d-none",
    //     role: role,
    //   });
    // }

    let role = "patient";

    if (req.session.Doctor) {
      role = "doctor";
    }

    if (req.session.Username) {
      if (!req.session.Doctor) {
        let login = false;
        if (req.session.Username) {
          login = true;
        }
        const rs = await userM.getByUsername(req.session.Username);
        var u = rs[0];
        u.src = "img/";
        if (u.Gender == "Nữ") {
          u.src += "female.png";
          u.female = "checked";
        } else {
          u.src += "male.png";
          u.male = "checked";
        }

        u.DOBB =
          typeof u.DOB == "object" ? u.DOB.toLocaleDateString("fr-CA") : "";

        u.DOB =
          typeof u.DOB == "object" ? u.DOB.toLocaleDateString("vi-VN") : "";

        const records = await RecordsM.getByUsername(req.session.Username);

        const appointments = await AppointmentM.getByUsername(
          req.session.Username
        );

        for (let i = 0; i < appointments.length; i++) {
          appointments[i].Date =
            typeof appointments[i].Date == "object"
              ? appointments[i].Date.toLocaleDateString("vi-VN")
              : "";
        }

        res.render("search-user-record", {
          u: u,
          uu: u,
          display1: "d-none",
          display2: "d-block",
          editSuccess: "d-none",
          editNoSuccess: "d-none",
          changePasswordSuccess: "d-none",
          changePasswordNoSuccess: "d-none",
          records: records,
          appointments: appointments,
          role: "patient",
          login: login,
        });
      } else {
        res.render("error", {
          display1: "d-block",
          display2: "d-none",
          role: role,
        });
      }
    } else {
      res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.viewAllAppointments = async (req, res, next) => {
  try {
    const rs = await AppointmentM.getAll();

    let role = "patient";

    if (req.session.Admin) {
      role = "admin";
    }

    if (req.session.Username && req.session.Admin) {
      res.render("manager-appointment", {
        appointments: rs,
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  } catch (err) {
    next(err);
  }
};
