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

const colorHelper = (value, mn, mx) => {
  const fraction = (value - mn) / (mx - mn),
    midpoint = 0.5,
    fq = 0.25,
    tq = 0.75;

  // blue -> green -> red
  let blue = ((midpoint - fraction) * 255) / midpoint,
    green =
      fraction <= midpoint
        ? Math.abs(2 * fraction) * 255
        : 2 * (1 - fraction) * 255,
    red = ((fraction - midpoint) * 255) / midpoint;

  // clamp values
  blue = Math.max(0, Math.min(blue, 255));
  green = Math.max(0, Math.min(green, 255));
  red = Math.max(0, Math.min(red, 255));

  // output final values
  return "rgb(" + red + "," + green + "," + blue + ")";
};
export const colorSensation = (sensation) => {
  return colorHelper(sensation, -4, 4);
};
export const colorTskin = (tskin, min, max) => {
  return colorHelper(tskin, min, max);
};
export const colorTcore = (tcore, min, max) => {
  return colorHelper(tcore, min, max);
};
export const colorHflux = (hflux, min, max) => {
  return colorHelper(hflux, min, max);
};
export const colorEnv = (env, min, max) => {
  return colorHelper(env, min, max);
};
export const colorComfort = (comfort) => {
  if (comfort < -1) return "black";
  else if (comfort >= -1 && comfort <= 1) return "gray";
  else return "white";
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

// for human body model color-rendering
export const determineColor = (cs) => {
  // cs = [comfort, sensation]
  let f, s;
  if (cs[0] < -1) f = "black";
  else if (cs[0] >= -1 && cs[0] <= 1) f = "gray";
  else f = "white";
  if (cs[1] < -1) s = "blue";
  else if (cs[1] >= -1 && cs[1] <= 1) s = "green";
  else s = "pink";
  return [f, s];
};
export const getCurrentConditionName = (time, params) => {
  let currParamTime = 0;
  for (let i = 0; i < params.length; i++) {
    currParamTime += params[i].exposure_duration;
    if (time < currParamTime) return params[i].condition_name;
  }
  return "Erroneous Condition";
};
