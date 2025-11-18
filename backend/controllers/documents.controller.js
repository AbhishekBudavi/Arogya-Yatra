// controllers/document.controller.js
const jwt = require('jsonwebtoken');
const { createDocument, getDocumentsByPatient,countDocumentsByType } = require("../models/documents.model");

async function createDocumentHandler(req, res) {
  try {
    const { patient_id, mobile, username, email } = req.user || {}; 
    // from JWT middleware
    console.log(patient_id);
    if (!patient_id) {
      return res.status(401).json({ error: "Unauthorized: Patient ID missing" });
    }

    // File path from multer
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const { document_type, document_category, document_data } = req.body;

    // Validate required fields
    if (!filePath || !document_type || !document_category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure document_data is parsed (if stringified in frontend)
    let parsedData = {};
    try {
      parsedData =
        typeof document_data === "string" ? JSON.parse(document_data) : document_data;
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON in document_data" });
    }

    // Prepare created_by & updated_by
    const creatorIdentifier = username || mobile || email || `patient_${patient_id}`;

    // Create document in DB
    const createdDoc = await createDocument({
      patient_id,
      document_url: filePath,
      document_type,
      document_category,
      document_data: parsedData,
      created_by: creatorIdentifier,
      updated_by: creatorIdentifier,
    });

    res.status(201).json({
      message: "Document created successfully",
      document: createdDoc,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Fetch documents for the logged-in patient
async function getPatientDocumentsHandler(req, res) {
  try {
    const { patient_id } = req.user;
    if (!patient_id) {
      return res.status(401).json({ error: "Unauthorized: Patient ID missing" });
    }

    const documents = await getDocumentsByPatient(patient_id);
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


module.exports = {
  createDocumentHandler,
  getPatientDocumentsHandler,
  getDocumentCounts
};
