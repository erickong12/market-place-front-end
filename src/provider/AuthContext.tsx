import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    error: Error | null;
    login: (body: unknown) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
