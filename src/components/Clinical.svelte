<script lang="ts">
    import { openehr } from "../utils/openehr";
    import { onMount } from "svelte";
    import { fhir } from "../utils/fhir";
    import { patientProxy } from "./patientProxy";
import Assessment from "./Assessment.svelte";

    export let ehr: string;
    let patientdata;
    let patient;

    $: patient = patientProxy(patientdata);

    onMount(async () => {
        try {
            await openehr.get(`/openehr/v1/ehr/${ehr}`)
        } catch (e) {
            if (e.response.status === 404) {
                console.log("EHR Does not exist, creating");
                const r = await openehr.put(`/openehr/v1/ehr/${ehr}`);
                console.log("Created EHR", r.data);
            }
        }
        const fhirDemographics = await fhir.get(`/Patient/${ehr}`)
        patientdata = fhirDemographics.data;
    });
</script>

{#if patient}
    <div>
        <h1 class="text-2xl">{patient.name}</h1>
        <p>{patient.age} {patient.genderShort}</p>
    </div>
    <div class="mt-4">
        <sl-button type="primary">
            Daily Sheet <sl-icon slot="suffix" name="sticky-fill" />
        </sl-button>
    </div>
    <Assessment></Assessment>
{/if}
