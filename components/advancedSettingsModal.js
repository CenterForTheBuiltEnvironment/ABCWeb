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
  const [componentArr, setCompArr] = useState([<BodyBuilderChanger />]);

  function BodyBuilderChanger() {
    const isValidHeight = (height) =>
      !isNaN(height) && height >= 1 && height <= 3;
    const isValidWeight = (weight) =>
      !isNaN(weight) && weight >= 25 && weight <= 200;
    const isValidAge = (age) => !isNaN(age) && age >= 5 && age <= 100;
    const isValidGender = (gender) => gender == "male" || gender == "female";
    const isValidBf = (bf) => !isNaN(bf) && bf >= 0.01 && bf <= 0.9;
    const isValidSkinColor = (sk) =>
      sk == "white" || sk == "brown" || sk == "black";

    const isValidChangeToParams = (params) => {
      let { height, weight, age, gender, body_fat, skin_color } = params;
      return (
        isValidHeight(parseFloat(height)) &&
        isValidWeight(parseFloat(weight)) &&
        isValidAge(parseInt(age)) &&
        isValidGender(gender) &&
        isValidBf(parseFloat(body_fat)) &&
        isValidSkinColor(skin_color)
      );
    };

    const prospectiveParams = bbParams;

    return (
      <VStack alignItems={"left"} margin={"15px"} spacing={2}>
        <Text>Please do not include units when you enter values.</Text>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Height:{" "}
          </Text>
          <Input
            w="300px"
            placeholder={bbParams.height + " m"}
            onChange={(e) => {
              prospectiveParams.height = parseFloat(e.target.value);
            }}
          />
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Weight:{" "}
          </Text>
          <Input
            w="300px"
            placeholder={bbParams.weight + " kg"}
            onChange={(e) => {
              prospectiveParams.weight = parseFloat(e.target.value);
            }}
          />
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Age:{" "}
          </Text>
          <Input
            w="300px"
            placeholder={bbParams.age + " years old"}
            onChange={(e) => {
              prospectiveParams.age = parseInt(e.target.value);
            }}
          />
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Gender:{" "}
          </Text>
          <Input
            w="300px"
            placeholder={bbParams.gender}
            onChange={(e) => {
              prospectiveParams.gender = e.target.value.trim().toLowerCase();
            }}
          />
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Body fat:{" "}
          </Text>
          <Input
            w="300px"
            placeholder={bbParams.body_fat}
            onChange={(e) => {
              prospectiveParams.body_fat = parseFloat(e.target.value);
            }}
          />
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Skin color:{" "}
          </Text>
          <Input
            w="300px"
            placeholder={bbParams.skin_color}
            onChange={(e) => {
              prospectiveParams.skin_color = e.target.value
                .trim()
                .toLowerCase();
            }}
          />
        </HStack>
        <Button
          maxW="200px"
          onClick={() => {
            if (isValidChangeToParams(prospectiveParams)) {
              setbbParams(prospectiveParams);
              alert("Successful save.");
            } else {
              alert("Invalid attempt to change parameters. Please try again.");
            }
          }}
          colorScheme="green"
        >
          Save parameters
        </Button>
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
                <Text>
                  Changes are NOT automatically saved. To save, click "Save."
                </Text>
                <Button
                  colorScheme="blue"
                  backgroundColor={"#3ebced"}
                  textColor={"white"}
                  ml={2}
                  onClick={() => {
                    disclosure.onClose();
                  }}
                >
                  Close
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
