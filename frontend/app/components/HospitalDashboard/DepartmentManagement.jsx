'use client'
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Building2 } from 'lucide-react';

export default function DepartmentManagement({ hospitalData, onShowToast }) {
  const [departments, setDepartments] = useState(
    hospitalData?.departments?.split(',').map(d => d.trim()) || []
  );
  const [newDepartment, setNewDepartment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) {
      onShowToast('Please enter a department name', 'error');
      return;
    }
    if (departments.includes(newDepartment.trim())) {
      onShowToast('Department already exists', 'error');
      return;
    }
    setDepartments([...departments, newDepartment.trim()]);
    setNewDepartment('');
    onShowToast('Department added successfully', 'success');
  };

  const handleDeleteDepartment = (index) => {
    setDepartments(departments.filter((_, i) => i !== index));
    onShowToast('Department removed', 'success');
  };

  const handleEditDepartment = (index) => {
    setEditingId(index);
    setEditingValue(departments[index]);
  };

  const handleSaveEdit = (index) => {
    if (!editingValue.trim()) {
      onShowToast('Department name cannot be empty', 'error');
      return;
    }
    const updated = [...departments];
    updated[index] = editingValue.trim();
    setDepartments(updated);
    setEditingId(null);
    setEditingValue('');
    onShowToast('Department updated', 'success');
  };

  return (
    <div className="space-y-6 ml-4 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            Department Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and organize hospital departments
          </p>
        </div>
      </div>

      {/* Add Department Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Department</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddDepartment()}
            placeholder="Enter department name"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleAddDepartment}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium 
              transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      {/* Departments List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mt-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Current Departments ({departments.length})
          </h2>
          
          {departments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No departments added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 
                    rounded-lg hover:shadow-md transition-shadow"
                >
                  {editingId === index ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="flex-1 px-3 py-1 border border-blue-500 rounded bg-white dark:bg-gray-600 
                          text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleSaveEdit(index)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-gray-900 dark:text-white font-medium">{dept}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditDepartment(index)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(index)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Departments</p>
          <p className="text-3xl font-bold text-blue-600">{departments.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Hospital Type</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{hospitalData?.hospital_type}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Status</p>
          <p className="text-lg font-semibold text-green-600">Active</p>
        </div>
      </div>
    </div>
  );
}
