import React, {useState} from "react";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const wholeHoursOfDay = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const hoursOfDay = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2); 
  const minute = i % 2 === 0 ? "00" : "30"; 
  return `${hour}:${minute}`;
});

const SlotsCalendar = () => {

  const [selectedTimes, setSelectedTimes] = useState([]);

  const handleOnClick = (day, hour) => {
    const timeString = `You have selected: ${day} at ${hour}`;
    setSelectedTimes((prev) =>
      prev.includes(timeString) ? prev.filter((t) => t !== timeString) : [...prev, timeString]
    );
  }

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
          {wholeHoursOfDay.map((hour) => (
            <div key={hour} className="h-10 border-b border-gray-300 bg-white flex items-center justify-center">
              {hour}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {daysOfWeek.map((day) => (
          <div key={day} className="border-r border-gray-300">
            {hoursOfDay.map((hour) => {
              const timeString = `You have selected: ${day} at ${hour}`;
              return (
                <div
                  key={timeString}
                  className={`h-5 border-b border-gray-300 flex items-center justify-center cursor-pointer transition ${
                    selectedTimes.includes(timeString) ? "bg-green-500" : "bg-white hover:bg-green-300"
                  }`}
                  onClick={() => handleOnClick(day, hour)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 text-lg font-semibold text-center">
        {selectedTimes.length > 0 && (
          <div>
            <p>Selected Times:</p>
            <ul className="list-disc list-inside">
              {selectedTimes.map((time, index) => (
                <li key={index}>{time}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotsCalendar;
