import { Box, Container, Flex, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AdminPanel } from "../components/AdminPanel";
import { Cart } from "../components/Cart";
import { ProductList } from "../components/ProductList";
import { CartItem, Order, Product } from "../types";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [nthOrder, setNthOrder] = useState(5);
  const [adminStats, setAdminStats] = useState<{
    itemsPurchased: number;
    totalPurchaseAmount: number;
    discountCodes: { code: string; used: boolean }[];
    totalDiscountAmount: number;
  }>({
    itemsPurchased: 0,
    totalPurchaseAmount: 0,
    discountCodes: [],
    totalDiscountAmount: 0,
  });
  const toast = useToast();
  console.log(cart);
  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchAdminStats();
    fetchNthOrder();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data);
  };

  const fetchCart = async () => {
    const response = await fetch("/api/cart");
    const data = await response.json();
    setCart(data);
  };

  const fetchAdminStats = async () => {
    const response = await fetch("/api/admin/stats");
    const data = await response.json();
    setAdminStats(data);
  };

  const handleAddToCart = async (productId: number) => {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    fetchCart();
    toast({
      title: "Item added to cart",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const resetStats = async () => {
    setAdminStats({
      itemsPurchased: 0,
      totalPurchaseAmount: 0,
      discountCodes: [],
      totalDiscountAmount: 0,
    });
    setCart([]);
  };

  const handleCheckout = async (discountCode?: string) => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountCode }),
    });
    const data = await response.json();
    if (response.ok) {
      const order: Order = data;
      fetchCart();
      fetchAdminStats();
      toast({
        title: "Order placed successfully",
        description: `Total: ₹ ${order.total.toFixed(2)}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Checkout failed",
        description: data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchNthOrder = async () => {
    const response = await fetch("/api/admin/nthOrder");
    const data = await response.json();
    setNthOrder(data.nthOrder);
  };

  const handleNthOrderChange = async (n: number) => {
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
  return (
    <Container maxW="container.xl" py={8}>
      <Flex direction={{ base: "column", md: "row" }} gap={8} height={"100%"}>
        <Box flex={2} height={"max-content"}>
          <ProductList products={products} onAddToCart={handleAddToCart} />
        </Box>
        <Box>
          <Flex
            direction={"column"}
            justifyContent={"space-between"}
            height={"100%"}
            maxH={"100%"}
            gap={4}
          >
            <Cart
              cart={cart}
              onCheckout={handleCheckout}
              availableDiscountCodes={
                adminStats.discountCodes
                  ? adminStats.discountCodes.filter((dc) => !dc.used)
                  : []
              }
            />
            <AdminPanel
              itemsPurchased={adminStats.itemsPurchased}
              totalPurchaseAmount={adminStats.totalPurchaseAmount}
              discountCodes={adminStats.discountCodes}
              totalDiscountAmount={adminStats.totalDiscountAmount}
              resetStats={resetStats}
              nthOrder={nthOrder}
              onNthOrderChange={handleNthOrderChange}
            />
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default Home;
