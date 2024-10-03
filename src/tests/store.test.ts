import { store } from "../utils/store";

describe("Store", () => {
  beforeEach(() => {
    // Reset the store before each test
    store.resetStats();
  });

  test("should return products", () => {
    const products = store.getProducts();
    expect(products).toHaveLength(5);
    expect(products[0].name).toBe("Laptop");
  });

  test("should add products to the cart", () => {
    store.addToCart(1, 1);
    const cart = store.getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].product.id).toBe(1);
    expect(cart[0].quantity).toBe(1);
  });

  test("should update quantity of existing item in the cart", () => {
    store.addToCart(1, 1);
    store.addToCart(1, 2);
    const cart = store.getCart();
    expect(cart[0].quantity).toBe(3);
  });

  test("should remove product from the cart", () => {
    store.addToCart(1, 1);
    store.removeFromCart(1);
    const cart = store.getCart();
    expect(cart).toHaveLength(0);
  });

  test("should clear the cart", () => {
    store.addToCart(1, 1);
    store.clearCart();
    const cart = store.getCart();
    expect(cart).toHaveLength(0);
  });

  test("should checkout and create an order", () => {
    store.addToCart(1, 1);
    const order = store.checkout();
    expect(order).toHaveProperty("id");
    expect(order).toHaveProperty("items");
  });

  test("should not checkout with an empty cart", () => {
    const result = store.checkout();
    expect(result).toEqual({ error: "Cannot checkout with an empty cart" });
  });

  test("should apply discount code", () => {
    store.setNthOrder(3); // Set nth order to 3
    store.addToCart(1, 1);
    store.addToCart(2, 1);
    store.checkout(); // First order
    let discountCodes = store.getDiscountCodes();
    expect(discountCodes.filter((ds) => !ds.isInvalid)).toHaveLength(0);
    store.addToCart(3, 1);
    store.checkout(); // Second order
    discountCodes = store.getDiscountCodes();
    expect(discountCodes.filter((ds) => !ds.isInvalid)).toHaveLength(1); // Discount code generated after 2 orders
  });

  test("should not apply an invalid discount code", () => {
    store.addToCart(1, 1);
    const result = store.checkout("INVALID_CODE"); // Attempting to use an invalid discount code
    expect(result).toEqual({ error: "Invalid or already Used discount code" });
  });

  test("should reset store stats", () => {
    store.addToCart(1, 1);
    store.checkout();
    const statsBeforeReset = store.getAdminStats();
    expect(statsBeforeReset.totalOrderCount).toBe(1);

    store.resetStats();
    const statsAfterReset = store.getAdminStats();
    expect(statsAfterReset.totalOrderCount).toBe(0);
  });

  test("should generate a valid discount code", () => {
    store.setNthOrder(3); // Set nth order to 3
    store.addToCart(1, 1);
    store.addToCart(2, 1);
    store.checkout(); // First order
    store.addToCart(3, 1);
    store.checkout(); // Second order
    const discountCodes = store.getDiscountCodes();
    expect(discountCodes.filter((ds) => !ds.isInvalid)).toBeTruthy();
  });

  test("should get admin stats", () => {
    store.addToCart(1, 2); // Add 2 laptops
    store.addToCart(2, 1); // Add 1 milk
    const order = store.checkout(); // Checkout
    const stats = store.getAdminStats();

    expect(stats.totalOrderCount).toBe(1);
    expect(stats.itemsPurchased).toBe(3);
    if ("total" in order) {
      expect(stats.totalPurchaseAmount).toBe(order.total);
    } else {
      throw new Error("Expected order to have a total property");
    }
  });
});
