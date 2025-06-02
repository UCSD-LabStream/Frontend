import React from 'react';
import { useState } from 'react';
import RaycastWrapper from './models/raycast/RaycastWrapper';
import RaycastModel from './models/raycast/RaycastModel';
import WideTextCard from './components/WideTextCard';

function ThreeD() {
    const [selectedComponent, setComponent] = useState("");
    const [description, setDescription] = useState("");


    // handler for the x button to close the label
    const handleClose = () => {
        setComponent("");
        setDescription("");
    };

    return (
        <div style={{ marginTop: 0, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            {selectedComponent && 

            // Display the component name & description in a wide text card

                <WideTextCard 
                    title={selectedComponent}
                    content={description}
                    onClose={handleClose}
                />
            }
            <RaycastWrapper component={selectedComponent} setComponent={setComponent} setDescription={setDescription}>
                        <RaycastModel />
            </RaycastWrapper>
        </div>
    );
}

export default ThreeD