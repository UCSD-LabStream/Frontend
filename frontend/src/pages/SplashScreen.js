import React from 'react';
import { useNavigate } from 'react-router-dom';
import introImg from '../components/Images/introImg.png'; // Adjust the path accordingly
import { Box, Button, Typography, Container } from '@mui/material';

function SplashScreen() {
    const navigate = useNavigate();

    return (
    <Container
      sx={{ 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px',
        marginTop: '20px'
      }}
    >
      {/* The content area */}
      <Box 
        sx={{ 
          display: 'flex', 
          width: '100%', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        {/* Text and buttons */}
        <Box sx={{ flex: 1, padding: '20px', paddingLeft: '10px' }}>
          <Typography 
            variant="h1" 
            sx={{ fontSize: '6rem', textAlign: 'left', marginBottom: '30px', fontWeight: 'bold' }}
          >
            Welcome to LabStream!
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ padding: '10px 20px', fontSize: '1.1rem', width: '200px', height: '50px' }} 
              onClick={() => navigate('./Login')}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ padding: '10px 20px', fontSize: '1.1rem', width: '200px', height: '50px' }} 
              onClick={() => navigate('./SignUp')}
            >
              Sign Up
            </Button>
          </Box>
        </Box>

        {/* Image */}
        <Box sx={{ flex: 1 }}>
          <img 
            src={introImg}
            alt="Intro" 
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
          />
        </Box>
      </Box>

      {/* Section below the content */}
      <Typography 
        variant="h2" 
        sx={{ fontSize: '3rem', textAlign: 'left', marginTop: '50px', fontWeight: 'bold', width: '100%' }}
      >
        What is LabStream?
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ fontSize: '1.5rem', textAlign: 'left', width: '100%', marginTop: '20px' }}
      >
        LabStream is a platform designed to help students manage their coursework and laboratory experiments more efficiently. 
        It allows students to track their progress, collaborate on experiments, and access real-time data from their labs. 
        With LabStream, students can streamline their workflows, stay organized, and ensure they’re always up to date with their academic work.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', marginTop: '30px' }}>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ padding: '10px 20px', fontSize: '1.1rem', width: '200px', height: '50px' }} 
          onClick={() => navigate('./Trial')}
        >
          Try Now!
        </Button>
      </Box>
    </Container>
    );
}

export default SplashScreen;
