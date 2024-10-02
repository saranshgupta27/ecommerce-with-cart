import { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../../utils/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const discountCode = store.getLatestDiscountCode();
    res.status(200).json(discountCode);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
