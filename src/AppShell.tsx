import {
    ChevronDown,
    LogIn,
    LogOut,
    Menu,
    ShoppingCart,
    Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownItem } from "./components/ui/Dropdown";
import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/Badge";
import { Dialog } from "./components/ui/Dialog";
import type { ReactNode } from "react";
import type { UserProfile } from "./types";
import { useState } from "react";

type UserRole = NonNullable<UserProfile["role"]>;
interface MenuItem {
    label: string;
    to: string;
}
interface AppShellProps {
    children: ReactNode;
    user?: UserProfile | null;
    onLogout: () => void;
    cartCount: number;
    onOpenCart: () => void;
}

const MENU_CONFIG: Partial<Record<UserRole, MenuItem[]>> = {
    BUYER: [
        { label: "Products", to: "/products" },
        { label: "Orders", to: "/orders" },
    ],
    SELLER: [
        { label: "Inventory", to: "/inventory" },
        { label: "Orders", to: "/orders" },
    ],
    ADMIN: [
        { label: "Users", to: "/admin/users" },
        { label: "Products", to: "/admin/products" },
    ],
};

function NavLinks({ links, mobile = false, setMobileOpen = () => { } }: { links: MenuItem[]; mobile?: boolean, setMobileOpen?: (open: boolean) => void }) {
    return (
        <>
            {links.map((l) => (
                <Link
                    key={l.to}
                    to={l.to}
                    className={
                        mobile
                            ? "block text-lg font-medium hover:underline py-2"
                            : "hover:underline"
                    }
                    onClick={mobile ? () => setMobileOpen(false) : undefined}
                >
                    {l.label}
                </Link>
            ))}
        </>
    );
}

function UserMenu({
    user,
    onLogout,
}: {
    user?: UserProfile | null;
    onLogout: () => void;
}) {
    if (!user) {
        return (
            <Button asChild variant="ghost" className="gap-2">
                <Link to="/login">
                    <LogIn className="h-4 w-4" /> Login
                </Link>
            </Button>
        );
    }

    return (
        <Dropdown
            trigger={
                <Button variant="ghost" className="gap-2">
                    {user.username}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            }
        >
            <DropdownItem onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" /> Logout
            </DropdownItem>
        </Dropdown>
    );
}

export function AppShell({
    children,
    user,
    onLogout,
    cartCount,
    onOpenCart,
}: AppShellProps) {
    const role = user?.role;
    const links = role ? MENU_CONFIG[role] ?? [] : [];
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
            <header className="sticky top-0 z-40 backdrop-blur shadow-sm bg-white/70">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <Store className="h-6 w-6" />
                        <span>MiniMart</span>
                    </Link>
                    <div className="flex-1" />

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <NavLinks links={links} />
                    </nav>

                    <div className="flex items-center gap-2">
                        <UserMenu user={user} onLogout={onLogout} />

                        {role === "BUYER" && (
                            <Button variant="outline" className="gap-2" onClick={onOpenCart}>
                                <ShoppingCart className="h-4 w-4" />
                                <Badge className="ml-1">{cartCount}</Badge>
                            </Button>
                        )}

                        {/* Mobile menu button */}
                        {links.length > 0 && (
                            <Button
                                variant="ghost"
                                className="md:hidden p-2"
                                onClick={() => setMobileOpen(true)}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Menu as Dialog */}
            <Dialog drawer={true}
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                title="Menu"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 items-start">
                        <NavLinks setMobileOpen={setMobileOpen} links={links} mobile />
                    </div>
                </div>
            </Dialog>

            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </div>
    );
}
