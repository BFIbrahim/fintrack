import React from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({children}) => {

    const authinfo = {

    }
    return (
        <AuthContext.Provider value={authinfo} >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;