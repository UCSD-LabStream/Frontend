import React from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HelpPage = () => {
    const faqItems = [
        {
            question: "How do I reserve a spot?",
            answer: "Reach out to your Professor to book a scheduled spot to operate the lab.",
        },
        {
            question: "How do I reset my password?",
            answer: "Navigate to the 'Forgot Password' link on the login page. Enter your email address to receive reset instructions.",
        },
        {
            question: "The 3D models aren't working. What should I do?",
            answer: "The 2D model provides the same functionality as the 3D model, and might work better if your computer has performance issues or visual bugs in the 3D model.",
        },
    ];

    return (
        <Container
            maxWidth="md"
            sx={{
                mt: 4,
                mb: 4,
                padding: 4,
            }}
        >
            <Typography
                variant="h3"
                sx={{ fontWeight: 'bold' }}
                gutterBottom
            >
                Help & Support
            </Typography>
            <Typography sx={{ marginBottom: '20px' }}>
                Welcome to the help section! Below are answers to some frequently asked questions. If you need further assistance, please contact our support team.
            </Typography>

            {faqItems.map((item, index) => (
                <Accordion
                    key={index}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon color='primary'/>}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                    >
                        <Typography>{item.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{item.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
};

export default HelpPage;
