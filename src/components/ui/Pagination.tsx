import { useState, type ReactNode, type FormEvent } from "react";
import { Button } from "./Button";
import { Select } from "./Select";
import { Input } from "./Input";
import { ArrowUp, ArrowDown } from "lucide-react";

type PaginationProps<TSort extends string = string> = {
    page: number;
    size: number;
    total: number;
    search?: string; // now optional
    sortBy: TSort;
    order: "asc" | "desc";
    sortOptions: { label: string; value: TSort }[];
    onChange: (q: {
        page?: number;
        size?: number;
        search?: string;
        sortBy?: TSort;
        order?: "asc" | "desc";
    }) => void;
    children: ReactNode;
    rightContent?: ReactNode;
    showSearch?: boolean;
};

export default function Pagination<TSort extends string = string>({
    page,
    size,
    total,
    search = "",
    sortBy,
    order,
    sortOptions,
    onChange,
    children,
    rightContent,
    showSearch = true,
}: PaginationProps<TSort>) {
    const totalPages = Math.max(1, Math.ceil(total / size));
    const [searchText, setSearchText] = useState(search);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        onChange({ search: searchText, page: 1 });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                {showSearch && (
                    <form onSubmit={handleSearch} className="flex gap-2 w-full">
                        <Input
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Button type="submit" variant="secondary">
                            Search
                        </Button>
                    </form>
                )}

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select
                        value={sortBy}
                        options={sortOptions}
                        onChange={(e) => onChange({ sortBy: e.target.value as TSort })}
                    />
                    <Button
                        variant="outline"
                        onClick={() =>
                            onChange({ order: order === "asc" ? "desc" : "asc" })
                        }
                    >
                        {order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    </Button>
                </div>

                {rightContent && <div>{rightContent}</div>}
            </div>

            <div>{children}</div>

            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => onChange({ page: page - 1 })}
                    >
                        Prev
                    </Button>
                    <Button
                        variant="outline"
                        disabled={page >= totalPages}
                        onClick={() => onChange({ page: page + 1 })}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
