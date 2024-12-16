import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import './styles.css';

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
            navigate('/'); 
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px' }}>
            <form onSubmit={handleSignup}>
                <h2 className="center-align">Sign Up</h2>
                {error && <p className="red-text center-align">{error}</p>}
                <div className="input-field">
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email">Email:</label>
                </div>
                <div className="input-field">
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                </div>
                <div className="input-field">
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                </div>
                <button type="submit" className="btn waves-effect waves-light" disabled={isLoading}>
                    {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default SignUp;
