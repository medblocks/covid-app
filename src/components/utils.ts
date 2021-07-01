import { relativeTime } from "./relativeTime";

export const formatValue = (data) => {
  if (data == null) {
    return "-";
  }
  if (data["_type"] === "PARTY_IDENTIFIED") {
    return data?.name;
  }
  if (data["_type"] === "DV_QUANTITY") {
    const unitsMap = {
      "[degF]": "°F",
      "1/mm3": "/mm3",
      "mm[Hg]": "mmHg",
    };

    if (data?.magnitude) {
      if (data?.units) {
        const convertedUnits = unitsMap[data.units] || data.units;
        return `${data.magnitude}${convertedUnits}`;
      } else {
        return data?.magnitude;
      }
    }
  }
  if (data["_type"] === "DV_COUNT") {
    return data?.magnitude;
  }

  if (data["_type"] === "DV_PROPORTION") {
    if (data?.numerator) {
      return data?.numerator + "%";
    }
  }
  if (data) {
    return "Yes";
  }
};
