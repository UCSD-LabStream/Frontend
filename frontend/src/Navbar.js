import * as React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Diversity2Icon from '@mui/icons-material/Diversity2';

const pages = ['Help', 'Booking', 'Log Out'];

export const NavBar = () => {
    const navigate = useNavigate();

    const handleLogOut = () => {
        console.log("handling logout");
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
      <AppBar position="sticky" sx={{ bgcolor: '#008493', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' }}>
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
  