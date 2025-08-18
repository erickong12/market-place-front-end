import { type ReactNode } from "react";
import { Card, CardContent, CardFooter } from "./Card";
import { Skeleton } from "./Skeleton";

type LoadingProps = {
    loading: boolean;
    children: ReactNode;
    count?: number;
};

export function Loading({ loading, children, count = 12 }: LoadingProps) {
    if (!loading) return <>{children}</>;

    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i} className="overflow-hidden flex flex-col">
                    <Skeleton className="h-40 w-full" />
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-9 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}
