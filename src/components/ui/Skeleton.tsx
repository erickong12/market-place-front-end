interface SkeletonProps {
    className?: string;
    variant?: "rect" | "circle" | "text";
    animate?: boolean;
}

export function Skeleton({
    className = "",
    variant = "rect",
    animate = true
}: SkeletonProps) {
    const baseStyles = "bg-slate-200";
    const shapeStyles = {
        rect: "rounded-xl",
        circle: "rounded-full",
        text: "rounded-md h-4 w-3/4"
    }[variant];

    const animation = animate ? "animate-pulse" : "";

    return (
        <div
            aria-hidden="true"
            className={`${baseStyles} ${shapeStyles} ${animation} ${className}`}
        />
    );
}
