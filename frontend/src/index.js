import React from 'react';
import ReactDOM from 'react-dom/client';
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
import CssBaseline from "@mui/material/CssBaseline";
import SlotsCalendar from './SlotsCalendar.js';



const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#23486A',
    },
    secondary: {
      main: '#EFB036',
    },
    background: {
      default: '#3B6790',
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
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/splashscreen" element={<SplashScreen/>} />
        <Route path="/splashscreen/Login" element={<Login/>} />
        <Route path="/splashscreen/Signup" element={<SignUp/>} />
        <Route path="/splashscreen/Trial" element={<Trial/>} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<App />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/booking" element={<Booking />} />
          
          {/* Nested Protected Route for Professors */}
          <Route element={<ProfessorRoute />}>
            <Route path="/Slots" element={<SlotCreation />} />
            <Route path="/MySlots" element={<MySlots />} />
            <Route path="/calendar" element={<SlotsCalendar />} />
          </Route>
        </Route>
        {/* <Route path="/3D" element={<ThreeD />} />
        <Route path="/2D" element={<TwoD />} /> */}
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  </UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
