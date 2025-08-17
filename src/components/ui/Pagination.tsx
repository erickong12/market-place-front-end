import { Button } from "./Button";

export function Pagination(page: number, setPage: React.Dispatch<React.SetStateAction<number>>, size: number, total_record: number) {
    return <div className="flex items-center justify-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}> Prev </Button>
        <span className="text-sm text-slate-600">Page {page}</span>
        <Button variant="outline" disabled={page * size >= total_record} onClick={() => setPage(page + 1)}>Next</Button>
    </div>;
}