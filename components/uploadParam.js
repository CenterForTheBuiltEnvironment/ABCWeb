import { personalComfortSystem } from "@/constants/constants";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

export default function UploadModal({
  disclosure,
  setParams,
  cloTable,
  setCloTable,
  setMetIndex,
  toast,
  isUploadingForComparison,
  setIsUploadingForComparison,
  comparedResults,
  setComparedResults,
  setComparing,
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
    let clothing = jsonData.clothing;
    let updatedParams = [];

    // check clothing ensembles
    let newCloObj = cloTable;
    let needToAppendLater = [];
    for (let i = 0; i < clothing.length; i++) {
      if (
        cloTable.some((e) => JSON.stringify(e) == JSON.stringify(clothing[i]))
      )
        continue;
      if (cloTable.some((e) => e.ensemble_name == clothing[i].ensemble_name)) {
        // means need to append a new one
        needToAppendLater.push(clothing[i].ensemble_name);
        // now add that to all of the clo_ensemble_names in user-uploaded phases
        for (let j = 0; j < phase.length; j++) {
          if (phase[j].clo_ensemble_name == clothing[i].ensemble_name) {
            phase[j].clo_ensemble_name += "-asUploadedParameter";
          }
        }
        clothing[i].ensemble_name += "-asUploadedParameter";
        newCloObj.push(clothing[i]);
      } else {
        // just create a new clothing and add it to cloTable
        newCloObj.push(clothing[i]);
      }
    }

    setCloTable(newCloObj);

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

      const newPcs = new Set();
      for (let k = 0; k < personalComfortSystem.length; k++) {
        if (
          phase[j].personal_comfort_system.includes(
            personalComfortSystem[k].name
          )
        ) {
          newPcs.add(k);
        }
      }

      newObj.personal_comfort_system = newPcs;

      let temp_ensemble = newCloObj.findIndex((ensemble) => {
        return ensemble.ensemble_name === phase[j].clo_ensemble_name;
      });

      const isEmpty =
        temp_ensemble == -1 ||
        Object.values(newObj).every((x) => x === null || x === "");
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

    setComparing(true);
    if (isUploadingForComparison) {
      setComparedResults(updatedParams);
      toast.closeAll();
      toast({
        title:
          "Your file for comparison was successfully uploaded! Try simulating again.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      setParams(updatedParams);
    }
    setIsUploadingForComparison(false);
    rKey(Math.random());
  };

  return (
    <Modal
      isCentered
      isOpen={disclosure.isOpen}
      onClose={() => {
        setIsUploadingForComparison(false);
        disclosure.onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent maxW="70vw">
        <ModalHeader>
          Upload Parameter {isUploadingForComparison ? "(comparison)" : ""}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody w="100%">
          <input
            type="file"
            id="paramupload"
            name="parameterjson"
            accept=".json"
          />
          <Text marginTop="10px">
            (Running into an error? Check that your clothing ensemble name is
            correct and that other fields are nonempty.)
          </Text>
          {isUploadingForComparison ? (
            <Alert status="info" mt="10px">
              To simulate later on, you will need to match the same number of
              Conditions as your uploaded comparison file.
            </Alert>
          ) : (
            <></>
          )}
          {isUploadingForComparison && comparedResults ? (
            <Alert status="warning" mt="10px">
              <AlertIcon />
              <AlertTitle>You already have an active comparison!</AlertTitle>
              <AlertDescription>
                Uploading a new file for comparison will overwrite your current
                comparison file.
              </AlertDescription>
            </Alert>
          ) : (
            <></>
          )}
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
                toast.closeAll();
                toast({
                  title: "Please select a file.",
                  status: "warning",
                  duration: 2000,
                  isClosable: true,
                  position: "top",
                });
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
