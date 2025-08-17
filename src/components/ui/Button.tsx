import React from "react";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "link";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    className?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
}

export function Button({
    asChild,
    className = "",
    variant = "default",
    size = "md",
    disabled,
    onClick,
    children,
    ...rest
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed";

    const variants: Record<ButtonVariant, string> = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-slate-300 bg-white hover:bg-slate-50",
        ghost: "hover:bg-slate-100",
        secondary: "bg-slate-800 text-white hover:bg-slate-900",
        link: "text-blue-600 underline underline-offset-4 bg-transparent",
    };

    const sizes: Record<ButtonSize, string> = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
        icon: "h-9 w-9 p-0",
    };

    const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<{ className?: string }>;

        return React.cloneElement(child, {
            className: [child.props.className, cls].filter(Boolean).join(" "),
        });
    }

    return (
        <button className={cls} disabled={disabled} onClick={onClick} {...rest}>
            {children}
        </button>
    );
}
