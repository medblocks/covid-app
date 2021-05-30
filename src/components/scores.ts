export const calcResp = (rate: number): undefined | string => {
  if (rate >= 12 && rate <= 20) {
    return "at0018";
  }
  if (rate >= 9 && rate <= 1) {
    return "at0019";
  }
  if (rate >= 21 && rate <= 24) {
    return "at0020";
  }
  if (rate <= 9 || rate >= 25) {
    return "at0021";
  }
  return;
};
export const calcSat = (rate: number): undefined | string => {
  if (rate >= 96) {
    return "at0030";
  }
  if (rate >= 94 && rate <= 95) {
    return "at0031";
  }
  if (rate >= 92 && rate <= 93) {
    return "at0032";
  }
  if (rate <= 91) {
    return "at0033";
  }
  return;
};
export const calcTemp = (rate: number): undefined | string => {
  let temp: number;
  if (rate !== undefined) {
    temp = (rate - 32) * (5 / 9);
  } else {
    return;
  }
  if (temp >= 36.1 && temp <= 38.0) {
    return "at0022";
  }
  if ((temp >= 35.1 && temp <= 36) || (temp >= 38.1 && temp <= 39.0)) {
    return "at0023";
  }
  if (temp >= 39.1) {
    return "at0038";
  }
  if (temp <= 35.0) {
    return "at0039";
  }
  return;
};
export const calcSys = (rate: number): undefined | string => {
  if (rate >= 111 && rate <= 219) {
    return "at0014";
  }
  if (rate >= 101 && rate <= 110) {
    return "at0015";
  }
  if (rate >= 91 && rate <= 100) {
    return "at0016";
  }
  if (rate <= 90 || rate >= 220) {
    return "at0017";
  }
  return;
};
export const calcHeart = (rate: number): undefined | string => {
  if (rate >= 51 && rate <= 90) {
    return "at0013";
  }
  if ((rate >= 41 && rate <= 50) || (rate >= 91 && rate <= 110)) {
    return "at0012";
  }
  if (rate >= 111 && rate <= 130) {
    return "at0011";
  }
  if (rate <= 40 || rate >= 131) {
    return "at0010";
  }
  return;
};
