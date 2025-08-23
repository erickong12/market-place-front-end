export type Role = "ADMIN" | "BUYER" | "SELLER";
export type Status = "PENDING" | "CONFIRMED" | "READY_TO_PICKUP" | "DONE" | "CANCELLED" | "AUTO_CANCELLED";

export const statusVariant: Record<Status, "success" | "destructive" | "warning" | "default" | "outline"> = {
    PENDING: "warning",
    CONFIRMED: "default",
    READY_TO_PICKUP: "success",
    CANCELLED: "destructive",
    DONE: "success",
    AUTO_CANCELLED: "success"
};

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

export interface TopProduct {
    id: string;
    name: string;
    image: string;
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
    product_id: string;
    product_name: string;
    product_image: string;
    product_description: string;
    price_at_purchase: number;
    quantity: number;
}

export interface Order {
    id: string;
    buyer_id: string;
    buyer_name: string;
    seller_id: string;
    seller_name: string;
    status: Status;
    created_at: string;
    updated_at: string;
    total: number;
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