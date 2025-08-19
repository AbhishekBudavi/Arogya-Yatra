"use client";

import React from "react";
import { User } from "lucide-react";
import DoctorCard from "./DoctorCards";
import BookingDrawer from "./BookingDrawer";
import { BookingProvider } from "../../../context/BookingContent";

const SearchResults = ({
  hasSearched,
  isLoading,
  results,
  resetFilters,
  doctors,
}) => {
  if (!hasSearched) return null;

  return (
    <div className="min-h-96 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Available Doctors
          </h2>
          <p className="text-gray-600 text-lg">
            {results.length} {results.length === 1 ? "doctor" : "doctors"} found
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border">
          Sorted by:{" "}
          <span className="font-medium text-gray-700">Relevance</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="text-gray-300 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No Doctors Found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <BookingProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {results.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}

              </div>
            </div>
            <BookingDrawer />
          </div>
        </BookingProvider>
      )}
    </div>
  );
};

export default SearchResults;
