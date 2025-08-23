import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { api, API_BASE } from "../api/client";
import type { InventoryItem, ProductDropDown } from "../types";
import { Loading } from "../components/ui/Loading";
import Pagination from "../components/ui/Pagination";
import { Dialog } from "../components/ui/Dialog";
import { InventoryForm } from "./InventoryForm";
import { money } from "../components/lib/utils";
import { Badge } from "../components/ui/Badge";

export function InventoryPage() {
    const [inventories, setInventories] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState({
        search: "",
        sortBy: "products.name",
        order: "asc" as "asc" | "desc",
        page: 1,
        size: 12,
    });
    const [totalRecord, setTotalRecord] = useState(0);

    const [products, setProducts] = useState<ProductDropDown[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<InventoryItem | null>(null);

    const loadInventories = useCallback(async () => {
        setLoading(true);
        const data = await api.listSellerInventory({
            page: query.page,
            size: query.size,
            sort: query.sortBy,
            order: query.order,
            search: query.search,
        });
        setInventories(data.result || []);
        setTotalRecord(data.total_record);
        setTimeout(() => setLoading(false), 200);
    }, [query]);

    const getProducts = useCallback(async () => {
        try {
            const data = await api.productDropDown();
            setProducts(data || []);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to load products";
            toast.error(msg);
        }
    }, []);

    const deleteInventory = async (id: string) => {
        await api.deleteSellerInventory(id);
        toast.success("Inventory deleted");
        setInventories((prev) => prev.filter((i) => i.id !== id));
    };

    const handleSubmit = async (form: FormData) => {
        const body = Object.fromEntries(form.entries());
        if (editing) {
            await api.updateSellerInventory(editing.id, body);
            toast.success("Inventory updated");
        } else {
            await api.addSellerInventory(body);
            toast.success("Inventory created");
        }
        setShowForm(false);
        setEditing(null);
        loadInventories();
    };

    useEffect(() => {
        loadInventories();
        getProducts();
    }, [loadInventories, getProducts]);

    return (
        <div className="p-6">
            <Pagination
                page={query.page}
                size={query.size}
                total={totalRecord}
                search={query.search}
                sortBy={query.sortBy}
                order={query.order}
                sortOptions={[
                    { label: "Name", value: "products.name" },
                    { label: "Price", value: "price" },
                    { label: "Qty", value: "quantity" },
                ]}
                onChange={(q) => setQuery((prev) => ({ ...prev, ...q }))}
                rightContent={
                    <Button
                        onClick={() => {
                            setEditing(null);
                            setShowForm(true);
                        }}
                    >
                        Add
                    </Button>
                }
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Loading loading={loading}>
                        {inventories.map((inv) => (
                            <Card key={inv.id} className="flex flex-col justify-between">
                                <img
                                    src={API_BASE + inv.product_image}
                                    alt={inv.product_name}
                                    className="h-40 w-full rounded-t-lg object-cover"
                                />
                                <CardHeader>
                                    <CardTitle>{inv.product_name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-2">{inv.product_description}</p>
                                    <p>
                                        <Badge variant="success">{money(inv.price) ?? "-"}</Badge>
                                    </p>
                                    <p>
                                        <Badge>Qty: {inv.quantity?.toLocaleString() ?? "-"}</Badge>
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                setEditing(inv);
                                                setShowForm(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => deleteInventory(inv.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </Loading>
                </div>
            </Pagination>

            <Dialog
                open={showForm}
                title={editing ? "Edit Inventory" : "Add Inventory"}
                onClose={() => {
                    setShowForm(false);
                    setEditing(null);
                }}
            >
                <InventoryForm
                    products={products}
                    initialData={editing || undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditing(null);
                    }}
                />
            </Dialog>
        </div>
    );
}
