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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export default function AdvancedSettingsModal({
  disclosure,
  bbParams,
  ind,
  setAdvIndex,
  setbbParams,
  params,
  setParams,
}) {
  const [componentArr, setCompArr] = useState([
    <BodyBuilderChanger key={"bodybuilder"} />,
  ]);

  function BodyBuilderChanger() {
    const isValidHeight = (height) =>
      !isNaN(height) && height >= 1 && height <= 3;
    const isValidWeight = (weight) =>
      !isNaN(weight) && weight >= 25 && weight <= 200;
    const isValidAge = (age) => !isNaN(age) && age >= 5 && age <= 100;
    const isValidSex = (sex) => sex == "male" || sex == "female";
    const isValidBf = (bf) => !isNaN(bf) && bf >= 0.01 && bf <= 0.7;
    const isValidSkinColor = (sk) =>
      sk == "white" || sk == "brown" || sk == "black";

    const isValidChangeToParams = (params) => {
      let { height, weight, age, sex, body_fat, skin_color } = params;
      return (
        isValidHeight(parseFloat(height)) &&
        isValidWeight(parseFloat(weight)) &&
        isValidAge(parseInt(age)) &&
        isValidSex(sex) &&
        isValidBf(parseFloat(body_fat)) &&
        isValidSkinColor(skin_color)
      );
    };

    let prospectiveParams = bbParams;

    return (
      <VStack alignItems={"left"} margin={"15px"} spacing={2}>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Height:{" "}
          </Text>
          <NumberInput
            w="300px"
            allowMouseWheel
            backgroundColor="white"
            type="number"
            textAlign="right"
            defaultValue={prospectiveParams.height}
            onChange={(e) => {
              prospectiveParams.height = parseFloat(e);
            }}
            min={1}
            max={3}
            precision={2}
            step={0.01}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text> m</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Weight:{" "}
          </Text>
          <NumberInput
            w="300px"
            allowMouseWheel
            backgroundColor="white"
            type="number"
            textAlign="right"
            defaultValue={prospectiveParams.weight}
            onChange={(e) => {
              prospectiveParams.weight = parseFloat(e);
            }}
            min={25}
            max={200}
            precision={1}
            step={0.1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text> kg</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Age:{" "}
          </Text>
          <NumberInput
            w="300px"
            allowMouseWheel
            backgroundColor="white"
            type="number"
            textAlign="right"
            defaultValue={prospectiveParams.age}
            onChange={(e) => {
              prospectiveParams.age = parseInt(e);
            }}
            min={5}
            max={100}
            precision={0}
            step={1}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text> years old</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Sex:{" "}
          </Text>
          <Select
            w="300px"
            onChange={(e) => {
              prospectiveParams.sex = e.target.value.toString();
            }}
          >
            <option selected disabled>
              Current: {prospectiveParams.sex}
            </option>
            <option value="male">male</option>
            <option value="female">female</option>
          </Select>
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Body fat:{" "}
          </Text>
          <NumberInput
            w="300px"
            allowMouseWheel
            backgroundColor="white"
            type="number"
            textAlign="right"
            defaultValue={prospectiveParams.body_fat}
            onChange={(e) => {
              prospectiveParams.body_fat = parseFloat(e);
            }}
            min={0}
            max={0.7}
            precision={2}
            step={0.01}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text> fraction</Text>
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Skin color:{" "}
          </Text>
          <Select
            w="300px"
            onChange={(e) => {
              prospectiveParams.skin_color = e.target.value.toString();
            }}
          >
            <option selected disabled>
              Current: {prospectiveParams.skin_color}
            </option>
            <option value="white">white</option>
            <option value="brown">brown</option>
            <option value="black">black</option>
          </Select>
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
                  Changes are NOT automatically saved. To save, click &quot;Save
                  parameters.&quot;
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
