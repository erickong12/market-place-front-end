import { useCallback, useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Loading } from "../components/ui/Loading";
import { api } from "../api/client";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../components/ui/Pagination";
import { statusVariant, type Order, type Status } from "../types";

export function OrderPage({ role }: { role: "SELLER" | "BUYER" }) {
    const [tab, setTab] = useState<"orders" | "history">("orders");
    const [orders, setOrders] = useState<Order[]>([]);
    const [query, setQuery] = useState({
        sortBy: "created_at",
        order: "desc" as "asc" | "desc",
        page: 1,
        size: 10,
    });
    const [totalRecord, setTotalRecord] = useState(0);
    const [loading, setLoading] = useState(false);
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        if (tab === "orders") {
            const res = await api.listOrders({
                page: query.page,
                size: query.size,
                sort: query.sortBy,
                order: query.order,
            });
            setOrders(res.result || []);
            setTotalRecord(res.total_record);
        } else {
            const res = await api.orderHistory();
            setOrders(res.result || []);
            setTotalRecord(res.total_record);
        }
        setTimeout(() => setLoading(false), 200);
    }, [tab, query]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="p-6 space-y-4">
            <div className="flex gap-2 border-b pb-2">
                <Button
                    variant={tab === "orders" ? "secondary" : "ghost"}
                    onClick={() => setTab("orders")}
                >
                    Orders
                </Button>
                <Button
                    variant={tab === "history" ? "secondary" : "ghost"}
                    onClick={() => setTab("history")}
                >
                    History
                </Button>
            </div>

            <Pagination
                page={query.page}
                size={query.size}
                total={totalRecord}
                sortBy={query.sortBy}
                order={query.order}
                showSearch={false}
                sortOptions={[{ label: "Date", value: "created_at" }]}
                onChange={(q) => setQuery((prev) => ({ ...prev, ...q }))}
            >
                <Loading loading={loading}>
                    <div className="grid grid-cols-1 gap-4">
                        {orders.map((o) => (
                            <Card key={o.id} className="cursor-pointer">
                                <Link
                                    to={`/orders/${o.id}`}
                                    state={{ order: o }}
                                    className="block"
                                >
                                    <CardHeader>
                                        <CardTitle>
                                            Order #{o.id} -{" "}
                                            <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {role === "SELLER" ? (
                                            <p>Buyer: {o.buyer_name}</p>
                                        ) : (
                                            <p>Seller: {o.seller_name}</p>
                                        )}
                                        <p>Total: ${o.total}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(o.created_at).toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Link>
                                {tab === "orders" && (
                                    <CardFooter className="flex gap-2">
                                        <OrderActions
                                            role={role}
                                            status={o.status}
                                            orderId={o.id}
                                            onActionDone={fetchOrders}
                                        />
                                    </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                </Loading>
            </Pagination>
        </div>
    );
}
export function OrderActions({
    role,
    status,
    orderId,
    onActionDone,
}: {
    role: "SELLER" | "BUYER";
    status: string;
    orderId: string;
    onActionDone: () => void;
}) {
    const navigate = useNavigate();
    const call = async (status: Status) => {
        switch (status) {
            case "CONFIRMED":
                await api.confirmOrder(orderId);
                break;
            case "READY_TO_PICKUP":
                await api.readyOrder(orderId);
                break;
            case "CANCELLED":
                await api.cancelOrder(orderId);
                break;
            case "DONE":
                await api.completeOrder(orderId);
                break;
        }
        navigate(`/orders`);
        onActionDone();
    };

    if (role === "SELLER") {
        if (status === "PENDING") {
            return (
                <>
                    <Button onClick={() => call("CONFIRMED")}>Confirm</Button>
                    <Button variant="danger" onClick={() => call("CANCELLED")}>
                        Cancel
                    </Button>
                </>
            );
        }
        if (status === "CONFIRMED") {
            return (
                <>
                    <Button onClick={() => call("READY_TO_PICKUP")}>Ready</Button>
                    <Button variant="danger" onClick={() => call("CANCELLED")}>
                        Cancel
                    </Button>
                </>
            );
        }
    }

    if (role === "BUYER") {
        if (status === "PENDING") {
            return (
                <Button variant="danger" onClick={() => call("CANCELLED")}>
                    Cancel
                </Button>
            );
        }
        if (status === "READY_TO_PICKUP") {
            return <Button onClick={() => call("DONE")}>Done</Button>;
        }
    }

    return null;
}
