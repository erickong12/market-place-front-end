import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export function Card({ className = "", children }: CardProps) {
    return (
        <div
            className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className = "", children }: CardProps) {
    return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: CardProps) {
    return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ className = "", children }: CardProps) {
    return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }: CardProps) {
    return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
}