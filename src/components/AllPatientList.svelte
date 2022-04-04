<script lang="ts">
  import { fhir } from "../services";
  import { onMount } from "svelte";
  import PatientList from "./PatientList.svelte";
  import { Link, navigate } from "svelte-routing";
  import { SearchAllPatients } from "./searchPatient";
  let patients;
  const load = async () => {
    const r = await fhir.get("/Patient", {
      params: { _count: 50, _sort: "-_lastUpdated" },
    });
    patients = r.data?.entry || [];
  };

  onMount(load);
</script>

<div class="flex flex-row mb-1 sm:mb-0 justify-between w-full flex-wrap">
  <h2 class="text-2xl leading-tight">
    <div class="my-3">
      <Link to="/">
        <sl-button type="neutral">All Patients</sl-button>
      </Link>
      <Link to="admissions">
        <sl-button type="text">Admissions</sl-button>
      </Link>
    </div>
  </h2>
</div>
<div class="flex justify-between gap-3 flex-wrap">
  <div class="text-end">
    <mb-search
      on:mb-input={(e) => {
        navigate(`/clinical/${e.target.data.code}`);
      }}
      axios={fhir}
      plugin={SearchAllPatients}
    />
  </div>
  <Link to="/patient">
    <sl-button type="primary"
      >New patient <sl-icon slot="suffix" name="plus-circle-fill" /></sl-button
    >
  </Link>
</div>
<PatientList {patients} on:reload={load} />
