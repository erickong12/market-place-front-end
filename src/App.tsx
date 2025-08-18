import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import type { Cart, ProductInventory } from "./types";
import { api } from "./api/client";
import { AppShell } from "./components/AppShell";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { ProductsPage } from "./components/pages/ProductsPage";
import { LoginPage } from "./components/pages/LoginPage";
import { HomePage } from "./components/pages/HomePage";
import { OrdersPage } from "./components/pages/OrderPage";
import { CartDrawer } from "./components/Drawer";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./provider/AuthProvider";
import { AdminUserPage } from "./components/pages/AdminUserPage";
import { AdminProductPage } from "./components/pages/AdminProductPage";

function AppContent() {
	const { user, loading, logout: authLogout } = useAuth();
	const [cartOpen, setCartOpen] = useState(false);
	const [cart, setCart] = useState<Cart | null>({ items: [] });
	const logout = useCallback(() => {
		authLogout();
		setCart({ items: [] });
	}, [authLogout]);

	useEffect(() => {
		let active = true;
		(async () => {
			if (!user) {
				setCart({ items: [] });

				return;
			}
			if (user.role == "BUYER") {
				try {
					const c = await api.getCart();
					if (active) setCart(c);
				} catch (e: unknown) {
					const msg = e instanceof Error ? e.message : "Failed to fetch cart";
					toast.error(msg);
				}
			}
		})();

		return () => { active = false };
	}, [logout, user]);

	const addToCart = async (p: ProductInventory) => {
		if (!user) {
			toast("Please sign in to add items");

			return;
		}
		try {
			await api.addToCart({ productId: p.id, quantity: 1 });
			const c = await api.getCart();
			setCart(c);
			toast.success("Added to cart");
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : "Failed to add to cart";
			toast.error(msg);
		}
	};

	const checkout = async () => {
		try {
			await api.checkout();
			toast.success("Order placed");
			setCart({ items: [] });
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : "Checkout failed";
			toast.error(msg);
		}
	};

	const cartCount = useMemo(
		() => cart?.items?.reduce((a, b) => a + b.quantity, 0) || 0,
		[cart]
	);

	return (
		<>
			<Toaster richColors closeButton position="top-center" />
			<AppShell user={user} onLogout={logout} cartCount={cartCount} onOpenCart={() => setCartOpen(true)}>
				{loading ? (
					<div className="flex items-center justify-center py-20 text-slate-500">
						<Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
					</div>
				) : (
					<Routes>
						{/* Public routes */}
						<Route path="/" element={<HomePage />} />
						<Route path="/login" element={<LoginPage />} />

						{/* Authenticated routes */}
						{(user?.role === "BUYER" || user?.role === "SELLER") && <Route path="/orders" element={<OrdersPage />} />}
						{user?.role === "BUYER" && (
							<>
								<Route path="/products" element={<ProductsPage onAddToCart={addToCart} />} />
								<Route path="/products/:id" element={<ProductDetailPage onAddToCart={addToCart} />} />
							</>
						)}
						{/* Admin-only routes */}
						{user?.role === "ADMIN" && (
							<>
								<Route path="/admin/users" element={<AdminUserPage />} />
								<Route path="/admin/products" element={<AdminProductPage />} />
							</>
						)}
					</Routes>
				)}
			</AppShell>
			{user?.role === "BUYER" && (
				<CartDrawer
					open={cartOpen}
					onOpenChange={setCartOpen}
					cart={cart}
					setCart={setCart}
					onCheckout={checkout}
				/>
			)}
		</>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</BrowserRouter>
	);
}

