import { useState } from "react";
import { Input } from "../components/ui/Input";
import type { InventoryItem, ProductDropDown } from "../types";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";

export function InventoryForm({
    initialData,
    products,
    onSubmit,
}: {
    products: ProductDropDown[];
    initialData?: Partial<InventoryItem>;
    onSubmit: (body: { product_id: string; price: number; quantity: number }) => Promise<void>;
}) {
    const [productId, setProductId] = useState(initialData?.product_id || "");
    const [price, setPrice] = useState(initialData?.price || 0);
    const [quantity, setQuantity] = useState(initialData?.quantity || 0);

    return (
        <form
            className="space-y-4"
            onSubmit={async (e) => {
                e.preventDefault();
                await onSubmit({ product_id: productId, price, quantity });
            }}
        >
            <Select
                label="Product"
                disabled={initialData !== undefined}
                placeholder="Product"
                value={productId}
                onChange={(e) => setProductId(e.target.value)} options={products.map((p) => ({ value: p.id, label: p.name }))} />
            <label className="text-sm font-medium">
                Price
            </label>
            <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
            />
            <label className="text-sm font-medium">
                Quantity
            </label>
            <Input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <Button type="submit">Save</Button>
        </form>
    );
}