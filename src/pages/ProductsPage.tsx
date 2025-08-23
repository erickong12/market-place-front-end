import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import { api, API_BASE } from "../api/client";
import type { ProductInventory, TopProduct } from "../types";
import Pagination from "../components/ui/Pagination";
import { Loading } from "../components/ui/Loading";
import { money } from "../components/lib/utils";
import { ShoppingCart } from "lucide-react";
import { Badge } from "../components/ui/Badge";

type ProductsPageProps = {
    onAddToCart: (p: ProductInventory) => void;
};

export function ProductsPage({ onAddToCart }: ProductsPageProps) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<ProductInventory[]>([]);
    const [totalRecord, setTotalRecord] = useState(0);
    const [landing, setLanding] = useState<TopProduct[]>([]);

    const [query, setQuery] = useState({
        search: "",
        sortBy: "products.name",
        order: "desc" as "asc" | "desc",
        page: 1,
        size: 12,
    });

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            const res = await api.listProductsInStore({
                search: query.search,
                sort: query.sortBy,
                page: query.page,
                size: query.size,
                order: query.order,
            });
            if (active) {
                setProducts(res.result || []);
                setTotalRecord(res.total_record);
            }
            if (active) setTimeout(() => setLoading(false), 200);
        })();

        return () => {
            active = false;
        };
    }, [query]);

    const fetchLanding = useCallback(async () => {
        const res = await api.landingProducts({ limit: 5 });
        setLanding(res || []);

    }, []);

    useEffect(() => {
        fetchLanding();
    }, [fetchLanding]);

    return (
        <div className="p-6 space-y-6">
            {landing.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-3">Top Products</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {landing.map((p) => (
                            <Card key={p.id} className="overflow-hidden hover:shadow-md transition rounded">
                                <div onClick={() => setQuery((prev) => ({ ...prev, search: p.name }))}>
                                    <img
                                        src={API_BASE + p.image}
                                        alt={p.name}
                                        className="h-32 w-full object-cover rounded-t-md"
                                    />
                                    <CardHeader className="p-2">
                                        <CardTitle className="line-clamp-1 text-sm">{p.name}</CardTitle>
                                    </CardHeader>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

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
                ]}
                onChange={(q) => setQuery((prev) => ({ ...prev, ...q }))}
            >
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Loading loading={loading}>
                        {products.map((p) => (
                            <Card key={p.id} className="overflow-hidden flex flex-col">
                                <Link to={`/products/${p.id}`} state={{ product: p }} className="block">
                                    <img
                                        src={API_BASE + p.product_image}
                                        alt={p.product_name}
                                        className="h-40 w-full object-cover"
                                    />
                                    <CardHeader className="pb-0">
                                        <CardTitle className="line-clamp-1 text-base">
                                            {p.product_name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold">
                                                <Badge variant="success">{money(p.price)}</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                                <CardFooter className="mt-auto">
                                    <div className="flex justify-between">
                                        <div className="flex items-end text-sm font-semibold text-slate-600">
                                            {p.seller_name}
                                        </div>
                                        <Button onClick={() => onAddToCart(p)}>
                                            <ShoppingCart className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </Loading>
                </div>
            </Pagination>
        </div>
    );
}
