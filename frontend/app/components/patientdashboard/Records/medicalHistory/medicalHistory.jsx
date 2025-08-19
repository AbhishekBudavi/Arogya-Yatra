'use client'
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Edit3, User, Activity, Heart, Users, FileText, Save, X, Check, AlertCircle, Calendar, Shield, Stethoscope } from 'lucide-react';

const MedicalHistory = () => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    medical: false,
    lifestyle: false,
    family: false,
    notes: false
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [completionStats, setCompletionStats] = useState({});

  const [patientData, setPatientData] = useState({
    // Basic Details
    fullName: "John Doe",
    age: "N/A",
    weight: "N/A",
    height: "N/A",
    gender: "Male",
    bloodGroup: "O+",
    emergencyContact: "N/A",
    mediclaimPolicy: "N/A",
    insuranceCompany: "N/A",
    policyExpiry: "N/A",
    arogyayatraId: "N/A",
    
    // Medical Data
    chronicConditions: "N/A",
    nutritionalDeficiency: "N/A",
    allergies: "N/A",
    pastSurgeries: "N/A",
    pastIllnesses: "N/A",
    currentMedications: "N/A",
    bloodPressure: "N/A",
    fastingBloodSugar: "N/A",
    postprandialBloodSugar: "N/A",
    randomBloodSugar: "N/A",
    
    // Lifestyle Details
    smoking: "No",
    alcoholConsumption: "N/A",
    tobaccoChewing: "No",
    gutkaChewing: "No",
    supariChewing: "No",
    dietType: "N/A",
    
    // Family Health History
    familyCancerHistory: "N/A",
    familyChronicHistory: "N/A",
    
    // Additional Notes
    additionalNotes: ""
  });

  const sectionFields = {
    basic: ['fullName', 'age', 'weight', 'height', 'gender', 'bloodGroup', 'emergencyContact', 'mediclaimPolicy', 'insuranceCompany', 'policyExpiry', 'arogyayatraId'],
    medical: ['chronicConditions', 'nutritionalDeficiency', 'allergies', 'pastSurgeries', 'pastIllnesses', 'currentMedications', 'bloodPressure', 'fastingBloodSugar', 'postprandialBloodSugar', 'randomBloodSugar'],
    lifestyle: ['smoking', 'alcoholConsumption', 'tobaccoChewing', 'gutkaChewing', 'supariChewing', 'dietType'],
    family: ['familyCancerHistory', 'familyChronicHistory'],
    notes: ['additionalNotes']
  };

  useEffect(() => {
    calculateCompletionStats();
  }, [patientData]);

  const calculateCompletionStats = () => {
    const stats = {};
    Object.keys(sectionFields).forEach(section => {
      const fields = sectionFields[section];
      const completedFields = fields.filter(field => 
        patientData[field] && patientData[field] !== 'N/A' && patientData[field].trim() !== ''
      );
      stats[section] = {
        completed: completedFields.length,
        total: fields.length,
        percentage: Math.round((completedFields.length / fields.length) * 100)
      };
    });
    setCompletionStats(stats);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const startEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue === 'N/A' ? '' : currentValue);
  };

  const saveEdit = () => {
    setPatientData(prev => ({
      ...prev,
      [editingField]: tempValue.trim() || 'N/A'
    }));
    setEditingField(null);
    setTempValue('');
    
    // Show save confirmation
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const getFieldPriority = (fieldKey) => {
    const criticalFields = ['fullName', 'age', 'bloodGroup', 'emergencyContact', 'allergies', 'currentMedications'];
    const importantFields = ['weight', 'height', 'chronicConditions', 'bloodPressure'];
    
    if (criticalFields.includes(fieldKey)) return 'critical';
    if (importantFields.includes(fieldKey)) return 'important';
    return 'normal';
  };

  const renderField = (label, value, fieldKey) => {
    const priority = getFieldPriority(fieldKey);
    const isEditing = editingField === fieldKey;
    const isEmpty = value === 'N/A' || value === '';
    
    let bgClass = '';
    if (priority === 'critical') bgClass = 'bg-red-50';
    else if (priority === 'important') bgClass = 'bg-yellow-50';



    
    return (
    
      <div className={`${bgClass} border-b border-gray-100 border-3xl hover:bg-blue-50 transition-colors duration-200`}>
        <div className="flex items-start px-4 py-4" style={{ minHeight: '72px' }}>
          <div className="flex-1 mr-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-semibold text-blue-500">{label}:</span>
              {priority === 'critical' && <AlertCircle size={14} className="text-red-500" />}
              {priority === 'important' && <AlertCircle size={14} className="text-yellow-500" />}
            </div>
            
            <div style={{ minHeight: '32px' }} className="flex items-center">
              {isEditing ? (
                <div className="flex items-center space-x-2 w-full">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                  />
                  <button
                    onClick={saveEdit}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors duration-200"
                    title="Save (Enter)"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors duration-200"
                    title="Cancel (Escape)"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center w-full">
                  <span className={`text-sm font-semibold ${isEmpty ? 'text-gray-600 italic' : 'text-gray-900 font-medium'}`}>
                    {value}
                  </span>
                  {isEmpty && (
                    <span className="ml-2 text-xs text-red-500">
                      {priority === 'critical' ? '• Required' : priority === 'important' ? '• Important' : '• Optional'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {!isEditing && (
              <button
                onClick={() => startEdit(fieldKey, value)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-all duration-200"
                title="Edit this field"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    
    );
  };

  const Section = ({ title, icon: Icon, sectionKey, children, colorClass = "bg-blue-50" }) => {
    const stats = completionStats[sectionKey] || { completed: 0, total: 0, percentage: 0 };
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className={`bg-white rounded-xl shadow-lg border my-4 border-gray-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-200' : ''}`}>
        <button
          onClick={() => toggleSection(sectionKey)}
          className={`w-full px-6 py-5 flex items-center justify-between ${colorClass} hover:brightness-105 transition-all duration-200`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <Icon size={30} />
            </div>
            <div className="text-left pl-2">
              <h3 className="text-lg font-semibold text-gray-800 ">{title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${stats.percentage >= 80 ? 'bg-green-500' : stats.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {stats.completed}/{stats.total} ({stats.percentage}%)
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {stats.percentage === 100 && (
              <div className="p-1 bg-green-500 rounded-full">
                <Check size={16} className="text-white" />
              </div>
            )}
            <div className="transform transition-transform duration-200">
              {isExpanded ? (
                <ChevronUp className="text-gray-600" size={20} />
              ) : (
                <ChevronDown className="text-gray-600" size={20} />
              )}
            </div>
          </div>
        </button>
        
        {isExpanded && (
          <div className="transition-all duration-300 ease-out">
            {children}
          </div>
        )}
      </div>
    );
  };

  const overallCompletion = Object.values(completionStats).reduce((acc, stat) => {
    return acc + stat.percentage;
  }, 0) / Object.keys(completionStats).length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Stethoscope className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 pl-3">
              Patient Health History
            </h1>
          </div>
          <p className="text-gray-600 mb-4">Comprehensive health information dashboard</p>
          
          {/* Overall Progress */}
          <div className="max-w-md mx-auto bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Completion</span>
              <span className="text-sm font-bold text-gray-900">{Math.round(overallCompletion)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${overallCompletion >= 80 ? 'bg-green-500' : overallCompletion >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${overallCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Save Status */}
        {saveStatus === 'saved' && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="flex items-center space-x-2">
              <Check size={16} />
              <span>Changes saved successfully!</span>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Details Section */}
          <Section title="Basic Details" icon={User} sectionKey="basic" colorClass="bg-blue-50" >
            <div>
              {renderField("Full Name", patientData.fullName, "fullName")}
              {renderField("Age", patientData.age, "age")}
              {renderField("Weight", patientData.weight, "weight")}
              {renderField("Height", patientData.height, "height")}
              {renderField("Gender", patientData.gender, "gender")}
              {renderField("Blood Group", patientData.bloodGroup, "bloodGroup")}
              {renderField("Emergency Contact", patientData.emergencyContact, "emergencyContact")}
              {renderField("Mediclaim Policy Number", patientData.mediclaimPolicy, "mediclaimPolicy")}
              {renderField("Insurance Company", patientData.insuranceCompany, "insuranceCompany")}
              {renderField("Policy Expiry Date", patientData.policyExpiry, "policyExpiry")}
              {renderField("Arogyayatra ID", patientData.arogyayatraId, "arogyayatraId")}
            </div>
          </Section>

          {/* Medical Data Section */}
          <Section title="Medical Data" icon={Activity} sectionKey="medical" colorClass="bg-red-50">
            <div>
              {renderField("Chronic Conditions", patientData.chronicConditions, "chronicConditions")}
              {renderField("Nutritional Deficiency", patientData.nutritionalDeficiency, "nutritionalDeficiency")}
              {renderField("Allergies", patientData.allergies, "allergies")}
              {renderField("Past Surgeries", patientData.pastSurgeries, "pastSurgeries")}
              {renderField("Past Illnesses", patientData.pastIllnesses, "pastIllnesses")}
              {renderField("Current Medications", patientData.currentMedications, "currentMedications")}
              {renderField("Blood Pressure (Diastolic)", patientData.bloodPressure, "bloodPressure")}
              {renderField("Fasting Blood Sugar", patientData.fastingBloodSugar, "fastingBloodSugar")}
              {renderField("Postprandial Blood Sugar", patientData.postprandialBloodSugar, "postprandialBloodSugar")}
              {renderField("Random Blood Sugar", patientData.randomBloodSugar, "randomBloodSugar")}
            </div>
          </Section>

          {/* Lifestyle Details Section */}
          <Section title="Lifestyle Details" icon={Heart} sectionKey="lifestyle" colorClass="bg-green-50">
            <div>
              {renderField("Smoking", patientData.smoking, "smoking")}
              {renderField("Alcohol Consumption", patientData.alcoholConsumption, "alcoholConsumption")}
              {renderField("Tobacco Chewing", patientData.tobaccoChewing, "tobaccoChewing")}
              {renderField("Gutka Chewing", patientData.gutkaChewing, "gutkaChewing")}
              {renderField("Supari Chewing", patientData.supariChewing, "supariChewing")}
              {renderField("Diet Type", patientData.dietType, "dietType")}
            </div>
          </Section>

          {/* Family Health History Section */}
          <Section title="Family Health History" icon={Users} sectionKey="family" colorClass="bg-purple-50">
            <div>
              {renderField("Family History of Cancer", patientData.familyCancerHistory, "familyCancerHistory")}
              {renderField("Family History of Chronic Conditions", patientData.familyChronicHistory, "familyChronicHistory")}
            </div>
          </Section>

          {/* Additional Notes Section */}
          <Section title="Additional Notes" icon={FileText} sectionKey="notes" colorClass="bg-indigo-50">
            <div className="p-6">
              <div className="relative">
                <textarea
                  value={patientData.additionalNotes}
                  onChange={(e) => setPatientData(prev => ({...prev, additionalNotes: e.target.value}))}
                  placeholder="Enter any additional notes about the patient's health history..."
                  className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all duration-200"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {patientData.additionalNotes.length} characters
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500">
                <FileText size={16} />
                <span>Use this space for any additional comments or observations.</span>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield size={16} />
                <span className='pl-3'>Data encrypted and secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default MedicalHistory;