'use client';
import React, { useState } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';

// Mock context for demonstration
const useBooking = () => {
  const [state, setState] = useState({
    location: {
      state: '',
      district: '',
      taluka: ''
    }
  });

  const dispatch = (action) => {
    if (action.type === 'SET_LOCATION') {
      setState(prev => ({
        ...prev,
        location: action.payload
      }));
    }
  };

  return { state, dispatch };
};

const states = {
  Maharashtra: {
    Pune: ['Haveli', 'Mulshi', 'Ambegaon', 'Khed', 'Junnar'],
    Mumbai: ['Andheri', 'Borivali', 'Bandra', 'Powai', 'Thane'],
    Nagpur: ['Central', 'East', 'West', 'South'],
    Nashik: ['Nashik Road', 'Panchavati', 'Satpur']
  },
  Karnataka: {
    Bengaluru: ['East', 'West', 'North', 'South', 'Central'],
    Mysuru: ['Rural', 'Urban', 'Chamundi', 'Krishnaraja'],
    Mangaluru: ['Ullal', 'Bantwal', 'Puttur'],
    Hubli: ['Dharwad', 'Navalgund', 'Kundgol']
  },
  'Tamil Nadu': {
    Chennai: ['North', 'South', 'Central', 'West'],
    Coimbatore: ['North', 'South', 'East', 'West'],
    Madurai: ['Central', 'East', 'West', 'North']
  },
  Gujarat: {
    Ahmedabad: ['East', 'West', 'North', 'South'],
    Surat: ['City', 'Olpad', 'Chorasi'],
    Vadodara: ['City', 'Padra', 'Dabhoi']
  }
};

const CustomSelect = ({ value, onChange, options, placeholder, disabled, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="relative">
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          relative flex items-center justify-between w-full p-3 border-2 rounded-lg cursor-pointer transition-all duration-200
          ${disabled 
            ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' 
            : isOpen 
              ? 'border-blue-500 bg-blue-50 shadow-lg' 
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }
          ${value ? 'text-gray-900' : 'text-gray-500'}
        `}
      >
        <div className="flex items-center space-x-2">
          {icon && <span className="text-gray-400">{icon}</span>}
          <span className="text-sm font-medium">
            {value || placeholder}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {value && !disabled && (
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={14} className="text-gray-500" />
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-100 last:border-b-0"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function LocationFilters() {
  const { state, dispatch } = useBooking();

  const selectedState = state.location.state;
  const selectedDistrict = state.location.district;

  const handleStateChange = (newState) => {
    dispatch({ 
      type: 'SET_LOCATION', 
      payload: { 
        ...state.location, 
        state: newState, 
        district: '', 
        taluka: '' 
      } 
    });
  };

  const handleDistrictChange = (newDistrict) => {
    dispatch({ 
      type: 'SET_LOCATION', 
      payload: { 
        ...state.location, 
        district: newDistrict, 
        taluka: '' 
      } 
    });
  };

  const handleTalukaChange = (newTaluka) => {
    dispatch({ 
      type: 'SET_LOCATION', 
      payload: { 
        ...state.location, 
        taluka: newTaluka 
      } 
    });
  };

  const clearAllFilters = () => {
    dispatch({ 
      type: 'SET_LOCATION', 
      payload: { 
        state: '', 
        district: '', 
        taluka: '' 
      } 
    });
  };

  const hasActiveFilters = selectedState || selectedDistrict || state.location.taluka;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="text-blue-600" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">Location Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <CustomSelect
          value={selectedState}
          onChange={handleStateChange}
          options={Object.keys(states)}
          placeholder="Select State"
          disabled={false}
        />

        <CustomSelect
          value={selectedDistrict}
          onChange={handleDistrictChange}
          options={selectedState ? Object.keys(states[selectedState]) : []}
          placeholder="Select District"
          disabled={!selectedState}
        />

        <CustomSelect
          value={state.location.taluka}
          onChange={handleTalukaChange}
          options={selectedDistrict ? states[selectedState][selectedDistrict] : []}
          placeholder="Select Taluka"
          disabled={!selectedDistrict}
        />
      </div>

      {/* Selected Location Display */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Selected Location:</span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {[selectedState, selectedDistrict, state.location.taluka]
              .filter(Boolean)
              .join(' → ')}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-800">{Object.keys(states).length}</div>
          <div className="text-xs text-gray-600">States</div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-800">
            {selectedState ? Object.keys(states[selectedState]).length : 0}
          </div>
          <div className="text-xs text-gray-600">Districts</div>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-800">
            {selectedDistrict ? states[selectedState][selectedDistrict].length : 0}
          </div>
          <div className="text-xs text-gray-600">Talukas</div>
        </div>
      </div>
    </div>

)
}