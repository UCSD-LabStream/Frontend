import React from 'react';
import { useState } from 'react';
import BoxModel from './models/BoxModel'
import OneBoxModel from './models/OneBoxModel'
import STLModel from './models/STLModel'
import ThorLabs from './models/ThorLabs'
import MultiModel from './models/MultiModel'
import MultiModel2 from './models/MultiModel2'
import PlanarGrid from './models/Grid';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import FourierOptics from './models/FourierOptics';

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
        'boxes': <BoxModel />,
        'ThorLabs': <ThorLabs />,
        'PlanarGrid': <PlanarGrid />,
        'LabeledMulti1': <MultiModel />,
        'LabeledMulti2': <MultiModel2 />,
        'FourierOptics': <FourierOptics />
    }

    return (
        <div className="ThreeD-wrapper">
            <div className="intro-card">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p>Welcome to LabStream 3D. Select a model to view.</p>
                    <FormControl variant="outlined" sx={{ minWidth: 'auto', width: 'auto' }}>
                        <InputLabel>Select a Model</InputLabel>
                        <Select
                            value={selectedModel}
                            onChange={handleChange}
                            label="Select a Model"
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
        </div>
    );
}

export default ThreeD