import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../../api/client";
import type { Product } from "../../types";
import { Pagination } from "../ui/Pagination";
import { Loading } from "../ui/Loading";

export function AdminProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState(search);
    const [sort, setSort] = useState("name");
    const [order, setOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [size] = useState(12);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.listProducts({ search, sort, order, page, size });
            setProducts(data.result || []);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to load products";
            toast.error(msg);
        } finally {
            setTimeout(() => setLoading(false), 200);
        }
    }, [search, sort, order, page, size]);

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
            {/* Filters */}
            <div className="flex items-center gap-3 mb-4">
                <Input
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") setSearch(searchText);
                    }}
                    className="pl-8"
                />
                <Button variant="secondary" onClick={() => setSearch(searchText)}>
                    Search
                </Button>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3"
                >
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                </select>
                <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="h-10 rounded-xl border border-slate-300 bg-white px-3"
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>

            {/* Product Grid */}
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

            {/* Pagination */}
            {Pagination(page, setPage, size, products.length)}
        </div>
    );
}
