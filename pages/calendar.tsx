import React, { useState } from 'react';
import Calendar from '../components/Calendar';
import TrackingForm from '../components/TrackingForm';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [trackedDays, setTrackedDays] = useState<Date[]>([]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // This should trigger your tracking form to open
  };

  return (
    <div>
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
        trackedDays={trackedDays}
      />
      {selectedDate && (
        <TrackingForm
          selectedDate={selectedDate}
          onSave={(data) => {
            // Handle saving the tracking data
            setTrackedDays(prev => [...prev, selectedDate]);
            // Other save logic...
          }}
        />
      )}
    </div>
  );
};

export default CalendarPage;