import { useEffect, useState } from "react";
import { AdminStats } from "../types";

export const useAdminStats = () => {
  const [adminStats, setAdminStats] = useState<AdminStats>({
    itemsPurchased: 0,
    totalPurchaseAmount: 0,
    discountCodes: [],
    totalOrderCount: 0,
    totalDiscountAmount: 0,
  });

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    const response = await fetch("/api/admin/stats");
    const data = await response.json();
    setAdminStats(data);
  };

  const resetStats = async () => {
    const response = await fetch("/api/admin/stats", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setAdminStats(data);
  };

  const refreshAdminStats = async () => {
    fetchAdminStats();
  };

  return { adminStats, resetStats, refreshAdminStats };
};
