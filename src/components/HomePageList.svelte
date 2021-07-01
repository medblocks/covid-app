<script lang="ts">
  import { fhir } from "../services";
  import { onMount } from "svelte";
  import PatientList from "./PatientList.svelte";
  import { Link, navigate } from "svelte-routing";
  import { SearchAllPatients } from "./searchPatient";
  export let view: "all" | "admitted" | "discharged";

  let patients;
  let loading = false;
  const actions = {
    admitted: { name: "Discharge", segment: "discharge/1" },
    all: { name: "Overview", segment: "" },
  };
  const load = async (view) => {
    loading = true;
    if (view === "all") {
      const r = await fhir.get("/Patient", {
        params: {
          _count: 50,
          _sort: "-_lastUpdated",
          _revinclude: "Encounter:subject",
        },
      });
      const entries = r.data?.entry || [];
      const onlypatients = entries.filter((e) => e?.search?.mode === "match");
      let encounters = entries.filter((e) => e?.search?.mode === "include");
      encounters = Object.fromEntries(
        encounters.map((e) => [
          e.resource.subject.reference.split("/")[1],
          e.resource.status,
        ])
      );
      console.log(encounters);
      const nonDischargedPatients = onlypatients.filter((p) => {
        const status = encounters[p.resource.id];
        if (status) {
          if (status === "in-progress") {
            return true;
          }
          return false;
        }
        return true;
      });
      patients = nonDischargedPatients;
    } else if (view === "admitted") {
      const r = await fhir.get("/Encounter", {
        params: {
          status: "in-progress",
          _include: "Encounter:subject",
          _sort: "-_lastUpdated",
          _count: 50,
        },
      });
      const entries = r.data?.entry || [];
      patients = entries.filter((e) => e?.search?.mode === "include");
    } else if (view === "discharged") {
      const r = await fhir.get("/Encounter", {
        params: {
          status: "finished,onleave,triaged,unknown,cancelled",
          _include: "Encounter:subject",
          _sort: "-_lastUpdated",
          _count: 50,
        },
      });
      console.log(r.data);
      const entries = r.data?.entry || [];
      patients = entries.filter((e) => e?.search?.mode === "include");
    } else {
      patients = [];
    }
    loading = false;
  };

  onMount(() => load(view));

  $: {
    load(view);
  }
</script>

<div class="flex flex-row mb-1 sm:mb-0 justify-between w-full flex-wrap">
  <h2 class="text-2xl leading-tight">
    <div class="my-3">
      <Link to="/list/all">
        <sl-button type={view === "all" ? "info" : "text"}
          >All Patients</sl-button
        >
      </Link>
      <Link to="/list/admitted">
        <sl-button type={view === "admitted" ? "info" : "text"}
          >Admissions</sl-button
        >
      </Link>
      <Link to="/list/discharged">
        <sl-button type={view === "discharged" ? "info" : "text"}
          >Discharged</sl-button
        >
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

{#if !loading}
  <PatientList action={actions[view]} {patients} on:reload={() => load(view)} />
{/if}
