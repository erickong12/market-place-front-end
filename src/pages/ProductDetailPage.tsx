import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import type { ProductInventory } from "../types";
import { money } from "../components/lib/utils";
import { API_BASE } from "../api/client";

interface ProductDetailPageProps {
	onAddToCart: (p: ProductInventory) => void;
}

export function ProductDetailPage({ onAddToCart }: ProductDetailPageProps) {
	const { id } = useParams<{ id: string }>();
	const location = useLocation();
	const p = (location.state as { product: ProductInventory } | null)?.product;

	if (!p || p.id !== id) {
		return <div>Product not found.</div>;
	}

	return (
		<div className="grid md:grid-cols-2 gap-6">
			<img src={API_BASE + p.product_image} className="w-full rounded-2xl object-cover" />
			<div>
				<h2 className="text-2xl font-bold">{p.product_name}</h2>
				<p className="mt-2 text-slate-600">
					{p.product_description || "No description."}
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
