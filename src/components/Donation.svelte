<script lang="ts">
  import { fhir } from "../services";

  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  export let ehrId;
  export let redirectUrl;
  let form;
  let invoice;
  let loading;
  onMount(async () => {
    const r = await fhir.get(`/Invoice?subject=${ehrId}`);
    if (r?.data?.entry) {
      invoice = r?.data?.entry[0]?.resource;
      if (invoice) {
        form.import(invoice);
      }
    }
  });

  async function handleSubmit(e: CustomEvent) {
    loading = true;
    const data = e.detail;
    if (invoice) {
      await fhir.put(`/Invoice/${invoice.id}`, {
        ...data,
        id: invoice.id,
      });
    } else {
      const r = await fhir.post("Invoice", data);
    }
    loading = false;
    navigate(redirectUrl || `/clinical/${ehrId}`, { replace: true });
  }
</script>

<p class="my-5 text-xl font-semibold text-gray-700">Dontation</p>
<mb-fhir-form
  bind:this={form}
  class="flex flex-col gap-3"
  on:mb-submit={handleSubmit}
>
  <div class="hidden">
    <mb-context path="resourceType" data="Invoice" />
    <mb-context path="subject" data={{ reference: `Patient/${ehrId}` }} />
    <mb-context
      type="number"
      label="Total Donations"
      path="totalNet.currency"
      data="INR"
    />
  </div>
  <mb-input type="number" label="Total Donations" path="totalNet.value" />
  <mb-input textarea path="note[0].text" label="Notes" />
  <mb-submit>
    <sl-button {loading} type="neutral" class="w-full">Save</sl-button>
  </mb-submit>
</mb-fhir-form>
