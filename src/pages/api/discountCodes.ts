// pages/api/discountCodes.ts
import { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../utils/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const discountCodes = store.getDiscountCodes();
    res.status(200).json(discountCodes);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
