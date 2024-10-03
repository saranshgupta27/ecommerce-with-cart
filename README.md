# Ecommerce Store
This is a simple ecommerce store built with Next.js, Chakra UI, and TypeScript. It demonstrates basic functionality such as adding items to a cart, applying discount codes, and checking out.

# NOTE
Admin Controls for now has been placed on home for easier debugging and testing in a floating dialog box. This is only temporary and should be moved on a separate page/route.

## Features

- Product listing
- Add items to cart
- Apply discount codes
- Checkout functionality
- Admin panel with statistics

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ecommerce-store.git
   cd ecommerce-store
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/pages`: Contains the main pages of the application
- `src/components`: Reusable React components
- `src/utils`: Utility functions and store logic
- `src/types`: TypeScript type definitions

## API Routes

- `GET /api/products`: Get all products
- `GET /api/cart`: Get the current cart
- `POST /api/cart`: Add an item to the cart
- `POST /api/checkout`: Process checkout
- `GET /api/admin/discount`: Get the latest discount code
- `GET /api/admin/stats`: Get admin statistics

## Testing

To run the unit tests:

```
npm run test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
