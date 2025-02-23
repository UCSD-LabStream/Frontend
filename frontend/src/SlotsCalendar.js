import React, { useState, useEffect } from "react";
import writeSlots from './components/Write_slots';
import readSlots from './components/Read';

// Utility function to get the date for a specific day of the current week
const getDateOfWeek = (dayOffset) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  currentDate.setDate(currentDate.getDate() - currentDay + dayOffset);
  return currentDate.toLocaleDateString();
};

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const wholeHoursOfDay = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const hoursOfDay = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

const SlotsCalendar = () => {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const fetchBookedSlots = async () => {
    const slots = await readSlots();
    setBookedSlots(slots);
}

    useEffect(() => {
        fetchBookedSlots()
    }, []);

  const handleOnClick = (date, day, hour) => {
    const startTime = new Date(`${date} ${hour}`);
    const endTime = new Date(`${date} ${hour}`);
    endTime.setMinutes(startTime.getMinutes() + 30);
    const timeTuple = [startTime, endTime];

    setSelectedTimes((prev) => {
      // Check if the timeTuple is already selected
      const existingIndex = prev.findIndex(
        (tuple) =>
          tuple[0].getTime() === timeTuple[0].getTime() && tuple[1].getTime() === timeTuple[1].getTime()
      );
      if (existingIndex !== -1) {
        const newSelectedTimes = [...prev];
        newSelectedTimes.splice(existingIndex, 1); // Remove the existing tuple
        return newSelectedTimes;
      } else {
        return [...prev, timeTuple]; // Add the new tuple
      }
    });
  };

  const handleSubmit = () => {
    alert("Booking selected times.");
    selectedTimes.forEach(([startTime, endTime]) => {
      writeSlots(startTime, endTime); 
    }); 
    // temporary fix 
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  return (
    <div className="w-full p-4 overflow-x-auto">
      <div className="grid grid-cols-8 border border-gray-300">
        {/* Header Row */}
        <div className="border-r border-gray-300 bg-white p-2 text-center font-bold">Time</div>
        {daysOfWeek.map((day, index) => {
          const date = getDateOfWeek(index);
          return (
            <div key={day} className="border-r border-gray-300 bg-white p-2 text-center font-bold">
              <div>{date}</div>
              <div>{day}</div>
            </div>
          );
        })}
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
        {daysOfWeek.map((day, index) => {
          const date = getDateOfWeek(index);
          return (
            <div key={day} className="border-r border-gray-300">
              {hoursOfDay.map((hour) => {
                const timeString = `${date} ${hour}`;
                const isBooked = bookedSlots.some(
                  (slot) =>
                    new Date(slot.startTime.toDate()).toLocaleString() === new Date(timeString).toLocaleString()
                );
                return (
                  <div
                    key={timeString}
                    className={`h-5 border-b border-gray-300 flex items-center justify-center cursor-pointer transition ${
                      isBooked
                      ?"bg-red-500"
                      : selectedTimes.some(
                        ([start, end]) =>
                          start.toLocaleString() === new Date(timeString).toLocaleString()
                      )
                        ? "bg-green-500"
                        : "bg-white hover:bg-green-300"
                    }`}
                    onClick={() => handleOnClick(date, day, hour)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-lg font-semibold text-center">
        {selectedTimes.length > 0 && (
          <div>
            <p>Selected Times:</p>
            <ul className="list-disc list-inside">
              {selectedTimes.map(([start, end], index) => (
                <li key={index}>
                  Start: {start.toLocaleString()}, End: {end.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SlotsCalendar;
