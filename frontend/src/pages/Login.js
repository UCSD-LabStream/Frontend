import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom'; 
// import 'materialize-css/dist/css/materialize.min.css';
import { TextField, Button, CircularProgress, Typography, Container } from '@mui/material';
import { useUser } from '../components/UserContext';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser(); 

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in:", userCredential.user.email);
            setUser(userCredential.user);
            navigate('/'); 
        } catch (error) {
            setError("Unsuccessful login. Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <Container sx={{ marginTop: '50px', padding: '20px', borderRadius: "15px", backgroundColor: 'white' }}>
      <form onSubmit={handleLogin}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
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

        <div style={{ marginTop: '20px' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </div>
      </form>
    </Container>
    );
};

export default Login;
