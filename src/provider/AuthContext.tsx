import { createContext } from "react";
import type { UserProfile } from "../types";

export interface AuthContextType {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
    loading: boolean;
    error: Error | null;
    login: (body: unknown) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
