// src/pages/api/admin/nthOrder.ts
import { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../../utils/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json({ nthOrder: store.getNthOrder() });
  } else if (req.method === "POST") {
    const { nthOrder } = req.body;
    try {
      store.setNthOrder(nthOrder);
      res.status(200).json({ message: "Nth order updated successfully" });
    } catch (error) {
      const errorMessage = (error as Error).message;
      res.status(400).json({ error: errorMessage });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
