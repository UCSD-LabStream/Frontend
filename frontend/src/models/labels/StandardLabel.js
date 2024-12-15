import React from 'react';
import { Paper, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const LabelPaper = styled(Paper)(({ theme }) => ({
    display: 'flex',
    minWidth: 100,
    background: '#252525',
    color: '#f1f1f1',
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
}));

function StandardLabel({ title, showLabel }) {
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
            {title}
        </LabelPaper>
    )
}

export default StandardLabel;