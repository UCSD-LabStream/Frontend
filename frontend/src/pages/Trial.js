import React from 'react';
import { useEffect, useState, useRef } from 'react';
import BoxModel from '../models/BoxModel';
import TextCard from '../components/TextCard';
import { Typography, IconButton, SvgIcon} from '@mui/material'
import Pause from '@mui/icons-material/Pause';
import RotateRight from '@mui/icons-material/RotateRight';
import RotateLeft from '@mui/icons-material/RotateLeft';

function Trial() {
    const [isFilterTwoTimes, handleFilterTwoTimes] = useState(false)
    return(
        <div>
            <h2 style={styles.centerAlign}>Rotating Box Model</h2>
            <br />
            <div style={styles.container}>
                <div style={styles.leftCard}>
                    <TextCard title="Interact With the Model" content="Left-click on the boxes to change their size." />
                </div>
                <div style={styles.boxModelContainer}>
                    <BoxModel />
                </div>
                <div style={styles.rightCard}>
                    <TextCard title="Change Perspective" content="Left-click and move your mouse to rotate around the model. You can also zoom in and out." />
                </div>
            </div>
            <br />
            <div 
  style={{
    alignItems: 'center', 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center',  
    marginTop: 20, 
    width: '100%'
  }}
>
            <div 
                style={{
                display: 'flex', 
                backgroundColor: 'white', 
                padding: '10px', // Adds padding around the buttons inside the white box
                borderRadius: '8px', // Optional: gives the box rounded corners
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' // Optional: adds a subtle shadow for a 3D effect
                }}
            >
                <Typography textAlign='left' style={{ marginLeft: 3 }}>Rotation motor</Typography>
                <IconButton style={{ backgroundColor: 'white' }} onClick={() => console.log("clicked")}>
                <RotateLeft />
                </IconButton>
                <IconButton style={{ backgroundColor: 'white' }} onClick={() => console.log("clicked")}>
                <Pause />
                </IconButton>
                <IconButton style={{ backgroundColor: 'white' }} onClick={() => console.log("clicked")}>
                <RotateRight />
                </IconButton>
                <IconButton style={{ backgroundColor: 'white' }} onClick={() => console.log("clicked")}>
                <SvgIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 449.851">
                    <g fill-rule="nonzero">
                        <path fill={isFilterTwoTimes ? "blue" : "black"} d="M153.143 219.364l-4.867-26.516c15.716-4.737 31.372-7.106 46.96-7.106 6.241 0 11.445.183 15.624.559 4.178.376 8.513 1.31 13.003 2.809 4.49 1.493 8.046 3.55 10.667 6.171 5.988 5.988 8.98 15.157 8.98 27.505 0 12.348-3.491 21.452-10.479 27.317-6.982 5.86-21.704 12.595-44.154 20.206v7.955h52.763v27.219h-95.984v-23.385c0-15.525 3.97-23.486 15.715-33.117 3.367-2.87 7.89-5.614 13.567-8.234a4349.194 4349.194 0 0116.091-7.39c5.05-2.31 9.137-4.211 12.253-5.706v-11.468c-5.613-.627-10.787-.938-15.528-.938-11.474 0-23.016 1.374-34.611 4.119zm144.908-30.818l12.908 31.248h1.873l12.908-31.248h40.599l-26.006 56.503 26.006 60.434h-41.534l-14.034-33.676h-1.681l-13.848 33.676h-39.664l25.447-59.311-25.447-57.626h42.473z"/>
                    </g>
                    </svg>
                </SvgIcon>
                </IconButton>
            </div>
            </div>

            <div style={styles.text}>
            <h5> Sign up with your university to connect to real labs <br /> and access features such as live camera feed of the equipment!</h5>
            </div>
        </div>
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
