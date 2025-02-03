import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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

const pages = ['Help', 'Booking', 'Slots', 'Log Out'];

export const NavBar = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogOut = async () => {
      const confirmation = window.confirm("Are you sure you want to log out?");
      if (confirmation) {
        try{
          console.log("handling logout");
          await signOut(auth);
          setUser(null);
          navigate('/splashscreen');
      } catch(error){
        console.error("Error logging out");
      }
    }
    }
  
    const handleNavigation = (page) => { 
      if(page === 'Log Out') { 
        handleLogOut(); 
      }
      else{
        navigate(`/${page}`);
      }
    };
  
    return (
      <AppBar position="sticky" sx={{ boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' }}>
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
              }}
              onClick={()=>navigate('/')}
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
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavigation(page)}
                  sx={{ my: 2, color: 'white', display: 'block', mr: 3 }}
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
  