import { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../utils/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const products = store.getProducts();
    res.status(200).json(products);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
