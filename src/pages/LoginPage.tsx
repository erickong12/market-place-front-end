import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api/client";

export function LoginPage() {
    const nav = useNavigate();
    const { login } = useAuth();

    const [mode, setMode] = useState<"login" | "register">("login");
    const [role, setRole] = useState<"SELLER" | "BUYER" | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const body = Object.fromEntries(form.entries());

        setLoading(true);
        if (mode === "login") {
            await login({ username: body.username as string, password: body.password as string });
            toast.success("Welcome back");
            nav("/");
        } else {
            if (!role) {
                toast.error("Please choose a role");

                return;
            }
            await api.register({ ...body, role });
            toast.success("Account created, please login");
            setMode("login");
            setRole(null);
        }
        setTimeout(() => setLoading(false), 200);
    };

    return (
        <div className="mx-auto max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {mode === "login" ? "Sign In" : "Create Account"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {mode === "register" && !role ? (
                        <div className="space-y-4">
                            <Button onClick={() => setRole("BUYER")} className="w-full">
                                Register as Buyer
                            </Button>
                            <Button onClick={() => setRole("SELLER")} className="w-full">
                                Register as Seller
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-4">
                            {mode === "register" && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Name
                                        </label>
                                        <Input name="name" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Address
                                        </label>
                                        <Input name="address" required />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Phone
                                        </label>
                                        <Input name="phone" required />
                                    </div>
                                </>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Username
                                </label>
                                <Input name="username" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Password
                                </label>
                                <Input name="password" type="password" required />
                            </div>
                            <Button disabled={loading} className="w-full" type="submit">
                                {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
                            </Button>
                        </form>
                    )}

                    <Button variant="link" className="mt-2"
                        onClick={() => {
                            setMode(mode === "login" ? "register" : "login");
                            setRole(null);
                        }}>
                        {mode === "login" ? "Create an account" : "Already have an account? Sign in"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
