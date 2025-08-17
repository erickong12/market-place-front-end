import { ChevronDown, LogIn, LogOut, ShoppingCart, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { Dropdown } from "./ui/Dropdown";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import type { ReactNode } from "react";
import type { UserProfile } from "../types";

interface AppShellProps {
    children: ReactNode;
    user?: UserProfile | null;
    onLogout: () => void;
    cartCount: number;
    onOpenCart: () => void;
}

export function AppShell({
    children,
    user,
    onLogout,
    cartCount,
    onOpenCart,
}: AppShellProps) {
    const role = user?.role;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
            <header className="sticky top-0 z-40 backdrop-blur border-b bg-white/70">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <Store className="h-6 w-6" />
                        <span>MiniMart</span>
                    </Link>
                    <div className="flex-1" />
                    <nav className="hidden md:flex items-center gap-6">
                        {/* Buyer menu */}
                        {role === "BUYER" && (
                            <>
                                <Link to="/products" className="hover:underline">Products</Link>
                                <Link to="/orders" className="hover:underline">Orders</Link>
                            </>
                        )}
                        {/* Seller menu */}
                        {role === "SELLER" && (
                            <>
                                <Link to="/inventory" className="hover:underline">Inventory</Link>
                                <Link to="/orders" className="hover:underline">Orders</Link>
                            </>
                        )}
                        {/* Admin menu */}
                        {role === "ADMIN" && (
                            <>
                                <Link to="/admin/users" className="hover:underline">Users</Link>
                                <Link to="/admin/products" className="hover:underline">Products</Link>
                            </>
                        )}
                    </nav>
                    <div className="flex items-center gap-2">
                        {user ? (
                            <Dropdown
                                trigger={
                                    <Button variant="ghost" className="gap-2">
                                        {user.username}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                }
                            >
                                <button
                                    className="w-full px-3 py-2 text-left rounded-lg hover:bg-slate-100 flex items-center gap-2"
                                    onClick={onLogout}
                                >
                                    <LogOut className="h-4 w-4" /> Logout
                                </button>
                            </Dropdown>
                        ) : (
                            <Button asChild variant="ghost" className="gap-2">
                                <Link to="/login">
                                    <LogIn className="h-4 w-4" />Login
                                </Link>
                            </Button>
                        )}
                        {role === "BUYER" && (
                            <Button variant="outline" className="gap-2" onClick={onOpenCart}>
                                <ShoppingCart className="h-4 w-4" />
                                <Badge className="ml-1">{cartCount}</Badge>
                            </Button>
                        )}
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </div>
    );
}
