import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/firebase.js'; // Update with your Firebase setup path

// Create UserContext
const UserContext = createContext();

// Custom Hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// UserProvider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State for logged-in user
    const [loading, setLoading] = useState(true); // State to check loading status

    // Listen for changes to the user's authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Set user (if logged in) or null (if logged out)
            setLoading(false); // Stop loading
        });

        return unsubscribe; // Cleanup on unmount
    }, []);

    // Provide `user` and `setUser` to the context
    const value = { user, setUser };

    return (
        <UserContext.Provider value={value}>
            {!loading && children} {/* Only render children once loading is complete */}
        </UserContext.Provider>
    );
};

export default UserProvider;
