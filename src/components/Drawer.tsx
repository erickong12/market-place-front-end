import React, { type Dispatch, type SetStateAction } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "../api/client";
import { money } from "../utils/format";
import { Button } from "./ui/Button";
import type { Cart, CartItem } from "../types";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function Drawer({ open, onClose, children }: DrawerProps) {
    return (
        <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
            <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
            <div className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
                {children}
            </div>
        </div>
    );
}

type CartDrawerProps = {
    open: boolean;
    cart: Cart | null;
    onCheckout: () => void;
    onOpenChange: (open: boolean) => void;
    setCart: Dispatch<SetStateAction<Cart | null>>;
};

export function CartDrawer({ open, onOpenChange, cart, setCart, onCheckout }: CartDrawerProps) {
    const subtotal =
        cart?.items?.reduce((a, b) => a + b.price * b.quantity, 0) || 0;

    const refresh = async () => {
        try {
            const c = await api.getCart();
            setCart(c);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to fetch orders";
            toast.error(msg);
        }
    };

    const inc = async (ci: CartItem) => {
        const optimistic: Cart = {
            ...cart!,
            items: cart!.items.map((x) =>
                x.id === ci.id ? { ...x, quantity: x.quantity + 1 } : x),
        };
        setCart(optimistic);
        try {
            await api.updateCartItem(ci.id, { quantity: ci.quantity + 1 });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to fetch orders";
            toast.error(msg);
            await refresh();
        }
    };

    const dec = async (ci: CartItem) => {
        if (ci.quantity <= 1) return;
        const optimistic: Cart = {
            ...cart!,
            items: cart!.items.map((x) =>
                x.id === ci.id ? { ...x, quantity: x.quantity - 1 } : x),
        };
        setCart(optimistic);
        try {
            await api.updateCartItem(ci.id, { quantity: ci.quantity - 1 });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to fetch orders";
            toast.error(msg);
            await refresh();
        }
    };

    const remove = async (ci: CartItem) => {
        const optimistic: Cart = {
            ...cart!,
            items: cart!.items.filter((x) => x.id !== ci.id),
        };
        setCart(optimistic);
        try {
            await api.removeCartItem(ci.id);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to fetch orders";
            toast.error(msg);
            await refresh();
        }
    };

    return (
        <Drawer open={open} onClose={() => onOpenChange(false)}>
            <div className="flex h-full flex-col">
                <div className="border-b p-4 text-lg font-semibold">Your Cart</div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart?.items?.length ? (cart.items.map((ci) => (
                        <div key={ci.id} className="flex items-center gap-3">
                            <img
                                src={
                                    ci.image ||
                                    `https://picsum.photos/seed/${ci.productId}/64/64`
                                }
                                alt={ci.name}
                                className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <div className="font-medium">{ci.name}</div>
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
                    ))) : (<div className="text-sm text-slate-500">Your cart is empty.</div>)}
                </div>
                <div className="border-t p-4">
                    <div className="flex items-center justify-between font-semibold mb-3">
                        <span>Subtotal</span>
                        <span>{money(subtotal)}</span>
                    </div>
                    <Button className="w-full" disabled={!cart?.items?.length} onClick={onCheckout}>
                        Checkout
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}
