import React from 'react';
import { useEffect, useState, useRef } from 'react';
import ThreeD from '../3D.js';
import TextCard from '../components/TextCard';
import { Typography, IconButton, Box } from '@mui/material'
import { FastForward, RotateRight, RotateLeft, Pause } from '@mui/icons-material';

function Trial() {
    const [isFilterTwoTimes, handleFilterTwoTimes] = useState(false)
    return(
       <Box sx={{ color: "white", height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {/* Title */}
      <Typography variant="h2" sx={{ textAlign: 'center', fontWeight: 'bold', mt:20 }}>
        Fourier Optics Model 
      </Typography>
      <Box sx={{ display: 'flex', width: '90%', justifyContent: 'center', alignItems: 'center', mt: 3 }}>

        {/* Box Model Container */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ThreeD />
        </Box>

      </Box>

      {/* Control Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3, width: '100%' }}>
        <Box sx={{ display: 'flex', backgroundColor: 'white', p: 2, borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center' }}>
          <Typography color="textPrimary" sx={{ ml: 1 }}>Rotation motor</Typography>
          
          {/* Icon Buttons */}
          <IconButton sx={{ backgroundColor: 'white' }} onClick={() => console.log("clicked")}>
            <RotateLeft />
          </IconButton>
          <IconButton sx={{ backgroundColor: 'white' }} onClick={() => console.log("clicked")}>
            <Pause />
          </IconButton>
          <IconButton sx={{ backgroundColor: 'white' }} onClick={() => console.log("clicked")}>
            <RotateRight />
          </IconButton>
          <IconButton style={{ backgroundColor: 'transparent' }} onClick={() => console.log("clicked")}>
            <FastForward />
            </IconButton>
        </Box>
      </Box>

      {/* Sign up information */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">
          Sign up with your university to connect to real labs <br /> and access features such as live camera feed of the equipment!
        </Typography>
      </Box>
    </Box>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
    },
    leftCard: {
        width: '300px',
        flexShrink: 0,
    },
    rightCard: {
        width: '300px',
        flexShrink: 0,
    },
    boxModelContainer: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    centerAlign: {
        textAlign: 'center',
        color: '#fff',
        marginBottom: '20px',
    },
    text: {
        color: '#fff',
        textAlign: 'center',
    }
};

export default Trial;
