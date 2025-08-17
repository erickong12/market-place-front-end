interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />;
}