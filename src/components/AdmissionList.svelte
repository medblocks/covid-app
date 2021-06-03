<script lang="ts">
  import { fhir } from "../utils/fhir";

  import { onMount } from "svelte";
  import PatientList from "./PatientList.svelte";
  let patients;
  onMount(async () => {
    const r = await fhir.get(
      "/Encounter?status=in-progress&_include=Encounter:subject"
    );
    const entries = r.data?.entry;
    patients = entries.filter((e) => e?.search?.mode === "include");
  });
</script>

<PatientList {patients} label="Admissions"/>
