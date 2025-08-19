// 📁 lib/api/fetchAvailableSlots.js

const fetchAvailableSlots = async (doctorId, date, type) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // simulate network delay

  return {
    date: date,
    morningSlots: [
      { time: "07:30 AM", available: true },
      { time: "08:00 AM", available: true },
      { time: "08:30 AM", available: false },
      { time: "09:00 AM", available: true },
      { time: "09:30 AM", available: true },
      { time: "10:00 AM", available: false },
      { time: "10:30 AM", available: true },
      { time: "11:00 AM", available: true }
    ],
    eveningSlots: [
      { time: "06:00 PM", available: true },
      { time: "06:30 PM", available: false },
      { time: "07:00 PM", available: true },
      { time: "07:30 PM", available: true },
      { time: "08:00 PM", available: true },
      { time: "08:30 PM", available: false },
      { time: "09:00 PM", available: true },
      { time: "09:30 PM", available: true }
    ]
  };
};

export default fetchAvailableSlots;
