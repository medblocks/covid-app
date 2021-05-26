import axios from 'axios'

export const fhir = axios.create({
  baseURL: 'http://localhost:8090/fhir',
  headers: {
    'Cache-Control': 'no-cache'
  }
});