import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { api } from "../api/client";
import type { User } from "../types";
import Pagination from "../components/ui/Pagination";
import { Loading } from "../components/ui/Loading";
import { Badge } from "../components/ui/Badge";
import { DrawerForm } from "../components/ui/Drawer";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export function AdminUserPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [query, setQuery] = useState({
		search: "",
		sortBy: "name",
		order: "asc" as "asc" | "desc",
		page: 1,
		size: 10,
	});
	const [totalRecord, setTotalRecord] = useState(0);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const loadUsers = useCallback(async () => {
		setLoading(true);
		const data = await api.listUsers({
			page: query.page,
			size: query.size,
			sort: query.sortBy,
			order: query.order,
			search: query.search,
		});
		setTotalRecord(data.total_record);
		setUsers(data.result || []);
		setTimeout(() => setLoading(false), 200);
	}, [query]);

	const deleteUser = async (id: string) => {
		await api.deleteUser(id);
		toast.success("User deleted");
		setUsers((prev) => prev.filter((u) => u.id !== id));
	};

	const addUser = async (form: FormData) => {
		const body = Object.fromEntries(form.entries());
		await api.createUser(body);
		toast.success("User added");
		setIsDrawerOpen(false);
		loadUsers();
	};

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	return (
		<div className="p-6">
			<Pagination
				page={query.page}
				size={query.size}
				total={totalRecord}
				search={query.search}
				sortBy={query.sortBy}
				order={query.order}
				sortOptions={[
					{ label: "ID", value: "id" },
					{ label: "Name", value: "name" },
					{ label: "Username", value: "username" },
					{ label: "Phone", value: "phone" },
					{ label: "Role", value: "role" },
				]}
				onChange={(q) => setQuery((prev) => ({ ...prev, ...q }))}
				rightContent={<Button onClick={() => setIsDrawerOpen(true)}>Add</Button>}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					<Loading loading={loading}>
						{users.map((u) => (
							<Card key={u.id} className="flex flex-col justify-between">
								<CardHeader>
									<CardTitle>
										{u.username} <Badge>{u.role}</Badge>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-gray-500">{u.name}</p>
									<p className="text-sm text-gray-600 my-2">{u.phone}</p>
									<div className="flex gap-2 mt-4">
										<Button
											variant="secondary"
											size="sm"
											onClick={() => deleteUser(u.id)}
										>
											Delete
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</Loading>
				</div>
			</Pagination>

			<DrawerForm open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onSubmit={addUser} title="Add New User">
				<Input name="name" placeholder="Name" required />
				<Input name="username" placeholder="Username" required />
				<Input name="address" placeholder="Address" required />
				<Input name="phone" placeholder="Phone" required />
				<Input name="password" type="password" placeholder="Password" required />
				<Select
					name="role"
					required
					options={[
						{ value: "ADMIN", label: "Admin" },
						{ value: "SELLER", label: "Seller" },
						{ value: "BUYER", label: "Buyer" },
					]}
				/>
			</DrawerForm>
		</div>
	);
}
