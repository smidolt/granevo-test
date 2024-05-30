import { z } from 'zod';

export const orderSchema = z.object({
    shipping_method: z.string(),
    payment_method: z.string(),
    billing_address_first_name: z.string(),
    billing_address_last_name: z.string(),
    billing_address_1: z.string(),
    billing_address_city: z.string(),
    billing_address_postcode: z.string(),
    billing_address_country_code: z.string(),
    billing_email: z.string().email(),
    items: z.array(
        z.object({
            product_id: z.string(),
            quantity: z.number().positive()
        })
    )
});
