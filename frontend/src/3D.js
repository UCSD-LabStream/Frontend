import React from 'react';
import { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ClickableFourierOptics from './models/ClickableFourierOptics';
import RaycastWrapper from './models/raycast/RaycastWrapper';

function ThreeD() {
    const [selectedModel, selectModelType] = useState("None")

    const selectModel = (model) => {
        selectModelType(model);
    };

    const handleChange = (event) => {
        const key = event.target.value;
        selectModelType(key);
    };

    const modelMap = {
        'None': <div />,
        // 'boxes': <BoxModel />,
        // 'ThorLabs': <ThorLabs />,
        // 'PlanarGrid': <PlanarGrid />,
        // 'LabeledMulti1': <MultiModel />,
        // 'LabeledMulti2': <MultiModel2 />,
        // 'FourierOpticsTest': <FourierOpticsTest />,
        // 'FourierOptics': <FourierOptics />,
        'ClickableFourierOptics': <ClickableFourierOptics />,
        'RayCasting': <RaycastWrapper />
    }

    return (
        <>
            {/* <div className="intro-card"> */}
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p>Welcome to LabStream 3D. Select a model to view.</p>
                    <FormControl color="secondary" variant="outlined" sx={{ minWidth: 'auto', width: 'auto' }}>
                        {/* <InputLabel sx={{color: 'red', backgroundColor: 'black', textDecorationColor: 'black', textEmphasisColor: 'black', }}>Select a Model</InputLabel> */}
                        <Select
                            value={selectedModel}
                            onChange={handleChange}
                            // label="Select a Model"
                            sx={{ minWidth: 120, maxWidth: 200 }}
                        >
                            {Object.entries(modelMap).map(([key]) => (
                                <MenuItem key={key} value={key}>{key}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div style={{ marginTop: 40 }}>
                {
                    // Display the selected model
                    modelMap[selectedModel]
                }
            </div>
        </>
    );
}

export default ThreeD