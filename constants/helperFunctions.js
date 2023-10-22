export const miniMax = (value, data) => {
  // 0 for finding min, 1 for finding max
  let curr = 0;
  if (value == 0) {
    curr = Math.min(data[0].comfort, data[0].sensation);
    for (let i = 1; i < data.length; i++) {
      curr = Math.min(curr, data[i].comfort, data[i].sensation);
    }
  } else {
    curr = Math.max(data[0].comfort, data[0].sensation);
    for (let i = 1; i < data.length; i++) {
      curr = Math.max(curr, data[i].comfort, data[i].sensation);
    }
  }
  return curr;
};
export const colorSensation = (sensation) => {
  if (sensation < -1) return "blue";
  else if (sensation >= -1 && sensation <= 1) return "green";
  else return "pink";
};
export const colorComfort = (comfort) => {
  if (comfort < -1) return "black";
  else if (comfort >= -1 && comfort <= 1) return "gray";
  else return "white";
};
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
