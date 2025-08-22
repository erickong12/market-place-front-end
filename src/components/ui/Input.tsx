import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	error?: boolean;
}

export function Input({ className = "", error = false, ...props }: InputProps) {
	return (
		<input
			{...props}
			className={`h-10 w-full rounded-xl border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100
       		 ${error ? "border-red-500" : "border-gray-300"}  ${className}`
			}
		/>
	);
}
