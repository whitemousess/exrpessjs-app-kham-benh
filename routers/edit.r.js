const app = require("express");
const router = app.Router();
const editC = require("../controllers/edit.c");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/thuoc-dich-vu", editC.getEditDrugService);
router.post("/thuoc/:ID", editC.postEditDrug);
router.post("/thuoc/xoa/:Name", editC.deleteDrug);
router.post("/dich-vu/:ID", editC.postEditService);
router.post("/benh-ly/:ID", editC.postEditSick);
router.post("/bac-si/:ID", upload.single("image"), editC.postEditDoctor);
router.get("/bac-si", editC.getAllSicks);
router.post("/dich-vu/xoa/:ID", editC.deleteService);
router.post("/benh-ly/xoa/:ID", editC.deleteSick);
router.post("/bac-si/xoa/:ID", editC.deleteDoctor);
router.get("/so-benh-nhan-toi-da", editC.getMaxPatients);
router.post("/so-benh-nhan-toi-da", editC.postMaxPatients);
router.post("/lich-lam-viec", editC.postSchedule);
router.post("/nguoidung/xoa/:ID", editC.deleteUser);

router.post("/lich-kham-benh/xoa/:ID",editC.deletePatientInDay)
router.post("/lich-kham-benh/sua/:ID",editC.updatePatientInDay)

module.exports = router;
