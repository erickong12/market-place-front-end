import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import type { InventoryItem, ProductDropDown } from "../types";

export function InventoryForm({
    initialData,
    products,
    onSubmit,
    onCancel,
}: {
    products: ProductDropDown[];
    initialData?: Partial<InventoryItem>;
    onSubmit: (form: FormData) => Promise<void>;
    onCancel: () => void;
}) {
    const [productId, setProductId] = useState(initialData?.product_id || "");
    const [price, setPrice] = useState(initialData?.price ?? 0);
    const [quantity, setQuantity] = useState(initialData?.quantity ?? 0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) {
            return alert("Product is required");
        }

        const form = new FormData();
        form.append("product_id", productId);
        form.append("price", price.toString());
        form.append("quantity", quantity.toString());

        setLoading(true);
        await onSubmit(form);
        setTimeout(() => setLoading(false), 200);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Select
                label="Product"
                disabled={!!initialData}
                placeholder="Select product"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                options={products.map((p) => ({ value: p.id, label: p.name }))}
            />
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
            />
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
            />
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : initialData?.id ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}
