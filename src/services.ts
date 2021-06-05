import axios from "axios";
const BASE_URL = "https://covid.medblocks.org";
// const BASE_URL = "http://localhost:8080";

export const fhir = axios.create({
  baseURL: `${BASE_URL}/fhir`,
  headers: {
    "Cache-Control": "no-cache",
  },
});

export const openehr = axios.create({
  baseURL: `${BASE_URL}/ehrbase/rest`,
  headers: {
    Accept: "application/json",
  },
});
