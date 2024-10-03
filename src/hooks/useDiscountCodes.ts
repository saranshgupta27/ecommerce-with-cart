import { useEffect, useState } from "react";
import { DiscountCode } from "../types";

export const useDiscountCodes = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  const fetchDiscountCodes = async () => {
    const response = await fetch("/api/discountCodes");
    const data = await response.json();
    if (response.ok) {
      setDiscountCodes(data);
    }
  };

  return discountCodes;
};
