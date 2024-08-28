import { advancedSettingsArr, graphsVals } from "@/constants/constants";
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
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  cToF,
  fToC,
  kgToLbs,
  lbsToKg,
  mphToMs,
  msToMph,
} from "@/constants/helperFunctions";

export default function AdvancedSettingsModal({
  disclosure,
  bbParams,
  pcsParams,
  ind,
  setAdvIndex,
  setbbParams,
  setPcsParams,
  isMetric,
}) {
  const components = (metric) => {
    return [
      <BodyBuilderChanger key={"bodybuilder"} metric={metric} />,
      <PersonalComfortSystemChanger key={"pcs"} metric={metric} />,
    ];
  };

  const [componentArr, setCompArr] = useState([
    <BodyBuilderChanger key={"bodybuilder"} metric={isMetric} />,
    <PersonalComfortSystemChanger key={"pcs"} metric={isMetric} />,
  ]);

  useEffect(() => {
    setCompArr(components(isMetric));
  }, [isMetric]);

  function BodyBuilderChanger({ metric }) {
    const isValidHeight = (height) =>
      !isNaN(height) && height >= 1 && height <= 3;
    const isValidWeight = (weight) =>
      !isNaN(weight) && weight >= 25 && weight <= 200;
    const isValidAge = (age) => !isNaN(age) && age >= 5 && age <= 100;
    const isValidSex = (sex) => sex == "male" || sex == "female";
    const isValidBf = (bf) => !isNaN(bf) && bf >= 0.01 && bf <= 0.7;
    const isValidSkinColor = (sk) =>
      sk == "white" || sk == "brown" || sk == "black";

    const convertHeightToFeet = (heightInM) => {
      return Math.floor(heightInM * 3.28084);
    };
    const convertFeetToHeight = (heightInFeet) => {
      return heightInFeet * 0.3048;
    };
    const convertHeightToModInches = (heightInM) => {
      return Math.floor(heightInM * 39.3701) % 12;
    };
    const convertModInchesToHeight = (heightInModInches) => {
      return heightInModInches * 0.0254;
    };

    const [feet, setFeet] = useState(convertHeightToFeet(bbParams.height));
    const [inch, setInch] = useState(convertHeightToModInches(bbParams.height));

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
          {metric ? (
            <>
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
            </>
          ) : (
            <>
              <NumberInput
                w="300px"
                allowMouseWheel
                backgroundColor="white"
                type="number"
                textAlign="right"
                defaultValue={convertHeightToFeet(prospectiveParams.height)}
                onChange={(e) => {
                  prospectiveParams.height =
                    convertFeetToHeight(parseFloat(e)) +
                    convertModInchesToHeight(inch);
                  setFeet(parseFloat(e));
                }}
                min={0}
                max={10}
                precision={0}
                step={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text> ft</Text>
              <NumberInput
                w="300px"
                allowMouseWheel
                backgroundColor="white"
                type="number"
                textAlign="right"
                defaultValue={convertHeightToModInches(
                  prospectiveParams.height
                )}
                onChange={(e) => {
                  prospectiveParams.height =
                    convertFeetToHeight(feet) +
                    convertModInchesToHeight(parseFloat(e));
                  setInch(parseFloat(e));
                }}
                min={0}
                max={11}
                precision={0}
                step={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text> in</Text>
            </>
          )}
        </HStack>
        <HStack spacing={2}>
          <Text fontWeight="bold" w="100px">
            Weight:{" "}
          </Text>
          {metric ? (
            <>
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
            </>
          ) : (
            <>
              <NumberInput
                w="300px"
                allowMouseWheel
                backgroundColor="white"
                type="number"
                textAlign="right"
                defaultValue={kgToLbs(prospectiveParams.weight)}
                onChange={(e) => {
                  prospectiveParams.weight = lbsToKg(parseFloat(e));
                }}
                min={kgToLbs(25)}
                max={kgToLbs(200)}
                precision={1}
                step={0.1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Text> lb</Text>
            </>
          )}
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

  function PersonalComfortSystemChanger({ metric }) {
    const [tempPcsParams, setTempPcsParams] = useState(pcsParams);
    const [currPcsInd, setCurrPcsInd] = useState(0);

    useEffect(() => {}, [tempPcsParams]);

    return (
      <VStack alignItems={"left"} margin={"15px"} spacing={2}>
        <HStack marginLeft="-15px">
          {pcsParams.map((pcsElem, ind) => {
            return (
              <Button
                key={ind}
                minW="110px"
                backgroundColor={currPcsInd == ind ? "#1b75bc" : "#3ebced"}
                textColor="white"
                colorScheme="blue"
                onClick={() => {
                  setCurrPcsInd(ind);
                }}
              >
                {pcsElem.name}
              </Button>
            );
          })}
        </HStack>
        <HStack spacing={2} w="100%">
          {[
            {
              name: "Air speed offset",
              func: msToMph,
              reverseFunc: mphToMs,
              mUnit: "m/s",
              nmUnit: "mph",
            },
            {
              name: "Air temp offset",
              func: cToF,
              reverseFunc: fToC,
              mUnit: "°C",
              nmUnit: "°F",
            },
            {
              name: "Mean radiant temp offset",
              func: cToF,
              reverseFunc: fToC,
              mUnit: "°C",
              nmUnit: "°F",
            },
          ].map(({ name, func, reverseFunc, mUnit, nmUnit }, elemTypeInd) => {
            let objProp;
            if (elemTypeInd == 0) {
              objProp = "v";
            } else if (elemTypeInd == 1) {
              objProp = "ta";
            } else {
              objProp = "mrt";
            }
            return (
              <VStack w="33%" key={elemTypeInd + "offsetTextMapping"}>
                <Text fontWeight="bold" w="100%" textAlign="center">
                  {name} ({tempPcsParams[currPcsInd].name})
                </Text>
                {graphsVals.slice(1).map((bodyPart, bodyPartInd) => {
                  return (
                    <HStack w="100%" key={bodyPartInd + "graphValsMapping"}>
                      <Text w="60%" fontWeight="bold">
                        {bodyPart.label}
                      </Text>
                      <NumberInput
                        w="25%"
                        allowMouseWheel
                        backgroundColor="white"
                        type="number"
                        textAlign="right"
                        value={
                          metric
                            ? tempPcsParams[currPcsInd][objProp][
                                bodyPartInd
                              ].toFixed(1)
                            : func(
                                tempPcsParams[currPcsInd][objProp][bodyPartInd]
                              ).toFixed(1)
                        }
                        onChange={(e) => {
                          let nwState = [...tempPcsParams];
                          nwState[currPcsInd][objProp][bodyPartInd] = metric
                            ? parseFloat(e)
                            : reverseFunc(parseFloat(e));
                          setTempPcsParams(nwState);
                        }}
                        min={0}
                        precision={1}
                        step={0.1}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text w="15%">{metric ? mUnit : nmUnit}</Text>
                    </HStack>
                  );
                })}
              </VStack>
            );
          })}
        </HStack>
        <Button
          maxW="200px"
          onClick={() => {
            setPcsParams(tempPcsParams);
            alert("Successful save.");
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
