<script lang="ts">
  import { fhir } from "../services";
  import { onMount } from "svelte";
  import { patientProxy } from "./patientProxy";

  let patientdata;
  $: patient = patientProxy(patientdata);

  export let ehrId;
  onMount(async () => {
    const fhirDemographics = await fhir.get(`/Patient/${ehrId}`);
    patientdata = fhirDemographics.data;
  });
</script>

{#if patient}
  <div class="py-8 px-5 rounded-md bg-gray-900 bg-opacity-80">
    <p class="text-white uppercase">{patient.shortUid}</p>
    <h1 class="text-2xl text-white font-semibold">{patient.name}</h1>
    <p class="text-white font-semibold">{patient.age} {patient.genderShort}</p>
  </div>
  <slot />
{:else}
  <div>
    <h1 class="text-2xl">...</h1>
    <p>...</p>
  </div>
{/if}
