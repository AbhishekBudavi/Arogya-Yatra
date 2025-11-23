export const getPatientId = () => {
  try {
    return localStorage.getItem("patientId");
  } catch (e) {
    return null;
  }
};

// Get hospital ID safely (similar logic)
export const getHospitalId = () => {
  try {
    return localStorage.getItem("hospitalId");
  } catch (e) {
    return null;
  }
};