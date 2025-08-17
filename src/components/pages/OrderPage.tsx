import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Order } from "../../types";
import { api } from "../../api/client";
import { Skeleton } from "../ui/Skeleton";
import { money } from "../../utils/format";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            try {
                const res = await api.listOrders();
                if (active) {
                    // normalize response
                    const items: Order[] = Array.isArray(res) ? res : res.items ?? [];
                    setOrders(items);
                }
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : "Failed to fetch orders";
                toast.error(msg);
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => { active = false };
    }, []);

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Orders</h2>
            {loading ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            ) : orders.length ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {orders.map((o) => {
                        const created = new Date(
                            o.createdAt || o.created_at || Date.now()
                        ).toLocaleString();

                        const total =
                            o.total ??
                            (o.items || []).reduce(
                                (a, b) => a + (b.price ?? 0) * (b.quantity ?? 0),
                                0
                            );

                        return (
                            <Card key={o.id}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center justify-between">
                                        Order #{o.code || o.id}
                                        <Badge>{o.status || "PAID"}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-slate-600 space-y-1">
                                    <div>{created}</div>
                                    <div>
                                        {(o.items || []).length} item(s) • Total {money(total)}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="text-sm text-slate-600">No orders yet.</div>
            )}
        </div>
    );
}
