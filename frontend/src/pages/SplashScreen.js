import React from 'react';
import { useNavigate } from 'react-router-dom';
import introImg from '../components/Images/introImg.png'; // Adjust the path accordingly

function SplashScreen() {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ color: "white", height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '50px', paddingTop: '150px' }}>
            {/* The content area */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Text and buttons */}
                <div style={{ flex: 1, padding: '20px', paddingLeft: '10px' }}>
                    <h1 className="header" style={{ fontSize: '6rem', textAlign: 'left', marginBottom: '30px', fontWeight: 'bold' }}>Welcome to LabStream!</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
                        <a 
                            className="waves-effect waves-light btn purple lighten-1" 
                            onClick={() => navigate('./Login')}
                            style={{ padding: '10px 20px', fontSize: '1.1rem', textAlign: 'center', width: '200px',height: '50px'  }}
                        >
                            Login
                        </a>
                        <a 
                            className="waves-effect waves-light btn purple lighten-1" 
                            onClick={() => navigate('./SignUp')}
                            style={{ padding: '10px 20px', fontSize: '1.1rem', textAlign: 'center', width: '200px', height: '50px' }}
                        >
                            Sign Up
                        </a>
                    </div>
                </div>
                
                {/* Image */}
                <div style={{ flex: 1 }}>
                    <img 
                        src={introImg} 
                        alt="Intro" 
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }} 
                    />
                </div>
            </div>

            {/* Section below the content */}
            <h2 style={{ fontSize: '3rem', textAlign: 'left', marginTop: '50px', fontWeight: 'bold', width: '100%' }}>What is LabStream?</h2>
            <p style={{ fontSize: '1.5rem', textAlign: 'left', width: '100%', marginTop: '20px' }}>
                LabStream is a platform designed to help students manage their coursework and laboratory experiments more efficiently. 
                It allows students to track their progress, collaborate on experiments, and access real-time data from their labs. 
                With LabStream, students can streamline their workflows, stay organized, and ensure they’re always up to date with their academic work.
            </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
                        <a 
                            className="waves-effect waves-light btn purple lighten-1" 
                            onClick={() => navigate('./Trial')}
                            style={{ padding: '10px 10px', fontSize: '1.1rem', textAlign: 'center', width: '200px',height: '50px', marginBottom: '30px'}}
                        >
                            Try Now !
                        </a>
                </div>
        </div>
    );
}

export default SplashScreen;
