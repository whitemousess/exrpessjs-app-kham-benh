require("dotenv").config();
const hbs = require("express-handlebars");
const express = require("express");
const session = require("express-session");
const { urlencoded } = require("express");
const sickM = require("./model/Sicks.m");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
//Use Session
app.set("trust proxy", 1);
app.use(
  session({
    secret: "secret-key-123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

//Router and model
const RegisterRouter = require("./routers/register.r");
const LoginRouter = require("./routers/login.r");
const LogoutRouter = require("./routers/logout.r");
const SearchRouter = require("./routers/search.r");
const DetaiDrugRouter = require("./routers/detail-drug.r");
const ProfileRouter = require("./routers/profile.r");
const DetailDoctorRouter = require("./routers/detail-doctor.r");
const DocumentRouter = require("./routers/doc.r");
const EditRouter = require("./routers/edit.r");

const doctorM = require("./model/Doctors.m");

//Use static resources
app.use(express.static(path.join(__dirname, "/public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
//Template engine
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "/views/layouts"),
    partialsDir: [path.join(__dirname, "/views/partials")],
    helpers: {
      eq: (a, b) => {
        return a == b;
      },

      other: function (a, b, options) {
        return a !== b ? options.fn(this) : options.inverse(this);
      },

      formatBOD: (a) => {
        const reverse = a.split("-");
        return reverse.reverse().join("/");
      },

      CountAppointments: (a, b) => {
        const count = a.filter((user) => user.Username === b);
        if (count.length > 0) {
          return count.length;
        }else{
          return "Chưa khám"
        }
      },

      ifEquals: function (a, b, options) {
        if (a === b) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      sum: function (a, b) {
        return a + b;
      },

      createInput: function (n) {
        var listRow = "";
        for (var i = 0; i < n; ++i) {
          listRow += `
                <tr>
                    <th scope="row" class="text-center">${i + 1}</th>
                    <td class="text-center"><input type="number" class="text-center" name="sobenhnhan-${
                      i + 1
                    }" min="0"></td>
                    <td class="text-center"><input type="number" class="text-center" name="doanhthu-${
                      i + 1
                    }" min="0"></td>
                    <td class="text-center"><input type="text" class="text-center" id="tyle-${
                      i + 1
                    }" name="tyle-${
            i + 1
          }" required onkeydown="return false;" style="caret-color: transparent !important;" autocomplete="off"></td>
                </tr>
                `;
        }
        return listRow;
      },
      createOutput: function (n) {
        var listRow = "";
        for (var i = 0; i < n; ++i) {
          listRow += `
                <tr>
                    <th scope="row" class="text-center">${i + 1}</th>
                    <td class="text-center"><input type="number" class="text-center" name="sobenhnhan-${
                      i + 1
                    }" value="{{data.sobenhnhan-${i + 1}}}" min="0"></td>
                    <td class="text-center"><input type="number" class="text-center" name="doanhthu-${
                      i + 1
                    }" value="{{data.doanhthu-${i + 1}}}" min="0"></td>
                    <td class="text-center"><input type="text" class="text-center" id="tyle-${
                      i + 1
                    }" name="tyle-${i + 1}" value="{{data.tyle-${
            i + 1
          }}}" required onkeydown="return false;" style="caret-color: transparent !important;" autocomplete="off"></td>
                </tr>
                `;
        }
        return listRow;
      },
      indexOf: function (context, ndx) {
        return context[ndx];
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

//Route

app.use("/dang-ky-tai-khoan", RegisterRouter);
app.use("/dang-nhap", LoginRouter);
app.use("/dang-xuat", LogoutRouter);
app.use("/tim-kiem", SearchRouter);
app.use("/thuoc", DetaiDrugRouter);
app.use("/tai-khoan", ProfileRouter);
app.use("/bac-si", DetailDoctorRouter);
app.use("/tai-lieu", DocumentRouter);
app.use("/chinh-sua", EditRouter);
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res, next) => {
  const doctors = await doctorM.getAll();

  let role = "patient";
  let login = false;

  if (req.session.Doctor) {
    role = "doctor";
  }

  if (req.session.Admin) {
    role = "admin";
  }

  if (req.session.Username) {
    login = true;
  }

  if (req.session.Username) {
    res.render("home", {
      display1: "d-none",
      display2: "d-block",
      doctors: doctors,
      role: role,
      login: login,
    });
  } else {
    res.render("home", {
      display1: "d-block",
      display2: "d-none",
      doctors: doctors,
      role: role,
    });
  }
});

app.all("*", function (req, res) {
  let role = "patient";
  if (req.session.Doctor) {
    role = "doctor";
  }
  if (req.session.Username) {
    res.render("page-not-found", {
      display1: "d-none",
      display2: "d-block",
      role: role,
    });
  } else {
    res.render("page-not-found", {
      display1: "d-block",
      display2: "d-none",
      role: role,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
