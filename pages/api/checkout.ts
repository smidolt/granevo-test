import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { orderSchema } from '../../schema';
import currency from 'currency.js';
import axios from 'axios';
import { Order, OrderItem } from '../../types';
import nock from 'nock';

type Data = {
    data?: any;
    error?: any;
};

const getProductPrice = (productId: string): number => {
    const prices: Record<string, number> = {
        '1000278': 10.0,
        '1000503': 20.0,
        '1001021': 5.0
    };
    return prices[productId] || 0;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {

        const parsedData: Order = orderSchema.parse(req.body);


        const { items } = parsedData;
        const subtotals = items.map((item: OrderItem) => {
            const price = getProductPrice(item.product_id);
            return currency(price).multiply(item.quantity);
        });

        const subtotal = subtotals.reduce((total, item) => total.add(item), currency(0));
        const tax = subtotal.multiply(0.22); 
        const total = subtotal.add(tax);

        const orderData = {
            ...parsedData,
            subtotal: subtotal.value,
            tax: tax.value,
            total: total.value,
            items: undefined, 
        };

        const directusUrl = 'https://gws.granevo.com';
        const apiKey = 'USE CORRECT ONE'; // CHANGE IT PLEASE

        const scope = nock(directusUrl, {
            reqheaders: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        scope.post('/items/DEMO_shop_orders', orderData)
            .reply(200, {
                data: {
                    id: 'mock-order-id',
                    ...orderData
                }
            });

        const orderItemsData = items.map((item: OrderItem) => ({
            order: 'mock-order-id',
            product_id: item.product_id,
            quantity: item.quantity,
        }));

        orderItemsData.forEach((item, index) => {
            scope.post('/items/DEMO_shop_order_items', item)
                .reply(200, {
                    data: {
                        id: `mock-order-item-id-${index}`,
                        ...item
                    }
                });
        });

        const orderResponse = await axios.post(
            `${directusUrl}/items/DEMO_shop_orders`,
            orderData,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        const orderId = orderResponse.data.data.id;

        const orderItemsResponses = await Promise.all(orderItemsData.map(item =>
            axios.post(
                `${directusUrl}/items/DEMO_shop_order_items`,
                item,
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            )
        ));

        const createdOrder = {
            ...orderResponse.data.data,
            items: orderItemsResponses.map(response => response.data.data.id),
        };

        res.status(200).json({ data: createdOrder });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
