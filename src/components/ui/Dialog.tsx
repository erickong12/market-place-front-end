import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
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
                    {/* Dialog */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    >
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-center p-4 border-b">
                                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                            {/* Content */}
                            <div className="p-4">{children}</div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}