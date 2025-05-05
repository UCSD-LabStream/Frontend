import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ThreeD from '../3D'; // Import your 3D model component

function SplashScreen() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <ScienceIcon sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: "Real-Time Control",
      description: "Manipulate actual lab equipment remotely through interactive 3D interfaces"
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: "Live Feedback",
      description: "Watch experiments unfold through real-time camera feeds and sensor data"
    },
    {
      icon: <AutoGraphIcon sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: "Authentic Results",
      description: "Collect and analyze real experimental data, not simulations"
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Decorative Background Grid */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(0deg, rgba(25,118,210,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(25,118,210,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 1,
        }}
      />

      {/* Circular Gradient Accent */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 6, md: 10 },
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: 'center',
            mb: 8,
            maxWidth: '900px',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5rem' },
              fontWeight: 900,
              background: 'linear-gradient(45deg, #1976d2 30%, #2196F3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2,
              textShadow: '0 2px 10px rgba(13,71,161,0.3)',
            }}
          >
            LabStream
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: '#212121',
              fontWeight: 700,
              mb: 3,
            }}
          >
            Control Real Lab Equipment — From Anywhere
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontSize: '1.5rem',
              color: '#555',
              fontWeight: 500,
              mb: 5,
              mx: 'auto',
              maxWidth: '800px',
            }}
          >
            Organize. Collaborate. Innovate.
          </Typography>
        </Box>

        {/* Hero Placeholder */}
        <Card
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: '1000px',
            height: '450px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
            mb: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ThreeD />
          </Box>
        </Card>

        {/* CTA Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: '16px', sm: '24px' },
            mb: 10,
          }}
        >
          <Button
            variant="contained"
            size="large"
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: '4px',
              boxShadow: '0 4px 20px rgba(25,118,210,0.4)',
              background: '#1976d2',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 6px 25px rgba(25,118,210,0.5)',
                background: '#1976d2',
              },
            }}
            onClick={() => navigate('./Login')}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            size="large"
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 700,
              borderRadius: '4px',
              borderWidth: '1px',
              borderColor: '#1976d2',
              color: '#1976d2',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderWidth: '1px',
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25,118,210,0.08)',
                transform: 'translateY(-3px)',
              },
            }}
            onClick={() => navigate('./SignUp')}
          >
            Sign Up
          </Button>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  borderRadius: '12px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* About Section */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '900px',
            textAlign: 'center',
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.8rem' },
              fontWeight: 700,
              color: '#212121',
              mb: 3,
            }}
          >
            Why LabStream?
          </Typography>
          <Typography variant="body1" sx={{ color: '#555', fontSize: '1.2rem' }}>
            LabStream bridges the gap between virtual and physical science education.
            Whether you're an instructor managing student labs or a student eager to get hands-on,
            LabStream brings real-world experimentation to your screen — safely, reliably, and in real time.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default SplashScreen;
