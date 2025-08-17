import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

export function LoginPage() {
    const nav = useNavigate();
    const { login } = useAuth();
    const [mode, setMode] = useState("login");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const body = Object.fromEntries(form.entries());
        setLoading(true);
        try {
            await login(body);
            toast.success(mode === "login" ? "Welcome back" : "Account created");
            nav("/");
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to fetch orders";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md">
            <Card>
                <CardHeader>
                    <CardTitle>{mode === "login" ? "Sign In" : "Create Account"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <Input name="username" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <Input name="password" type="password" required />
                        </div>
                        <Button disabled={loading} className="w-full">
                            {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
                        </Button>
                    </form>
                    <Button
                        variant="link"
                        className="mt-2"
                        onClick={() => setMode(mode === "login" ? "register" : "login")}
                    >
                        {mode === "login" ? "Create an account" : "Already have an account? Sign in"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
