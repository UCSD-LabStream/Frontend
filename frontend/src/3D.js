import React from 'react';
import { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ClickableFourierOptics from './models/ClickableFourierOptics';
import RaycastWrapper from './models/raycast/RaycastWrapper';
import RaycastModel from './models/raycast/RaycastModel';

function ThreeD() {
    const [selectedComponent, setComponent] = useState("");
    const [description, setDescription] = useState("");
    return (
        <div style={{ marginTop: 40 }}>
            <p>Welcome to Labstream 3D! Click on a component to learn more about it.</p>
            {selectedComponent && 
                <>
                    <p>Selected component: {selectedComponent}</p>
                    <p>Description: {description}</p>
                </>
            }
            <RaycastWrapper setComponent={setComponent} setDescription={setDescription}>
                        <RaycastModel />
            </RaycastWrapper>
        </div>
    );
}

export default ThreeD