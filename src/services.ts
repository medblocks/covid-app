import axios from "axios";

const OPENEHR_BASE_URL = import.meta.env.VITE_OPENEHR_ENDPOINT;
const FHIR_BASE_URL = import.meta.env.VITE_FHIR_ENDPOINT;
console.log(OPENEHR_BASE_URL)


export const fhir = axios.create({
  baseURL: `${FHIR_BASE_URL}/fhir`,
  headers: {
    "Cache-Control": "no-cache",
  },
});

export const openehr = axios.create({
  baseURL: `${OPENEHR_BASE_URL}/ehrbase/rest`,
  headers: {
    Accept: "application/json",
  },
});
