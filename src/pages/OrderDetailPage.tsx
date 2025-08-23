import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Loading } from "../components/ui/Loading";
import { api, API_BASE } from "../api/client";
import { OrderActions } from "./OrderPage";
import { statusVariant, type Order, type OrderItem } from "../types";
import { money } from "../components/lib/utils";

interface OrderDetailPageProps {
    role: "SELLER" | "BUYER";
}

export function OrderDetailPage({ role }: OrderDetailPageProps) {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const [items, setItems] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(false);
    const order = (location.state as { order: Order } | null)?.order;

    const fetchOrder = useCallback(async () => {
        if (!order || order.id !== id) return;
        setLoading(true);
        const itemsRes = await api.getOrderItems(id);
        setItems(itemsRes);
        setLoading(false);
    }, [id, order]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    if (!order) {
        return <div className="p-6 text-gray-500">Order not found.</div>;
    }

    return (
        <div className="p-6 space-y-6 bg-white shadow rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                <h2 className="text-lg font-semibold">
                    Order #{order.id} - <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </h2>
            </div>

            <div className="grid gap-2 text-sm text-gray-700">
                {role === "SELLER" ? (
                    <p><span className="font-medium">Buyer:</span> {order.buyer_name}</p>
                ) : (
                    <p><span className="font-medium">Seller:</span> {order.seller_name}</p>
                )}
                <p><span className="font-medium">Created:</span> {new Date(order.created_at).toLocaleString()}</p>
                <p><span className="font-medium">Updated:</span> {new Date(order.updated_at).toLocaleString()}</p>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Items</h2>
                <Loading loading={loading}>
                    <div className="divide-y border rounded-lg bg-white shadow-sm">
                        {items.map((it) => (
                            <div
                                key={it.id}
                                className="flex items-center gap-4 p-4"
                            >
                                <img
                                    src={API_BASE + it.product_image}
                                    alt={it.product_name}
                                    className="h-16 w-16 rounded object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{it.product_name}</p>
                                    <p className="text-sm text-gray-500">{it.product_description}</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p>Qty: {it.quantity}</p>
                                    <Badge variant="success" className="font-medium">{money(it.price_at_purchase)}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Loading>
                <div className="flex justify-end mt-4">
                    <span className="font-medium">Total <Badge variant="success" size="sm">{money(order.total)}</Badge></span>
                </div>
            </div>

            <div className="flex justify-end">
                <OrderActions
                    role={role}
                    status={order.status}
                    orderId={order.id}
                    onActionDone={fetchOrder}
                />
            </div>
        </div>
    );
}
