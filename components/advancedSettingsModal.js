import {
  advancedSettingsArr,
  graphsVals,
  listOfParameters,
} from "@/constants/constants";
import {
  Button,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function AdvancedSettingsModal({
  disclosure,
  bbParams,
  ind,
  setAdvIndex,
  setbbParams,
  params,
  setParams,
}) {
  let [componentArr, setCompArr] = useState([BodyBuilderChanger()]);

  function BodyBuilderChanger() {
    return (
      <VStack alignItems={"left"} margin={"15px"}>
        <HStack spacing={2}>
          <Text fontWeight="bold">Height: </Text>
          <Input value={bbParams.height} />
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold">Weight: </Text>
          <Text>Hello</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold">Age: </Text>
          <Text>Hello</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold">Gender: </Text>
          <Text>Hello</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold">Body fat: </Text>
          <Text>Hello</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold">Skin color: </Text>
          <Text>Hello</Text>
        </HStack>
      </VStack>
    );
  }

  return (
    <>
      {componentArr.length == 0 ? (
        <></>
      ) : (
        <Modal
          isCentered
          isOpen={disclosure.isOpen}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          onClose={disclosure.onClose}
        >
          <ModalOverlay />
          <ModalContent maxW="90%" maxH="90%" overflowY="scroll">
            <ModalHeader textAlign={"center"}>Advanced Settings</ModalHeader>
            <ModalBody>
              <HStack w="90%" overflowY={"scroll"} spacing={3}>
                {advancedSettingsArr.map((elem, indx) => {
                  return (
                    <Button
                      key={indx}
                      minW="110px"
                      backgroundColor={ind == indx ? "#1b75bc" : "#3ebced"}
                      textColor="white"
                      colorScheme="blue"
                      onClick={() => {
                        if (ind == indx) return false;
                        else setAdvIndex(indx);
                      }}
                    >
                      {advancedSettingsArr[indx]}
                    </Button>
                  );
                })}
              </HStack>
              <div style={{ width: "100%" }}>{componentArr[ind]}</div>
            </ModalBody>
            <ModalFooter>
              <HStack w="100%" justifyContent="center">
                <Text fontWeight="bold">Changes are automatically saved.</Text>
                <Button
                  colorScheme="blue"
                  backgroundColor={"#3ebced"}
                  textColor={"white"}
                  ml={2}
                  onClick={disclosure.onClose}
                >
                  Done
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
