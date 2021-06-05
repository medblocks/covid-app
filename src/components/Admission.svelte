<script lang="ts">
  import { fhir } from "../services";

  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  export let ehrId;
  let form;
  let encounter;
  let loading;
  onMount(async () => {
    const r = await fhir.get(`/Encounter?subject=${ehrId}`);
    if (r?.data?.entry) {
      encounter = r?.data?.entry[0]?.resource;
      if (encounter) {
        form.import(encounter);
      }
    }
  });

  async function handleSubmit(e: CustomEvent) {
    loading = true;
    const data = e.detail;
    if (encounter) {
      await fhir.put(`/Encounter/${encounter.id}`, {
        ...data,
        id: encounter.id,
      });
    } else {
      const r = await fhir.post("Encounter", data);
    }
    loading = false;
    navigate("/", { replace: true });
  }
</script>

<h1 class="text-xl my-5">Admission Details</h1>
<mb-fhir-form
  bind:this={form}
  class="flex flex-col gap-3"
  on:mb-submit={handleSubmit}
>
  <div class="hidden">
    <mb-context path="resourceType" data="Encounter" />
    <mb-context path="subject" data={{ reference: `Patient/${ehrId}` }} />
  </div>
  <mb-select path="status" type="code" label="Status">
    <mb-option value="in-progress" label="Started" />
    <mb-option value="finished" label="Completed" />
    <mb-option value="cancelled" label="Cancelled" />
    <mb-option value="death" label="Patient expired" />
  </mb-select>

  <mb-submit>
    <sl-button {loading} type="info" class="w-full">Save</sl-button>
  </mb-submit>
</mb-fhir-form>
