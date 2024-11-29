import React from 'react';
import { Paper, IconButton, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import './labels.scss'

const LabelPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    minWidth: 120,
    minHeight: 100,
    background: '#252525',
    color: '#f1f1f1',
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
}));

const marks = [
    {
        value: 0,
        label: '0°',
    },
    {
        value: 90,
        label: '90°',
    },
];

function SliderLabel({ title, showLabel }) {
    return (
        <LabelPaper variant="outlined" id="slider-label">
            <IconButton
                size="small"
                onClick={() => showLabel(false)}
                sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    color: 'white',
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
            <div className="slidlab-content">
                <div className="slidlab-title">
                    {title}
                </div>
                <div className="slidlab-slider-container">
                    <Slider
                        aria-label="Custom marks"
                        defaultValue={20}
                        step={10}
                        max={90}
                        valueLabelDisplay="auto"
                        marks={marks}
                        sx={{
                            '& .MuiSlider-markLabel': {
                                color: 'white', // Change to the desired color
                            },
                        }}
                    />
                </div>
            </div>
        </LabelPaper>
    )
}

export default SliderLabel;