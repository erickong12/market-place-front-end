"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../lib/utils"

type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "link" | "danger"
type ButtonSize = "sm" | "md" | "lg" | "icon"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
    variant?: ButtonVariant
    size?: ButtonSize
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            asChild = false,
            className,
            variant = "default",
            size = "md",
            ...props
        },
        ref
    ) => {
        const Comp = asChild ? Slot : "button"

        const base =
            "inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed"

        const variants: Record<ButtonVariant, string> = {
            default: "bg-blue-600 text-white hover:bg-blue-700",
            outline: "border border-slate-300 bg-white hover:bg-slate-50",
            ghost: "hover:bg-slate-100",
            secondary: "bg-slate-800 text-white hover:bg-slate-900",
            link: "text-blue-600 underline underline-offset-4 bg-transparent",
            danger: "bg-red-600 text-white hover:bg-red-700",
        }

        const sizes: Record<ButtonSize, string> = {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-4",
            lg: "h-12 px-6 text-lg",
            icon: "h-9 w-9 p-0",
        }

        return (
            <Comp
                ref={ref}
                className={cn(base, variants[variant], sizes[size], className)}
                {...props}
            />
        )
    }
)

Button.displayName = "Button"

export { Button }
