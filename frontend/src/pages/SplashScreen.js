import React from 'react';
import { useNavigate } from 'react-router-dom';

function SplashScreen() {
    const navigate = useNavigate();

    return (
        <div className="container center-align" style={{ color:"white", height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="header">Welcome to LabStream!</h1>
            <div className="row">
                <div className="col s12" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <a 
                        className="waves-effect waves-light btn purple lighten-1" 
                        onClick={() => navigate('./Login')}
                    >
                        Login
                    </a>
                    <a 
                        className="waves-effect waves-light btn purple lighten-1" 
                        onClick={() => navigate('./SignUp')}
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
}

export default SplashScreen;
