'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBooking } from '../../../context/BookingContent';
import { 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  Phone, 
  Mail,
  Award,
  Users,
  Heart,
  Share2
} from 'lucide-react';

export default function DoctorCard({ doctor, onBook }) {
  const { dispatch } = useBooking();

  const handleBook = () => {
    dispatch({ type: 'SET_DOCTOR', payload: doctor });
    onBook(); // open drawer
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    // Handle favorite functionality
    console.log('Added to favorites:', doctor.name);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Handle share functionality
    console.log('Sharing doctor profile:', doctor.name);
  };

  return (
    <div className="group relative border rounded-xl p-6 shadow-sm bg-white  transition-all duration-300 hover:border-blue-200">
      {/* Header with avatar and actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff`}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-100"
            />
            {doctor.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {doctor.name}
            </h3>
            <p className="text-blue-600 font-medium">{doctor.specialist}</p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              {doctor.location}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleFavorite}
            className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rating and experience */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {doctor.rating || '4.8'}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              ({doctor.reviews || '124'} reviews)
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Award className="w-4 h-4 mr-1" />
            {doctor.experience || '8'} years exp.
          </div>
        </div>
        
        {doctor.consultationFee && (
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              ₹{doctor.consultationFee}
            </div>
            <div className="text-xs text-gray-500">consultation</div>
          </div>
        )}
      </div>

      {/* Additional info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          <span>{doctor.patientsCount || '2.5k+'} patients</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{doctor.availableTime || 'Available today'}</span>
        </div>
      </div>

      {/* Specializations/Tags */}
      {doctor.specializations && (
        <div className="flex flex-wrap gap-2 mb-4">
          {doctor.specializations.slice(0, 3).map((spec, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {spec}
            </span>
          ))}
          {doctor.specializations.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
              +{doctor.specializations.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Contact info */}
      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
        {doctor.phone && (
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-1" />
            <span>{doctor.phone}</span>
          </div>
        )}
        {doctor.email && (
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-1" />
            <span>{doctor.email}</span>
          </div>
        )}
      </div>

      {/* Next available slot */}
      {doctor.nextAvailable && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center text-green-700">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              Next available: {doctor.nextAvailable}
            </span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-3 mr-4">
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors" 
          onClick={handleBook}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
        <Button 
          variant="outline" 
          className="px-4 border-blue-200 text-blue-600 hover:bg-blue-50 ml-3"
          onClick={() => console.log('View profile:', doctor.name)}
        >
          View Profile
        </Button>
      </div>

      {/* Hover effect overlay */}
   
    </div>
  );
}