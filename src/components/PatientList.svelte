<script lang="ts">
  import { Link } from "svelte-routing";
  import "@shoelace-style/shoelace/dist/components/relative-time/relative-time";
  import { patientProxy } from "./patientProxy";
  import { getCovidResults } from "./aqls";
  export let patients: any[] = null;
  let proxyList: any[];
  $: if (patients) {
    proxyList = patients.map((p) => ({
      proxy: patientProxy(p.resource),
      resource: p.resource,
    }));
  }

  let covidRes = {};
  $: if (patients?.length > 0) {
    getCovidResults(patients.map((p) => p.resource.id)).then((aql) => {
      aql.forEach((row) => {
        if (!covidRes[row.get("id")]) {
          covidRes[row.get("id")] = row.get("result")?.value;
        }
      });
    });
  }
</script>

{#if patients}
  {#if patients?.length > 0}
    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
      <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
        <table class="min-w-full leading-normal">
          <tbody>
            {#each proxyList as patient}
              <tr>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div>
                    <p
                      class="whitespace-no-wrap font-bold text-blue-500 hover:text-blue-800"
                    >
                      <Link to={`/clinical/${patient.resource.id}`}>
                        {patient.proxy.name}
                      </Link>
                    </p>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {patient.proxy.age},
                    <span class="capitalize">{patient.proxy.gender}</span>
                  </p>
                </td>

                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold leading-tight"
                  >
                    {#if covidRes[patient.resource.id] === "Positive"}
                      <span
                        aria-hidden="true"
                        class="absolute inset-0 bg-red-400  opacity-50 rounded-full"
                      />
                      <span class="relative text-green-900"> covid +ve </span>
                    {:else if covidRes[patient.resource.id] === "Negative"}
                      <span
                        aria-hidden="true"
                        class="absolute inset-0 bg-gray-400  opacity-50 rounded-full"
                      />
                      <span class="relative text-gray-700"> covid -ve </span>
                    {/if}
                  </span>
                </td>
                <td class=" py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    Updated <sl-relative-time
                      date={patient.resource.meta.lastUpdated}
                    />
                  </p>
                </td>
                <td
                  class="px-5 py-5 space-x-5 border-b border-gray-200 bg-white text-sm"
                >
                  <Link
                    to={`patient/${patient.resource.id}`}
                    class="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                  <Link to="delete" class="text-red-600 hover:text-red-800">
                    Delete
                  </Link>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    {#if patients.length >= 50}
      <p class="mt-5 text-gray-700">
        Showing only top 50 latest patients. Use the searchbox to get more.
      </p>
    {/if}
  {:else}
    <p class="mt-5 text-xl text-gray-700">No patients</p>
  {/if}
{:else}
  <p class="mt-5 text-xl text-gray-700">Loading...</p>
{/if}
