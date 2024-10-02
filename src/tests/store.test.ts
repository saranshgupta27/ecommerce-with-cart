// src/__tests__/store.test.ts
import { store } from "../utils/store";

describe("Store", () => {
  beforeEach(() => {
    // Reset the store before each test
    store["products"] = [
      { id: 1, name: "Product 1", price: 10 },
      { id: 2, name: "Product 2", price: 20 },
      { id: 3, name: "Product 3", price: 30 },
    ];
    store["cart"] = [];
    store["orders"] = [];
    store["discountCodes"] = [];
    store["orderCount"] = 0;
  });

  // ... (keep other tests unchanged)

  test("discount code is generated every nth order", () => {
    for (let i = 0; i < 4; i++) {
      store.addToCart(1, 1);
      store.checkout();
    }
    expect(store.getLatestDiscountCode()).toBeNull();

    store.addToCart(1, 1);
    store.checkout();
    const discountCode = store.getLatestDiscountCode();
    expect(discountCode).not.toBeNull();
    expect(discountCode?.used).toBe(false);
  });

  test("discount code can only be used once", () => {
    // Generate a discount code
    for (let i = 0; i < 5; i++) {
      store.addToCart(1, 1);
      store.checkout();
    }
    const discountCode = store.getLatestDiscountCode();

    // Use the discount code
    store.addToCart(1, 1);
    const order1 = store.checkout(discountCode?.code);
    expect("error" in order1).toBe(false);
    if (!("error" in order1)) {
      expect(order1.discount).toBe(1); // 10% of 10
    }

    // Try to use the same discount code again
    store.addToCart(1, 1);
    const order2 = store.checkout(discountCode?.code);
    expect("error" in order2).toBe(true);
    if ("error" in order2) {
      expect(order2.error).toBe("Invalid or already used discount code");
    }
  });

  test("getAdminStats returns correct statistics including discount codes", () => {
    // Generate and use a discount code
    for (let i = 0; i < 5; i++) {
      store.addToCart(1, 1);
      store.checkout();
    }
    const discountCode = store.getLatestDiscountCode();
    store.addToCart(2, 1);
    store.checkout(discountCode?.code);

    const stats = store.getAdminStats();
    expect(stats.itemsPurchased).toBe(6);
    expect(stats.totalPurchaseAmount).toBe(70); // 5 * 10 + 20
    expect(stats.totalDiscountAmount).toBe(2); // 10% of 20
    expect(stats.discountCodes).toHaveLength(1);
    expect(stats.discountCodes[0].used).toBe(true);
  });
});
