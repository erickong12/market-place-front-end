import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../api/client";
import { money } from "../../utils/format";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import type { Product } from "../../types";

interface ProductDetailPageProps {
  onAddToCart: (p: Product) => void;
}

export function ProductDetailPage({ onAddToCart }: ProductDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        if (!id) return; // guard for invalid params
        const res = await api.getProduct(id);
        if (active) setP(res);
      } catch (e: unknown) {
        if (e instanceof Error) toast.error(e.message);
        else toast.error("Failed to load product");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading)
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <div className="space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-40" />
            </div>
        </div>
    );

  if (!p) return <div>Product not found.</div>;

  return (
      <div className="grid md:grid-cols-2 gap-6">
          <img
              src={p.image || `https://picsum.photos/seed/${p.id}/640/480`}
              className="w-full rounded-2xl object-cover"
      />
          <div>
              <h2 className="text-2xl font-bold">{p.name}</h2>
              <p className="mt-2 text-slate-600">
                  {p.description || "No description."}
              </p>
              <div className="mt-4 text-2xl font-semibold">{money(p.price)}</div>
              <div className="mt-6 flex gap-3">
                  <Button onClick={() => onAddToCart(p)}>Add to cart</Button>
                  <Button variant="outline" asChild>
                      <Link to="/products">Back</Link>
                  </Button>
              </div>
          </div>
      </div>
  );
}
