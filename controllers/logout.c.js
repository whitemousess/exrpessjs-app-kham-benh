exports.logout = async (req, res, next) => {
  try {
    delete req.session.Username;

    delete req.session.Name;

    delete req.session.Doctor;

    delete req.session.Admin;

    res.redirect("/dang-nhap");
  } catch (err) {
    next(err);
  }
};
