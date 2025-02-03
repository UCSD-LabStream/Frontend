import React, { useState, useEffect } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
import readSlots from '../components/Read';
import updateBookingData from '../components/Write';
import './styles.css';


const Booking = () => {
    const [email, setEmail] = useState("");
    const [otherEmail, setOtherEmail] = useState('');
    const [otherEmailsList, setOtherEmailsList] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [slotsData, setSlotsData] = useState([]);
    // selected slot state management
    const [selectedSlot, setSelectedSlot] = useState(null);

    const fetchData = async () => {
        const slots = await readSlots();
        setSlotsData(slots);
    }

    useEffect(() => {
        fetchData()
    }, []);
    
    //console.log("slots", readSlots())

    const handleOtherEmailChange = (e) => {
      const value = e.target.value;
      setOtherEmail(value);

      const emailsArray = value.split(',').map(email => email.trim()).filter(email => email !== '');
      setOtherEmailsList(emailsArray);
    }
    const handleSelect = (slot) => {
        //e.preventDefault();
        if (selectedSlot?.id === slot.id) {
            setSelectedSlot(null); // Deselect if the same slot is clicked
        } else {
            setSelectedSlot(slot); // Select new slot
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        if(!selectedSlot){
            setError("Please select a time slot before confirming.");
            return;
        }
        setIsLoading(true);

        const primaryEmail = selectedSlot.email ? String(selectedSlot.email) : String(email);
        try {
          await updateBookingData(
            selectedSlot.id,
            primaryEmail,
            otherEmailsList
          );
          console.log("Booking submitted!");
          setSelectedSlot(null);
          setEmail('');
          setOtherEmail('');
          setOtherEmailsList([]);
        } catch (error) {
          setError("Failed to submit booking. Please try again.");
        }
        
        // Reset form and states after submission if needed
        setTimeout(() => {
          setIsLoading(false);
          setSelectedSlot(null); // Reset state after submission
        }, 1000);
    }

    console.log("use slots", slotsData);
    console.log("length:", slotsData.length);
    console.log("other emails: ", otherEmailsList);

    useEffect(() => {
        // Initialize Materialize components if needed
        M.AutoInit();
    }, []);

    return (
        <div style={{ color: 'white' }}>
            <form onSubmit={handleSubmit} className="container" style={{ marginTop: '50px' }}>
                <h2 className="center-align">Lab Booking</h2>
                {error && <p className="red-text">{error}</p>}
                
                <div className="row">
                    <div className="input-field col s6">
                        <input
                            id="primaryEmail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="primaryEmail">Primary email</label>
                    </div>
                    <div className="input-field col s6">
                        <input
                            id="otherEmails"
                            type="text"
                            value={otherEmail}
                            onChange={handleOtherEmailChange}
                        />
                        <label htmlFor="otherEmails">Enter other emails, separated by commas</label>
                    </div>
                </div>
                
                <p className="center-align">Select one time slot</p>
                <p className="center-align grey-text">Database view of all available times</p> 
                <div>
                    {slotsData.length > 0 ? (
                        <table>
                        <thead>
                            <tr>
                            <th>Slot</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                            <th>Book </th>
                            {/* Add more columns here based on your data structure */}
                            </tr>
                        </thead>
                        <tbody>
                        {slotsData.map((slot) => {
                            return(
                            <tr key={slot.id}>
                                <td>{slot?.id}</td>
                                <td>{slot?.startTime?.toDate().toLocaleString() || "Not Assigned Yet"}</td>
                                <td>{slot?.endTime?.toDate().toLocaleString() || "Not Assigned Yet"}</td>
                                <td>{String(slot?.status)}</td>
                                <td>
                                {!slot.status && (
                                <button
                                type="button"
                                onClick={() => handleSelect(slot)}
                                className={`${selectedSlot?.id === slot?.id ? 'green' : 'blue'}`}
                                >
                                Select
                                </button>
                                )}
                                </td>
                                {/* Add more cells here for other properties */}
                            </tr>
                            )})}
                        </tbody>
                        </table>
                    ) : (
                        <p>No data available in the 'slots' collection.</p>
                    )}
                </div>
                {/* Display selected slot and email details */}
                <div className="section">
                    <h5>Selected Slot Details</h5>
                    {selectedSlot && (
                    <div>
                        <p><b>Primary Email:</b>{email}</p>
                        <p><b>Other Email:</b> {otherEmail}</p>
                        <p><b>Slot ID:</b> {selectedSlot.id}</p>
                        <p><b>Start Time:</b> {selectedSlot.startTime?.toDate().toLocaleString() || "Not Assigned Yet"}</p>
                        <p><b>End Time:</b> {selectedSlot.endTime?.toDate().toLocaleString() || "Not Assigned Yet"}</p>
                    </div>
                    )}
                </div>
                <br></br>
                <button type="submit" className="btn waves-effect waves-light" disabled={isLoading || !selectedSlot}>
                    {isLoading ? "Booking ..." : "Confirm Booking"}
                </button>
            </form>
        </div>
    );
}

export default Booking;
