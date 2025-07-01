import { graphsVals, listOfParameters } from "@/constants/constants";
import {
  Button,
  HStack,
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
  Spacer,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import { personalComfortSystem } from "@/constants/constants";

export default function EditModal({
  disclosure,
  currentlyEditing,
  params,
  ind,
  setParams,
  isMetric,
}) {
  const uploadMRTJson = (uploadedFile) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        const data = JSON.parse(fileReader.result).results;

        let newState = [...params];
        for (let i = 0; i < data.segment_data.length; i++) {
          newState[ind][optionRendererObj.val][i] = data.segment_data[i].mrt;
        }
        setParams(newState);
      } catch (e) {
        console.log("error");
      }
    };
    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
  };

  const optionRendererObj = listOfParameters(isMetric)[currentlyEditing];
  return (
    <Modal
      isCentered
      isOpen={disclosure.isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onClose={disclosure.onClose}
    >
      <ModalOverlay />
      <ModalContent maxW="90%" maxH="90%" overflowY="scroll">
        <ModalHeader>Edit {optionRendererObj.title.toLowerCase()}</ModalHeader>
        <Box
          backgroundColor="yellow.100"
          borderLeft="4px solid #ECC94B"
          padding="8px"
          marginX="20px"
          borderRadius="md"
        >
          <Text color="gray.700">
            Use the "Apply to all" button to assign the same value to all
            body parts for a uniform environment. To create a non-uniform
            environment, you can either use the "Stratify" buttons or manually
            adjust each value.
          </Text>
        </Box>
        <ModalBody marginTop={5}>
          <HStack justifyContent="center" spacing={8}>
            <HStack>
              <NumberInput
                w="7vw"
                allowMouseWheel
                backgroundColor="white"
                type="number"
                textAlign="right"
                value={
                  isMetric
                    ? params[ind][optionRendererObj.tempKey]
                    : optionRendererObj.conversionFunction(
                        params[ind][optionRendererObj.tempKey]
                      )
                }
                onChange={(e) => {
                  let newState = [...params];
                  newState[ind][optionRendererObj.tempKey] = isMetric
                    ? e.toString()
                    : optionRendererObj.reverseConversionFunction(e).toString();
                  setParams(newState);
                }}
                min={0}
                max={isMetric ? 100 : optionRendererObj.conversionFunction(100)}
                precision={optionRendererObj.precision}
                step={optionRendererObj.step}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text>{optionRendererObj.unit}</Text>
              <Button
                colorScheme="blue"
                onClick={() => {
                  let newState = [...params];
                  newState[ind][optionRendererObj.val] = Array(16).fill(
                    params[ind][optionRendererObj.tempKey].toString()
                  );
                  setParams(newState);
                }}
              >
                Apply to all
              </Button>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Optional:</Text>
              <NumberInput
                w="6vw"
                allowMouseWheel
                backgroundColor="white"
                textAlign="right"
                defaultValue={params[ind][optionRendererObj.deltaKey]}
                onChange={(e) => {
                  let newState = [...params];
                  newState[ind][optionRendererObj.deltaKey] = e.toString();
                  setParams(newState);
                }}
                // min={-100}
                // max={100}
                step={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text>Δ delta</Text>
              <Button
                onClick={() => {
                  let newState = [...params],
                    newArray = [];
                  for (let i = 0; i < 16; i++) {
                    newArray.push(
                      (
                        parseFloat(params[ind][optionRendererObj.tempKey]) +
                        parseFloat(params[ind][optionRendererObj.deltaKey]) *
                          (1 - graphsVals[i + 1].stand)
                      ).toString()
                    );
                  }
                  newState[ind][optionRendererObj.val] = newArray;
                  setParams(newState);
                }}
              >
                Stratify standing
              </Button>
              <Button
                onClick={() => {
                  let newState = [...params],
                    newArray = [];
                  for (let i = 0; i < 16; i++) {
                    newArray.push(
                      (
                        parseFloat(params[ind][optionRendererObj.tempKey]) +
                        parseFloat(params[ind][optionRendererObj.deltaKey]) *
                          (1 - graphsVals[i + 1].sit)
                      ).toString()
                    );
                  }
                  newState[ind][optionRendererObj.val] = newArray;
                  setParams(newState);
                }}
              >
                Stratify sitting
              </Button>
            </HStack>
            <HStack justifyContent="center">
              {optionRendererObj.key == "MRT" ? (
                <label
                  htmlFor="mrtJSON"
                  style={{ width: "fit-content", cursor: "pointer" }}
                >
                  <input
                    type="file"
                    accept=".json"
                    name="mrtJSON"
                    id="mrtJSON"
                    style={{ display: "none", cursor: "default" }}
                    onChange={(e) => uploadMRTJson(e.target.files[0])}
                  />
                  <div className={styles.mrtJSONBtn}>
                    <p>Import from MRT JSON file</p>
                  </div>
                </label>
              ) : (
                <></>
              )}
            </HStack>
          </HStack>
          <HStack w="100%" justifyContent="center" spacing={8} marginTop={10}>
            {params[ind][optionRendererObj.val].map((value, indx) => {
              if (indx < 8)
                return (
                  <VStack key={indx}>
                    <Text>{graphsVals[indx + 1].label}</Text>
                    <NumberInput
                      w="7vw"
                      allowMouseWheel
                      backgroundColor="white"
                      type="number"
                      textAlign="right"
                      value={
                        isMetric
                          ? parseFloat(value)
                          : optionRendererObj
                              .conversionFunction(parseFloat(value))
                              .toFixed(1) // Round to 1 decimal place for fpm
                      }
                      onChange={(e) => {
                        let newState = [...params];
                        newState[ind][optionRendererObj.val][indx] = isMetric
                          ? e.toString()
                          : optionRendererObj
                              .reverseConversionFunction(e)
                              .toString();
                        setParams(newState);
                      }}
                      min={0}
                      max={
                        isMetric
                          ? 100
                          : optionRendererObj.conversionFunction(100)
                      }
                      precision={optionRendererObj.precision}
                      step={optionRendererObj.step}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {["v", "ta", "mrt"].includes(optionRendererObj.pcsKey) ? (
                      <Text color="red">
                        +
                        {isMetric
                          ? [...params[ind].personal_comfort_system]
                              .reduce(
                                (partialSum, increase) =>
                                  partialSum +
                                  personalComfortSystem[increase][
                                    optionRendererObj.pcsKey
                                  ][indx],
                                0
                              )
                              .toFixed(1)
                          : [...params[ind].personal_comfort_system]
                              .reduce(
                                (partialSum, increase) =>
                                  partialSum +
                                  optionRendererObj.conversionFunctionIncr(
                                    personalComfortSystem[increase][
                                      optionRendererObj.pcsKey
                                    ][indx]
                                  ),
                                0
                              )
                              .toFixed(1)}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </VStack>
                );
            })}
          </HStack>
          <HStack w="100%" justifyContent="center" spacing={8} marginTop={5}>
            {params[ind][optionRendererObj.val].map((value, indx) => {
              if (indx >= 8)
                return (
                  <VStack key={indx}>
                    <Text>{graphsVals[indx + 1].label}</Text>
                    <NumberInput
                      w="7vw"
                      allowMouseWheel
                      backgroundColor="white"
                      type="number"
                      textAlign="right"
                      value={
                        isMetric
                          ? parseFloat(value)
                          : optionRendererObj
                              .conversionFunction(parseFloat(value))
                              .toFixed(1) // Round to 1 decimal place for fpm
                      }
                      onChange={(e) => {
                        let newState = [...params];
                        newState[ind][optionRendererObj.val][indx] = isMetric
                          ? e.toString()
                          : optionRendererObj
                              .reverseConversionFunction(e)
                              .toString();
                        setParams(newState);
                      }}
                      min={0}
                      max={
                        isMetric
                          ? 100
                          : optionRendererObj.conversionFunction(100)
                      }
                      precision={optionRendererObj.precision}
                      step={optionRendererObj.step}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {["v", "ta", "mrt"].includes(optionRendererObj.pcsKey) ? (
                      <Text color="red">
                        +
                        {isMetric
                          ? [...params[ind].personal_comfort_system]
                              .reduce(
                                (partialSum, increase) =>
                                  partialSum +
                                  personalComfortSystem[increase][
                                    optionRendererObj.pcsKey
                                  ][indx],
                                0
                              )
                              .toFixed(1)
                          : [...params[ind].personal_comfort_system]
                              .reduce(
                                (partialSum, increase) =>
                                  partialSum +
                                  optionRendererObj.conversionFunctionIncr(
                                    personalComfortSystem[increase][
                                      optionRendererObj.pcsKey
                                    ][indx]
                                  ),
                                0
                              )
                              .toFixed(1)}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </VStack>
                );
            })}
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack w="100%" justifyContent="end">
            {["v", "ta", "mrt"].includes(optionRendererObj.pcsKey) ? (
              <Text color="red">
                Contributions in red are from the personal comfort system.
              </Text>
            ) : (
              <></>
            )}
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
  );
}
