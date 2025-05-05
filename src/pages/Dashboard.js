import React from 'react';
import { Box, Typography, Card, CardContent, Button, Container } from '@mui/material';
import { useUser } from '../components/UserContext';

const mockBookings = [
  {
    id: 1,
    labName: "ECE 101 Lab 1",
    date: "2025-05-05",
    startTime: "18:00",
    endTime: "20:00"
  },
  {
    id: 2,
    labName: "ECE 101 Lab 2",
    date: "2025-05-06",
    startTime: "10:00",
    endTime: "11:00"
  }
];

const Dashboard = () => {
  const { user } = useUser();
  const now = new Date();

  const isCurrentBooking = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return now >= startDate && now <= endDate;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: 'white', fontWeight: 'bold' }}
        >
        Hello, {user?.displayName || user?.email || 'User'}
        </Typography>
      <br></br>

      <Typography variant="h6" gutterBottom>
        Your Upcoming Bookings
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
      {mockBookings.map((booking) => {
        const start = new Date(`${booking.date}T${booking.startTime}`);
        const end = new Date(`${booking.date}T${booking.endTime}`);
        const isNow = isCurrentBooking(start, end);

        const shouldShowEnterLab = isNow || booking.id === 1; // always show for booking id 1

        return (
            <Card key={booking.id} variant="outlined">
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h6">{booking.labName}</Typography>
                    <Typography>Date: {booking.date}</Typography>
                    <Typography>
                    Time: {booking.startTime} – {booking.endTime}
                    </Typography>
                </Box>
                {shouldShowEnterLab && (
                    <Button
                    variant="contained"
                    sx={{ backgroundColor: '#1976d2', height: 'fit-content' }}
                    onClick={() => alert(`Navigating to lab ${booking.labName}`)}
                    >
                    Enter Lab
                    </Button>
                )}
                </Box>
            </CardContent>
            </Card>
        );
    })}

      </Box>
    </Container>
  );
};

export default Dashboard;
