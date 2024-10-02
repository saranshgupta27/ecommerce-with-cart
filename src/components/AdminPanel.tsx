import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { DiscountCode } from "../types";

interface AdminPanelProps {
  itemsPurchased: number;
  totalPurchaseAmount: number;
  discountCodes: DiscountCode[];
  totalDiscountAmount: number;
  nthOrder: number;
  onNthOrderChange: (n: number) => void;
  resetStats: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  itemsPurchased,
  totalPurchaseAmount,
  discountCodes,
  totalDiscountAmount,
  nthOrder,
  onNthOrderChange,
  resetStats,
}) => {
  const [newNthOrder, setNewNthOrder] = useState(nthOrder.toString());

  const handleNthOrderChange = () => {
    const n = parseInt(newNthOrder, 10);
    if (!isNaN(n) && n > 0) {
      onNthOrderChange(n);
    }
  };

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Admin Panel
      </Heading>
      <VStack align="start" spacing={2}>
        <Text>Items Purchased: {itemsPurchased}</Text>
        <Text>Total Purchase Amount: INR {totalPurchaseAmount.toFixed(2)}</Text>
        <Text>Total Discount Amount: INR {totalDiscountAmount.toFixed(2)}</Text>
        <Text>Current Nth Order: {nthOrder}</Text>
        <Text>Discount Codes:</Text>
        <VStack align="start" pl={4}>
          {discountCodes.map((code, index) => (
            <Text key={index}>
              {code.code} - {code.used ? "Used" : "Available"}
            </Text>
          ))}
        </VStack>
        <Flex gap={2}>
          <Input
            w={50}
            type="number"
            required
            placeholder="New Nth Order"
            value={newNthOrder}
            onChange={(e) => setNewNthOrder(e.target.value)}
            mr={2}
          />
          <Button onClick={handleNthOrderChange}>
            Update Nth Order number for discount
          </Button>
        </Flex>
        <Box>
          <Button onClick={resetStats}>Reset Admin Stats</Button>
        </Box>
      </VStack>
    </Box>
  );
};
