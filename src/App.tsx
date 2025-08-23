import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import type { CartItem, ProductInventory } from "./types";
import { api } from "./api/client";
import { AppShell } from "./AppShell";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./context/AuthProvider";
import { AdminUserPage } from "./pages/AdminUserPage";
import { AdminProductPage } from "./pages/AdminProductPage";
import { CartPage } from "./pages/CartPage";
import { InventoryPage } from "./pages/InventoryPage";
import { OrderPage } from "./pages/OrderPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { ProductsPage } from "./pages/ProductsPage";

function AppContent() {
	const { user, loading, logout: authLogout } = useAuth();
	const [cartOpen, setCartOpen] = useState(false);
	const [cart, setCart] = useState<CartItem[] | null>(null);
	const logout = useCallback(() => {
		authLogout();
		setCart(null);
	}, [authLogout]);

	useEffect(() => {
		let active = true;
		(async () => {
			if (!api.token())
				authLogout();

			if (!user) {
				setCart(null);

				return;
			}
			if (user.role == "BUYER" && cart == null) {
				const c = await api.getCart();
				if (active) setCart(c);
			}
		})();

		return () => { active = false };
	}, [authLogout, cart, cartOpen, user]);

	const addToCart = async (p: ProductInventory) => {
		if (!user) {
			toast("Please sign in to add items");

			return;
		}
		await api.addToCart({ seller_inventory_id: p.id, quantity: 1 });
		const c = await api.getCart();
		setCart(c);
		toast.success("Added to cart");
	};

	const checkout = async () => {
		try {
			await api.checkout();
			toast.success("Order placed");
			setCart(null);
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : "Checkout failed";
			toast.error(msg);
		}
	};

	const cartCount = useMemo(
		() => cart?.reduce((a, b) => a + b.quantity, 0) || 0,
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
						{(user?.role === "BUYER" || user?.role === "SELLER") && (
							<>
								<Route path="/orders" element={<OrderPage role={user.role} />} />
								<Route path="/orders/:id" element={<OrderDetailPage role={user.role} />} />
							</>
						)}
						{user?.role === "BUYER" && (
							<>
								<Route path="/products" element={<ProductsPage onAddToCart={addToCart} />} />
								<Route path="/products/:id" element={<ProductDetailPage onAddToCart={addToCart} />} />
							</>
						)}
						{user?.role === "SELLER" && <Route path="/inventory" element={<InventoryPage />} />}
						{/* Admin-only routes */}
						{user?.role === "ADMIN" && (
							<>
								<Route path="/admin/users" element={<AdminUserPage />} />
								<Route path="/admin/products" element={<AdminProductPage />} />
							</>
						)}
						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				)}
			</AppShell>
			{user?.role === "BUYER" && (
				<CartPage
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

