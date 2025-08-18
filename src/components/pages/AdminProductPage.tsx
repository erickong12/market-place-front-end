import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { api } from "../../api/client";
import type { Product } from "../../types";
import { Loading } from "../ui/Loading";
import Pagination from "../ui/Pagination";

export function AdminProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState({
        search: "",
        sortBy: "name",
        order: "desc" as "asc" | "desc",
        page: 1,
        size: 12,
    });
    const [totalRecord, setTotalRecord] = useState(0);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.listProducts({
                page: query.page,
                size: query.size,
                sort: query.sortBy,
                order: query.order,
                search: query.search,
            });
            setProducts(data.result || []);
            setTotalRecord(data.total_record);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to load products";
            toast.error(msg);
        } finally {
            setTimeout(() => setLoading(false), 200);
        }
    }, [query]);

    const deleteProduct = async (id: string) => {
        try {
            await api.deleteProduct(id);
            toast.success("Product deleted");
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to delete product";
            toast.error(msg);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

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
                    { label: "Name", value: "name" },
                    { label: "Price", value: "price" },
                ]}
                onChange={(q) => setQuery((prev) => ({ ...prev, ...q }))}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Loading loading={loading}>
                        {products.map((p) => (
                            <Card key={p.id} className="flex flex-col justify-between">
                                <CardHeader>
                                    <CardTitle>{p.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                                    <p className="font-semibold">Rp {p.price.toLocaleString()}</p>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => toast.info(`Edit ${p.name} (TODO)`)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => deleteProduct(p.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </Loading>
                </div>
            </Pagination>
        </div>
    );
}
