<script lang="ts">
  import { fhir } from "../utils/fhir";
  import { onMount } from "svelte";
  import PatientList from "./PatientList.svelte";
  let patients;
  onMount(async () => {
    const r = await fhir.get("/Patient");
    patients = r.data?.entry || [];
  });
</script>

<PatientList {patients} label="All Patients"/>
