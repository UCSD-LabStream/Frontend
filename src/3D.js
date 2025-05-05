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
        <div style={{ marginTop: 0, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
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