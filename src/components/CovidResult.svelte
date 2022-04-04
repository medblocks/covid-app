<script lang="ts">
  import { openehr } from "../services";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";
  export let ehrId;
  export let compositionId;
  export let templateId = "MCS.CovidResult.v0";

  let loading = false;
  let form;

  onMount(async () => {
    if (compositionId) {
      const r = await openehr.get(`/ecis/v1/composition/${compositionId}`, {
        params: { format: "FLAT" },
      });
      const data = r.data?.composition;
      if (data) {
        form.import(data);
      }
    }
  });

  async function handleSubmit(e: CustomEvent) {
    const data = e.detail;
    loading = true;
    if (compositionId) {
      const r = await openehr.put(
        `/ecis/v1/composition/${compositionId.split(":")[0]}`,
        data,
        {
          params: { format: "FLAT", templateId, ehrId },
        }
      );
      loading = false;
    } else {
      const r = await openehr.post("/ecis/v1/composition/", data, {
        params: { format: "FLAT", templateId, ehrId },
      });
      console.log(r);
      loading = false;
    }
    navigate(`/clinical/${ehrId}`, { replace: true });
  }
</script>

<p class="my-5 text-xl font-semibold text-gray-700">Covid Status Report</p>
<mb-form
  bind:this={form}
  class="flex flex-col gap-4"
  on:mb-submit={handleSubmit}
>
  <mb-buttons
    path="mcs.covidresult.v0/laboratory_test_result/any_event:0/laboratory_analyte_result/analyte_result"
  >
    <mb-option label="Sample given" value="given" />
    <mb-option label="Positive" value="positive" />
    <mb-option label="Negative" value="negative" />
  </mb-buttons>
  <div class="hidden">
    <mb-context
      path="mcs.covidresult.v0/laboratory_test_result/any_event:0/laboratory_analyte_result/analyte_name"
      label="Analyte name"
      data={{ code: "1234", terminology: "SNOMED-CT", value: "Covid Analyte" }}
    />
    <mb-context
      path="mcs.covidresult.v0/laboratory_test_result/any_event:0/test_name"
      label="Test name"
      data={"Covid Test Result"}
    />
    <mb-context path="mcs.covidresult.v0/category" />
    <mb-context path="mcs.covidresult.v0/context/start_time" />
    <mb-context path="mcs.covidresult.v0/context/setting" />
    <mb-context
      path="mcs.covidresult.v0/laboratory_test_result/any_event:0/time"
    />
    <mb-context path="mcs.covidresult.v0/laboratory_test_result/subject" />
    <mb-context path="mcs.covidresult.v0/laboratory_test_result/language" />
    <mb-context path="mcs.covidresult.v0/laboratory_test_result/encoding" />
    <mb-context path="mcs.covidresult.v0/composer" />
    <mb-context path="mcs.covidresult.v0/language" />
    <mb-context path="mcs.covidresult.v0/territory" />
  </div>
  <mb-submit>
    <sl-button {loading} type="neutral"> Save </sl-button>
  </mb-submit>
</mb-form>
