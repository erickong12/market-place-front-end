import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/Card";
import { toast } from "sonner";
import { api } from "../../api/client";
import { money } from "../../utils/format";
import type { ProductInventory } from "../../types";
import Pagination from "../ui/Pagination";
import { Loading } from "../ui/Loading";

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
            try {
                const res = await api.listProductsInStore({
                    search: query.search,
                    sort: query.sortBy,
                    page: query.page,
                    size: query.size,
                    order: query.order,
                });
                if (active) {
                    const items: ProductInventory[] = res.items || res.data || [];
                    setProducts(items);
                    setTotalRecord(res.total_record);
                }
            } catch (e: unknown) {
                if (e instanceof Error) toast.error(e.message);
                else toast.error("Failed to load products");
            } finally {
                if (active) setTimeout(() => setLoading(false), 200);
            }
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
                                    <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                                    <CardHeader className="pb-0">
                                        <CardTitle className="line-clamp-1 text-base">{p.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="font-semibold">{money(p.price)}</div>
                                        </div>
                                    </CardContent>
                                </Link>
                                <CardFooter className="mt-auto">
                                    <Button className="w-full" onClick={() => onAddToCart(p)}>
                                        Add to cart
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

