import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const AboutModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text mr={5} onClick={onOpen} cursor="pointer">
        About
      </Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>About</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* About Section */}
            <Text fontWeight="bold" mb={2}>
              About
            </Text>
            <Text mb={4}>
              This is the Advanced Berkeley Comfort Tool, developed to help you
              analyze and optimize comfort conditions.
            </Text>

            {/* Cite us Section */}
            <Text fontWeight="bold" mb={2}>
              Cite us
            </Text>
            <Text mb={4}>Please cite us if you use this software: XXXXX</Text>

            {/* Reference Section */}
            <Text fontWeight="bold" mb={2}>
              Reference
            </Text>
            <Text>
              For more information, please refer to the official documentation
              and references available on our website.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AboutModal;
