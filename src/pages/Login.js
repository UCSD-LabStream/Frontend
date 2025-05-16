import React, { useState } from 'react';
import { signInWithEmailAndPassword, signOut} from "firebase/auth";
import { auth } from '../Firebase/firebase';
import { useNavigate, Link } from 'react-router-dom'; 
// import 'materialize-css/dist/css/materialize.min.css';
import { TextField, Button, CircularProgress, Typography, Container, Box } from '@mui/material';
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
            const user = userCredential.user;
            if (!user.emailVerified) {
                setError("Please verify your email before logging in.");
                signOut(auth);
                return; // Don't proceed if the email is not verified
            }
            setUser(userCredential.user);
            navigate('/dashboard'); 
        } catch (error) {
            setError("Unsuccessful login. Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <>
        <Container style={{ position: 'relative', width: '40vw', marginTop: '50px', padding: '20px', borderRadius: "15px", backgroundColor: 'white' }}>
          <form onSubmit={handleLogin}>
            <Typography variant="h3" fontWeight="bold" align="center" marginTop="2rem" gutterBottom>
              Login
            </Typography>

            {error && (
              <Typography color="error" align="center" paragraph>
                {error}
              </Typography>
            )}

            <div style={{ marginBottom: '10px' }}>
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

            <div style={{ marginBottom: '10px' }}>
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

            <div className="flex justify-center mt-7">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
                sx={{
                  height: '3rem',
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Log in'}
              </Button>
            </div>
          </form>
          <Typography sx={{ margin: 'auto', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            Don't have an account? <Link to="/splashscreen/SignUp"><span className="inline-block mx-1 underline">Sign up</span></Link>instead.
          </Typography>
        </Container>
        </>
    );
};

export default Login;
