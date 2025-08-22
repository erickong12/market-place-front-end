import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import type { Product } from "../types";

export function ProductForm({ initial, onSubmit, onCancel }: {
    initial?: Partial<Product>;
    onSubmit: (form: FormData) => Promise<void>;
    onCancel: () => void;
}) {
    const [name, setName] = useState(initial?.name || "");
    const [description, setDescription] = useState(initial?.description || "");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || (!initial?.id && !image)) {
            return alert("Name, Price, and Image are required");
        }

        const form = new FormData();
        form.append("name", name);
        if (description) form.append("description", description);
        if (image) form.append("image", image);

        setLoading(true);
        await onSubmit(form);
        setTimeout(() => setLoading(false), 200);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={(e) => setImage(e.target.files?.[0] || null)} required={!initial?.id} />
                </label>
            </div>
            <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : initial?.id ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}
