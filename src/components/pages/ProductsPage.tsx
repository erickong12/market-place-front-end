import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import { toast } from "sonner";
import { api } from "../../api/client";
import { money } from "../../utils/format";
import type { PageInfo, Product } from "../../types";

type ProductsPageProps = {
    onAddToCart: (p: Product) => void;

};

export function ProductsPage({ onAddToCart }: ProductsPageProps) {

    const [params, setParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo>({ page: 1, size: 12, offset: 0, total_record: 0 });
    const [searchText, setSearchText] = useState(params.get("search") || "");

    const search = params.get("search") || "";
    const sort = params.get("sort_by") || "name";
    const size = Number(params.get("size") || 12);
    const order = params.get("order") || "asc";
    const page = Number(params.get("page") || 1);

    const updateParam = (key: string, val: string | number | null | undefined) => {
        const next = new URLSearchParams(params);
        if (val === undefined || val === null || val === "") {
            next.delete(key);
        } else {
            next.set(key, String(val));
        }
        if (key !== "page") next.set("page", "1");
        setParams(next, { replace: true });
    };

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            try {
                const res = await api.listProducts({ search, sort, page, size, order });
                if (active) {
                    const items: Product[] = res.items || res.data || [];
                    setProducts(items);
                    setPageInfo({
                        page: res.page ?? page,
                        size: res.size ?? pageInfo.size,
                        offset: res.offset ?? pageInfo.offset,
                        total_record: res.total ?? 0,
                    });
                }
            } catch (e: unknown) {
                if (e instanceof Error) toast.error(e.message);
                else toast.error("Failed to load products");
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, [search, sort, page, size, order, pageInfo.size, pageInfo.offset]);

    return (
        <div className="space-y-4">
            {/* Search + Filters */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <div className="flex-1 flex items-center gap-2">
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search products..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") updateParam("search", searchText);
                            }}
                            className="pl-8"
                        />
                    </div>
                    <Button variant="secondary" onClick={() => updateParam("search", searchText)}>
                        Search
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="h-10 rounded-xl border border-slate-300 bg-white px-3"
                        value={sort}
                        onChange={(e) => updateParam("sort_by", e.target.value)}>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                    </select>
                    <select
                        className="h-10 rounded-xl border border-slate-300 bg-white px-3"
                        value={order}
                        onChange={(e) => updateParam("order", e.target.value)}>
                        <option value="asc" >Asc</option>
                        <option value="desc">Desc</option>
                    </select>

                </div>
            </div>

            {/* Products grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-40 w-full" />
                        <CardContent className="space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/3" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-9 w-full" />
                        </CardFooter>
                    </Card>
                )) : products.map((p) => (
                    <Card key={p.id} className="overflow-hidden flex flex-col">
                        <Link to={`/products/${p.id}`} className="block">
                            <img
                                src={p.image}
                                alt={p.name}
                                className="h-40 w-full object-cover"
                            />
                        </Link>
                        <CardHeader className="pb-0">
                            <CardTitle className="line-clamp-1 text-base">{p.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="font-semibold">{money(p.price)}</div>
                                {p.category && (
                                <Badge>{typeof p.category === "string" ? p.category : p.category.name}</Badge>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="mt-auto">
                            <Button className="w-full" onClick={() => onAddToCart(p)}>
                                Add to cart
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
                <Button variant="outline" disabled={page <= 1} onClick={() => updateParam("page", page - 1)}> Prev </Button>
                <span className="text-sm text-slate-600">Page {page}</span>
                <Button variant="outline" disabled={page * pageInfo.size >= pageInfo.total_record} onClick={() => updateParam("page", page + 1)}>Next</Button>
            </div>
        </div>
    );
}

