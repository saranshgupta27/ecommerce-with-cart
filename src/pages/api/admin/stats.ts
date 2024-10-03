import { NextApiRequest, NextApiResponse } from "next";
import { store } from "../../../utils/store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const stats = store.getAdminStats();
    return res.status(200).json(stats);
  }
  if (req.method === "DELETE") {
    store.resetStats();
    const stats = store.getAdminStats();
    return res.status(200).json(stats);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
