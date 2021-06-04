import axios from "axios";
import { token } from "./stores";
import { get } from "svelte/store";
console.log(get(token));

export const fhir = axios.create({
  baseURL: "https://covid.medblocks.org/fhir",
  headers: {
    "Cache-Control": "no-cache",
  },
});

export const openehr = axios.create({
  baseURL: "https://covid.medblocks.org/ehrbase/rest",
  headers: {
    Accept: "application/json",
  },
});
