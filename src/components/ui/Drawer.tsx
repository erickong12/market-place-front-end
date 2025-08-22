import React from "react";

import { useState } from "react";
import { Button } from "./Button";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

interface DrawerFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (form: FormData) => Promise<void> | void;
    title: string;
    children: React.ReactNode;
    submitLabel?: string;
    cancelLabel?: string;
}

export function Drawer({ open, onClose, children, title }: DrawerProps) {
    return (
        <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
            <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
            <div className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
                {title && (
                    <div className="border-b px-4 py-3 font-medium text-gray-800">
                        {title}
                    </div>
                )}
                <div className="overflow-y-auto h-full">{children}</div>
            </div>
        </div>
    );
}

export function DrawerForm({
    open,
    onClose,
    onSubmit,
    title,
    children,
    submitLabel = "Save",
    cancelLabel = "Cancel",
}: DrawerFormProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        try {
            setLoading(true);
            if (onSubmit) {
                await onSubmit(form);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer open={open} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                {children}
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : submitLabel}
                    </Button>
                </div>
            </form>
        </Drawer>
    );
}

