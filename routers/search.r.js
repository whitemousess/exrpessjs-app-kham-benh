const app = require('express');
const router = app.Router();
const searchC = require('../controllers/search.c');

router.use('/thuoc', searchC.viewAllDrugs);
router.use('/nguoi-dung', searchC.viewAllUser);
router.use('/bac-si', searchC.viewAllDoctors);
router.use('/dich-vu', searchC.viewAllServices);
router.use('/benh-ly', searchC.viewAllSicks);
router.use('/benh-nhan', searchC.viewAllPatients);
router.use('/ho-so-benh-an', searchC.viewAllRecords);
router.use('/ho-so-benh-ly', searchC.viewRecordsUser);
router.use('/lich-hen', searchC.viewAllAppointments);

module.exports = router;