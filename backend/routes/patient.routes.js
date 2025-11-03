const express = require('express');
const router = express.Router();
const {registerPatient,
   sendOTP,
  verifyOTP,
  selectPatient, getPatientDashboard,getRecentVisitsController, getPatientsByPhone, createDocumentHandler, getLabReportsHandler,updateDocumentHandler, deleteDocumentHandler,getPrescriptionReportsHandler,

getMedicalHistory,
  createMedicalHistory,
  updateMedicalHistory,
 getPatientQRCodeData,
 getPatientDataByToken
 } = require('../controllers/patient.controller');
const verifyJWT = require('../middleware/verifyJWT');
const upload = require("../middlewares/upload");
const multer = require('multer');



// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Patient service is running',
    timestamp: new Date().toISOString()
  });
});

router.post('/register', registerPatient);
router.get('/login', loginPatient);
router.get('/health',healthCheck)
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/', getPatientsByPhone )
router.post('/select-patient',(verifyJWT("patient")), selectPatient);
router.get('/dashboard', (verifyJWT("patient")), getPatientDashboard);
router.get('/dashboard/visits', (verifyJWT("patient")), getRecentVisitsController);

router.post("/upload-report", (verifyJWT("patient")),upload.single('file'), createDocumentHandler);
router.get("/labreports", getLabReportsHandler);
router.get("/patient/prescriptionReports", getPrescriptionReportsHandler)
router.put("/update-document/:id", verifyToken, upload.single("file"), updateDocumentHandler);

// DELETE document
router.delete("/delete-document/:id", verifyToken, deleteDocumentHandler);

router.get('/medical-history', (verifyJWT("patient")), getMedicalHistory);
router.post('/medical-history', (verifyJWT("patient")), createMedicalHistory);
router.put('/medical-history', (verifyJWT("patient")), updateMedicalHistory);
router.get('/my-qrcode', (verifyJWT("patient")), getPatientQRCodeData);
router.get('/scan-patient', (verifyJWT("patient")), getPatientDataByToken); 
module.exports = router;