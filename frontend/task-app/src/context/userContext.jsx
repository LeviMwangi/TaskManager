import { createContext, useEffect, useState } from "react";
import axiosInstance from '../Utils/axiosInstance'
import { API_PATHS } from "../Utils/apiPath";

export const userContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) return;

        const accessToken = localStorage.getItem('token');
        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error('user not authenticated', error);
                clearUser();
            } finally {
                setLoading(false);
            };

            const clearUser = () => {
                setUser(null);
                localStorage.removeItem('token')
            }
        };

        fetchUser();
    }, []);

    const updatedUser = (userData) => {
        setUser(userData);
        localStorage.setItem('token', userData.token);
        setLoading(false);
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <userContext.Provider value={{ user, loading, updatedUser, clearUser }}>
            {children}
        </userContext.Provider>
    );
}

export default UserProvider;