'use client';
import React, { useState } from 'react';
import DoctorCard from './DoctorCards';
import SlotBookingDrawer from './SlotBookingDrawer.jsx';

const doctors = [
  { id: 1, name: 'Dr. Priya Sharma', specialist: 'Cardiologist', location: 'Pune, Maharashtra' },
  { id: 2, name: 'Dr. Ravi Patil', specialist: 'Dermatologist', location: 'Mumbai, Maharashtra' },
  { id: 3, name: 'Dr. Suresh Reddy', specialist: 'Neurologist', location: 'Bengaluru, Karnataka' }
];


export default function DoctorList({ doctors = [] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!doctors.length) return null; // Don't render if no doctors

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} onBook={() => setDrawerOpen(true)} />
        ))}
      </div>
      <SlotBookingDrawer open={drawerOpen} setOpen={setDrawerOpen} />
    </>
  );
}
