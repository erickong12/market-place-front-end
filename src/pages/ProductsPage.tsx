import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import { api, API_BASE } from "../api/client";
import type { ProductInventory } from "../types";
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
    const [query, setQuery] = useState({
        search: "",
        sortBy: "products.name",
        order: "desc" as "asc" | "desc",
        page: 1,
        size: 12,
    });
    const [totalRecord, setTotalRecord] = useState(0);

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
                const items: ProductInventory[] = res.result;
                setProducts(items);
                setTotalRecord(res.total_record);
            }
            if (active) setTimeout(() => setLoading(false), 200);
        })();

        return () => {
            active = false;
        };
    }, [query]);

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
                ]}
                onChange={(q) => setQuery((prev) => ({ ...prev, ...q }))}>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Loading loading={loading}>
                        {products.map((p) => (
                            <Card key={p.id} className="overflow-hidden flex flex-col">
                                <Link to={`/products/${p.id}`} state={{ product: p }} className="block">
                                    <img src={API_BASE + p.product_image} alt={p.product_name} className="h-40 w-full object-cover" />
                                    <CardHeader className="pb-0">
                                        <CardTitle className="line-clamp-1 text-base">{p.product_name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold"><Badge variant="success">{money(p.price)}</Badge></div>
                                        </div>
                                    </CardContent>
                                </Link>
                                <CardFooter className="mt-auto">
                                    <Button className="w-full" onClick={() => onAddToCart(p)}>
                                        <ShoppingCart></ShoppingCart> Add to cart
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

