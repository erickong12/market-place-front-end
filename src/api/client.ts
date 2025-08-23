import { toast } from "sonner";

export const API_BASE = import.meta.env.VITE_API_BASE;

function buildQuery(params: Record<string, number | string | boolean | undefined> = {}) {
    const q = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string | number | boolean)}`)
        .join("&");

    return q ? `?${q}` : "";
}

export const api = {
    token: () => localStorage.getItem("token") || "",
    setToken: (t: string) => localStorage.setItem("token", t || ""),
    clearToken: () => localStorage.removeItem("token"),

    async request(path: string, opts: RequestInit = {}) {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(opts.headers as Record<string, string> || {}),
        };

        // If body is FormData let the browser set Content-Type (boundary)
        if (opts.body instanceof FormData) {
            delete headers["Content-Type"];
        }

        const token = api.token();
        if (token) headers["Authorization"] = `Bearer ${token}`;

        let res: Response;
        try {
            res = await fetch(`${API_BASE}${path}`, {
                ...opts,
                headers,
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw new Error(`Network error: ${err.message}`);
            }
            throw new Error("Unknown network error");
        }

        if (res.status === 401) {
            api.clearToken();
            window.location.href = "/login";
        }

        if (!res.ok) {
            let msg: string;
            try {
                const j = await res.json();
                msg = j.detail && typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail) || "Unknown error";
            } catch {
                msg = res.statusText || "Unknown error";
            }
            toast.error(msg);
            throw new Error(msg);
        }
        const ct = res.headers.get("content-type") || "";

        return ct.includes("application/json") ? res.json() : res.text();
    },

    // Auth
    login: ({ username, password }: { username: string; password: string }) =>
        api.request("/login", {
            method: "POST",
            headers: {
                Authorization: "Basic " + btoa(`${username}:${password}`),
            },
        }),
    register: (body: object) => api.request("/register", { method: "POST", body: JSON.stringify(body) }),
    profile: () => api.request("/secured/profile", { method: "GET" }),
    updateProfile: (body: object) => api.request("/secured/profile", { method: "PATCH", body: JSON.stringify(body) }),
    changePassword: (body: { old_password: string; new_password: string }) =>
        api.request("/secured/change-password", { method: "PATCH", body: JSON.stringify(body) }),

    // Admin - Users
    listUsers: ({ sort, page, size, order, search = "" }: { sort?: string; page?: number; size?: number; order?: string; search?: string } = {}) =>
        api.request(`/secured/admin/${buildQuery({ search, sort_by: sort, page, size, order })}`),
    createUser: (body: object) => api.request("/secured/admin/", { method: "POST", body: JSON.stringify(body) }),
    deleteUser: (id: string) => api.request(`/secured/admin/${id}`, { method: "DELETE" }),

    // Admin - Products
    listProducts: ({ sort, page, size, order, search = "" }: { sort?: string; page?: number; size?: number; order?: string; search?: string } = {}) =>
        api.request(`/secured/admin/products${buildQuery({ search, sort_by: sort, page, size, order })}`),
    createProduct: (form: FormData | Record<string, unknown>) => {
        const body = form instanceof FormData ? form : (() => {
            const f = new FormData();
            Object.entries(form).forEach(([k, v]) => { if (v !== null) f.append(k, v as string | Blob); });

            return f;
        })();

        return api.request("/secured/admin/products", { method: "POST", body });
    },
    updateProduct: (id: string, form: FormData | Record<string, unknown>) => {
        const body = form instanceof FormData ? form : (() => {
            const f = new FormData();
            Object.entries(form).forEach(([k, v]) => { if (v !== null) f.append(k, v as string | Blob); });

            return f;
        })();

        return api.request(`/secured/admin/products/${id}`, { method: "PUT", body });
    },
    deleteProduct: (id: string) => api.request(`/secured/admin/products/${id}`, { method: "DELETE" }),

    // Product store
    listProductsInStore: ({ sort, page, size, order, search = "" }: { sort?: string; page?: number; size?: number; order?: string; search?: string } = {}) =>
        api.request(`/secured/products${buildQuery({ search, sort_by: sort, page, size, order })}`),
    landingProducts: ({ limit = 5 }: { limit?: number; } = {}) =>
        api.request(`/secured/products/landing${buildQuery({ limit })}`),

    // Seller Inventory
    listSellerInventory: ({ sort, page, size, order, search = "" }: { sort?: string; page?: number; size?: number; order?: string; search?: string } = {}) =>
        api.request(`/secured/seller-inventory/${buildQuery({ search, sort_by: sort, page, size, order })}`),
    productDropDown: () => api.request(`/secured/seller-inventory/products`),
    addSellerInventory: (body: object) => api.request(`/secured/seller-inventory/`, { method: "POST", body: JSON.stringify(body) }),
    updateSellerInventory: (inventoryId: string, body: object) =>
        api.request(`/secured/seller-inventory/${inventoryId}`, { method: "PUT", body: JSON.stringify(body) }),
    deleteSellerInventory: (inventoryId: string) => api.request(`/secured/seller-inventory/${inventoryId}`, { method: "DELETE" }),

    // Cart
    getCart: () => api.request("/secured/cart/"),
    addToCart: (body: object) => api.request("/secured/cart/", { method: "POST", body: JSON.stringify(body) }),
    clearCart: () => api.request("/secured/cart/", { method: "DELETE" }),
    updateCartItem: (cartItemId: string, quantity: number) =>
        api.request(`/secured/cart/${cartItemId}${buildQuery({ quantity })}`, { method: "PUT" }),
    removeCartItem: (cartItemId: string) => api.request(`/secured/cart/${cartItemId}`, { method: "DELETE" }),
    checkout: () => api.request("/secured/cart/checkout", { method: "POST" }),

    // Orders
    listOrders: ({ sort, page, size, order }: { sort?: string; page?: number; size?: number; order?: string } = {}) =>
        api.request(`/secured/orders/${buildQuery({ sort_by: sort, page, size, order })}`),
    getOrderItems: (orderId: string) => api.request(`/secured/orders/items/${orderId}`),
    confirmOrder: (orderId: string) => api.request(`/secured/orders/${orderId}/confirm`, { method: "PATCH" }),
    readyOrder: (orderId: string) => api.request(`/secured/orders/${orderId}/ready`, { method: "PATCH" }),
    completeOrder: (orderId: string) => api.request(`/secured/orders/${orderId}/done`, { method: "PATCH" }),
    cancelOrder: (orderId: string) => api.request(`/secured/orders/${orderId}/cancel`, { method: "PATCH" }),

    orderHistory: () => api.request(`/secured/orders/history`),
};
