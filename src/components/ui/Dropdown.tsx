import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DropdownProps {
	trigger: ReactNode;
	children: ReactNode;
}
interface DropdownItemProps {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
}

export function Dropdown({ trigger, children }: DropdownProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClick);

		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", handleKey);

		return () => document.removeEventListener("keydown", handleKey);
	}, []);

	const toggle = () => setOpen((prev) => !prev);

	return (
		<div className="relative" ref={ref}>
			<div
				onClick={toggle}
				role="button"
				aria-haspopup="menu"
				aria-expanded={open}
				className="cursor-pointer"
			>
				{trigger}
			</div>

			<AnimatePresence>
				{open && (
					<motion.div
						key="dropdown"
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -5 }}
						transition={{ duration: 0.15 }}
						role="menu"
						className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-100 bg-white shadow-lg p-1 z-50"
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export function DropdownItem({
	children,
	onClick,
	className = "",
	disabled = false
}: DropdownItemProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className={`
        w-full text-left px-3 py-2 rounded-lg text-sm
        transition-colors
        ${disabled
					? "text-slate-400 cursor-not-allowed"
					: "text-slate-700 hover:bg-slate-100 active:bg-slate-200"}
        ${className}
      `}
		>
			{children}
		</button>
	);
}