import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { auth } from '../Firebase/firebase.init';

// Google provider
const googleProvider = new GoogleAuthProvider();

const FirebaseAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Create user with email/password
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Google sign-in
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // Login
    const logInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Logout
    const SignOutUser = () => {
        setLoading(true);
        setUser(null);
        setRole(null);
        return signOut(auth);
    };

    // 🔄 Save user to backend
    const saveUserToBackend = async (firebaseUser) => {
        try {
            const userInfo = {
                name: firebaseUser.displayName || "Anonymous",
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL || null,
                role: "user", // Default role
            };

            await fetch("http://localhost:5000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInfo),
            });
        } catch (error) {
            console.error("Error saving user to backend:", error);
        }
    };

    // 🔄 Fetch user role from backend
    const fetchUserRole = async (email) => {
        try {
            const res = await fetch(`http://localhost:5000/users/${email}`);
            const data = await res.json();
            setRole(data.role || 'user'); // Default to 'user'
        } catch (error) {
            console.error('Failed to fetch role:', error);
            setRole('user');
        }
    };

    // 🔁 Listen for Firebase auth changes
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                saveUserToBackend(currentUser);       // ✅ Save to backend
                fetchUserRole(currentUser.email);     // ✅ Get role
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unSubscribe();
    }, []);

    // Auth context value
    const authInfo = {
        user,
        role,
        loading,
        createUser,
        googleSignIn,
        logInUser,
        SignOutUser
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default FirebaseAuthProvider;
