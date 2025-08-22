"use client"

import * as React from "react"
import { cn } from "../lib/utils"

type BadgeVariant = "default" | "success" | "warning" | "destructive" | "outline"
type BadgeSize = "sm" | "md"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant
	size?: BadgeSize
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	(
		{ className, variant = "default", size = "md", children, ...props },
		ref
	) => {
		const base =
			"inline-flex items-center rounded font-medium transition-colors"

		const variants: Record<BadgeVariant, string> = {
			default: "bg-slate-100 text-slate-700",
			success: "bg-green-100 text-green-700",
			warning: "bg-yellow-100 text-yellow-800",
			destructive: "bg-red-100 text-red-700",
			outline: "border border-slate-300 text-slate-700 bg-transparent",
		}

		const sizes: Record<BadgeSize, string> = {
			sm: "px-2 py-0.5 text-xs",
			md: "px-2.5 py-0.5 text-sm",
		}

		return (
			<span
				ref={ref}
				className={cn(base, variants[variant], sizes[size], className)}
				{...props}
			>
				{children}
			</span>
		)
	}
)

Badge.displayName = "Badge"

export { Badge }
