// src/utils/store.ts
import { CartItem, DiscountCode, Order, Product } from "../types";

class Store {
  private products: Product[] = [
    { id: 1, name: "Product 1", price: 10 },
    { id: 2, name: "Product 2", price: 20 },
    { id: 3, name: "Product 3", price: 30 },
  ];
  private cart: CartItem[] = [];
  private orders: Order[] = [];
  private discountCodes: DiscountCode[] = [];
  private orderCount: number = 0;
  private nthOrder: number = 5; // Default to every 5th order
  private discountPercentage: number = 10; // 10% discount

  getProducts(): Product[] {
    return this.products;
  }

  addToCart(productId: number, quantity: number): void {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      const existingItem = this.cart.find(
        (item) => item.product.id === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.cart.push({ product, quantity });
      }
    }
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
  }

  checkout(discountCode?: string): Order | { error: string } {
    if (this.cart.length === 0) {
      return { error: "Cannot checkout with an empty cart" };
    }

    const subtotal = this.cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    let discount = 0;

    if (discountCode) {
      const validDiscount = this.discountCodes.find(
        (dc) => dc.code === discountCode && !dc.used
      );
      if (validDiscount) {
        discount = subtotal * (this.discountPercentage / 100);
        validDiscount.used = true;
      } else {
        return { error: "Invalid or already used discount code" };
      }
    }

    const total = subtotal - discount;
    this.orderCount++;

    const order: Order = {
      id: this.orderCount,
      items: [...this.cart],
      subtotal,
      discount,
      total,
      discountCode: discountCode,
    };

    this.orders.push(order);
    this.clearCart();

    if (this.orderCount % this.nthOrder === 0) {
      this.generateDiscountCode();
    }

    return order;
  }

  private generateDiscountCode(): DiscountCode {
    const code = `DISCOUNT${this.orderCount}`;
    const discountCode: DiscountCode = { code, used: false };
    this.discountCodes.push(discountCode);
    return discountCode;
  }

  setNthOrder(n: number): void {
    if (n > 0) {
      this.nthOrder = n;
    } else {
      throw new Error("Nth order must be a positive number");
    }
  }

  getNthOrder(): number {
    return this.nthOrder;
  }

  getLatestDiscountCode(): DiscountCode | null {
    const unusedCodes = this.discountCodes.filter((dc) => !dc.used);
    return unusedCodes.length > 0 ? unusedCodes[unusedCodes.length - 1] : null;
  }

  getAdminStats() {
    const itemsPurchased = this.orders.reduce(
      (total, order) =>
        total + order.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    );
    const totalPurchaseAmount = this.orders.reduce(
      (total, order) => total + order.total,
      0
    );
    const totalDiscountAmount = this.orders.reduce(
      (total, order) => total + order.discount,
      0
    );

    return {
      itemsPurchased,
      totalPurchaseAmount,
      discountCodes: this.discountCodes,
      totalDiscountAmount,
    };
  }
}

export const store = new Store();
