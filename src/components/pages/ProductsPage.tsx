import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/Card";
import { toast } from "sonner";
import { api } from "../../api/client";
import { money } from "../../utils/format";
import type { ProductInventory } from "../../types";
import { Pagination } from "../ui/Pagination";
import { Loading } from "../ui/Loading";

type ProductsPageProps = {
    onAddToCart: (p: ProductInventory) => void;

};

export function ProductsPage({ onAddToCart }: ProductsPageProps) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<ProductInventory[]>([]);
    const [search, setSearch] = useState("");
    const [searchText, setSearchText] = useState(search);
    const [sort, setSort] = useState("products.name");
    const [order, setOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [size] = useState(12);
    const [totalRecord, setTotalRecord] = useState(0);

    useEffect(() => {
        let active = true;
        (async () => {
            setLoading(true);
            try {
                const res = await api.listProductsInStore({ search, sort, page, size, order });
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
    }, [search, sort, page, size, order]);

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
                                if (e.key === "Enter") setSearch(searchText);
                            }}
                            className="pl-8"
                        />
                    </div>
                    <Button variant="secondary" onClick={() => setSearch(searchText)}>
                        Search
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="h-10 rounded-xl border border-slate-300 bg-white px-3"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}>
                        <option value="products.name">Name</option>
                        <option value="price">Price</option>
                    </select>
                    <select
                        className="h-10 rounded-xl border border-slate-300 bg-white px-3"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}>
                        <option value="asc" >Asc</option>
                        <option value="desc">Desc</option>
                    </select>

                </div>
            </div>

            {/* Products grid */}
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

            {/* Pagination */}
            {Pagination(page, setPage, size, totalRecord)}
        </div>
    );
}

