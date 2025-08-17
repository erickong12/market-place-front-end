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

export interface User {
    id: string;
    username: string;
}

export interface Product {
    id: string | number;
    name: string;
    price: number;
    image?: string;
    description: string;
    category?: { id?: string | number; name?: string; slug?: string } | string;
}
export interface PageInfo {
    page: number;
    offset: number;
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
