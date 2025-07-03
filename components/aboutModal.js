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
  Link,
  Box,
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
        <ModalContent maxW="50%" maxH="90%" overflowY="scroll">
          <ModalHeader>
            Web interface of Advanced Berkeley Comfort (ABC) model
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* About Section */}
            <Text fontWeight="bold" mb={2} mt={4}>
              Overview
            </Text>
            <Text mb={2}>
              This web interface allows you to simulate human thermal sensation
              and comfort using the Advanced Berkeley Comfort (ABC) model,
              developed by the{" "}
              <Link
                href="https://cbe.berkeley.edu/"
                isExternal
                color="blue.500"
                textDecoration="underline"
              >
                Center for the Built Environment (CBE)
              </Link>{" "}
              at the University of California, Berkeley.
            </Text>

            <Text mb={2}>
              The ABC model predicts both thermal sensation (e.g., hot, cold,
              neutral) and comfort (comfortable or uncomfortable), as well as
              physiological responses (e.g., skin temperature, core
              temperature). Unlike conventional models such as the Predicted
              Mean Vote (PMV) model, the ABC model can predict thermal sensation
              and comfort in transient and non-uniform environments.
            </Text>

            <Text fontWeight="bold" mb={2} mt={4}>
              License
            </Text>
            <Text mb={2}>
              This tool is released under the{" "}
              <Link
                href="https://en.wikipedia.org/wiki/MIT_License"
                isExternal
                color="blue.500"
                textDecoration="underline"
              >
                MIT License
              </Link>{" "}
              - Feel free to use this tool with credit, in accordance with the
              terms of the license.
            </Text>
            <Text fontWeight="bold" mb={2} mt={4}>
              Citation
            </Text>
            <Text mb={2}>
              If you use this tool in your work, please cite the following
              paper:
              <br />
              XXXXX, YYYYY, ZZZZZ. (Year). <i>Journal Name</i>.
            </Text>
            <Box
              bg="yellow.100"
              borderLeft="4px solid"
              borderColor="yellow.500"
              p={3}
              mb={4}
              fontSize="sm"
            >
              <strong>⚠️ Important:</strong> If you are referencing the ABC
              model itself, please cite the original physiological and comfort
              model publications in{" "}
              <Link
                href="https://cbe-berkeley.gitbook.io/advanced-berkeley-comfort-abc-model/references/list-of-references"
                isExternal
                color="blue.500"
                textDecoration="underline"
              >
                this list of references
              </Link>{" "}
              (not the paper above).
            </Box>

            {/* Reference Section */}
            <Text fontWeight="bold" mb={2} mt={4}>
              Reference
            </Text>
            <ul style={{ marginLeft: "1em", marginBottom: "1em" }}>
              <li>
                <Link
                  href="https://cbe-berkeley.gitbook.io/advanced-berkeley-comfort-abc-model/documentation/web-interface"
                  isExternal
                  color="blue.500"
                  textDecoration="underline"
                >
                  How to Use This Web Tool
                </Link>
              </li>
              <li>
                <Link
                  href="https://cbe-berkeley.gitbook.io/advanced-berkeley-comfort-abc-model/help-and-faqs/faqs"
                  isExternal
                  color="blue.500"
                  textDecoration="underline"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="https://cbe-berkeley.gitbook.io/advanced-berkeley-comfort-abc-model/references/list-of-references"
                  isExternal
                  color="blue.500"
                  textDecoration="underline"
                >
                  List of References
                </Link>
              </li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={2} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AboutModal;
