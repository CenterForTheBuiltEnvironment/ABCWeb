import { VStack } from "@chakra-ui/react";

export const defaultConversionFunc = (value) => value;

export const cToF = (value) => {
  return value * 1.8 + 32;
};

export const cToFDiff = (value) => {
  return value * 1.8;
};

export const fToC = (value) => {
  return (value - 32) / 1.8;
};

export const fToCDiff = (value) => {
  return value / 1.8;
};

export const msToMph = (value) => {
  return value * 2.236936;
};

export const mphToMs = (value) => {
  return value / 2.236936;
};

// Researchers in comfort studies typically use feet per minute (fpm) in IP unit.
export const msToFpm = (value) => {
  return value * 196.850394;
};

export const fpmToMs = (value) => {
  return value / 196.850394;
};

export const mToInches = (value) => {
  return value * 39.3701;
};

export const inchesToM = (value) => {
  return value / 39.3701;
};

export const kgToLbs = (value) => {
  return value * 2.2046226218;
};

export const lbsToKg = (value) => {
  return value / 2.2046226218;
};

export const miniMax = (value, data, label) => {
  // 0 for finding min, 1 for finding max
  let curr = 0;
  if (value == 0) {
    curr = data[0][label];
    for (let i = 1; i < data.length; i++) {
      curr = Math.min(curr, data[i][label]);
    }
  } else {
    curr = data[0][label];
    for (let i = 1; i < data.length; i++) {
      curr = Math.max(curr, data[i][label]);
    }
  }
  return curr;
};
export const hfluxMinimax = (value, data, label) => {
  // 0 for finding min, 1 for finding max
  let curr = data[0][label[0]];
  for (let j = 0; j < label.length; j++) {
    for (let i = 1; i < data.length; i++) {
      if (value == 1) {
        curr = Math.max(curr, data[i][label[j]]);
      } else {
        curr = Math.min(curr, data[i][label[j]]);
      }
    }
  }
  return curr;
};
export const environmentMinimax = (value, data, label) => {
  // 0 for finding min, 1 for finding max
  let curr = data[0][label[0]];
  for (let j = 0; j < label.length; j++) {
    for (let i = 1; i < data.length; i++) {
      if (value == 1) {
        curr = Math.max(curr, data[i][label[j]]);
      } else {
        curr = Math.min(curr, data[i][label[j]]);
      }
    }
  }
  return curr;
};

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(value, max));
};

const colorHelper = (value, mn, mx, opacity = 1, isComfort = false) => {
  const fraction = (value - mn) / (mx - mn);

  if (isComfort) {
    // Black -> Gray -> Green gradient processing for comfort
    const midpoint = 0.5;

    let blackToGray =
        fraction <= midpoint
          ? (fraction / midpoint) * 128 // 0 to 128 (Black to Gray)
          : (1 - (fraction - midpoint) / midpoint) * 128, // 128 to 0 (Gray to Green)
      grayToGreen =
        fraction <= midpoint
          ? (fraction / midpoint) * 128 // 0 to 128 (Black to Gray)
          : 128 + ((fraction - midpoint) / midpoint) * 127; // 128 to 255 (Gray to Green)

    const blue = blackToGray;
    const red = blackToGray;
    const green = grayToGreen;

    // Clamp values between 0 and their respective maximums
    const clampedRed = clamp(red, 0, 128);
    const clampedGreen = clamp(green, 0, 255);
    const clampedBlue = clamp(blue, 0, 128);

    return `rgba(${Math.round(clampedRed)},${Math.round(
      clampedGreen
    )},${Math.round(clampedBlue)},${opacity})`;
  }

  // Blue -> Green -> Red gradient processing for the other parameters
  const midpoint = 0.5;
  let blue = ((midpoint - fraction) * 255) / midpoint,
    green =
      fraction <= midpoint
        ? Math.abs(2 * fraction) * 255
        : 2 * (1 - fraction) * 255,
    red = ((fraction - midpoint) * 255) / midpoint;

  // Clamp values between 0 and 255
  blue = clamp(blue, 0, 255);
  green = clamp(green, 0, 255);
  red = clamp(red, 0, 255);

  // Return the final rgba value
  return `rgba(${Math.round(red)},${Math.round(green)},${Math.round(
    blue
  )}, ${opacity})`;
};

export const colorComfort = (comfort, isComparison = false) => {
  return colorHelper(comfort, -4, 4, isComparison ? 0.3 : 1, true);
};

export const colorSensation = (sensation, isComparison = false) => {
  return colorHelper(sensation, -4, 4, isComparison ? 0.3 : 1);
};

export const colorTskin = (tskin, isComparison = false) => {
  return colorHelper(tskin, 20, 38, isComparison ? 0.3 : 1);
};

export const colorTskinNotMetric = (tskin, isComparison = false) => {
  return colorHelper(tskin, cToF(20), cToF(38), isComparison ? 0.3 : 1);
};

export const colorTcore = (tcore, isComparison = false) => {
  return colorHelper(tcore, 25, 40, isComparison ? 0.3 : 1);
};

export const colorTcoreNotMetric = (tcore, isComparison = false) => {
  return colorHelper(tcore, cToF(25), cToF(40), isComparison ? 0.3 : 1);
};

export const colorHflux = (elem) => {
  switch (elem) {
    case "q_met":
      return "blue";
    case "q_conv":
      return "lightgreen";
    case "q_rad":
      return "orange";
    case "q_solar":
      return "red";
    case "q_resp":
      return "skyblue";
    case "q_sweat":
      return "green";
  }
};
export const colorEnv = (elem) => {
  switch (elem) {
    case "ta":
      return "blue";
    case "mrt":
      return "lightgreen";
    case "solar":
      return "orange";
    case "eht":
      return "red";
    case "rh":
      return "skyblue";
    case "v":
      return "green";
  }
};
export const findMin = (data, ind, key) => {
  let res = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < data.length; i++) {
    if (key == "tcore") {
      if (ind == 0) {
        res = Math.min(res, data[i][ind].tblood);
      } else {
        res = Math.min(res, data[i][ind][key]);
      }
    } else {
      res = Math.min(res, data[i][ind][key]);
    }
  }
  return res;
};
export const findMax = (data, ind, key) => {
  let res = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < data.length; i++) {
    if (key == "tcore") {
      if (ind == 0) {
        res = Math.max(res, data[i][ind].tblood);
      } else {
        res = Math.max(res, data[i][ind][key]);
      }
    } else {
      res = Math.max(res, data[i][ind][key]);
    }
  }
  return res;
};
export const determineColor = (value, key) => {
  switch (key) {
    case "comfort":
      return colorComfort(value[key]);
    case "sensation":
      return colorSensation(value[key]);
    case "tskin":
      return colorTskin(value[key]);
    case "tcore":
      return colorTcore(value[key]);
    default:
      return "white";
  }
};
export const determineColorFunction = (key) => {
  switch (key) {
    case "comfort":
      return (
        <VStack w="100%" h="100%" spacing={0}>
          <div
            style={{
              width: "100%",
              height: "50%",
              backgroundImage: "linear-gradient(green, white)",
            }}
          />
          <div
            style={{
              width: "100%",
              height: "50%",
              backgroundImage: "linear-gradient(white, black)",
            }}
          />
        </VStack>
      );
    case "sensation":
    case "tskin":
    case "tcore":
      return (
        <VStack w="100%" h="100%" spacing={0}>
          <div
            style={{
              width: "100%",
              height: "50%",
              backgroundImage: "linear-gradient(to top, green, red)",
            }}
          />
          <div
            style={{
              width: "100%",
              height: "50%",
              backgroundImage: "linear-gradient(to top, blue, green)",
            }}
          />
        </VStack>
      );
    default:
      return <></>;
  }
};
export const convertResultToArrayForCSV = (result) => {
  const {
    ta,
    mrt,
    rh,
    v,
    solar,
    clo,
    met,
    comfort,
    comfort_weighted,
    sensation,
    sensation_linear,
    sensation_weighted,
    tskin,
    tblood,
    tneutral,
    pmv,
    ppd,
    eht,
    q_met,
    q_conv,
    q_rad,
    q_solar,
    q_resp,
    q_sweat,
  } = result;
  return [
    ta,
    mrt,
    rh,
    v,
    solar,
    clo,
    met,
    comfort,
    comfort_weighted,
    sensation,
    sensation_linear,
    sensation_weighted,
    tskin,
    tblood,
    tneutral,
    pmv,
    ppd,
    eht,
    q_met,
    q_conv,
    q_rad,
    q_solar,
    q_resp,
    q_sweat,
  ];
};

export const getCurrentConditionName = (time, params) => {
  let currParamTime = 0;
  for (let i = 0; i < params.length; i++) {
    currParamTime += params[i].exposure_duration;
    if (time < currParamTime) return params[i].condition_name;
  }
  return "Erroneous Condition";
};

export const formatComfDescriptor = (val) => {
  if (val >= 4) {
    return "very comfortable";
  } else if (val >= 2) {
    return "comfortable";
  } else if (val >= 0.0001) {
    return "just comfortable";
  } else if (val > -0.0001) {
    return "";
  } else if (val > -2) {
    return "just uncomfortable";
  } else if (val > -4) {
    return "uncomfortable";
  } else return "very uncomfortable";
};

export const formatSensDescriptor = (val) => {
  if (val >= 4) {
    return "very hot";
  } else if (val >= 3) {
    return "hot";
  } else if (val >= 2) {
    return "warm";
  } else if (val >= 1) {
    return "slightly warm";
  } else if (val > -1) {
    return "neutral";
  } else if (val > -2) {
    return "slightly cool";
  } else if (val > -3) {
    return "cool";
  } else if (val > -4) {
    return "cold";
  } else return "very cold";
};

export const getSaveFilePicker = async () => {
  const opts = {
    suggestedName: "Parameters.json",
    types: [
      {
        accept: { "application/json": [".json"] },
      },
    ],
    startIn: "downloads",
  };
  return await window.showSaveFilePicker(opts);
};
