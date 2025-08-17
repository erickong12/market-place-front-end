import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";

export function HomePage() {
    return (
        <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
                <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold tracking-tight">
                    Your one-stop marketplace
                </motion.h1>
                <p className="mt-3 text-slate-600">Discover products from multiple sellers, add to cart, and checkout in seconds.</p>
                <div className="mt-6 flex gap-3">
                    <Button asChild><Link to="/products">Browse Products</Link></Button>
                    <Button asChild variant="outline"><Link to="/login">Sign In</Link></Button>
                </div>
            </div>
            <div className="hidden md:block">
                <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src="https://picsum.photos/seed/market/640/420" className="rounded-2xl shadow" />
            </div>
        </div>
    );
}