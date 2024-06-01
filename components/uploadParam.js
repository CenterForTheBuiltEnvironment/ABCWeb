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
  ModalCloseButton,
} from "@chakra-ui/react";
import clo_correspondence from "../reference/local clo input/clothing_ensembles.json";
import styles from "../styles/Home.module.css";

export default function UploadModal({
  disclosure,
  setParams,
  setMetIndex,
  toast,
  rKey,
}) {
  const handleFileChangeAndUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileContent = await readFileContent(file);
        const jsonData = JSON.parse(fileContent);

        handleParsedJson(jsonData);
      } catch (error) {
        console.error("Error parsing JSON file", error);
      }
    } else {
      console.warn("Please select a file");
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const handleParsedJson = (jsonData) => {
    let phase = jsonData.phases;
    let updatedParams = [];
    for (let j = 0; j < phase.length; j++) {
      const format = [
        "Head",
        "Chest",
        "Back",
        "Pelvis",
        "Left Upper Arm",
        "Right Upper Arm",
        "Left Lower Arm",
        "Right Lower Arm",
        "Left Hand",
        "Right Hand",
        "Left Thigh",
        "Right Thigh",
        "Left Lower Leg",
        "Right Lower Leg",
        "Left Foot",
        "Right Foot",
      ];
      let newObj = {};
      newObj.condition_name = phase[j].condition_name;
      newObj.exposure_duration = parseInt(
        phase[j].end_time - phase[j].start_time
      );
      newObj.met_activity_name = phase[j].met_activity_name;
      newObj.met_value = parseFloat(phase[j].met);
      setMetIndex(parseFloat(phase[j].met));
      newObj.relative_humidity = format.map(
        (e) => phase[j].segment_data[e].rh * 100
      );
      newObj.air_speed = format.map((e) => String(phase[j].segment_data[e].v));
      newObj.air_temperature = format.map((e) =>
        String(phase[j].segment_data[e].ta)
      );
      newObj.radiant_temperature = format.map((e) =>
        String(phase[j].segment_data[e].mrt)
      );
      let temp_ensemble = clo_correspondence.findIndex(
        (ensemble) => ensemble.ensemble_name === phase[j].clo_ensemble_name
      );
      const isEmpty = Object.values(newObj).every(
        (x) => x === null || x === ""
      );
      if (isEmpty) {
        toast.closeAll();
        toast({
          title: "A field in your file is invalid or not supported. Try again.",
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      newObj.clo_value = temp_ensemble;
      newObj.ramp = phase[j].ramp;
      updatedParams.push(newObj);
    }
    setParams(updatedParams);
    rKey(Math.random());
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Parameter</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <input
            type="file"
            id="paramupload"
            name="parameterjson"
            accept=".json"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            backgroundColor={"#3ebced"}
            textColor={"white"}
            colorScheme="blue"
            onClick={async () => {
              const fileInput = document.getElementById("paramupload");
              if (fileInput && fileInput.files && fileInput.files.length > 0) {
                await handleFileChangeAndUpload({
                  target: { files: [fileInput.files[0]] },
                });
                disclosure.onClose();
              } else {
                console.warn("Please select a file");
              }
            }}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
