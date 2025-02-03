import React from 'react';
import { Paper, IconButton, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const LabelPaper = styled(Paper)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    background: '#252525',
    color: '#f1f1f1',
    padding: theme.spacing(4, 2, 2, 2), // Extra padding on top for close button
    minWidth: '200px',
}));

const ContentBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
});

function StandardLabel({ title, description, showLabel }) {
    return (
        <LabelPaper variant="outlined">
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
            
            <ContentBox>
                <Typography 
                    variant="h6" 
                    component="h2" 
                    sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        color: '#ffffff'
                    }}
                >
                    {title}
                </Typography>
                
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: '#e0e0e0',
                        fontSize: '0.875rem',
                    }}
                >
                    {description}
                </Typography>
            </ContentBox>
        </LabelPaper>
    );
}

export default StandardLabel;