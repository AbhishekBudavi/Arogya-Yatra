'use client'

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Edit3, User, Activity, Heart, Users, FileText, Check, X, AlertCircle, Calendar, Shield, Stethoscope, Loader2, RefreshCw } from 'lucide-react';
import { medicalHistoryAPI } from '../../../../utils/api';

const defaultPatientData = {
  fullname: 'N/A',
  age: 'N/A',
  weight: 'N/A',
  height: 'N/A',
  gender: 'N/A',
  bloodgroup: 'N/A',
  emergencycontact: 'N/A',
  mediclaimpolicy: 'N/A',
  insurancecompany: 'N/A',
  policyexpiry: 'N/A',
  arogyayatraid: 'N/A',
  chronicconditions: 'N/A',
  nutritionaldeficiency: 'N/A',
  allergies: 'N/A',
  pastsurgeries: 'N/A',
  pastillnesses: 'N/A',
  currentmedications: 'N/A',
  bloodpressure: 'N/A',
  fastingbloodsugar: 'N/A',
  postprandialbloodsugar: 'N/A',
  randombloodsugar: 'N/A',
  smoking: 'No',
  alcoholconsumption: 'N/A',
  tobaccochewing: 'No',
  gutkachewing: 'No',
  suparichewing: 'No',
  diettype: 'N/A',
  familycancerhistory: 'N/A',
  familychronichistory: 'N/A',
  additionalnotes: ''
};
const sectionFields = {
  basic: ['fullname', 'age', 'weight', 'height', 'gender', 'bloodgroup', 'emergencycontact', 'mediclaimpolicy', 'insuranceCompany', 'policyexpiry', 'arogyayatraid'],
  medical: ['chronicconditions', 'nutritionaldeficiency', 'allergies', 'pastsurgeries', 'pastillnesses', 'currentmedications', 'bloodpressure', 'fastingbloodsugar', 'postprandialbloodsugar', 'randombloodsugar'],
  lifestyle: ['smoking', 'alcoholconsumption', 'tobaccochewing', 'gutkachewing', 'suparichewing', 'diettype'],
  family: ['familycancerhistory', 'familychronichistory'],
  notes: ['additionalnotes'],
};

const MedicalHistory = () => {
  const [expandedSections, setExpandedSections] = useState({ basic: true, medical: false, lifestyle: false, family: false, notes: false });
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [completionStats, setCompletionStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [patientData, setPatientData] = useState(defaultPatientData);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  useEffect(() => {
    calculateCompletionStats();
  }, [patientData]);

 const fetchMedicalHistory = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await medicalHistoryAPI.get(); // { success: true, medicalHistory: {...} }
    const apiData = res?.medicalHistory || {};

    // Merge defaultPatientData with API data
    const mergedData = Object.keys(defaultPatientData).reduce((acc, key) => {
      acc[key] = apiData[key] !== undefined && apiData[key] !== null ? apiData[key] : defaultPatientData[key];
      return acc;
    }, {});

    setPatientData(mergedData);
    setHasExistingRecord(Object.keys(apiData).length > 0);
  } catch (err) {
    setPatientData(defaultPatientData);
    setHasExistingRecord(false);
    setError('No medical history found. Start filling in your information.');
  } finally {
    setLoading(false);
  }
};

  const saveMedicalHistory = async (updatedData = patientData) => {
    try {
      setSaving(true);
      setError(null);
      if (hasExistingRecord) {
        await medicalHistoryAPI.update(updatedData);
      } else {
        await medicalHistoryAPI.create(updatedData);
        setHasExistingRecord(true);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setError(err.message || 'Failed to save');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletionStats = () => {
    const stats = {};
    Object.keys(sectionFields).forEach((section) => {
      const fields = sectionFields[section];
      const completedFields = fields.filter((field) => patientData[field] && patientData[field] !== 'N/A' && patientData[field].trim() !== '');
      stats[section] = { completed: completedFields.length, total: fields.length, percentage: Math.round((completedFields.length / fields.length) * 100) };
    });
    setCompletionStats(stats);
  };

  const toggleSection = (section) => setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  const startEdit = (field, currentValue) => { setEditingField(field); setTempValue(currentValue === 'N/A' ? '' : currentValue); };
  const cancelEdit = () => { setEditingField(null); setTempValue(''); };
const saveEdit = async () => {
  const payload = { [editingField]: tempValue.trim() || 'N/A' };
  setPatientData(prev => ({ ...prev, ...payload }));
  setEditingField(null);
  setTempValue('');

  try {
    if (hasExistingRecord) {
      await medicalHistoryAPI.update(payload); // send only changed field
    } else {
      await medicalHistoryAPI.create(patientData); // full data for first-time create
      setHasExistingRecord(true);
    }
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
  } catch (err) {
    setError(err.message || 'Failed to save');
    setSaveStatus('error');
    setTimeout(() => setSaveStatus(''), 3000);
  }
};


  const getFieldPriority = (fieldKey) => {
    const critical = ['fullname', 'age', 'bloodgroup', 'emergencycontact', 'allergies', 'currentmedications'];
    const important = ['weight', 'height', 'chronicconditions', 'bloodpressure'];
    if (critical.includes(fieldKey)) return 'critical';
    if (important.includes(fieldKey)) return 'important';
    return 'normal';
  };

  const renderField = (label, value, fieldKey) => {
    const priority = getFieldPriority(fieldKey);
    const isEditing = editingField === fieldKey;
    const isEmpty = value === 'N/A' || value === '';
    const bgClass = priority === 'critical' ? 'bg-red-50' : priority === 'important' ? 'bg-yellow-50' : '';

    return (
      <div key={fieldKey} className={`${bgClass} border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200`}>
        <div className="flex items-start px-4 py-4" style={{ minHeight: '72px' }}>
          <div className="flex-1 mr-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-semibold text-blue-500">{label}:</span>
              {priority !== 'normal' && <AlertCircle size={14} className={priority === 'critical' ? 'text-red-500' : 'text-yellow-500'} />}
            </div>
            <div style={{ minHeight: '32px' }} className="flex items-center">
              {isEditing ? (
                <div className="flex items-center space-x-2 w-full">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                    autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                  />
                  <button onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-100 rounded-md" title="Save" disabled={saving}>
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  </button>
                  <button onClick={cancelEdit} className="p-2 text-red-600 hover:bg-red-100 rounded-md" title="Cancel">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center w-full">
                  <span className={`text-sm font-semibold ${isEmpty ? 'text-gray-600 italic' : 'text-gray-900'}`}>{value}</span>
                  {isEmpty && <span className="ml-2 text-xs text-red-500">{priority === 'critical' ? '• Required' : priority === 'important' ? '• Important' : '• Optional'}</span>}
                </div>
              )}
            </div>
          </div>
          {!isEditing && <button onClick={() => startEdit(fieldKey, value)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md"><Edit3 size={16} /></button>}
        </div>
      </div>
    );
  };

  const Section = ({ title, icon: Icon, sectionKey, children, colorClass }) => {
    const stats = completionStats[sectionKey] || { completed: 0, total: 0, percentage: 0 };
    const isExpanded = expandedSections[sectionKey];
    return (
      <div className={`bg-white rounded-xl shadow-lg border my-4 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-200' : ''}`}>
        <button onClick={() => toggleSection(sectionKey)} className={`w-full px-6 py-5 flex items-center justify-between ${colorClass} hover:brightness-105`}>
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-blue-500 text-white"><Icon size={30} /></div>
            <div className="text-left pl-2">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-500 ${stats.percentage >= 80 ? 'bg-green-500' : stats.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${stats.percentage}%` }}></div>
                </div>
                <span className="text-sm text-gray-600">{stats.completed}/{stats.total} ({stats.percentage}%)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {stats.percentage === 100 && <div className="p-1 bg-green-500 rounded-full"><Check size={16} className="text-white" /></div>}
            {isExpanded ? <ChevronUp className="text-gray-600" size={20} /> : <ChevronDown className="text-gray-600" size={20} />}
          </div>
        </button>
        {isExpanded && <div className="transition-all duration-300">{children}</div>}
      </div>
    );
  };

  const overallCompletion = Object.values(completionStats).reduce((acc, stat) => acc + stat.percentage, 0) / Object.keys(completionStats).length || 0;

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 mx-auto" size={48} />
      <p className="text-gray-600 mt-2">Loading medical history...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header & Refresh */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl"><Stethoscope className="text-white" size={32} /></div>
            <h1 className="text-4xl font-bold text-gray-900 pl-3">Patient Health History</h1>
          </div>
          <p className="text-gray-600 mb-4">Comprehensive health information dashboard</p>
          <div className="flex justify-center space-x-4 mb-4">
            <button onClick={fetchMedicalHistory} className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-50 transition-colors" disabled={loading || saving}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
          {error && (
            <div className="max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-center space-x-2"><AlertCircle size={16} /><span>{error}</span></div>
            </div>
          )}
          <div className="max-w-md mx-auto bg-white rounded-xl p-4 shadow-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Completion</span>
              <span className="text-sm font-bold text-gray-900">{Math.round(overallCompletion)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all duration-1000 ${overallCompletion >= 80 ? 'bg-green-500' : overallCompletion >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${overallCompletion}%` }}></div>
            </div>
          </div>
        </div>

        {/* Save notifications */}
        {saveStatus === 'saved' && <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2"><Check size={16} /><span>Changes saved!</span></div>}
        {saveStatus === 'error' && <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2"><AlertCircle size={16} /><span>Failed to save</span></div>}

        {/* Sections */}
        <div className="space-y-8">
          <Section title="Basic Details" icon={User} sectionKey="basic" colorClass="bg-blue-50">{sectionFields.basic.map(f => renderField(f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), patientData[f], f))}</Section>
          <Section title="Medical Data" icon={Activity} sectionKey="medical" colorClass="bg-red-50">{sectionFields.medical.map(f => renderField(f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), patientData[f], f))}</Section>
          <Section title="Lifestyle Details" icon={Heart} sectionKey="lifestyle" colorClass="bg-green-50">{sectionFields.lifestyle.map(f => renderField(f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), patientData[f], f))}</Section>
          <Section title="Family Health History" icon={Users} sectionKey="family" colorClass="bg-purple-50">{sectionFields.family.map(f => renderField(f.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), patientData[f], f))}</Section>
          <Section title="Additional Notes" icon={FileText} sectionKey="notes" colorClass="bg-indigo-50">
            <div className="p-6">
              <textarea
                value={patientData.additionalNotes || ''}
                onChange={(e) => setPatientData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                onBlur={() => saveMedicalHistory({ ...patientData, additionalNotes: patientData.additionalNotes })}
                placeholder="Enter any additional notes..."
                className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="text-xs text-gray-400 mt-2">{(patientData.additionalNotes || '').length} characters</div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
