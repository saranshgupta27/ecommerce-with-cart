import { Box, Container, Flex, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AdminPanel } from "../components/AdminPanel";
import { Cart } from "../components/Cart";
import { ProductList } from "../components/ProductList";
import { AdminStats, CartItem, Order, Product } from "../types";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    itemsPurchased: 0,
    totalPurchaseAmount: 0,
    discountCodes: [],
    totalOrderCount: 0,
    totalDiscountAmount: 0,
  });
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchAdminStats();
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

  const resetStats = async () => {
    const response = await fetch("/api/admin/stats", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setCart([]);
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

  // Function to clear the cart
  const handleClearCart = async () => {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      // No body needed to clear the cart
    });
    if (response.ok) {
      setCart([]);
      toast({
        title: "Cart cleared",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to clear cart",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Function to delete an item from the cart
  const handleDeleteItem = async (productId: number) => {
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (response.ok) {
      fetchCart(); // Refresh the cart after deletion
      toast({
        title: "Item removed from cart",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to remove item",
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
              onClearCart={handleClearCart}
              onDeleteItem={handleDeleteItem}
            />
            <AdminPanel adminStats={adminStats} onReset={resetStats} />
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default Home;
