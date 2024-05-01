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

export default function EditModal({
    disclosure,
    params,
    ind,
    setParams,
    conditionParams,
    toast,
  }) {
    const handleFileChangeAndUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            const fileContent = await readFileContent(file);
            const jsonData = JSON.parse(fileContent);
    
            handleParsedJson(jsonData);
          } catch(error) {
            console.error('Error parsing JSON file', error);
          }
        }
        else {
          console.warn('Please select a file')
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
        console.log(phase);
        let updatedParams = [];
        for (let j = 0; j < phase.length; j++) {
          const format = ["Head", "Chest", "Back", "Pelvis", "Left Upper Arm", "Right Upper Arm", "Left Lower Arm", "Right Lower Arm", "Left Hand", "Right Hand", "Left Thigh", "Right Thigh", "Left Lower Leg", "Right Lower Leg", "Left Foot", "Right Foot"]
          const newObj = conditionParams(j+1)
          newObj.condition_name = "Condition #" + (j+1).toString();
          newObj.exposure_duration = phase[j].end_time - phase[j].start_time;
          newObj.met_activity_name = phase[j].met_activity_name;
          newObj.met_activity_value = String(phase[j].met);
          newObj.relative_humidity = format.map((e) => (phase[j].segment_data[e].rh))
          newObj.air_speed = format.map((e) => (String(phase[j].segment_data[e].v)))
          newObj.air_temperature = format.map((e) => (String(phase[j].segment_data[e].ta)))
          newObj.radiant_temperature = format.map((e) => (String(phase[j].segment_data[e].mrt)))
          let temp_ensemble = clo_correspondence.find(ensemble => (ensemble.ensemble_name === phase[j].clo_ensemble_name));
          if (temp_ensemble == null) {
            toast.closeAll();
              toast({
                title: "The clothing ensemble name in your file is not supported.",
                status: "warning",
                duration: 2000,
                isClosable: true,
                position: "top",
              });
              return;
          }
          newObj.clo_value = String(temp_ensemble.whole_body.iclo)
          newObj.ramp = phase[j].ramp;
          updatedParams.push(newObj);
        };
        setParams(updatedParams);
      }

      return (
         <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
                <ModalContent>
                <ModalHeader>Upload Parameter</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <input type="file" id="paramupload" name="parameterjson" accept=".json" />
                </ModalBody>
                <ModalFooter>
                    <Button
                    backgroundColor={"#3ebced"}
                    textColor={"white"}
                    colorScheme="blue"
                    onClick = {async () => {
                        const fileInput = document.getElementById("paramupload");
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                        await handleFileChangeAndUpload({target: { files : [fileInput.files[0]]}})
                        disclosure.onClose();
                        } else {
                            console.warn("Please select a file")
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