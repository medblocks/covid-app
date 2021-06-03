<script lang="ts">
  import { onMount } from "svelte";
  import { fhir } from "../utils/fhir";
  import { Link } from "svelte-routing";
  import "@shoelace-style/shoelace/dist/components/relative-time/relative-time";
  import { patientProxy } from "./patientProxy";
  import { getCovidResults } from "./aqls";
  export let patients: any[] = [];
  export let label: string;
  $: proxyList = patients.map((p) => ({
    proxy: patientProxy(p.resource),
    resource: p.resource,
  }));
  let covidRes = {};
  $: {
    getCovidResults(patients.map((p) => p.resource.id)).then((aql) => {
      aql.forEach((row) => {
        if (!covidRes[row.get("id")]) {
          covidRes[row.get("id")] = row.get("result")?.value;
        }
      });
    });
  }
</script>

<div class="flex flex-row mb-1 sm:mb-0 justify-between w-full">
  <h2 class="text-2xl leading-tight">{label}</h2>

  <div class="text-end">
    <form class="flex w-full max-w-sm space-x-3">
      <div class=" relative ">
        <sl-input placeholder="Search all patients" />
      </div>
      <sl-button>Filter</sl-button>
    </form>
  </div>
  <Link to="/patient">
    <sl-button type="primary"
      >New patient <sl-icon slot="suffix" name="plus-circle-fill" /></sl-button
    >
  </Link>
</div>
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
    <div
      class="px-5 bg-white py-5 flex flex-col xs:flex-row items-center xs:justify-between"
    >
      <div class="flex items-center">
        <button
          type="button"
          class="w-full p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100"
        >
          <svg
            width="9"
            fill="currentColor"
            height="8"
            class=""
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="w-full px-4 py-2 border-t border-b text-base text-indigo-500 bg-white hover:bg-gray-100 "
        >
          1
        </button>
        <button
          type="button"
          class="w-full px-4 py-2 border text-base text-gray-600 bg-white hover:bg-gray-100"
        >
          2
        </button>
        <button
          type="button"
          class="w-full px-4 py-2 border-t border-b text-base text-gray-600 bg-white hover:bg-gray-100"
        >
          3
        </button>
        <button
          type="button"
          class="w-full px-4 py-2 border text-base text-gray-600 bg-white hover:bg-gray-100"
        >
          4
        </button>
        <button
          type="button"
          class="w-full p-4 border-t border-b border-r text-base  rounded-r-xl text-gray-600 bg-white hover:bg-gray-100"
        >
          <svg
            width="9"
            fill="currentColor"
            height="8"
            class=""
            viewBox="0 0 1792 1792"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>
