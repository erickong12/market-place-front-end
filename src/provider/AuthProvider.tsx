import { useState, useEffect, type ReactNode } from "react";
import type { UserProfile } from "../types";
import { api } from "../api/client";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let active = true;
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
    }, []);

    const login = async (body: unknown) => {
        setLoading(true);
        try {
            const res = await api.login(body as { username: string; password: string });
            if (res?.access_token) api.setToken(res.access_token);
            const profile = await api.profile();
            setUser(profile);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        api.clearToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
