import { CloseIcon } from "@chakra-ui/icons";
import { IconButton, Button, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import { getSaveFilePicker } from "@/constants/helperFunctions";

const commonButtonStyle = {
  textColor: "gray.600",
  bgColor: "white",
  borderWidth: 2,
  colorScheme: "gray",
};

export default function CloseButton({ params, ind, setParams, setIndex }) {
  return (
    <IconButton
      w="5%"
      colorScheme="red"
      icon={<CloseIcon />}
      isDisabled={params.length == 1}
      onClick={() => {
        let tempParams = [...params];
        tempParams.splice(ind, 1);
        setParams(tempParams);
        setIndex(Math.max(0, ind - 1));
      }}
    />
  );
}

export const SimulateButton = ({ onClick }) => {
  return (
    <Tooltip label="Run simulation with current settings" hasArrow>
      <Button
        backgroundColor={"cbe.Blue"}
        color={"white"}
        colorScheme="blue"
        alignSelf="center"
        onClick={onClick}
      >
        Simulate
      </Button>
    </Tooltip>
  );
};

export const UploadJSONButton = ({ onClick }) => {
  return (
    <Tooltip label="Upload a JSON file with input settings" hasArrow>
      <Button
        {...commonButtonStyle}
        onClick={onClick}
      >
        Open
      </Button>
    </Tooltip>
  );
};
export const UploadCSVButton = ({ onClick }) => {
  return (
    <Tooltip label="Upload a CSV file with input settings" hasArrow>
      <Button
        {...commonButtonStyle}
        onClick={onClick}
      >
        Upload CSV
      </Button>
    </Tooltip>
  );
};

export const SaveJSONButton = ({
  params,
  cloTable,
  bodybuilderObj,
  personalComfortSystem,
}) => {
  return (
    <Tooltip label="Download simulation results as a JSON file" hasArrow>
      <Button
        {...commonButtonStyle}
        onClick={async () => {
          let phases = [];
          let currTimer = 0;
          for (let i = 0; i < params.length; i++) {
            let temp_condition_name = params[i].condition_name;
            let temp_duration = params[i].exposure_duration;
            let temp_met_activity_name = "Custom-defined Met Activity";
            let temp_met_activity_value = parseFloat(params[i].met_value);
            let temp_relative_humidity = params[i].relative_humidity.map(
              function (x) {
                return parseFloat(x) / 100;
              }
            );
            let temp_air_speed = params[i].air_speed.map(Number);
            let temp_air_temperature = params[i].air_temperature.map(Number);
            let temp_radiant_temperature =
              params[i].radiant_temperature.map(Number);
            let temp_clo_ensemble_name =
              cloTable[parseInt(params[i].clo_value)].ensemble_name;
            let pcs = [];
            for (let j = 0; j < personalComfortSystem.length; j++) {
              if (params[i].personal_comfort_system.has(j)) {
                pcs.push(personalComfortSystem[j].name);
              }
            }
            phases.push({
              condition_name: temp_condition_name,
              start_time: currTimer,
              time_units: "minutes",
              ramp: params[i].ramp,
              end_time: currTimer + temp_duration,
              met_activity_name: temp_met_activity_name,
              met: temp_met_activity_value,
              personal_comfort_system: pcs,
              default_data: {
                rh:
                  temp_relative_humidity.reduce((a, b) => a + b) /
                  (temp_relative_humidity.length * 100),
                v:
                  temp_air_speed.reduce((a, b) => a + b) /
                  temp_air_speed.length,
                solar: 0,
                ta:
                  temp_air_temperature.reduce((a, b) => a + b) /
                  temp_air_temperature.length,
                mrt:
                  temp_radiant_temperature.reduce((a, b) => a + b) /
                  temp_radiant_temperature.length,
              },
              clo_ensemble_name: temp_clo_ensemble_name,
              segment_data: {
                Head: {
                  mrt: temp_radiant_temperature[0],
                  rh: temp_relative_humidity[0],
                  solar: 0,
                  ta: temp_air_temperature[0],
                  v: temp_air_speed[0],
                },
                Chest: {
                  mrt: temp_radiant_temperature[1],
                  rh: temp_relative_humidity[1],
                  solar: 0,
                  ta: temp_air_temperature[1],
                  v: temp_air_speed[1],
                },
                Back: {
                  mrt: temp_radiant_temperature[2],
                  rh: temp_relative_humidity[2],
                  solar: 0,
                  ta: temp_air_temperature[2],
                  v: temp_air_speed[2],
                },
                Pelvis: {
                  mrt: temp_radiant_temperature[3],
                  rh: temp_relative_humidity[3],
                  solar: 0,
                  ta: temp_air_temperature[3],
                  v: temp_air_speed[3],
                },
                "Left Upper Arm": {
                  mrt: temp_radiant_temperature[4],
                  rh: temp_relative_humidity[4],
                  solar: 0,
                  ta: temp_air_temperature[4],
                  v: temp_air_speed[4],
                },
                "Right Upper Arm": {
                  mrt: temp_radiant_temperature[5],
                  rh: temp_relative_humidity[5],
                  solar: 0,
                  ta: temp_air_temperature[5],
                  v: temp_air_speed[5],
                },
                "Left Lower Arm": {
                  mrt: temp_radiant_temperature[6],
                  rh: temp_relative_humidity[6],
                  solar: 0,
                  ta: temp_air_temperature[6],
                  v: temp_air_speed[6],
                },
                "Right Lower Arm": {
                  mrt: temp_radiant_temperature[7],
                  rh: temp_relative_humidity[7],
                  solar: 0,
                  ta: temp_air_temperature[7],
                  v: temp_air_speed[7],
                },
                "Left Hand": {
                  mrt: temp_radiant_temperature[8],
                  rh: temp_relative_humidity[8],
                  solar: 0,
                  ta: temp_air_temperature[8],
                  v: temp_air_speed[8],
                },
                "Right Hand": {
                  mrt: temp_radiant_temperature[9],
                  rh: temp_relative_humidity[9],
                  solar: 0,
                  ta: temp_air_temperature[9],
                  v: temp_air_speed[9],
                },
                "Left Thigh": {
                  mrt: temp_radiant_temperature[10],
                  rh: temp_relative_humidity[10],
                  solar: 0,
                  ta: temp_air_temperature[10],
                  v: temp_air_speed[10],
                },
                "Right Thigh": {
                  mrt: temp_radiant_temperature[11],
                  rh: temp_relative_humidity[11],
                  solar: 0,
                  ta: temp_air_temperature[11],
                  v: temp_air_speed[11],
                },
                "Left Lower Leg": {
                  mrt: temp_radiant_temperature[12],
                  rh: temp_relative_humidity[12],
                  solar: 0,
                  ta: temp_air_temperature[12],
                  v: temp_air_speed[12],
                },
                "Right Lower Leg": {
                  mrt: temp_radiant_temperature[13],
                  rh: temp_relative_humidity[13],
                  solar: 0,
                  ta: temp_air_temperature[13],
                  v: temp_air_speed[13],
                },
                "Left Foot": {
                  mrt: temp_radiant_temperature[14],
                  rh: temp_relative_humidity[14],
                  solar: 0,
                  ta: temp_air_temperature[14],
                  v: temp_air_speed[14],
                },
                "Right Foot": {
                  mrt: temp_radiant_temperature[15],
                  rh: temp_relative_humidity[15],
                  solar: 0,
                  ta: temp_air_temperature[15],
                  v: temp_air_speed[15],
                },
              },
            });
            currTimer += temp_duration;
          }
          let phasesToPass = [];
          for (let i = 0; i < params.length; i++) {
            phasesToPass.push({
              exposure_duration: params[i].exposure_duration,
              met_activity_name: "Custom-defined Met Activity",
              ramp: params[i].ramp,
              met_activity_value: parseFloat(params[i].met_value),
              relative_humidity: params[i].relative_humidity.map(function (x) {
                return parseFloat(x) / 100;
              }),
              air_speed: params[i].air_speed.map(Number),
              air_temperature: params[i].air_temperature.map(Number),
              radiant_temperature: params[i].radiant_temperature.map(Number),
              clo_ensemble_name:
                cloTable[parseInt(params[i].clo_value)].ensemble_name,
            });
          }
          let bodyb = bodybuilderObj;
          let clothing = cloTable;
          const resultsToPass = await axios
            .post("/api/process", {
              // Chaining of data is intentional
              phases: phasesToPass,
              bodyb,
              clothing,
              raw: true,
            })
            .then((res) => {
              return res.data;
            });
          const obj = {
            name: "CBE Interface Test",
            description: "Prototype testing requests",
            reference_time: new Date(),
            output_freq: 60,
            options: {
              csvOutput: false,
              sensation_adaptation: false,
              sensation_coredTdt: false,
              ignore_segments: false,
              ignore_physiology: false,
              neutralSimulationOutput: false,
            },
            phases: phases,
            clothing: cloTable,
            results: resultsToPass,
          };
          try {
            const fh = await getSaveFilePicker();
            const writeable = await fh.createWritable();
            await writeable.write(
              new Blob([JSON.stringify(obj, undefined, 2)], {
                type: "application/json",
              })
            );
            await writeable.close();
          } catch (e) {
            alert(e);
          }
        }}
      >
        Save
      </Button>
    </Tooltip>
  );
};

export const CompareToggleButton = ({
  isComparing,
  setComparing,
  setComparedResults,
  setFullDataCompare,
  setDataCompare,
  runSimulationManager,
  isMetric,
  setInComparingUploadModal,
  uploadModal,
}) => {
  return (
    <Tooltip label="Compare current result with uploaded data" hasArrow>
    <Button
      {...commonButtonStyle}
      onClick={() => {
        if (isComparing) {
          setComparing(false);
          setComparedResults();
          setFullDataCompare([]);
          setDataCompare([]);
          runSimulationManager(isMetric, false);
        } else {
          setInComparingUploadModal(true);
          uploadModal.onOpen();
        }
      }}
    >
      {isComparing ? "Remove comparison" : "Compare"}
    </Button>
    </Tooltip>
  );
};

export const AdvancedSettingButton = ({ onClick }) => {
  return (
    <Tooltip label="Open advanced simulation settings" hasArrow>
      <Button
        {...commonButtonStyle}
        onClick={onClick}
      >
        Advanced
      </Button>
    </Tooltip>
  );
};