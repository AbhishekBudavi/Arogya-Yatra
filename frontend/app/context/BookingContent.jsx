'use client';
import { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext();

const initialState = {
  selectedDoctor: null,
  selectedSlot: null,
  location: {
    state: '',
    district: '',
    taluka: ''
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_DOCTOR':
      return { ...state, selectedDoctor: action.payload };
    case 'SET_SLOT':
      return { ...state, selectedSlot: action.payload };
    default:
      return state;
  }
}

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
