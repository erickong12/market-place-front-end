import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loading } from "../components/ui/Loading";
import { Sheet, SheetTrigger, SheetContent } from "../components/ui/Sheet";
import { api, API_BASE } from "../api/client";
import { InventoryForm } from "./InventoryForm";
import type { InventoryItem, ProductDropDown } from "../types";
import Pagination from "../components/ui/Pagination";
import { money } from "../components/lib/utils";
import { toast } from "sonner";
import { Badge } from "../components/ui/Badge";

export function InventoryPage() {
    const [data, setData] = useState<InventoryItem[]>([]);
    const [query, setQuery] = useState({
        search: "",
        sortBy: "products.name",
        order: "asc" as "asc" | "desc",
        page: 1,
        size: 10,
    });
    const [totalRecord, setTotalRecord] = useState(0);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductDropDown[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const data = await api.listSellerInventory({
            page: query.page,
            size: query.size,
            sort: query.sortBy,
            order: query.order,
            search: query.search,
        });
        setTotalRecord(data.total_record);
        setData(data.result || []);
        setTimeout(() => setLoading(false), 200);
    }, [query]);

    const getProducts = useCallback(async () => {
        try {
            const data = await api.productDropDown();
            setProducts(data || []);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to load users";
            toast.error(msg);
        }
    }, []);

    useEffect(() => {
        fetchData();
        getProducts();
    }, [fetchData, getProducts]);

    return (
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Inventory</h1>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>Add Inventory</Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-4 space-y-4">
                        <h2 className="font-semibold text-lg">Add Inventory</h2>
                        <InventoryForm products={products}
                            onSubmit={async (body) => {
                                await api.addSellerInventory(body);
                                await fetchData();
                            }}
                        />
                    </SheetContent>
                </Sheet>
            </div>

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
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Loading loading={loading}>
                        {data.map((item) => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle>{item.product_name}</CardTitle>
                                    <Badge variant="success">{money(item.price) ?? "-"}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <img
                                        src={API_BASE + item.product_image}
                                        alt={item.product_name}
                                        className="h-32 w-full object-cover rounded-md mb-2"
                                    />
                                    <p className="text-sm text-gray-600">{item.product_description}</p>
                                    <p className="text-sm"><Badge>Qty: {item.quantity?.toLocaleString() ?? "-"}</Badge></p>
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button size="sm" variant="secondary">
                                                Edit
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="right" className="p-4 space-y-4">
                                            <h2 className="font-semibold text-lg">Edit Inventory</h2>
                                            <InventoryForm products={products}
                                                initialData={item}
                                                onSubmit={async (body) => {
                                                    await api.updateSellerInventory(item.id, body);
                                                    await fetchData();
                                                }}
                                            />
                                        </SheetContent>
                                    </Sheet>
                                    <Button
                                        size="sm"
                                        onClick={async () => {
                                            await api.deleteSellerInventory(item.id);
                                            await fetchData();
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </Loading>
                </div>
            </Pagination>
        </div>
    );
}

