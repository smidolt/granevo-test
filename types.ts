export interface OrderItem {
    product_id: string;
    quantity: number;
}

export interface Order {
    shipping_method: string;
    payment_method: string;
    billing_address_first_name: string;
    billing_address_last_name: string;
    billing_address_1: string;
    billing_address_city: string;
    billing_address_postcode: string;
    billing_address_country_code: string;
    billing_email: string;
    items: OrderItem[];
}
