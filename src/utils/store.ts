import { CartItem, DiscountCode, Order, Product } from "../types";

class Store {
  private products: Product[] = [
    {
      id: 1,
      name: "Laptop",
      price: 59999,
      image:
        "https://img.freepik.com/premium-vector/modern-laptop-mockup-with-blank-screen-vector-illustration_1253202-36850.jpg",
    },
    {
      id: 2,
      name: "Milk",
      price: 120,
      image:
        "https://www.shutterstock.com/image-vector/tall-vanilla-cows-milk-carton-600nw-2016254093.jpg",
    },
    {
      id: 3,
      name: "Banana (3 pieces)",
      price: 30,
      image:
        "https://static.vecteezy.com/system/resources/previews/006/853/188/non_2x/realistic-banana-good-for-food-catalugue-fruit-catalogue-etc-free-vector.jpg",
    },
    {
      id: 4,
      name: "Headphones",
      price: 1999,
      image:
        "https://static.vecteezy.com/system/resources/previews/004/800/082/original/red-headphones-device-free-vector.jpg",
    },
    {
      id: 5,
      name: "Chocolate",
      price: 90,
      image:
        "https://static.vecteezy.com/system/resources/previews/007/634/001/non_2x/chocolate-bar-clipart-design-vektor-free-vector.jpg",
    },
  ];

  private cart: CartItem[] = [];
  private currentOrder: Order[] = [];
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

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter((item) => item.product.id !== productId);
  }

  getCart(): CartItem[] {
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
  }

  checkout(discountCode?: string): Order | { error: string } {
    discountCode = discountCode?.trim();

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
        validDiscount.used = true; // Mark the discount as used
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

    this.currentOrder.push(order);
    this.clearCart();

    if (this.orderCount % this.nthOrder === 0) {
      this.generateDiscountCode();
    }

    return order;
  }

  private generateDiscountCode(): DiscountCode {
    const code = `GET10-${this.orderCount}`;
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

  resetStats() {
    this.cart = [];
    this.currentOrder = [];
    this.discountCodes = [];
    this.orderCount = 0;
    return this.getAdminStats();
  }

  getAdminStats() {
    const itemsPurchased = this.currentOrder.reduce(
      (total, order) =>
        total + order.items.reduce((sum, item) => sum + item.quantity, 0),
      0
    );
    const totalPurchaseAmount = this.currentOrder.reduce(
      (total, order) => total + order.total,
      0
    );
    const totalDiscountAmount = this.currentOrder.reduce(
      (total, order) => total + order.discount,
      0
    );
    const totalOrderCount = this.orderCount;

    return {
      totalOrderCount,
      itemsPurchased,
      totalPurchaseAmount,
      discountCodes: this.discountCodes,
      totalDiscountAmount,
    };
  }
}

export const store = new Store();
