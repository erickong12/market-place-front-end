import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function HomePage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate("/login");
        } else {
            switch (user.role) {
                case "ADMIN":
                    navigate("/admin/users");
                    break;
                case "BUYER":
                    navigate("/products");
                    break;
                case "SELLER":
                    navigate("/inventory");
                    break;
                default:
                    navigate("/login");
            }
        }
    }, [user, loading, navigate]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center py-20 text-slate-500">
                Loading...
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
                <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold tracking-tight"
                >
                    Welcome back, {user.username}
                </motion.h1>
                <p className="mt-3 text-slate-600">
                    Redirecting you to your dashboard...
                </p>
            </div>
        </div>
    );
}
