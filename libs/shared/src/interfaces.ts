export interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'vendor' | 'admin';
}

export interface Product {
    id: string;
    vendorId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    images: string[];
}

export interface Order {
    id: string;
    userId: string;
    vendorId: string;
    totalAmount: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
}

export interface Payment {
    id: string;
    orderId: string;
    stripePaymentId: string;
    status: 'pending' | 'succeeded' | 'failed' | 'refunded';
    amount: number;
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
}
