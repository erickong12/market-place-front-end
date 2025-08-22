export interface CartItem {
    id: string;
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
    image: string;
    seller_id: string;
    seller_name: string;
    inventory_id: string;
}

type Role = "ADMIN" | "BUYER" | "SELLER";
type Status = "PENDING" | "CONFIRMED" | "READY_TO_PICKUP" | "DONE" | "CANCELLED" | "AUTO_CANCELLED";

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
    price: number;
    quantity: number;
    product_id: string;
    product_name: string;
    product_image: string;
    product_description: string;
    seller_id: string;
    seller_name: string;
}

export interface ProductDropDown {
    id: string;
    name: string;
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
    status: Status;
    createdAt?: string;
    created_at?: string;
    total?: number;
}

export interface InventoryItem {
    id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    product_description: string;
    seller_id: string;
    seller_name: string;
    price?: number;
    quantity?: number;
}