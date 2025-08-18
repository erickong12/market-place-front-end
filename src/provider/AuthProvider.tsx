import { useState, useEffect, type ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { UserProfile } from "../types";
import { api } from "../api/client";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const navigate = useNavigate();

    const logout = useCallback(() => {
        api.clearToken();
        setUser(null);
        navigate("/login");
    }, [navigate]);

    useEffect(() => {
        let active = true;
        api.setOnUnauthorized(() => {
            if (active) logout();
        });

        (async () => {
            try {
                const profile = await api.profile();
                if (active) setUser(profile);
            } catch (e: unknown) {
                if (e instanceof Error) setError(e);
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [logout]);

    const login = async (body: { username: string; password: string }) => {
        setLoading(true);
        try {
            const res = await api.login(body);
            if (res?.access_token) api.setToken(res.access_token);
            const profile = await api.profile();
            setUser(profile);
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
