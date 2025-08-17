const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

let onUnauthorized: (() => void) | null = null;

export const api = {
    token: () => localStorage.getItem("token") || "",
    setToken: (t: string) => localStorage.setItem("token", t || ""),
    clearToken: () => localStorage.removeItem("token"),
    setOnUnauthorized(cb: () => void) {
        onUnauthorized = cb;
    },

    async request(path: string, opts: RequestInit = {}) {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(opts.headers as Record<string, string> || {}),
        };

        const token = api.token();
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });

        if (res.status === 401) {
            api.clearToken();
            if (onUnauthorized) onUnauthorized();
            throw new Error("Unauthorized");
        }

        if (!res.ok) {
            let msg = `HTTP ${res.status}`;
            try {
                const j = await res.json();
                msg = j.message || j.error || msg;
            } catch {
                throw new Error(msg);
            }
        }

        const ct = res.headers.get("content-type") || "";

        return ct.includes("application/json") ? res.json() : res.text();
    },

    // Auth
    login: ({ username, password }: { username: string; password: string }) => api.request(
"/login",
        {
            method: "POST",
            headers: {
                Authorization: "Basic " + btoa(`${username}:${password}`),
            },
        }
),

    register: (body: object) => api.request("/register", { method: "POST", body: JSON.stringify(body) }),
    profile: () => api.request("/secured/profile", { method: "GET" }),

    // Product
    listProducts: ({ sort, page, size, order, search = "" }: { sort?: string, page?: number, size?: number, order?: string, search?: string } = {}) =>
        api.request(
            `/secured/products?search=${encodeURIComponent(search)}&sort_by=${sort}&page=${page}&size=${size}&order=${order}`,
        ),
    getProduct: (id: string) => api.request(`/secured/products/${id}`),

    // Cart
    getCart: () => api.request("/secured/cart"),
    addToCart: (body: object) => api.request("/secured/cart", { method: "POST", body: JSON.stringify(body) }),
    updateCartItem: (id: string, body: object) => api.request(`/secured/cart/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    removeCartItem: (id: string) => api.request(`/secured/cart/${id}`, { method: "DELETE" }),
    checkout: () => api.request("/secured/cart/checkout", { method: "POST" }),

    // Orders
    listOrders: () => api.request("/secured/orders"),
};
