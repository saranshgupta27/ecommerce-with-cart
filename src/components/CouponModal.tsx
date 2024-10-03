import { DiscountCode } from "@/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

interface CouponModalProps {
  coupons: DiscountCode[] | [];
  onApplyCoupon: (couponCode: string) => void;
  isCartEmpty: boolean;
}

const CouponModal: React.FC<CouponModalProps> = ({
  coupons,
  onApplyCoupon,
  isCartEmpty,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");

  const handleApplyCoupon = () => {
    if (selectedCoupon) {
      onApplyCoupon(selectedCoupon);
      onClose();
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        background={"blue.500"}
        _hover={{ background: "blue.400" }}
        _active={{ background: "blue.600" }}
        variant={"solid"}
        color={"white"}
        isDisabled={coupons.length < 1 || isCartEmpty}
      >
        Find
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Available Coupons</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {coupons.length > 0 ? (
              <RadioGroup value={selectedCoupon} onChange={setSelectedCoupon}>
                <VStack align="start">
                  {coupons
                    .filter((coupon) => !coupon.isInvalid)
                    .map((coupon) => (
                      <Radio key={coupon.code} value={coupon.code}>
                        {coupon.code}
                      </Radio>
                    ))}
                  <Text> Get 10% off per coupon</Text>
                </VStack>
              </RadioGroup>
            ) : (
              <Text>No available coupons.</Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button background={"red"} color={"white"} mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="green"
              onClick={handleApplyCoupon}
              isDisabled={!selectedCoupon}
            >
              Apply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CouponModal;
