import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import writeSlots from '../components/Write_slots';

const SlotCreation = () => {
  const [formData, setFormData] = useState({
    course_no: '',
    startTime: dayjs('2025-01-01'),
    endTime: dayjs('2025-01-01'),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    writeSlots(formData.startTime, formData.endTime);
    alert(
      `Booking these slots`
    );
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '50px', padding: '20px', borderRadius: "15px", backgroundColor: 'white' }} >
      <Box sx={{ padding: 2 }}>
          <Typography variant="h4" gutterBottom>
              Create Slot
          </Typography>
          <form onSubmit={handleSubmit} id="slot-form">
              <TextField
                  id="course_no"
                  label="Course Number"
                  name="course_no"
                  type="text"
                  value={formData.course_no}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    marginBottom: 2
                  }}
              />

              <div style={{ display: 'flex', gap: '10px'}}>
              <DateTimePicker
                  label="Start Time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={(newDate) => setFormData({...formData, startTime: newDate})}
                  required
                  fullWidth
                  sx={{ 
                    marginBottom: 2,  
                  }}
              />

              <DateTimePicker
                  label="End Time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={(newDate) => setFormData({...formData, endTime: newDate})}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
              />
              </div>

              

              <Button
                  className="btn waves-effect waves-light"
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
              >
                  Create Slot
              </Button>
          </form>
      </Box>
  </Container>
  );
};

export default SlotCreation;
