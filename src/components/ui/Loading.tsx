import { type ReactNode } from "react";
import { Card, CardContent, CardFooter } from "./Card";
import { Skeleton } from "./Skeleton";

type LoadingProps = {
    loading: boolean;
    children: ReactNode;
    count?: number;
    variant?: "card" | "list" | "custom";
};

export function Loading({
    loading,
    children,
    count = 12,
    variant = "card"
}: LoadingProps) {
    if (!loading) return <>{children}</>;

    const renderSkeleton = (i: number) => {
        switch (variant) {
            case "list":
                return (
                    <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                    </div>
                );
            case "card":
            default:
                return (
                    <div key={i} className="flex flex-col">
                        <Card className="overflow-hidden flex flex-col">
                            <Skeleton className="h-40 w-full" />
                            <CardContent className="space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/3" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-9 w-full" />
                            </CardFooter>
                        </Card>
                    </div>
                );
        }
    };

    return Array.from({ length: count }).map((_, i) => renderSkeleton(i));
}
