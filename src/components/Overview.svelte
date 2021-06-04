<script lang="ts">
  import { openehr } from "../utils/openehr";
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  export let ehrId: string;
  import "@shoelace-style/shoelace/dist/components/format-date/format-date";
  import LineChart from "./LineChart.svelte";

  import { allCompositions } from "./aqls";
  import { formatValue } from "./utils";

  let dailyData: Map<string, any>[] = [];
  let loaded = false;
  let scores: any = [];
  let o2scores: any = [];

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

    dailyData = await allCompositions(ehrId);
    scores = dailyData
      .map((row) => ({
        score: row.get("EWS")?.magnitude,
        date: row.get("time"),
      }))
      .filter((row) => row.score != null);
    o2scores = dailyData
      .map((row) => ({
        score: row.get("spO2")?.numerator,
        date: row.get("time"),
      }))
      .filter((row) => row.score != null);
    loaded = true;
  });
</script>

<div class="mt-4 flex gap-3 flex-wrap">
  <Link to={`daily`}>
    <sl-button type="primary">
      Daily Monitoring <sl-icon slot="suffix" name="plus-circle-fill" />
    </sl-button>
  </Link>
  <Link to={`covid`}>
    <sl-button type="info">
      Covid Report <sl-icon slot="suffix" name="plus-circle-fill" />
    </sl-button>
  </Link>
  <Link to={`admission`}>
    <sl-button type="info"> Admission </sl-button>
  </Link>
</div>

{#if loaded}
  {#if dailyData?.length > 0}
    <p class="my-5 text-xl font-semibold text-gray-700">
      Daily Monitoring Table
    </p>
    <div role="region" tabindex="0" class="max-w-full overflow-auto">
      <table class="min-w-full leading-normal table-fixed">
        <thead>
          <tr>
            <td
              class="px-5 py-5 border-b border-gray-200 bg-white font-bold text-gray-600"
            >
              Date
            </td>
            {#each dailyData as data}
              <td
                class="m-10 w-10 text-center border-b border-r border-gray-200 bg-white font-semibold text-gray-800"
              >
                <sl-format-date
                  month="long"
                  day="numeric"
                  date={data.get("time")}
                />
                <br />
                <sl-format-date
                  hour="numeric"
                  minute="numeric"
                  date={data.get("time")}
                />
              </td>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each [...dailyData[0].keys()].slice(2, -1) as key}
            <tr>
              <td
                class="px-5 py-5 border-b border-gray-200 bg-white font-bold text-gray-600"
                >{key.replaceAll("_", " ")}</td
              >
              {#each dailyData as data}
                <td
                  class="px-5 py-5 border-b border-r border-gray-200 bg-white"
                >
                  {formatValue(data.get(key))}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#if scores}
      <p class="mt-20 text-xl font-semibold text-gray-700">
        Early Warning Score Monitoring
      </p>
      <div class="max-w-2xl my-10">
        <LineChart data={scores.reverse()} label="Early Warning Score" />
      </div>
      {#if o2scores}
        <p class="mt-20 text-xl font-semibold text-gray-700">
          Oxygen Saturation Monitoring
        </p>
        <div class="max-w-2xl my-10">
          <LineChart
            data={o2scores.reverse()}
            label="Oxygen Saturation"
            color="lightblue"
          />
        </div>
      {/if}
    {/if}
    <p class="mt-20 text-xl font-semibold text-gray-700">
      Daily Monitoring Sheets
    </p>
    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
      <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
        <table class="min-w-full leading-normal">
          <tbody>
            {#each dailyData as sheet}
              <tr>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    <span class="capitalize"
                      >Updated <sl-relative-time
                        date={sheet.get("time")}
                      /></span
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
                    date={sheet.get("time")}
                  />
                </td>
                <td
                  class="px-5 py-5 space-x-5 border-b border-gray-200 bg-white text-sm text-right"
                >
                  <Link
                    to={`daily/${sheet.get("uid")}`}
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
  {:else}
    <p class="mt-5 text-xl text-gray-700">
      Please click on the above buttons to start entering data.
    </p>
  {/if}
{:else}
<p class="mt-5 text-xl text-gray-700">
  Loading...
</p>
{/if}
