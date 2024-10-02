export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  discountCode?: string;
}

export interface DiscountCode {
  code: string;
  used: boolean;
}
