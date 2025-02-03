import React, { useState } from 'react';

// Time slots for the calendar (from 8:00 AM to 8:00 PM, hourly intervals)
const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
];

const generateTimeGrid = () => {
    const grid = [];
    for (let i = 0; i < timeSlots.length; i++) {
        grid.push(timeSlots[i]);
    }
    return grid;
};

const SlotsCalendar = () => {
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [timeGrid] = useState(generateTimeGrid());

    // Handle time slot selection
    const handleSlotSelection = (slot) => {
        setSelectedSlots((prev) => {
            if (prev.includes(slot)) {
                return prev.filter((time) => time !== slot); // Deselect if already selected
            }
            return [...prev, slot]; // Add if not selected
        });
    };

    return (
        <div>
            <h3 style={{ color:"white"}}>Select Multiple Time Slots</h3>

            {/* Grid of Time Slots */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {timeGrid.map((slot, index) => (
                    <button
                        key={index}
                        onClick={() => handleSlotSelection(slot)}
                        style={{
                            backgroundColor: selectedSlots.includes(slot) ? 'green' : 'lightgray',
                            padding: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px',
                            borderRadius: '5px',
                            textAlign: 'center',
                        }}
                    >
                        {slot}
                    </button>
                ))}
            </div>

            {selectedSlots.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ color:"white"}}>Selected Time Slots</h4>
                    <ul>
                        {selectedSlots.map((slot, index) => (
                            <li key={index} style={{ color:"white"}}>{slot}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


export default SlotsCalendar;
