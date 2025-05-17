import React from 'react';
import ReactDOM from 'react-dom/client';
import { Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import { NavBar } from './Navbar';
import HelpPage from './pages/HelpPage.js';
import Booking from './pages/Booking.js';
import SplashScreen from './pages/SplashScreen.js';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import SlotCreation from './pages/slotCreation.js';
import reportWebVitals from './reportWebVitals';
import ProtectedRoutes from './components/ProtectedRoutes.js';
import ProfessorRoute from './components/ProfessorRoute.js';
import UserProvider from './components/UserContext.js'
import Trial from './pages/Trial.js';
import MySlots from './MySlots.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CssBaseline from "@mui/material/CssBaseline";
import SlotsCalendar from './SlotsCalendar.js';
import StreamHost from './StreamHost.js';
import HostRoute from './components/hostRoute.js';
import Dashboard from './pages/Dashboard.js';
import Brewster from "./pages/Brewster.js"


const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "black !important",
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          color: "black !important",
          '&:hover fieldset': {
                borderColor: 'yellow', // - Set the Input border when parent has :hover
            },
        },
        focused: {
          borderColor: "white",
        },
        notchedOutline: {
          borderColor: "white",
        },
        input: {
          color: "black !important"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#23486A",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#23486A",
            },
        },
      },
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#EFB036',
    },
    background: {
      default: 'white',
    },
    text: {
      primary: '#000000',
      secondary: '#ffffff',
      disabled: '#ffffff',
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      {/* Set up background color and gradient */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
      {/* Grid */}
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
          zIndex: -2,
        }}
      />
      <NavBar />
      <Routes>
        <Route path="/splashscreen" element={<SplashScreen/>} />
        <Route path="/splashscreen/Login" element={<Login/>} />
        <Route path="/splashscreen/Signup" element={<SignUp/>} />
        <Route path="/splashscreen/Trial" element={<Trial/>} />
        <Route path="/Brewster" element={<Brewster/>} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/booking" element={<Booking />} />
          
          <Route element={<HostRoute />}>
            <Route path="/Host" element={<StreamHost />} />
          </Route>
          {/* Nested Protected Route for Professors */}
          <Route element={<ProfessorRoute />}>
            {/*<Route path="/Slots" element={<SlotCreation />} /> */}
            <Route path="/MySlots" element={<MySlots />} />
            <Route path="/Slots" element={<SlotsCalendar />} />
          </Route>
        </Route>
      </Routes>
      </Box>
    </BrowserRouter>
    </ThemeProvider>
    </LocalizationProvider>
  </UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
