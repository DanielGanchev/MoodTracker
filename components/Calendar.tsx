import React, { useState } from 'react';
import { isSameDay, isPastDay } from 'date-fns';
import { cn } from '../lib/utils';

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  trackedDays: Date[]; // Array of days that have been tracked
}

const Calendar = ({ selectedDate, onSelectDate, trackedDays }: CalendarProps) => {
  const handleDayClick = (date: Date) => {
    onSelectDate(date);
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          const isPast = isPastDay(day);
          const isTracked = trackedDays.some(trackedDay =>
            isSameDay(trackedDay, day)
          );
          const isMissed = isPast && !isTracked;
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              className={cn(
                "h-12 rounded-lg p-2 text-sm transition-colors",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                {
                  "bg-blue-100": isSelected,
                  "bg-red-50": isMissed,
                  "opacity-50": !isPast,
                  "cursor-pointer": isPast
                }
              )}
              disabled={!isPast}
              aria-label={`Select ${day.toLocaleDateString()}`}
              tabIndex={isPast ? 0 : -1}
            >
              <div className="flex flex-col items-center">
                {day.getDate()}
                {isMissed && (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;