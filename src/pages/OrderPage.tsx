import { useEffect, useState } from "react";
import type { Order } from "../types";
import { api } from "../api/client";
import { Skeleton } from "../components/ui/Skeleton";
import { money } from "../components/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            const res = await api.listOrders();
            if (active) {
                const items: Order[] = res.result;
                setOrders(items);
            }
            setTimeout(() => setLoading(false), 200);
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

                        const total = o.total

                        return (
                            <Card key={o.id}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base flex items-center justify-between">
                                        Order #{o.code || o.id}
                                        <Badge>{o.status}</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm text-slate-600 space-y-1">
                                    <div>{created}</div>
                                    <div>Total {money(total)}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="text-sm text-slate-600">No orders yet.</div>
            )
            }
        </div >
    );
}
