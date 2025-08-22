import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { api, API_BASE } from "../api/client";
import type { Product } from "../types";
import { Loading } from "../components/ui/Loading";
import Pagination from "../components/ui/Pagination";
import { Dialog } from "../components/ui/Dialog";
import { ProductForm } from "./AdminProductForm";

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

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        const data = await api.listProducts({
            page: query.page,
            size: query.size,
            sort: query.sortBy,
            order: query.order,
            search: query.search,
        });
        setProducts(data.result || []);
        setTotalRecord(data.total_record);
        setTimeout(() => setLoading(false), 200);
    }, [query]);

    const deleteProduct = async (id: string) => {
        await api.deleteProduct(id);
        toast.success("Product deleted");
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    const handleSubmit = async (form: FormData) => {
        if (editing) {
            await api.updateProduct(editing.id, form);
            toast.success("Product updated");
        } else {
            await api.createProduct(form);
            toast.success("Product created");
        }
        setShowForm(false);
        setEditing(null);
        loadProducts();
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
                onChange={(q) => setQuery((prev) => ({ ...prev, ...q }))}
                rightContent={
                    <Button onClick={() => { setEditing(null); setShowForm(true); }}>
                        Add
                    </Button>}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Loading loading={loading}>
                        {products.map((p) => (
                            <Card key={p.id} className="flex flex-col justify-between">
                                <img src={API_BASE + p.image} alt={p.name} className="h-50 w-full rounded-t-lg object-cover" />
                                <CardHeader>
                                    <CardTitle>{p.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => { setEditing(p); setShowForm(true); }}
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
                                </CardFooter>
                            </Card>
                        ))}
                    </Loading>
                </div>
            </Pagination>

            <Dialog open={showForm} title={editing ? "Edit Product" : "Add Product"}
                onClose={() => {
                    setShowForm(false);
                    setEditing(null);
                }}>
                <ProductForm initial={editing || undefined} onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditing(null);
                    }} />
            </Dialog>
        </div>
    );
}
