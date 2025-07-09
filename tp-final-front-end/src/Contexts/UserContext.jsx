import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('loggedUser'));
        if (savedUser) setUser(savedUser);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('loggedUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('loggedUser');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}
