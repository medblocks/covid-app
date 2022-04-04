import axios from "axios";

const OPENEHR = import.meta.env.VITE_OPENEHR_ENDPOINT ;
const FHIR = import.meta.env.VITE_FHIR_ENDPOINT;


export const fhir = axios.create({
  baseURL: `${FHIR}/fhir`,
  headers: {
    "Cache-Control": "no-cache",
  },
});

export const openehr = axios.create({
  baseURL: `${OPENEHR}/ehrbase/rest`,
  headers: {
    Accept: "application/json",
  },
});
