import React, { useState, useEffect } from 'react';
// import 'materialize-css/dist/css/materialize.min.css';
// import M from 'materialize-css';
import readSlots from '../components/Read';
import updateBookingData from '../components/Write';
import { TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Typography, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';


const Booking = () => {
    const [email, setEmail] = useState("");
    const [otherEmail, setOtherEmail] = useState('');
    const [otherEmailsList, setOtherEmailsList] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [slotsData, setSlotsData] = useState([]);
    const [experiment, setExperiment] = useState('');
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

    return (
        <Container sx={{ position: 'relative', zIndex: 10, marginTop: '50px', marginBottom: '50px', padding: '20px', borderRadius: "15px", backgroundColor: 'white' }}>
            <form onSubmit={handleSubmit}>
                <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                Lab Booking
                </Typography>

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

                {error && (
                <Typography color="error" align="center">
                    {error}
                </Typography>
                )}

                <div>
                    <TextField
                        id="primaryEmail"
                        label="Primary email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />

                    <TextField
                        id="otherEmails"
                        label="Enter other emails, separated by commas"
                        value={otherEmail}
                        onChange={handleOtherEmailChange}
                        fullWidth
                        margin="normal"
                    />
                </div>

                <Typography variant="h6" align="center" sx={{ marginTop: '20px' }} gutterBottom>
                Select one time slot
                </Typography>
                <Typography variant="body2" align="center">
                Database view of all available times
                </Typography>

                {slotsData.length > 0 ? (
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Slot</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>End Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Book</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {slotsData.map((slot, index) => (
                        <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                            {slot?.startTime?.toDate().toLocaleString() || 'Not Assigned Yet'}
                        </TableCell>
                        <TableCell>
                            {slot?.endTime?.toDate().toLocaleString() || 'Not Assigned Yet'}
                        </TableCell>
                        <TableCell>{String(slot?.status)}</TableCell>
                        <TableCell>
                            {!slot.status && (
                            <Button
                                variant="contained"
                                color={selectedSlot?.id === slot?.id ? 'secondary' : 'primary'}
                                onClick={() => handleSelect(slot)}
                            >
                                Select
                            </Button>
                            )}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                ) : (
                <Typography align="center">No data available in the 'slots' collection.</Typography>
                )}

                {selectedSlot && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h6">Selected Slot Details</Typography>
                    <Typography><b>Primary Email:</b> {email}</Typography>
                    <Typography><b>Other Email:</b> {otherEmail}</Typography>
                    <Typography><b>Start Time:</b> {selectedSlot.startTime?.toDate().toLocaleString() || 'Not Assigned Yet'}</Typography>
                    <Typography><b>End Time:</b> {selectedSlot.endTime?.toDate().toLocaleString() || 'Not Assigned Yet'}</Typography>
                </div>
                )}

                <div style={{ marginTop: '20px' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading || !selectedSlot}
                    fullWidth
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
                </Button>
                </div>
            </form>
        </Container>
    );
}

export default Booking;
