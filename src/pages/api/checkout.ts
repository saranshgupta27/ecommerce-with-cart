import { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../utils/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { discountCode } = req.body;
    const result = store.checkout(discountCode);
    if ("error" in result) {
      res.status(400).json({ error: result.error });
    } else {
      res.status(200).json(result);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
