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
 const dataEdit=(data)=>{
if(data===null){
  return '-';
}if(data?.magnitude){
  if(data?.units){
if(data?.units==="[degF]"){
  return data?.magnitude+"°F";
}else if(data?.units==='1/mm3'){
  return data?.magnitude+'/mm3';
}else if(data?.units==='mm[Hg]'){
  return data?.magnitude+'mmHg';
}else if(data?.units==='/min'){
  return data?.magnitude+'/min';
}
  }else{
    return data?.magnitude;
  }
}if(data?.numerator){
  return data?.numerator+'%'
}if(data?.items){
 return data?.items[0].value.magnitude+data?.items[0].value.units;
}
if(data?.name){
  if(data?.name.value){
    return 'Yes';
  }else return 'No';
}
if((new Date(data)).getDate()){
  console.log(data)
  return new Date(data).toDateString()
}
    
}
  let dailySheets = [];
  let dailyData={};
  let columns=[];
  let rows=[];
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
    columns=dailyDataRequest.data?.columns;
    rows=dailyDataRequest.data?.rows;
   
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
<div class='overflow-x-auto'>
<table class='min-w-full leading-normal relative'>
 <tr>
   <th class="px-5 py-5 border border-gray-200 bg-white text-sm sticky left-0 top-0 z-10">time</th>
  {#each rows as row}
      {#each row as r,i}
      {#if row.length-1===i}<td class="px-5 py-5 border border-gray-200 bg-white text-sm sticky top-0 left-0">{dataEdit(r)}</td>
      {/if}
      {/each}
      {/each}
 </tr>
 
       {#each columns as col,j}<tr> {#if col.name!=='time'}<th class="px-5 py-5 border border-gray-200 bg-white text-sm sticky left-0" scope='row'>{col.name}</th>{/if}{#each rows as row}
      {#each  row as r,i}
  {#if row.length-1!==i}
{#if i===j}

  <td class="px-5 py-5 border border-gray-200 bg-white text-sm">{dataEdit(r)}</td>
 
  {/if}
  {/if}
  
    {/each}
    {/each}
   
     
   
 </tr>{/each}
  
</table>
</div>