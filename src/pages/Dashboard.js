import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Container } from '@mui/material';
import { useUser } from '../components/UserContext';
import { readSlots, readBrewsterSlots } from '../components/Read';
import { useNavigate } from 'react-router-dom';
import { useLabAccess } from '../components/LabAccessContext';

const Dashboard = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();
  const { setCanAccessLab } = useLabAccess();
  const { user } = useUser();
  const now = new Date();
  const [slotsData, setSlotsData] = useState([]);

  const fetchData = async () => {
    if (user?.email) {
      const [fourierSlots, brewsterSlots] = await Promise.all([
      readSlots(),
      readBrewsterSlots()
    ]);

    const allSlots = [...fourierSlots, ...brewsterSlots];

    const filteredSlots = allSlots.filter(slot => {
      const isUserBooked =
        slot.bookedBy === user.email ||
        (Array.isArray(slot.otherEmails) && slot.otherEmails.includes(user.email));

      const slotEnd = slot.endTime?.seconds ? new Date(slot.endTime.seconds * 1000) : new Date(slot.endTime);

      return isUserBooked && slotEnd > now;
    });

    setSlotsData(filteredSlots);
   }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const isCurrentBooking = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return now >= startDate && now <= endDate;
  };

 const handleEnterLab = () => {
  setCanAccessLab(true);
  if (!selectedSlot?.labName) return;
  
  if (selectedSlot.labName === 'Brewster') {
    navigate('/Brewster');
  } else {
    navigate('/FourierOptics');
  }
};


  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    }
    return '';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography
          variant="h4"
          sx={{ color: 'black', fontWeight: 'bold' }}
        >
          Hello, {user?.displayName || user?.email || 'User'}
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        Your Upcoming Bookings
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {slotsData.length > 0 ? (
          slotsData.map((booking) => {
            const start = formatDate(booking.startTime);
            const end = formatDate(booking.endTime);
            const isNow = isCurrentBooking(start, end);
            const shouldShowEnterLab = isNow || booking.id === 1;

            return (
              <Card key={booking.id} variant="outlined">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">{booking.labName}</Typography>
                      <Typography>Date: {booking.date}</Typography>
                      <Typography>
                        Time: {start} – {end}
                      </Typography>
                    </Box>
                    {shouldShowEnterLab ? (
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: '#1976d2', height: 'fit-content' }}
                        onClick={() =>{
                          setSelectedSlot(booking); 
                          handleEnterLab();
                        }}
                      >
                        Enter Lab
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        disabled
                        sx={{ backgroundColor: '#757575', color: 'white', height: 'fit-content' }}
                      >
                        Lab opens soon
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography>No upcoming bookings found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
