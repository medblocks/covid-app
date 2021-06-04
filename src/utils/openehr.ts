import axios from "axios";

export const openehr = axios.create({
  baseURL: "https://covid.medblocks.org/ehrbase/rest",
  headers: {
    Accept: "application/json",
  },
});
