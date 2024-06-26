const DrugsM = require("../model/Drugs.m");
const ServicesM = require("../model/Services.m");
const SicksM = require("../model/Sicks.m");
const fs = require("fs");
const { dirname } = require("path");
const DoctorsM = require("../model/Doctors.m");
const UsersM = require("../model/Users.m");
const AdminM = require("../model/Admin.m");
const { ObjectId } = require("mongodb");

const PatientsInDayM = require("../model/PatientsInDay.m");
const { db } = require("../model/Database.m");

exports.getEditDrugService = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    res.render("editInstruction", {
      display1: "d-none",
      display2: "d-block",
      role: role,
    });
  } catch (err) {
    next(err);
  }
};

exports.postEditDrug = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    var ID = req.params.ID;

    var data = req.body;

    data.ID = ID;

    data.Price = parseInt(data.Price);

    data.Quantity = parseInt(data.Quantity);

    await DrugsM.update(ID, data);

    const rs = await DrugsM.getByID(ID);

    if (rs.length == 0) {
      if (req.session.Username) {
        return res.render("page-not-found", {
          display1: "d-none",
          display2: "d-block",
          role: role,
        });
      } else {
        return res.render("page-not-found", {
          display1: "d-block",
          display2: "d-none",
          role: role,
        });
      }
    }

    rs[0].href = "https://www.google.com/search?tbm=isch&q=" + rs[0].Name;

    rs[0].shop = "https://www.google.com/search?tbm=shop&q=" + rs[0].Name;

    return res.render("detailDrug", {
      data: rs[0],
      display1: "d-none",
      display2: "d-block",
      role: role,
      info: "edit",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteDrug = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    var Name = req.params.Name;

    var ID = Name.split("-")[0];

    Name = Name.split("-")[1];

    await DrugsM.delete(ID);

    req.session.delete = "delete";

    return res.redirect("/thuoc/" + ID + "-" + Name);
  } catch (err) {
    next(err);
  }
};

exports.postEditService = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    var ID = req.params.ID;

    var data = req.body;

    data.ID = ID;

    await ServicesM.update(ID, data);

    req.session.info = "edit";

    res.redirect("/tim-kiem/dich-vu");
  } catch (err) {
    next(err);
  }
};

exports.postEditSick = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    var ID = req.params.ID;

    var data = req.body;

    data.ID = ID;

    await SicksM.update(ID, data);

    req.session.info = "edit";

    res.redirect("/tim-kiem/benh-ly");
  } catch (err) {
    next(err);
  }
};

exports.postEditDoctor = async (req, res, next) => {
  let role = "patient";

  if (req.session.Admin) {
    role = "admin";
  }

  if (!req.session.Admin) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    var ID = req.params.ID;
    if (req.file) {
      req.body.image = req.file.buffer.toString("base64");
    }
    var data = req.body;

    data.ID = ID;
    const checkUserM = await UsersM.getByUsername(req.body.Username);
    const checkDoctorM = await DoctorsM.getByUsername(req.body.Username);
    const checkAdmin = await AdminM.getByUsername(req.body.Username);

    if (
      (checkUserM.length > 0 && checkUserM[0].Name != req.body.Name) ||
      (checkDoctorM.length > 0 && checkDoctorM[0].Name != req.body.Name) ||
      (checkAdmin.length > 0 && checkAdmin[0].Name != req.body.Name)
    ) {
      res.render("search-doctor", {
        error: true,
      });
    } else {
      await DoctorsM.update(ID, data);

      req.session.info = "edit";

      res.redirect("/tim-kiem/bac-si");
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllSicks = async (req, res, next) => {
  try {
    const sicks = await SicksM.getAll();

    // res.json(sicks)

    res.render("search-doctor", {
      sicks: sicks,
      display1: "d-block",
      display2: "d-none",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteService = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    var ID = req.params.ID;

    await ServicesM.delete(ID);

    req.session.info = "delete";

    res.redirect("/tim-kiem/dich-vu");
  } catch (err) {
    next(err);
  }
};

exports.deleteSick = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    var ID = req.params.ID;

    await SicksM.delete(ID);

    req.session.info = "delete";

    res.redirect("/tim-kiem/benh-ly");
  } catch (err) {
    next(err);
  }
};

exports.deleteDoctor = async (req, res, next) => {
  let role = "patient";

  if (req.session.Admin) {
    role = "admin";
  }

  if (!req.session.Admin) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    var ID = req.params.ID;

    await DoctorsM.delete(ID);

    req.session.info = "delete";

    res.redirect("/tim-kiem/bac-si");
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    var ID = req.params.ID;
    await UsersM.delete(ID);
    req.session.info = "delete";
    res.redirect("/tim-kiem/nguoi-dung");
  } catch (error) {
    next(error);
  }
};

exports.getMaxPatients = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    let data = fs.readFileSync("./model/MaxPatient.json");

    data = JSON.parse(data);

    res.render("max-patient", {
      data: data,
      display1: "d-none",
      display2: "d-block",
      role: role,
    });
  } catch (err) {
    next(err);
  }
};

exports.postMaxPatients = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    var data = { max: req.body.max };

    fs.writeFileSync("./model/MaxPatient.json", JSON.stringify(data), {
      encoding: "utf-8",
    });

    return res.redirect("/chinh-sua/so-benh-nhan-toi-da");
  } catch (err) {
    next(err);
  }
};

exports.postSchedule = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    await DoctorsM.update(req.session.Username, req.body);
  } catch (err) {
    next(err);
  }
};

exports.deletePatientInDay = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  try {
    const rs = await PatientsInDayM.deleteID(req.params.ID);

    if (rs) {
      res.redirect("/tai-lieu/danh-sach-kham-benh");
    }
  } catch (err) {
    next(err);
  }
};

exports.updatePatientInDay = async (req, res, next) => {
  let role = "patient";

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (!req.session.Doctor) {
    if (req.session.Username) {
      return res.render("error", {
        display1: "d-none",
        display2: "d-block",
        role: role,
      });
    } else {
      return res.render("error", {
        display1: "d-block",
        display2: "d-none",
        role: role,
      });
    }
  }

  const data = req.body;

  try {
   
    const rs = await PatientsInDayM.update(req.params.ID, data);

    if (rs) {
      res.redirect("/tai-lieu/danh-sach-kham-benh");
    }
  } catch (err) {
    next(err);
  }
};
