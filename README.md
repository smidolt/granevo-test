# Directus Shop Orders API

This project is a simple Next.js application that implements an API endpoint for handling web store orders. The orders are stored in the Directus CMS using its API.

## Features

- Validates input data using the Zod library.
- Calculates order subtotals, taxes, and totals using the Currency.js library.
- Stores orders and their items in the Directus CMS.

## How It Works

The application provides an API endpoint `/api/checkout` that accepts POST requests with order data in JSON format. Upon receiving a request, the application performs the following steps:

1. **Validation**: Validates the input data using the Zod library to ensure data integrity.
2. **Calculation**: Calculates order subtotals, taxes, and totals based on the provided item quantities and product prices.
3. **Data Transformation**: Transforms the order data into the format required by the Directus CMS.
4. **API Interaction**: Sends the order data to the Directus API endpoint for storing orders and their items.

## Why Mocking was Used

- **Access Restrictions**: Due to limitations in accessing the Directus API (e.g., permission issues, authentication constraints), mocking was used to simulate API responses and test the application's functionality independently.
- **Testing Purposes**: Mocking allows me to test the application's logic without relying on external services, ensuring consistent and reliable testing results.

## Limitations and Considerations

- **Directus API Access**: I encountered difficulties accessing the Directus API due to permission restrictions or authentication issues. As a result, I opted to use mocking for testing purposes.
- **Authentication Credentials**: Although the task provided Directus URL and API key, I were unable to authenticate and access the Directus CMS. Thus, the API interaction part of the application was not tested with real API endpoints.

## Getting Started

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Change 55 line in `checkout.ts` for correct api key
4. Run the development server using `npm run dev`.

## Usage

Send a POST request to `/api/checkout` with the order data in the request body.

Example request body:
```json
{
    "shipping_method": "store-pickup",
    "payment_method": "bank-transaction",
    "billing_address_first_name": "Name",
    "billing_address_last_name": "Last name",
    "billing_address_1": "Ulica 1",
    "billing_address_city": "Ljubljana",
    "billing_address_postcode": "1000",
    "billing_address_country_code": "SI",
    "billing_email": "your@email.si",
    "items": [
        {
            "product_id": "1000278",
            "quantity": 1
        },
        {
            "product_id": "1000503",
            "quantity": 2
        },
        {
            "product_id": "1001021",
            "quantity": 12
        }
    ]
}
```
## Demonstration
![Screenshot 2024-05-30 at 11 08 58 pm](https://github.com/smidolt/granevo-test/assets/103376685/1865b8fd-2921-461c-bd96-cbd36d421d95)



