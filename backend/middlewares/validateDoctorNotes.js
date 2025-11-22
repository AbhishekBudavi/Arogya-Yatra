const { body, validationResult } = require("express-validator");

/**
 * Middleware to validate clinical note generation request
 */
const validateClinicalNoteGeneration = [
  body("doctor_id")
    .trim()
    .notEmpty()
    .withMessage("doctor_id is required")
    .customSanitizer(value => String(value)),
  
  body("patient_id")
    .notEmpty()
    .withMessage("patient_id is required")
    .customSanitizer(value => String(value)),
  
  body("raw_input")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("raw_input is required - provide doctor's keywords or observations")
    .isLength({ min: 10 })
    .withMessage("raw_input must be at least 10 characters long"),
  
  body("current_symptoms")
    .optional()
    .isString()
    .trim(),
  
  body("additional_notes")
    .optional()
    .isString()
    .trim(),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }
    next();
  },
];

/**
 * Middleware to validate note approval/rejection
 */
const validateNoteAction = [
  body("reason")
    .optional()
    .isString()
    .trim(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateClinicalNoteGeneration,
  validateNoteAction,
};
