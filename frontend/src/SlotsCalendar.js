import React from "react";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const SlotsCalendar = () => {
  return (
    <div className="w-full p-4 overflow-x-auto">
      <div className="grid grid-cols-8 border border-gray-300">
        {/* Header Row */}
        <div className="border-r border-gray-300 bg-white p-2 text-center font-bold">Time</div>
        {daysOfWeek.map((day) => (
          <div key={day} className="border-r border-gray-300 bg-white p-2 text-center font-bold">
            {day}
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="grid grid-cols-8 border border-gray-300">
        {/* Time Column */}
        <div className="border-r border-gray-300">
          {hoursOfDay.map((hour) => (
            <div key={hour} className="h-10 border-b border-gray-300 bg-white flex items-center justify-center">
              {hour}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {daysOfWeek.map((day) => (
          <div key={day} className="border-r border-gray-300">
            {hoursOfDay.map((hour) => (
              <div
                key={`${day}-${hour}`}
                className="h-10 border-b border-gray-300 bg-white hover:bg-green-300"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotsCalendar;
