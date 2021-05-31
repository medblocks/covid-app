<script lang="ts">
  import { openehr } from "../utils/openehr";
  import { onMount } from "svelte";
  import { fhir } from "../utils/fhir";
  import { patientProxy } from "./patientProxy";
  import { Link } from "svelte-routing";
  export let ehrId: string;
  let patientdata;
  let patient;
  import "@shoelace-style/shoelace/dist/components/format-date/format-date";
  $: patient = patientProxy(patientdata);

  const getCompositions = (ehrId: string, templateId: string) => ({
    q: `SELECT c/uid/value as uid, c/context/start_time/value as time from EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.encounter.v1] where c/archetype_details/template_id/value='${templateId}' AND e/ehr_id/value='${ehrId}' ORDER BY c/context/start_time/value DESC`,
  });
  const allCompositions = (ehrId) => {
    const query = `
    SELECT 
    c/context/start_time/value as time, 
    c/uid/value as uid, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.body_temperature.v2]/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as Temperature, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.pulse.v2]/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value as Pulse,
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.blood_pressure.v2]/data[at0001]/events[at0006]/data[at0003]/items[at0004]/value as Systolic_BP, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.blood_pressure.v2]/data[at0001]/events[at0006]/data[at0003]/items[at0005]/value as Diastolic_BP, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.news_uk_rcp.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0028]/value as EWS, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Vitals']/items[openEHR-EHR-OBSERVATION.pulse_oximetry.v1]/data[at0001]/events[at0002]/data[at0003]/items[at0006]/value as spO2, 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'Fasting Glucose']/items[at0001]/value as Glucose_Fasting, 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'Postprandial Blood Sugar']/items[at0001]/value as Glucose_Postprandial, 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'CRP']/items[at0001]/value as CRP, 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'Total WBC']/items[at0001]/value as WBC, 
    c/content[openEHR-EHR-OBSERVATION.laboratory_test_result.v1,'Lab Results']/data[at0001]/events[at0002]/data[at0003]/items[openEHR-EHR-CLUSTER.laboratory_test_analyte.v1,'D-Dimer']/items[at0001]/value as D_Dimer, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Dexamethasone'] as Dexamethasone, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Enoxaparin'] as Enoxiparin, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Tab Paracetamol'] as Paracetamol, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Tab Co-Amoxyclav'] as Coamoxiclav, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.medication.v1,'Budesonide Puffs'] as Budesonide, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.procedure.v1,'Steam Inhalation'] as Steam, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.procedure.v1,'Deep Breathing Exercises'] as Deep_Breathing, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-ACTION.procedure.v1,'Oxygen Therapy'] as Oxygen_Therapy, 
    c/content[openEHR-EHR-SECTION.adhoc.v1,'Management']/items[openEHR-EHR-OBSERVATION.medication_statement.v0,'Other regular medication'] as regularMeds 
    from EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.encounter.v1]  
    where c/archetype_details/template_id/value='MCS.CovidCare.DailySheet.v0.1' 
    AND e/ehr_id/value='${ehrId}'
    ORDER BY time DESC
    `;
  };
  const dataEdit = (data) => {
    if (data === null) {
      return "-";
    }
    if (data?.magnitude) {
      if (data?.units) {
        if (data?.units === "[degF]") {
          return data?.magnitude + "°F";
        } else if (data?.units === "1/mm3") {
          return data?.magnitude + "/mm3";
        } else if (data?.units === "mm[Hg]") {
          return data?.magnitude + "mmHg";
        } else if (data?.units === "/min") {
          return data?.magnitude + "/min";
        }
      } else {
        return data?.magnitude;
      }
    }
    if (data?.numerator) {
      return data?.numerator + "%";
    }
    if (data?.items) {
      console.log({ items: data });
      console.log(data?.items[0].value.magnitude + data?.items[0].value.units);
      return data?.items[0].value.magnitude + " " + data?.items[0].value.units;
    }
    if (data?.name) {
      if (data?.name.value) {
        return "Yes";
      } else return "No";
    }
    if (new Date(data).getDate()) {
      return new Date(data).toDateString();
    }
  };
  let dailySheets = [];
  let dailyData = {};
  let columns = [];
  let rows = [];
  onMount(async () => {
    try {
      await openehr.get(`/openehr/v1/ehr/${ehrId}`);
    } catch (e) {
      if (e.response.status === 404) {
        console.log("EHR Does not exist, creating");
        const r = await openehr.put(`/openehr/v1/ehr/${ehrId}`);
        console.log("Created EHR", r.data);
      }
    }
    const fhirDemographics = await fhir.get(`/Patient/${ehrId}`);
    patientdata = fhirDemographics.data;
    const compositions = await openehr.post(
      `/openehr/v1/query/aql`,
      getCompositions(ehrId, "MCS.CovidCare.DailySheet.v0.1")
    );

    dailySheets = compositions.data?.rows;
    const dailyDataRequest = await openehr.post(
      `/openehr/v1/query/org.openehr::coviddaily`,
      { query_parameters: { ehr_id: ehrId } }
    );
    dailyData = {
      columns: dailyDataRequest.data?.columns,
      rows: dailyDataRequest.data?.rows,
    };
    columns = dailyDataRequest.data?.columns;
    rows = dailyDataRequest.data?.rows;
  });
</script>

{#if patient}
  <div>
    <h1 class="text-2xl">{patient.name}</h1>
    <p>{patient.age} {patient.genderShort}</p>
  </div>
  <div class="mt-4">
    <Link to={`clinical/${ehrId}/daily`}>
      <sl-button type="primary">
        Daily Monitoring <sl-icon slot="suffix" name="plus-circle-fill" />
      </sl-button>
    </Link>
  </div>
{/if}

<p class="mt-5 text-2xl text-gray-700">Daily Monitoring Sheets</p>
<div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
  <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
    <table class="min-w-full leading-normal">
      <tbody>
        {#each dailySheets as sheet}
          <tr>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                <span class="capitalize"
                  ><sl-relative-time date={sheet[1]} /></span
                >
              </p>
            </td>
            <td
              class="px-5 py-5 space-x-5 border-b border-gray-200 bg-white text-sm"
            >
              <sl-format-date
                month="long"
                day="numeric"
                hour="numeric"
                minute="numeric"
                date={sheet[1]}
              />
            </td>
            <td
              class="px-5 py-5 space-x-5 border-b border-gray-200 bg-white text-sm text-right"
            >
              <Link
                to={`clinical/${ehrId}/daily/${sheet[0]}`}
                class="text-blue-600 hover:text-blue-900"
              >
                Edit/View
              </Link>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<p>Patient status</p>
<!-- <pre>{JSON.stringify(dailyData, null, 2)}</pre> -->
<div class="flex w-full">
  <div class="flex flex-col">
    {#each columns as col}
      <div
        class="px-2 py-5 border-b font-bold border-gray-200 bg-white text-sm"
      >
        {col.name}
      </div>
    {/each}
  </div>
  <div class="flex overflow-x-auto">
    {#each rows as row}
      <div class="flex flex-col">
        {#each row as r}
          <div class="px-2 py-5 border-b border-gray-200 bg-white text-sm">
            {dataEdit(r)}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
{console.log(rows)}
