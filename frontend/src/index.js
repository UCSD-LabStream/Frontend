import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ThreeD from './3D';
// import TwoD from './2D';
import './index.css';
import App from './App';
import { NavBar } from './Navbar';
import HelpPage from './pages/HelpPage.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/help" element={<HelpPage />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
