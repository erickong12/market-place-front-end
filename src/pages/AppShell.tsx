import {
    ChevronDown,
    LogIn,
    LogOut,
    Menu,
    ShoppingCart,
    Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownItem } from "../components/ui/Dropdown";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/Sheet";
import type { ReactNode } from "react";
import type { UserProfile } from "../types";

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

function NavLinks({ links, mobile = false }: { links: MenuItem[]; mobile?: boolean }) {
    return (
        <>
            {links.map((l) => (
                <Link
                    key={l.to}
                    to={l.to}
                    className={
                        mobile
                            ? "text-lg font-medium hover:underline"
                            : "hover:underline"
                    }
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
            <header className="sticky top-0 z-40 backdrop-blur shadow-sm bg-white/70">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <Store className="h-6 w-6" />
                        <span>MiniMart</span>
                    </Link>
                    <div className="flex-1" />

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

                        {links.length > 0 && (
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" className="md:hidden p-2">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="flex flex-col gap-4 p-6">
                                    <NavLinks links={links} mobile />
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </div>
    );
}
