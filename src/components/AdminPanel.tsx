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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNthOrderChange = () => {
    const n = parseInt(newNthOrder, 10);
    if (!isNaN(n) && n > 0) {
      onNthOrderChange(n);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={5}
      top={5}
      cursor={isExpanded ? "initial" : "pointer"}
      color={isExpanded ? "black" : "white"}
      background={isExpanded ? "beige" : "blue.800"}
      p={isExpanded ? 6 : 2}
      onClick={isExpanded ? undefined : () => setIsExpanded(true)}
    >
      <Heading as="h2" size="lg">
        Admin Controls
      </Heading>
      {isExpanded && (
        <VStack align="start" spacing={2}>
          <Text mt={4}>Items Purchased: {itemsPurchased}</Text>
          <Text>
            Total Purchase Amount: INR {totalPurchaseAmount.toFixed(2)}
          </Text>
          <Text>
            Total Discount Amount: INR {totalDiscountAmount.toFixed(2)}
          </Text>
          <Text>Current Nth Order: {nthOrder}</Text>
          <Text>Discount Code Status:</Text>
          <VStack align="start" pl={4}>
            {discountCodes?.map((code) => (
              <Text key={code.code}>
                {code.code} - {code.used ? "Used" : "Available"}
              </Text>
            ))}
          </VStack>
          <Flex gap={2}>
            <Input
              w={50}
              type="number"
              required
              background={"white"}
              placeholder="New Nth Order"
              value={newNthOrder}
              onChange={(e) => setNewNthOrder(e.target.value)}
              mr={2}
            />
            <Button
              onClick={handleNthOrderChange}
              background={"blue.900"}
              color={"white"}
            >
              Update Discount frequency to Nth Order
            </Button>
          </Flex>
          <Flex gap={"4"}>
            <Button
              onClick={resetStats}
              background={"blue.600"}
              color={"white"}
            >
              Reset Stats
            </Button>
            <Button
              onClick={() => setIsExpanded(false)}
              background={"red"}
              color={"white"}
            >
              Close
            </Button>
          </Flex>
        </VStack>
      )}
    </Box>
  );
};
