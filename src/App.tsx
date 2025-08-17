import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import type { Cart, Product } from "./types";
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

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>({ items: [] });

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) {
        setCart({ items: [] });

        return;
      }
      try {
        const c = await api.getCart();
        if (active) setCart(c);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to fetch orders";
        toast.error(msg);
      }
    })();

    return () => { active = false };
  }, [user]);

  const addToCart = async (p: Product) => {
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
      const msg = e instanceof Error ? e.message : "Failed to fetch orders";
      toast.error(msg);
    }
  };

  const checkout = async () => {
    try {
      await api.checkout();
      toast.success("Order placed");
      setCart({ items: [] });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch orders";
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
          <AppShell
              user={user}
              onLogout={logout}
              cartCount={cartCount}
              onOpenCart={() => setCartOpen(true)}
      >
              {loading ? (
                  <div className="flex items-center justify-center py-20 text-slate-500">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading...
                  </div>
        ) : (
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/products" element={<ProductsPage onAddToCart={addToCart} />} />
                <Route path="/products/:id" element={<ProductDetailPage onAddToCart={addToCart} />} />
                <Route path="/orders" element={<OrdersPage />} />
            </Routes>
        )}
          </AppShell>
          <CartDrawer open={cartOpen} onOpenChange={setCartOpen} cart={cart} setCart={setCart} onCheckout={checkout}
      />
      </>
  );
}

export default function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
              <AppContent />
          </BrowserRouter>
      </AuthProvider>
  );
}
