import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom';
// import 'materialize-css/dist/css/materialize.min.css';
import { TextField, Button, CircularProgress, Typography, Container } from '@mui/material';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters long");
            return;
        }

        try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", userCredential);
            const user = userCredential.user;

            await sendEmailVerification(user);
            console.log("Verification email sent");
            await signOut(auth);
            setError("Please verify your email before logging in.");
            setTimeout(() => {
              navigate('/splashscreen/Login');
          }, 3000);
            
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container style={{ marginTop: '50px', padding: '20px', borderRadius: "15px", backgroundColor: 'white' }}>
        <form onSubmit={handleSignup}>
          <Typography variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
  
          {error && (
            <Typography color="error" align="center" paragraph>
              {error}
            </Typography>
          )}
  
          <div style={{ marginBottom: '16px' }}>
            <TextField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />
          </div>
  
          <div style={{ marginBottom: '16px' }}>
            <TextField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />
          </div>
  
          <div style={{ marginBottom: '16px' }}>
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              variant="outlined"
              margin="normal"
            />
          </div>
  
          <div style={{ marginTop: '20px' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading || password !== confirmPassword}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
          </div>
        </form>
      </Container>
    );
};

export default SignUp;
