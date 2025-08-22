import { type ReactNode, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    drawer?: boolean;
}

export function Dialog({ open, onClose, title, children, drawer = false }: DialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
        } else {
            document.removeEventListener("keydown", handleKeyDown);
        }

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, handleKeyDown]);

    // Motion variants
    const variants = drawer
        ? {
            hidden: { x: "100%", opacity: 0 },
            visible: { x: 0, opacity: 1 },
            exit: { x: "100%", opacity: 0 },
        }
        : {
            hidden: { opacity: 0, scale: 0.95, y: -10 },
            visible: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: -10 },
        };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Dialog container */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? "dialog-title" : undefined}
                        ref={dialogRef}
                        className={`fixed inset-0 z-50 flex ${drawer ? "justify-end" : "items-center justify-center"} p-4`}
                        variants={variants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                            {title && (
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h2 id="dialog-title" className="text-lg font-semibold">
                                        {title}
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            <div className="p-4">{children}</div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function DialogHeader({ children }: { children: ReactNode }) {
    return <div className="p-4 border-b">{children}</div>;
}

export function DialogContent({ children }: { children: ReactNode }) {
    return <div className="p-4">{children}</div>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
    return <div className="p-4 border-t">{children}</div>;
}
