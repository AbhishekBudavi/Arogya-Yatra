const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const DocumentController = require("../controllers/documents.controller");
const verifyJWT = require("../middlewares/verifyJWT"); 

// Upload document (with file)
router.post("/upload-report", upload.single("file"), verifyJWT, DocumentController.createDocumentHandler);

// Get all documents for a patient
router.get("/:patient_id", verifyJWT, DocumentController.getPatientDocumentsHandler);

module.exports = router;  
