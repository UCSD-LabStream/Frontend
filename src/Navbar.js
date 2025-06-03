import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import { useUser } from './components/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from './Firebase/firebase';

const allPages = ['Help', 'Booking', 'Slots', 'Host', 'Brewster', 'Log Out'];

export const NavBar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    
    // Define your list of host users
    const hosts = ["rsrikanth@ucsd.edu", "wal009@ucsd.edu", "sabaghda@ucsd.edu", "hlonsdale@ucsd.edu", "prashk135@gmail.com"];
    const isHost = user && hosts.includes(user.email);

    const professors = ["professor1@ucsd.edu", "professor2@ucsd.edu", "rsrikanth@ucsd.edu"];
    const isProfessor = user && professors.includes(user.email);                                                                                                                                                                                                                                                      
    const handleLogOut = async () => {
      const confirmation = window.confirm("Are you sure you want to log out?");
      if (confirmation) {
        try {
          console.log("handling logout");
          await signOut(auth);
          setUser(null);
          navigate('/');
        } catch (error) {
          console.error("Error logging out");
        }
      }
    }

    const handleNavigation = (page) => { 
      if (page === 'Log Out') { 
        handleLogOut(); 
      } else {
        navigate(`/${page}`);
      }
    };

    // Customize visible pages based on user type
    const visiblePages = user != null
      ? allPages.filter((page) => {
          if (page === 'Log Out') return true;
          if (page === 'Host') return isHost; // Only show Host if user is host
          if (page === 'Slots') return isProfessor;
          return true;
        })
      : allPages.filter((page) => page !== 'Log Out');  

    // list of URLs where the navbar should not appear
    const noNavbarURLs = ['/', '/Login', '/SignUp']

    return (
      <AppBar sx={{ ...(noNavbarURLs.includes(useLocation().pathname) && {visibility: 'hidden',}), ...(!noNavbarURLs.includes(useLocation().pathname) && {position: 'sticky',}), boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Diversity2Icon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/FourierOptics')}
            >
              LabStream
            </Typography>

            <Diversity2Icon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LabStream
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {visiblePages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavigation(page)}
                  variant='text'
                  sx={{ fontWeight: '500', color: 'white', mr: 3, 
                    ':hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
};
