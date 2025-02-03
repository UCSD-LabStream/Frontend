import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase/firebase';
import { useNavigate } from 'react-router-dom'; 
import 'materialize-css/dist/css/materialize.min.css';
import './styles.css';
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
        <div className="container" style={{ marginTop: '50px' }}>
            <form onSubmit={handleLogin}>
                <h2 className="center-align">Login</h2>
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
                <button type="submit" className="btn waves-effect waves-light" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
