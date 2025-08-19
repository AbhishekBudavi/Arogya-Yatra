'use client';
import React, { useEffect, useState } from 'react';
import { X, Star, Video, Building, User, Loader2 } from 'lucide-react';
import { useBooking } from '../../../context/BookingContent';
import fetchAvailableSlots from '../../../lib/api/fetchAvailableSlots';
import SlotPicker from './SlotBookingDrawer.jsx';

const BookingDrawer = () => {
  const { state, dispatch } = useBooking();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
    setDateRange(dates);
    if (!state.selectedDate) {
      const today = dates[0].toISOString().split('T')[0];
      dispatch({ type: 'SET_SELECTED_DATE', payload: today });
    }
  }, []);

  useEffect(() => {
    if (state.isDrawerOpen && state.selectedDoctor && state.selectedDate) {
      dispatch({ type: 'SET_SLOTS_LOADING', payload: true });
      const fetchSlots = async () => {
        try {
          const slots = await fetchAvailableSlots(
            state.selectedDoctor.id,
            state.selectedDate,
            state.appointmentType
          );
          dispatch({ type: 'SET_SLOTS', payload: slots });
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SET_SLOTS_LOADING', payload: false });
        }
      };
      const timer = setTimeout(fetchSlots, 300);
      return () => clearTimeout(timer);
    }
  }, [state.isDrawerOpen, state.selectedDoctor, state.selectedDate, state.appointmentType]);

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });

  const handleDateSelect = (date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date.toISOString().split('T')[0] });
  };

  const handleSlotSelect = (slot) => {
    dispatch({ type: 'SET_SELECTED_SLOT', payload: slot });
  };

  const handleContinue = () => {
    if (state.selectedSlot) {
      alert(`Booking confirmed for ${state.selectedSlot.time} on ${state.selectedDate}`);
      dispatch({ type: 'CLOSE_DRAWER' });
    }
  };

  if (!state.isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end backdrop-blur-sm bg-white/30">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <button
            onClick={() => dispatch({ type: 'CLOSE_DRAWER' })}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Info */}
        {state.selectedDoctor && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{state.selectedDoctor.name}</h3>
                <p className="text-sm text-gray-600">{state.selectedDoctor.specialist}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{state.selectedDoctor.rating}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Type Tabs */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => dispatch({ type: 'SET_APPOINTMENT_TYPE', payload: 'online' })}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                state.appointmentType === 'online'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Online Consult</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_APPOINTMENT_TYPE', payload: 'clinic' })}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-colors ${
                state.appointmentType === 'clinic'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Clinic Visit</span>
            </button>
          </div>
        </div>

        {/* Date Selector */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Date</h3>
          <div className="flex space-x-2 overflow-x-auto">
            {dateRange.map((date, idx) => {
              const dateStr = date.toISOString().split('T')[0];
              const isSelected = state.selectedDate === dateStr;
              return (
                <button
                  key={idx}
                  onClick={() => handleDateSelect(date)}
                  className={`flex-shrink-0 p-3 rounded-lg border text-center transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  <div className="text-xs">{formatDate(date)}</div>
                  <div className="text-sm font-medium">{date.getDate()}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slots */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Available Time Slots</h3>
          {state.slotsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading slots...</span>
            </div>
          ) : (
            <SlotPicker
              slots={state.slots}
              selectedSlot={state.selectedSlot}
              onSlotSelect={handleSlotSelect}
            />
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleContinue}
            disabled={!state.selectedSlot}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              state.selectedSlot
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue - ₹{state.appointmentType === 'online' ? '500' : '800'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDrawer;
