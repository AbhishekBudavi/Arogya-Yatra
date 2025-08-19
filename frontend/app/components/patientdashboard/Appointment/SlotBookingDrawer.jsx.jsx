'use client';
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { useBooking } from '../../../context/BookingContent';
import { Button } from '@/components/ui/button';

export default function SlotBookingDrawer({ open, setOpen }) {
  const { state, dispatch } = useBooking();

  const availableSlots = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

  const confirmSlot = (slot) => {
    dispatch({ type: 'SET_SLOT', payload: slot });
    setOpen(false);
  };

  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select Time Slot</DrawerTitle>
          <DrawerDescription>Doctor: {state.selectedDoctor?.name}</DrawerDescription>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-3 p-4">
          {availableSlots.map((slot) => (
            <Button key={slot} variant="outline" onClick={() => confirmSlot(slot)}>
              {slot}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
