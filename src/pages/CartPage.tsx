import { Minus, Plus, Trash2, X } from "lucide-react";
import type { CartItem } from "../types";
import type { Dispatch, SetStateAction } from "react";
import { api, API_BASE } from "../api/client";
import { Drawer } from "../components/ui/Drawer";
import { money } from "../components/lib/utils";
import { Button } from "../components/ui/Button";

type CartDrawerProps = {
    open: boolean;
    cart: CartItem[] | null;
    onCheckout: () => void;
    onOpenChange: (open: boolean) => void;
    setCart: Dispatch<SetStateAction<CartItem[] | null>>;
};

export function CartPage({ open, onOpenChange, cart, setCart, onCheckout }: CartDrawerProps) {
    const subtotal =
        cart?.reduce((a, b) => a + b.price * b.quantity, 0) || 0;

    const refresh = async () => {
        const c = await api.getCart();
        setCart(c);
    };

    const inc = async (ci: CartItem) => {
        const optimistic: CartItem[] = [
            ...cart!.map((c) => ({ ...c, quantity: c.id == ci.id ? ci.quantity + 1 : c.quantity })),
        ];
        setCart(optimistic);
        try {
            await api.updateCartItem(ci.id, ci.quantity + 1);
        } catch {
            await refresh();
        }
    };

    const dec = async (ci: CartItem) => {
        const optimistic: CartItem[] = [
            ...cart!.map((c) => ({ ...c, quantity: c.id == ci.id ? ci.quantity - 1 : c.quantity })),
        ];
        setCart(optimistic);
        try {
            await api.updateCartItem(ci.id, ci.quantity - 1);
        } catch {
            await refresh();
        }
    };

    const remove = async (ci: CartItem) => {
        const optimistic: CartItem[] = cart!.filter((c) => c.id !== ci.id);
        setCart(optimistic);
        try {
            await api.removeCartItem(ci.id);
        } catch {
            await refresh();
        }
    };

    const clear = async () => {
        try {
            setCart(null);
            await api.clearCart();
        } catch {
            await refresh();
        }
    };

    return (
        <Drawer open={open} onClose={() => onOpenChange(false)}>
            <div className="flex h-full flex-col">
                <div className="flex border-b p-4 text-lg font-semibold">
                    <div className="flex-1">Your Cart</div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}><X /></Button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart?.length ?
                        (<div className="space-y-4">
                            {cart.map((ci) => (
                                <div key={ci.id} className="flex items-center gap-3">
                                    <img src={API_BASE + ci.image} alt={ci.product_name} className="h-16 w-16 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <div className="font-medium">{ci.product_name}</div>
                                        <div className="text-sm text-slate-500">
                                            {money(ci.price)}
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Button size="icon" variant="outline" onClick={() => dec(ci)}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <div className="w-8 text-center">{ci.quantity}</div>
                                            <Button size="icon" variant="outline" onClick={() => inc(ci)}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => remove(ci)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center">
                                <Button size="sm" variant="danger" onClick={() => clear()}>
                                    <Trash2 className="mr-2 h-4 w-4" />Clear Cart
                                </Button>
                            </div>
                        </div>) : (<div className="text-sm text-slate-500">Your cart is empty.</div>)}
                </div>
                <div className="border-t p-4">
                    <div className="flex items-center justify-between font-semibold mb-3">
                        <span>Subtotal</span>
                        <span>{money(subtotal)}</span>
                    </div>
                    <Button variant="secondary" className="w-full" disabled={!cart?.length} onClick={onCheckout}>
                        Checkout
                    </Button>
                </div>
            </div>
        </Drawer >
    );
}