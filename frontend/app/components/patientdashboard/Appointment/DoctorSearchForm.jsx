'use client';
import React from 'react';
import { User, Star, MapPin, Video, Building } from 'lucide-react';
import { useBooking } from '../../../context/BookingContent';

const DoctorCard = ({ doctor }) => {
  const { dispatch } = useBooking();

  // Defensive check
  if (!doctor) return null;

  const handleBookNow = (type = 'online') => {
    dispatch({
      type: 'OPEN_DRAWER',
      payload: { doctor, type }
    });
  };
console.log("Doctor Search Is here")
  return (
  
    
    <div>Iam Heee</div>
  );
};

export default DoctorCard;
