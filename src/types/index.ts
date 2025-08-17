export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string | null;
}

export interface Cart {
    items: CartItem[];
}

type Role = "ADMIN" | "BUYER" | "SELLER";

export interface UserProfile {
    id: string;
    username: string;
    role: Role;
}

export interface User {
    id: string;
    name: string;
    username: string;
    phone: string;
    role: Role;
}
export interface Product {
    id: string;
    name: string;
    price: number;
    image?: string;
    description: string;
}

export interface ProductInventory {
    id: string;
    name: string;
    price: number;
    image?: string;
    description: string;
}

export interface PageInfo {
    page: number;
    size: number;
    total_record: number;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    code?: string;
    status?: string;
    createdAt?: string;
    created_at?: string;
    total?: number;
    items?: OrderItem[];
}
