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