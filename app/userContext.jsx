import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

// Create a custom hook to use the context
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (userCredential) => {
            if (userCredential) {
                setUser(userCredential); // User is logged in                
            } else {
                setUser(null); // No user logged in
                console.log('noUser');
                
            }
            setLoading(false);
        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
    }, []);

    // Provide the user and loading state to the rest of the app
    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;