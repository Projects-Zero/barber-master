import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => { 
    const [auth, setAuth] = useState({});

    //const [persist, setPersist] = useState(JSON.parse(AsyncStorage.getItem("persist" || false )));


    

    return <AuthContext.Provider value={{
        auth,
        setAuth,
        
        
        
    }}
    
    >
        {children}
    </AuthContext.Provider>
}

export default AuthContext;