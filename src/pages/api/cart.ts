import { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../utils/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const cart = store.getCart();
    res.status(200).json(cart);
  } else if (req.method === "POST") {
    const { productId, quantity } = req.body;
    store.addToCart(productId, quantity);
    res.status(200).json({ message: "Item added to cart" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
