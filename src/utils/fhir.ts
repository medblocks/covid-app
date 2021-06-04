import axios from "axios";

export const fhir = axios.create({
  baseURL: "https://covid.medblocks.org/fhir",
  headers: {
    "Cache-Control": "no-cache",
  },
});
