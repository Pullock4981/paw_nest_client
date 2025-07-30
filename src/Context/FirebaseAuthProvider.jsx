import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { auth } from '../Firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


const FirebaseAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const githubSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, githubProvider);
    };

    const logInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const SignOutUser = () => {
        setLoading(true);
        // setUser(null);
        setRole(null);
        return signOut(auth);
    };

    // ✅ Save user only if not already in DB
    const saveUserToBackend = async (firebaseUser) => {
        try {
            const email = firebaseUser.email;

            // Check if user exists
            const res = await fetch(`https://pet-adoption-server-wheat.vercel.app/users/${email}`);
            if (res.status === 200) {
                return; // User exists, don't overwrite role
            }

            // Save new user
            const userInfo = {
                name: firebaseUser.displayName || "Anonymous",
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL || null,
                role: "user",
            };

            await fetch("https://pet-adoption-server-wheat.vercel.app/users", {
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

    const fetchUserRole = async (email) => {
        try {
            const res = await fetch(`https://pet-adoption-server-wheat.vercel.app/users/${email}`);
            const data = await res.json();
            setRole(data.role || 'user');
        } catch (error) {
            console.error('Failed to fetch role:', error);
            setRole('user');
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                saveUserToBackend(currentUser);
                fetchUserRole(currentUser.email);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        role,
        loading,
        createUser,
        googleSignIn,
        githubSignIn,
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
