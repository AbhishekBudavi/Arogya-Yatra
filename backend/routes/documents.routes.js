// routes/document.route.js
const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const { createDocumentHandler } = require('../controllers/documents.controller');


// Create document (patient uploads document)
router.post('/', verifyJWT, createDocumentHandler);



module.exports = router;
