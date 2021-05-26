import axios from 'axios'

export const openehr = axios.create({
    baseURL: 'http://localhost:8080/ehrbase/rest',
    headers: {
        Accept: "application/json",
    },
});