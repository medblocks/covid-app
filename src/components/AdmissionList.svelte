<script lang="ts">
  import { fhir } from "../utils/fhir";

  import { onMount } from "svelte";
  import PatientList from "./PatientList.svelte";
  import { Link } from "svelte-routing";
  let patients;
  onMount(async () => {
    const r = await fhir.get(
      "/Encounter?status=in-progress&_include=Encounter:subject"
    );
    const entries = r.data?.entry;
    patients = entries.filter((e) => e?.search?.mode === "include");
  });
</script>

<div class="flex flex-row mb-1 sm:mb-0 justify-between w-full">
  <h2 class="text-2xl leading-tight">
    <div>
      <Link to="/">
        <sl-tab>All Patients</sl-tab>
      </Link>
      <Link to="admissions">
        <sl-tab active>Admissions</sl-tab>
      </Link>
    </div>
  </h2>

  <div class="text-end">
    <form class="flex w-full max-w-sm space-x-3">
      <sl-input placeholder="Search all patients" />
    </form>
  </div>
  <Link to="/patient">
    <sl-button type="primary"
      >New patient <sl-icon slot="suffix" name="plus-circle-fill" /></sl-button
    >
  </Link>
</div>
<PatientList {patients} label="Admissions" />
