import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../../api/client";
import type { User } from "../../types";
import { Pagination } from "../ui/Pagination";
import { Loading } from "../ui/Loading";
import { Badge } from "../ui/Badge";

export function AdminUserPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [searchText, setSearchText] = useState(search);
	const [sort, setSort] = useState("id");
	const [order, setOrder] = useState("asc");
	const [page, setPage] = useState(1);
	const [size] = useState(10);
	const [total_record, setTotalRecord] = useState(0);

	const loadUsers = useCallback(async () => {
		setLoading(true);
		try {
			const data = await api.listUsers({
				page,
				size,
				sort: sort,
				order,
				search,
			});
			setTotalRecord(data.total_record);
			setUsers(data.result || []);
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : "Failed to load users";
			toast.error(msg);
		} finally {
			setTimeout(() => setLoading(false), 200);
		}
	}, [search, sort, order, page, size]);

	const deleteUser = async (id: string) => {
		try {
			await api.deleteUser(id);
			toast.success("User deleted");
			setUsers((prev) => prev.filter((u) => u.id !== id));
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : "Failed to delete user";
			toast.error(msg);
		}
	};

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	return (
		<div className="p-6">
			{/* Filters */}
			<div className="flex items-center gap-3 mb-4">
				<Input
					placeholder="Search User..."
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") setSearch(searchText);
					}}
					className="pl-8"
				/>
				<Button variant="secondary" onClick={() => setSearch(searchText)}>
					Search
				</Button>
				<select
					value={sort}
					onChange={(e) => setSort(e.target.value)}
					className="h-10 rounded-xl border border-slate-300 bg-white px-3"
				>
					<option value="id">ID</option>
					<option value="name">Name</option>
					<option value="username">Username</option>
					<option value="phone">Phone</option>
					<option value="role">Role</option>
				</select>
				<select
					value={order}
					onChange={(e) => setOrder(e.target.value)}
					className="h-10 rounded-xl border border-slate-300 bg-white px-3"
				>
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</select>
			</div>

			{/* User Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<Loading loading={loading}>
					{users.map((u) => (
						<Card key={u.id} className="flex flex-col justify-between">
							<CardHeader>
								<CardTitle>{u.username} <Badge>{u.role}</Badge> </CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-500">{u.name}</p>
								<p className="text-sm text-gray-600 my-2">{u.phone}</p>
								<div className="flex gap-2 mt-4">
									<Button variant="secondary" size="sm" onClick={() => deleteUser(u.id)}>
										Delete
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</Loading>
			</div>

			{/* Pagination */}
			{Pagination(page, setPage, size, total_record)}
		</div >
	);
}
