import { createContext, useContext, useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface User {
    id: number;
    username: string;
    email: string;
    token: string;
    tokenExpiration: number;  // In milliseconds
    image: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Function to store the user session in localStorage
    const storeSession = (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("tokenExpiration", String(user.tokenExpiration));
    };

    // Function to clear the user session from localStorage
    const clearSession = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("tokenExpiration");
    };

    // Function to refresh the user session by calling the API
    const refreshSession = async () => {
        if (user) {
            const res = await fetch("https://dummyjson.com/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: user.token }),
            });

            if (res.ok) {
                const newUser = await res.json();
                setUser(newUser);
                storeSession(newUser);
            } else {
                throw new Error("Failed to refresh session");
            }
        }
    };

    // Automatically check if the session has expired on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedExpiration = localStorage.getItem("tokenExpiration");

        if (storedUser && storedExpiration) {
            const userData: User = JSON.parse(storedUser);
            const expirationTime = parseInt(storedExpiration);
            const currentTime = Date.now();

            if (currentTime > expirationTime) {
                // Session expired
                clearSession();
                navigate("/")
                alert("Session expired");
            } else {
                // Set the user from storage
                setUser(userData);
            }
        }
    }, []);

    // Perform login using the mutation
    const loginMutation = useMutation({
        mutationFn: async (data: { username: string; password: string }) => {
            const res = await fetch("https://dummyjson.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Invalid username or password");
            }

            const user = await res.json();

            // Set session expiration (4 hours from now)
            const expirationTime = Date.now() + 4 * 60 * 60 * 1000; // 4 hours

            const userWithExpiration = {
                ...user,
                tokenExpiration: expirationTime,
            };

            setUser(userWithExpiration);
            storeSession(userWithExpiration);
            navigate("/home");
        },
        onError: (error) => {
            console.error(error);
        },
    });

    // Handle login
    const login = async (username: string, password: string) => {
        await loginMutation.mutateAsync({ username, password });
    };

    // Handle logout
    const logout = () => {
        setUser(null);
        clearSession();
        navigate("/auth/login");
    };

    // Check if the session is about to expire and refresh it
    useEffect(() => {
        const interval = setInterval(() => {
            if (user) {
                const currentTime = Date.now();
                const remainingTime = user.tokenExpiration - currentTime;

                if (remainingTime <= 0) {
                    clearInterval(interval);
                    logout(); // Log out the user if the session expired
                } else if (remainingTime <= 5 * 60 * 1000) {
                    refreshSession(); // Refresh the session if it is about to expire
                }
            }
        }, 60 * 1000); // Check every minute

        return () => clearInterval(interval);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
