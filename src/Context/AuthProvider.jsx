import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useCurrentUser } from '../hooks/useCurrentUser';

const AuthProvider = ({ children }) => {
    // ১. সার্ভার থেকে কারেন্ট ইউজার ডাটা ফেচ করা
    const { data: initialUser, isLoading, refetch } = useCurrentUser();

    // ২. স্টেট ইনিশিয়ালাইজেশন (লোকাল স্টোরেজ থেকে)
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("userInfo");
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            return null;
            
        }
    });

    // ৩. ইউজারের জন্য একটি ম্যানুয়াল লোডিং স্টেট (যাতে লোকাল ডাটা থাকা অবস্থায় লোডিং না দেখায়)
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            if (initialUser) {
                setUser(initialUser);
                localStorage.setItem("userInfo", JSON.stringify(initialUser));
            }
            setAuthLoading(false);
        }
    }, [initialUser, isLoading]);

    const loginUser = (userData, token) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userInfo", JSON.stringify(userData));
        setUser(userData);
        refetch?.();
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("authToken");
        return Promise.resolve();
    };

    const authInfo = {
        user,
        // এখানে isLoading এবং authLoading দুইটাই কনসিডার করা হয়েছে
        loading: isLoading || authLoading, 
        refetchUser: refetch,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;