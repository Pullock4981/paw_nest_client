import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth } from '../Firebase/firebase.init';

// google provider
const googleProvider = new GoogleAuthProvider()

const FirebaseAuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // register or create user by email amd pass

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // Google Sign-In
    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    // Login
    const logInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Logout
    const SignOutUser = () => {
        setLoading(true);
        setUser(null);
        return signOut(auth);
    }

     // Monitor Auth State
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log('User is signed in:', currentUser);
                setUser(currentUser);
            } else {
                console.log('No user is signed in.');
                setUser(null);
            }
            setLoading(false);
        });
        return () => unSubscribe();
    }, []);

    
    const authInfo = {
        user,
        loading,
        createUser,
        googleSignIn,
        logInUser,
        SignOutUser
    }

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default FirebaseAuthProvider;