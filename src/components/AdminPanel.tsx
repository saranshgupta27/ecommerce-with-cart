import { AdminStats } from "@/types";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface AdminPanelProps {
  adminStats: AdminStats;
  onReset: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  adminStats,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [nthOrder, setNthOrder] = useState(5);
  const [newNthOrder, setNewNthOrder] = useState(nthOrder.toString());

  const toast = useToast();

  const fetchNthOrder = async () => {
    const response = await fetch("/api/admin/nthOrder");
    const data = await response.json();
    setNthOrder(data.nthOrder);
  };

  const onNthOrderChange = async (n: number) => {
    const response = await fetch("/api/admin/nthOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nthOrder: n }),
    });
    if (response.ok) {
      setNthOrder(n);
      toast({
        title: "Nth Order updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to update Nth Order",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleNthOrderChange = () => {
    const n = parseInt(newNthOrder, 10);
    if (!isNaN(n) && n > 0) {
      onNthOrderChange(n);
    }
  };

  useEffect(() => {
    fetchNthOrder();
  }, []);

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
          <Text mt={4}>Items Purchased: {adminStats.itemsPurchased}</Text>
          <Text>
            Total Purchase Amount: INR{" "}
            {adminStats.totalPurchaseAmount.toFixed(2)}
          </Text>
          <Text>
            Total Discount Amount: INR{" "}
            {adminStats.totalDiscountAmount.toFixed(2)}
          </Text>
          <Text>Total Orders: {adminStats.totalOrderCount}</Text>
          <Text>Current Nth Order: {nthOrder}</Text>
          <Text>Discount Code Status:</Text>

          <VStack align="start" pl={4}>
            {adminStats.discountCodes?.map((code) => (
              <Text key={code.code}>
                {code.code} - {code.isInvalid ? "Expired/Used" : "Available"}
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
            <Button onClick={onReset} background={"blue.600"} color={"white"}>
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
