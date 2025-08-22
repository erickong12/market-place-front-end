import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";

export function HomePage() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate("/");
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-slate-500">
                <div className="h-10 w-10 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        // 👉 Landing page ala marketplace
        return (
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-blue-400 to-indigo-600 text-white py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            Welcome to <span className="text-yellow-300">MiniMart</span>
                        </motion.h1>
                        <p className="text-lg md:text-xl text-slate-100 mb-8">
                            Find the best products from trusted sellers, all in one place.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/login">
                                <Button>Login</Button>
                            </Link>
                        </div>
                    </div>
                </section>
                <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                        <p className="text-slate-600">Choose from thousands of products across categories.</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Trusted Sellers</h3>
                        <p className="text-slate-600">Verified sellers ensure safe and secure shopping.</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">Easy Checkout</h3>
                        <p className="text-slate-600">Fast and reliable payment with multiple options.</p>
                    </div>
                </section>
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
