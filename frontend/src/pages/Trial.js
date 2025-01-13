import React from 'react';
import BoxModel from '../models/BoxModel';
import TextCard from '../components/TextCard';

function Trial() {
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
                    <TextCard title="Change Perspective" content="Left-click and move your mouse to rotate around the model." />
                </div>
            </div>
            <br />
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
