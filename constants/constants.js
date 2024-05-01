import { SpinnerIcon, StarIcon, SunIcon, TimeIcon } from "@chakra-ui/icons";
import { ImDroplet } from "react-icons/im";

export const met_auto = [
  {
    label: "Sleeping (0.8)",
    value: 0.8,
  },
  {
    label: "Sitting Quietly (1)",
    value: 1,
  },
  {
    label: "Standing Quietly (1.2)",
    value: 1.2,
  },
  {
    label: "Walking at 3.2 km/h (2)",
    value: 2,
  },
  {
    label: "Walking at 4.3 km/h (2.6)",
    value: 2.6,
  },
];

export const places = [
  1, 3, 4, 2, 2, 2, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5,
];

export const modes = [
  { label: "Comfort", value: "comfort" },
  {
    label: "Sensation",
    value: "sensation",
  },
  {
    label: "Skin Temperature",
    value: "tskin",
  },
  {
    label: "Core Temperature",
    value: "tcore",
  },
  {
    label: "Heat Flux Variables",
    value: "hflux",
  },
  {
    label: "Environment Variables",
    value: "environment",
  },
];

export const graphsVals = [
  { label: "Overall", value: 0 },
  { label: "Head", value: 1, stand: 1.0, sit: 1.0 },
  { label: "Chest", value: 2, stand: 0.82, sit: 0.77 },
  { label: "Back", value: 3, stand: 0.82, sit: 0.77 },
  { label: "Pelvis", value: 4, stand: 0.65, sit: 0.65 },
  { label: "Left Upper Arm", value: 5, stand: 0.82, sit: 0.77 },
  { label: "Right Upper Arm", value: 6, stand: 0.82, sit: 0.77 },
  { label: "Left Lower Arm", value: 7, stand: 0.65, sit: 0.65 },
  { label: "Right Lower Arm", value: 8, stand: 0.65, sit: 0.65 },
  { label: "Left Hand", value: 9, stand: 0.47, sit: 0.54 },
  { label: "Right Hand", value: 10, stand: 0.47, sit: 0.54 },
  { label: "Left Thigh", value: 11, stand: 0.47, sit: 0.54 },
  { label: "Right Thigh", value: 12, stand: 0.47, sit: 0.54 },
  { label: "Left Lower Leg", value: 13, stand: 0.24, sit: 0.23 },
  { label: "Right Lower Leg", value: 14, stand: 0.24, sit: 0.23 },
  { label: "Left Foot", value: 15, stand: 0.0, sit: 0.0 },
  { label: "Right Foot", value: 16, stand: 0.0, sit: 0.0 },
];
export const signals = [
  "tskin-",
  "tcore-",
  "sensation-",
  "sensation_weighted-",
  "comfort-",
  "comfort_weighted-",
  "eht-",
  "tskin_set-",
  "tskin_set_reg-",
];

export const csvHeaderLine = [
  "elapsed_time",
  "air",
  "mrt",
  "rh",
  "velocity",
  "solar",
  "clo",
  "met",
  "overall_comfort",
  "overall_comfort_weighted",
  "overall_sensation",
  "overall_sensation_linear",
  "overall_sensation_weighted",
  "meanskintemp",
  "tblood",
  "tneutral",
  "pmv",
  "ppd",
  "eht",
  "qmet",
  "qconv",
  "qrad",
  "qsolar",
  "qresp",
  "qsweat",
].concat(
  signals
    .map((value) =>
      graphsVals
        .map((value2, idx) => (idx != 0 ? [`${value}${value2.label}`] : []))
        .flat()
    )
    .flat()
);

export const conditionParams = (num) => {
  return {
    condition_name: "Condition #" + num.toString(),
    exposure_duration: 60,
    ramp: false,
    air_temperature: Array(16).fill("25"),
    radiant_temperature: Array(16).fill("25"),
    air_speed: Array(16).fill("0.1"),
    relative_humidity: Array(16).fill("50"),
    met_value: 1,
    clo_value: "0.52",
    at_delta: "0",
    mr_delta: "0",
    as_delta: "0",
    rh_delta: "0",
    at_d: "25",
    rt_d: "25.0",
    ai_d: "0.1",
    rh_d: "50.0",
  };
};

export const listOfParameters = [
  {
    title: "Exposure time",
    fullTitle: "Exposure Time",
    icon: <TimeIcon color="gray.400" />,
    unit: " min",
    fullUnit: " minutes",
    val: "exposure_duration",
    key: "time",
    step: 1,
    precision: 0,
  },
  {
    title: "Ambient temp",
    fullTitle: "Ambient temperature",
    icon: <SunIcon color="gray.400" />,
    unit: " °C",
    fullUnit: " ° Celsius",
    val: "air_temperature",
    key: "air temp",
    step: 0.1,
    precision: 1,
    deltaKey: "at_delta",
    tempKey: "at_d",
  },
  {
    title: "Mean rad temp",
    fullTitle: "Mean radiant temperature",
    icon: <StarIcon color="gray.400" />,
    unit: " °C",
    fullUnit: " ° Celsius",
    val: "radiant_temperature",
    key: "MRT",
    step: 0.1,
    precision: 1,
    deltaKey: "mr_delta",
    tempKey: "rt_d",
  },
  {
    title: "Air speed",
    fullTitle: "Speed of surrounding air",
    icon: <SpinnerIcon color="gray.400" />,
    unit: " m/s",
    fullUnit: " meters/second",
    val: "air_speed",
    key: "speed",
    step: 0.1,
    precision: 1,
    deltaKey: "as_delta",
    tempKey: "ai_d",
  },
  {
    title: "Rel humidity",
    fullTitle: "Relative humidity",
    icon: <ImDroplet color="gray" />,
    unit: "%",
    fullUnit: "%",
    val: "relative_humidity",
    key: "humidity",
    step: 1,
    precision: 0,
    deltaKey: "rh_delta",
    tempKey: "rh_d",
  },
];
