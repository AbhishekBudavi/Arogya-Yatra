"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import api from '../../../utils/api'
import {
  CheckCircle2,
  User,
  Search,
  Phone,
  MapPin,
  ChevronDown,
  Camera,
  RotateCcw,
  Check,
  X,
} from "lucide-react";

// Patient Photo Capture Component
const PatientPhotoCapture = ({ onPhotoTaken }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: false
      });

      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      console.error("Camera access error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Attach stream to video element when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Set canvas size to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
      setImage(imageSrc);
      onPhotoTaken(imageSrc); // Call the parent callback
      stopCamera();
    }
  };

  const retake = () => {
    setImage(null);
    setError(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-gray-50 rounded-lg p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {!cameraActive && !image && (
          <div className="text-center">
            <div className="w-full h-40 mx-auto bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
            <button
              onClick={startCamera}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full justify-center"
            >
              <Camera className="w-5 h-5 mr-2" />
              {isLoading ? "Starting Camera..." : "Take Patient Photo"}
            </button>
          </div>
        )}

        {cameraActive && !image && (
          <div className="text-center">
            <div className="relative inline-block w-full h-40">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-40 object-cover bg-black rounded-lg shadow-md"
                style={{ objectFit: "cover", background: "#000" }}
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-lg pointer-events-none"></div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-4 space-x-3 ">
              <button
                onClick={capture}
                className="inline-flex mx-2 items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture
              </button>
              <button
                onClick={stopCamera}
                className="inline-flex mx-2 items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {image && (
          <div className="text-center">
            <div className="relative inline-block mb-4 w-full h-40">
              <img
                src={image}
                alt="Captured patient photo"
                className="w-full h-40 object-cover rounded-lg shadow-md"
                style={{ objectFit: "cover" }}
              />
              
<Image
  src={image}
  alt="Captured patient photo preview"
  fill
  className='w-full h-40 object-cover rounded-lg shadow-md'
  priority
/>
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            </div>
            <div className="space-x-3">
              <button
                onClick={retake}
                className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-center text-xs text-gray-500">
        <p>• Ensure good lighting for clear photos</p>
        <p>• Position face within the frame</p>
      </div>
    </div>
  );
};

// Section Navigation Buttons
function SectionNav({ activeSection, setActiveSection }) {
  const sections = [
    { key: "personal", label: "Personal" },
    { key: "address", label: "Address" },
    { key: "medical", label: "Medical" },
    
  ];
  return (
    <>
      <div className="hidden md:flex items-center gap-4">
        {sections.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`px-4 py-2 font-bold text-[16px] rounded-lg transition-colors ${
              activeSection === key
                ? "bg-white text-blue-600"
                : "text-blue-100 hover:bg-blue-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="md:hidden relative w-full">
        <select
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value)}
          className="w-full px-4 py-2 bg-blue-700  text-white rounded-lg appearance-none"
        >
          <option value="personal">Personal Information</option>
          <option value="address">Address Information</option>
          <option value="medical">Medical Information</option>
        </select>
        <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-white pointer-events-none" />
      </div>
    </>
  );
}

// MultiSelect with Search
function MultiSelectSearch({
  label,
  items,
  selected,
  search,
  setSearch,
  onSelect,
  onRemove,
  placeholder,
}) {
  const filteredItems = items
    .filter((i) => i.name.toLowerCase().includes((search || "").toLowerCase()))
    .filter((i) => !selected.includes(i.name));
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 pb-1">
        {label}
      </label>
      <div className="relative">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
          <Search className="h-4 w-4 text-gray-400 ml-3 mr-3" />
          <input
            type="text"
            placeholder={selected.length === 0 ? placeholder : ""}
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-3 border-none focus:ring-0"
          />
          {selected.map((item) => (
            <span
              key={item}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[14px] flex items-center gap-1 mr-2"
            >
              {item}
              {onRemove && (
                <button
                  type="button"
                  className="text-blue-700 hover:text-red-600 focus:outline-none"
                  onClick={() => onRemove(item)}
                >
                  &times;
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
      {search && (
        <div className="mt-2">
          {filteredItems.length > 0 ? (
            filteredItems.map((i) => (
              <div
                key={i.id}
                className="py-2 px-3 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-700"
                onClick={() => {
                  onSelect(i.name);
                  setSearch("");
                }}
              >
                {i.name}
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm px-3 py-2">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PersonalInfoSection({ formData, errors, handleInputChange, onPhotoTaken }) {
  return (
    <div className="space-y-6">
      <h3 className="text-[20px] font-semibold text-gray-900 flex items-center gap-2">
        <User className="h-7 w-7 text-blue-600" />
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 px-4">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-900">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.first_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>
        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-900">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.last_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-900">*</span>
          </label>
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
                errors.gender ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>
        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-900">*</span>
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.date_of_birth ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date_of_birth&& (
            <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
          )}
        </div>
        {/* Mobile Number */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Phone className="h-4 w-4 text-blue-600" />
            Mobile Number (Verified)
          </label>
          <input
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>
        {/* Patient Photo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient Photo
          </label>
          <PatientPhotoCapture onPhotoTaken={onPhotoTaken} />
        </div>
      </div>
    </div>
  );
}

function AddressInfoSection({ formData, errors, handleInputChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-[20px] font-semibold text-gray-900 flex items-center gap-2 ">
        <MapPin className="h-5 w-5 text-blue-600 " />
        Address Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 px-4">
        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address <span className="text-red-900">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your complete address"
            rows="3"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode <span className="text-red-900">*</span>
          </label>
          <input
            type="number"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            placeholder="6-digit pincode"
            maxLength="6"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.pincode ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
          )}
        </div>
        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-900">*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="Auto-filled from pincode"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.state ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}
        </div>
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City <span className="text-red-900">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Auto-filled from pincode"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MedicalInfoSection({
  formData,
  errors,
  handleInputChange,
  availableAllergies,
  availableChronicIllnesses,
  allergySearch,
  setAllergySearch,
  chronicSearch,
  setChronicSearch,
  handleMultiSelect,
  handleRemoveAllergy,
}) {
  return (
    <div className="space-y-6 px-[20px]">
      <h3 className="text-[20px] font-semibold text-gray-900 ">
        Medical Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
        {/* Height */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 pb-1">
            Height <span className="text-red-900">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="Enter height"
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.height ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="relative w-24">
              <select
                name="heightUnit"
                value={formData.heightUnit}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="cm">cm</option>
                <option value="ft">ft</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {errors.height && (
            <p className="text-red-500 text-sm mt-1">{errors.height}</p>
          )}
        </div>
        {/* Weight */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 pb-1">
            Weight (kg) <span className="text-red-900">*</span>
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Enter weight in kg"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.weight ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
          )}
        </div>
        {/* Blood Group */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 pb-1">
            Blood Group <span className="text-red-900">*</span>
          </label>
          <div className="relative">
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
                errors.blood_groups ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select blood group</option>
              <option value="a_positive">A+</option>
              <option value="a_negative">A-</option>
              <option value="b_positive">B+</option>
              <option value="b_negative">B-</option>
              <option value="ab_positive">AB+</option>
              <option value="ab_negative">AB-</option>
              <option value="o_positive">O+</option>
              <option value="o_negative">O-</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          {errors.blood_groupt && (
            <p className="text-red-500 text-sm mt-1">{errors.blood_group}</p>
          )}
        </div>
        {/* Allergies */}
        <MultiSelectSearch
          label="Allergies"
          items={availableAllergies}
          selected={formData.allergies}
          search={allergySearch}
          setSearch={setAllergySearch}
          onSelect={(name) => handleMultiSelect("allergies", name)}
          onRemove={handleRemoveAllergy}
          placeholder="Search allergies..."
        />
        {/* Chronic Illnesses */}
        <MultiSelectSearch
          label="Chronic Illnesses"
          items={availableChronicIllnesses}
          selected={formData.chronic_illnesses}
          search={chronicSearch}
          setSearch={setChronicSearch}
          onSelect={(name) => handleMultiSelect("chronicIllnesses", name)}
          onRemove={null}
          placeholder="Search conditions..."
        />
      </div>
    </div>
  );
}

function NavigationButtons({
  activeSection,
  setActiveSection,
  handleSubmit,
  isLoading,
}) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-between gap-4">
      <div className="flex gap-4">
        {activeSection !== "personal" && (
          <button
            type="button"
            onClick={() =>
              setActiveSection(
                activeSection === "address" ? "personal" : "address"
              )
            }
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
          >
            {activeSection === "address"
              ? "Back to Personal"
              : "Back to Address"}
          </button>
        )}
      </div>
      <div className="flex gap-4">
        {activeSection !== "medical" && (
          <button
            type="button"
            onClick={() =>
              setActiveSection(
                activeSection === "personal" ? "address" : "medical"
              )
            }
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            {activeSection === "personal"
              ? "Continue to Address"
              : "Continue to Medical"}
          </button>
        )}
        {activeSection === "medical" && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Registering...
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                Register Patient
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SuccessMessage({ onReset }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Registration Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your patient profile has been created successfully.
        </p>
        <button
          onClick={onReset}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        >
          Register Another Patient
        </button>
        
      </div>
    </div>
  );
}

const initialFormData = {
  first_name: "",
  last_name: "",
  gender: "",
  date_of_birth: "",
  mobile_number: "",
  address: "",
  pincode: "",
  state: "",
  city: "",
  height: "",
  height_unit: "cm",
  weight: "",
  blood_group: "",
  allergies: [],
  chronic_illnesses: [],
  photo: null,
};

function PatientRegistrationForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [availableAllergies, setAvailableAllergies] = useState([]);
  const [availableChronicIllnesses, setAvailableChronicIllnesses] = useState(
    []
  );
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [allergySearch, setAllergySearch] = useState("");
  const [chronicSearch, setChronicSearch] = useState("");
const searchParams = useSearchParams();
  const mobile_number = searchParams.get('phone') || sessionStorage.getItem('phone');
  const router = useRouter();

  useEffect(() => {
    if (mobile_number) {
      setFormData((prev) => ({ ...prev, mobile_number }));
    }
  }, [mobile_number]);

  // Fetch mock allergies and chronic illnesses
  useEffect(() => {
    setAvailableAllergies([
      { id: 1, name: "Peanuts" },
      { id: 2, name: "Shellfish" },
      { id: 3, name: "Dairy" },
      { id: 4, name: "Eggs" },
      { id: 5, name: "Soy" },
      { id: 6, name: "Gluten" },
      { id: 7, name: "Dust Mites" },
      { id: 8, name: "Pollen" },
      { id: 9, name: "Pet Dander" },
      { id: 10, name: "Latex" },
    ]);
    setAvailableChronicIllnesses([
      { id: 1, name: "Diabetes Type 1" },
      { id: 2, name: "Diabetes Type 2" },
      { id: 3, name: "Hypertension" },
      { id: 4, name: "Asthma" },
      { id: 5, name: "Heart Disease" },
      { id: 6, name: "Arthritis" },
      { id: 7, name: "Thyroid Disorder" },
      { id: 8, name: "COPD" },
      { id: 9, name: "Kidney Disease" },
      { id: 10, name: "Depression" },
    ]);
  }, []);

  // Auto-fill state and city based on pincode (mock)
  useEffect(() => {
    if (formData.pincode && formData.pincode.length === 6) {
      const locationMap = {
        560001: { state: "Karnataka", city: "Bangalore" },
        400001: { state: "Maharashtra", city: "Mumbai" },
        110001: { state: "Delhi", city: "New Delhi" },
        600001: { state: "Tamil Nadu", city: "Chennai" },
        500001: { state: "Telangana", city: "Hyderabad" },
      };
      const location = locationMap[formData.pincode];
      if (location) {
        setFormData((prev) => ({
          ...prev,
          state: location.state,
          city: location.city,
        }));
      }
    }
  }, [formData.pincode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const handleRemoveAllergy = (item) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== item),
    }));
  };

  const handlePhotoTaken = (photoData) => {
    setFormData((prev) => ({
      ...prev,
      patientPhoto: photoData,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.date_of_birth)
      newErrors.date_of_birth = "Date of birth is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.pincode || formData.pincode.length !== 6) {
      newErrors.pincode = "Valid 6-digit pincode is required";
    }
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.height || formData.height <= 0)
      newErrors.height = "Valid height is required";
    if (!formData.weight || formData.weight <= 0)
      newErrors.weight = "Valid weight is required";
    if (!formData.blood_group) newErrors.blood_group = "Blood group is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent form default submit
  if (!validateForm()) return;

  setIsLoading(true);
  setErrors({}); // Clear previous errors

  try {
    const { data } = await api.post(
      '/patient/register',
      formData,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // if backend uses cookies
      }
    );

    console.log('Registration successful:', data);
    setIsSubmitted(true);

    // Optional: show success message before redirect
    setTimeout(() => {
      router.push('/auth/login/patient');
    }, 1500);

  } catch (error) {
    console.error(' Registration error:', error.response?.data || error.message);

    setErrors({
      submit: error.response?.data?.message || 'Failed to register. Please try again.',
    });
  } finally {
    setIsLoading(false);
  }
};


  if (isSubmitted) {
    return <SuccessMessage onReset={() => {
      setFormData(initialFormData);
      setIsSubmitted(false);
      setActiveSection("personal");
      setErrors({});
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br tracking-wider from-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 md:px-8 md:py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-wider text-white flex items-center gap-3">
                  <User className="h-6 w-6 md:h-8 md:w-8" />
                  Patient Registration
                </h1>
                <p className="text-blue-100 mt-2 text-sm md:text-base tracking-wider">
                  Please fill in your details to create your patient profile
                </p>
              </div>
              <SectionNav
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            </div>
          </div>
          {/* Form */}
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="space-y-8">
              {/* Personal Information */}
              {activeSection === "personal" && (
                <PersonalInfoSection
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  onPhotoTaken={handlePhotoTaken}
                />
              )}
              {/* Address Information */}
              {activeSection === "address" && (
                <AddressInfoSection
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />
              )}
              {/* Medical Information */}
              {activeSection === "medical" && (
                <MedicalInfoSection
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  availableAllergies={availableAllergies}
                  availableChronicIllnesses={availableChronicIllnesses}
                  allergySearch={allergySearch}
                  setAllergySearch={setAllergySearch}
                  chronicSearch={chronicSearch}
                  setChronicSearch={setChronicSearch}
                  handleMultiSelect={handleMultiSelect}
                  handleRemoveAllergy={handleRemoveAllergy}
                />
              )}
              {/* Navigation Buttons */}
              <NavigationButtons
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientRegistrationForm;