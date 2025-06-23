import React, { useState, useEffect } from "react";
import { writeSlots, writeBrewsterSlots } from './components/Write_slots';
import { readSlots, readBrewsterSlots } from './components/Read';
import { getAuth } from "firebase/auth"; 
import { DeleteSlots, DeleteBrewsterSlots } from "./components/DeleteSlots";
import CustomAlert from './components/CustomAlert';
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";


// Utility function to get the date for a specific day of the current week
const getDateOfWeek = (dayOffset) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  currentDate.setDate(currentDate.getDate() - currentDay + dayOffset);
  return currentDate.toLocaleDateString();
};

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const SlotsCalendar = () => {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [createdSlots, setCreatedSlots] = useState([]);
  const [myCreatedSlots, setMyCreatedSlots] = useState([]);
  const [deletableSlots, setDeletableSlots] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null); 
  const [experiment, setExperiment] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchCreatedSlots = async () => {
    let slots = [];
    if(experiment == 'Fourier Optics'){
      slots = await readSlots();
    } else if(experiment == 'Brewster'){
      slots = await readBrewsterSlots();
    } else{
      return;
    }
    const updatedDeletableSlots = [];
    const updatedMyCreatedSlots = []; // Store the slots created by the current user
  
    slots.forEach(slot => {
      if (slot.createdBy === user.email) {
        updatedMyCreatedSlots.push(slot);
        const currTime = new Date();
        const slotStartTime = slot.startTime.toDate ? slot.startTime.toDate() : new Date(slot.startTime);
        const bufferTime = new Date(slotStartTime);
        bufferTime.setMinutes(bufferTime.getMinutes() - 1);
        if (currTime <= bufferTime) {
          updatedDeletableSlots.push(slot);
        }
      }
    });
  
    // Update the state correctly
    setMyCreatedSlots(updatedMyCreatedSlots);
    setDeletableSlots(updatedDeletableSlots);
    setCreatedSlots(slots);
  };

  useEffect(() => {
    fetchCreatedSlots();
  
    const updateDeletableSlots = () => {
      const currTime = new Date();
      
      setDeletableSlots((prevDeletableSlots) => {
        return prevDeletableSlots.filter(slot => {
          // Convert slot.startTime to a Date as it is a Firebase Timestamp
          const slotStartTime = slot.startTime.toDate ? slot.startTime.toDate() : new Date(slot.startTime);
          const bufferTime = new Date(slotStartTime);
          bufferTime.setMinutes(bufferTime.getMinutes() - 1);
          return currTime <= bufferTime;
        });
      });
    };    
  
    // Calculate the time left until the next full minute
    const now = new Date();
    const secondsLeft = 60 - now.getSeconds();
    const millisecondsLeft = secondsLeft * 1000;
  
    // Set timeout to update deletable slots at the next full minute
    const timeoutId = setTimeout(() => {
      updateDeletableSlots(); // Update at the start of the next minute
  
      // Then set up an interval to update every minute
      const intervalId = setInterval(updateDeletableSlots, 60000); // Every minute
  
      // Cleanup the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, millisecondsLeft);
  
    // Cleanup the timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []); // This effect only runs once when the component mounts
  
  useEffect(() => {
    console.log("updated delete slots:", deletableSlots);
  }, [deletableSlots]);

  useEffect(() => {
  setSelectedTimes([]); // Clear selected times on experiment change
  fetchCreatedSlots();  // Refetch slots for the new experiment
}, [experiment]);

  

  const handleOnClick = (date, day, hour) => {
    const startTime = new Date(`${date} ${hour}`);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);
    const timeTuple = [startTime, endTime];

    const isBooked = createdSlots.some(
      (slot) =>
        new Date(slot.startTime.toDate()).toLocaleString() === startTime.toLocaleString()
    );

    const isMyBooked = myCreatedSlots.some(
      (slot) =>
        new Date(slot.startTime.toDate()).toLocaleString() === startTime.toLocaleString()
    ); 

    if (isBooked || isMyBooked) return;
    /*if (isMyBooked) {
      console.log("Deletable");
    }*/

    setSelectedTimes((prev) => {
      const existingIndex = prev.findIndex(
        (tuple) =>
          tuple[0].getTime() === timeTuple[0].getTime() && tuple[1].getTime() === timeTuple[1].getTime()
      );
      if (existingIndex !== -1) {
        const newSelectedTimes = [...prev];
        newSelectedTimes.splice(existingIndex, 1);
        return newSelectedTimes;
      } else {
        return [...prev, timeTuple];
      }
    });
  };

  const handleSubmit = () => {
    alert("Booking selected times.");
    selectedTimes.forEach(([startTime, endTime]) => {
      if (experiment === "Fourier Optics") {
        writeSlots(startTime, endTime);
      } else if (experiment === "Brewster") {
        writeBrewsterSlots(startTime, endTime);
      } else {
        alert("Please select an experiment.");
      }
    });
    //add it to bookedslot and mybookedslots
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };
  const handleDeleteSlot = (slot) => {
    const startTime = slot.startTime.toDate().toLocaleString();
    const endTime = slot.endTime.toDate().toLocaleString();
  
    alert(`Deleting a slot! ${startTime} to ${endTime}`);
    if(experiment == 'Fourier Optics'){
      DeleteSlots(slot.id);
    } else if(experiment == 'Brewster'){
      DeleteBrewsterSlots(slot.id);
    }
    setTimeout(() => {
      window.location.reload();
    }, 3000);

  }

  return (
    <div className="w-full p-4 overflow-x-auto">
        <div className="w-full max-w-xs mx-auto mb-4">
          <FormControl fullWidth margin="normal">
            <InputLabel id="experiment-label">Select Experiment</InputLabel>
            <Select
              labelId="experiment-label"
              id="experiment-select"
              value={experiment}
              label="Select Experiment"
              onChange={(e) => setExperiment(e.target.value)}
            >
              <MenuItem value="Fourier Optics">Fourier Optics</MenuItem>
              <MenuItem value="Brewster">Brewster</MenuItem>
            </Select>
          </FormControl>
        </div>

      {!experiment ? (
        <div className="text-center text-lg text-gray-600 mt-8">
        Please select an experiment to view and book time slots.
      </div>
    ) : (
      <>
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
          {hoursOfDay.map((hour) => (
            <div className="h-10 border-b border-gray-300 bg-white flex items-start justify-center pt-1">
              <span className="self-start leading-none">{hour}</span>
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
              const bookedSlot = myCreatedSlots.find(
                (slot) =>
                  new Date(slot.startTime.toDate()).toLocaleString() === new Date(timeString).toLocaleString()
              );
              const isBooked = createdSlots.some(
                (slot) =>
                  new Date(slot.startTime.toDate()).toLocaleString() === new Date(timeString).toLocaleString()
              );
              const isMyBooked = !!bookedSlot;
              const isSlotDeletable = deletableSlots.some(
                (deletableSlot) => deletableSlot && deletableSlot.id === bookedSlot?.id // Check if deletableSlot exists and compare by id
              );              

              return (
                <div
                    key={timeString}
                    className={`relative z-10 h-10 border-b border-gray-300 flex items-center justify-center cursor-pointer transition ${
                      isMyBooked
                        ? "bg-purple-500"
                        : isBooked && !isMyBooked
                        ? "bg-red-500"
                        : selectedTimes.some(
                            ([start, end]) =>
                              start.toLocaleString() === new Date(timeString).toLocaleString()
                          )
                        ? "bg-green-500"
                        : "bg-white hover:bg-green-300"
                    }`}
                    onClick={() => handleOnClick(date, day, hour)}
                  >
                    {isMyBooked && isSlotDeletable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent cell click
                          handleDeleteSlot(bookedSlot);
                        }}
                        className="absolute top-0 right-0 z-70 bg-red-600 text-white text-xs px-2 py-0.5 rounded-lg hover:bg-red-800 transition"
                      >
                        X
                      </button>
                    )}
                  </div>

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
      <div className="text-center mt-6 relative z-50">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
      </>
      )}
    </div>
  );
};

export default SlotsCalendar;
