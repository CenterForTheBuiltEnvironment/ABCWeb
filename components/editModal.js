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
  Text,
  VStack,
} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";

export default function EditModal({
  disclosure,
  currentlyEditing,
  params,
  ind,
  setParams,
}) {
  const uploadMRTJson = (uploadedFile) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        const data = JSON.parse(fileReader.result).results;

        let newState = [...params];
        for (let i = 0; i < data.segment_data.length; i++) {
          newState[ind][listOfParameters[currentlyEditing].val][i] =
            data.segment_data[i].mrt;
        }
        setParams(newState);
      } catch (e) {
        console.log("error");
      }
    };
    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
  };
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
        <ModalHeader>
          Edit {listOfParameters[currentlyEditing].title.toLowerCase()}
        </ModalHeader>
        <ModalBody>
          <HStack justifyContent="center">
            <NumberInput
              w="7vw"
              allowMouseWheel
              backgroundColor="white"
              type="number"
              textAlign="right"
              value={params[ind][listOfParameters[currentlyEditing].tempKey]}
              onChange={(e) => {
                let newState = [...params];
                newState[ind][listOfParameters[currentlyEditing].tempKey] =
                  parseFloat(e);
                setParams(newState);
              }}
              min={0}
              max={100}
              precision={listOfParameters[currentlyEditing].precision}
              step={listOfParameters[currentlyEditing].step}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text>{listOfParameters[currentlyEditing].unit}</Text>
            <NumberInput
              w="6vw"
              allowMouseWheel
              backgroundColor="white"
              textAlign="right"
              value={params[ind][listOfParameters[currentlyEditing].deltaKey]}
              onChange={(e) => {
                let newState = [...params];
                newState[ind][listOfParameters[currentlyEditing].deltaKey] =
                  parseFloat(e);
                setParams(newState);
              }}
              min={-100}
              max={100}
              step={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text>% delta</Text>
            <Button
              colorScheme="yellow"
              onClick={() => {
                let newState = [...params];
                newState[ind][listOfParameters[currentlyEditing].val] = Array(
                  16
                ).fill(params[ind][listOfParameters[currentlyEditing].tempKey]);
                setParams(newState);
              }}
            >
              Apply to all
            </Button>
            <Button
              onClick={() => {
                let newState = [...params],
                  newArray = [];
                for (let i = 0; i < 16; i++) {
                  newArray.push(
                    params[ind][listOfParameters[currentlyEditing].tempKey] +
                      (params[ind][
                        listOfParameters[currentlyEditing].deltaKey
                      ] /
                        100) *
                        (1 - graphsVals[i + 1].stand)
                  );
                }
                newState[ind][listOfParameters[currentlyEditing].val] =
                  newArray;
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
                    params[ind][listOfParameters[currentlyEditing].tempKey] +
                      (params[ind][
                        listOfParameters[currentlyEditing].deltaKey
                      ] /
                        100) *
                        (1 - graphsVals[i + 1].sit)
                  );
                }
                newState[ind][listOfParameters[currentlyEditing].val] =
                  newArray;
                setParams(newState);
              }}
            >
              Stratify sitting
            </Button>
          </HStack>
          <HStack justifyContent="center" mt={3}>
            {listOfParameters[currentlyEditing].key == "MRT" ? (
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
          <HStack w="100%" justifyContent="center" spacing={8} margin={2}>
            {params[ind][listOfParameters[currentlyEditing].val].map(
              (value, indx) => {
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
                        value={value}
                        onChange={(e) => {
                          let newState = [...params];
                          newState[ind][listOfParameters[currentlyEditing].val][
                            indx
                          ] = parseFloat(e);
                          setParams(newState);
                        }}
                        min={0}
                        max={100}
                        precision={listOfParameters[currentlyEditing].precision}
                        step={listOfParameters[currentlyEditing].step}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </VStack>
                  );
              }
            )}
          </HStack>
          <HStack w="100%" justifyContent="center" spacing={8} margin={2}>
            {params[ind][listOfParameters[currentlyEditing].val].map(
              (value, indx) => {
                if (indx >= 8)
                  return (
                    <VStack>
                      <Text>{graphsVals[indx + 1].label}</Text>
                      <NumberInput
                        w="7vw"
                        allowMouseWheel
                        backgroundColor="white"
                        type="number"
                        textAlign="right"
                        value={value}
                        onChange={(e) => {
                          let newState = [...params];
                          newState[ind][listOfParameters[currentlyEditing].val][
                            indx
                          ] = parseFloat(e);
                          setParams(newState);
                        }}
                        min={0}
                        max={100}
                        precision={listOfParameters[currentlyEditing].precision}
                        step={listOfParameters[currentlyEditing].step}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </VStack>
                  );
              }
            )}
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack w="100%" justifyContent="end">
            <Text fontWeight="bold">Changes are automatically saved.</Text>
            <Button
              colorScheme="yellow"
              textColor="#007AFF"
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
