import React from 'react';
import { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import RaycastWrapper from './models/raycast/RaycastWrapper';
import RaycastModel from './models/raycast/RaycastModel';
import WideTextCard from './components/WideTextCard';

function ThreeD() {
    const [selectedComponent, setComponent] = useState("");
    const [description, setDescription] = useState("");
    return (
        <div style={{ marginTop: 40, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <p>Welcome to Labstream 3D! Click on a component to learn more about it. </p>
                
            <p>Left-click and drag to rotate the scene. Right-click and drag to pan. Scroll to zoom.</p>
            {selectedComponent && 

            // Display the component name & description in a wide text card

                <WideTextCard 
                    title={selectedComponent}
                    content={description}
                />
            }
            <RaycastWrapper setComponent={setComponent} setDescription={setDescription}>
                        <RaycastModel />
            </RaycastWrapper>
        </div>
    );
}

export default ThreeD