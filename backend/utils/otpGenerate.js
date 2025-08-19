const crypto = require("crypto");

/**
 * Generate a secure numeric OTP
 * @param {number} length - Number of digits (default: 6)
 * @returns {string} - OTP as a string
 */
function generateSecureOTP(length = 6) {
  if (length < 4 || length > 10) {
    throw new Error("OTP length must be between 4 and 10 digits");
  }

  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, digits.length);
    otp += digits[index];
  }

  return otp;
}

module.exports = generateSecureOTP;
