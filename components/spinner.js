import {
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner as Spin,
} from "@chakra-ui/react";

export default function Spinner({ loadingModal }) {
  return (
    <Modal isCentered isOpen={loadingModal.isOpen}>
      <ModalOverlay />
      <ModalContent boxShadow="0px" bgColor="transparent">
        <ModalBody>
          <Center>
            <Spin size="xl" speed="0.75s" color="blue.400" thickness="4px" />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
