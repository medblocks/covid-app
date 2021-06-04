<script lang="ts">
  import "medblocks-ui/dist/medblocks";
  import "@shoelace-style/shoelace/dist/themes/base.css";
  import { onMount } from "svelte";
  import { fhir } from "../services";
  import { Link, navigate } from "svelte-routing";

  let data = {};
  let form;
  let loading = false;
  export let id;

  onMount(async () => {
    if (id) {
      const r = await fhir.get(`/Patient/${id}`);
      console.log(r.data);
      console.log(form.parse(r.data));
      data = form.parse(r.data);
    }
  });
  const handleSubmit = async (e: any) => {
    const data = e.detail;
    if (id) {
      loading = true;
      await fhir.put(`/Patient/${id}`, { ...data, id });
      loading = false;
    } else {
      loading = true;
      await fhir.post(`/Patient`, data);
      loading = false;
    }
    navigate("/", { replace: true });
  };
</script>

<div class="flex justify-between mb-10">
  <h1 class="text-2xl leading-tight">Patient registration</h1>
  <Link to="/" class="text-blue-500">Go back</Link>
</div>
<mb-fhir-form
  class="flex flex-col gap-4 p-10"
  {data}
  bind:this={form}
  on:mb-input={(e) => {
    data = e.target.data;
  }}
  on:mb-submit={handleSubmit}
>
  <mb-input class="hidden" path="resourceType" data="Patient" />

  <mb-input label="Name" path="name[0].given[0]" />

  <mb-date label="Date of birth" path="birthDate" />
  <mb-buttons type="code" label="Gender" path="gender">
    <mb-option value="male" label="Male" />
    <mb-option value="female" label="Female" />
    <mb-option value="other" label="Other" />
  </mb-buttons>
  <mb-input label="Phone number" path="telecom[0].value" />
  <mb-input path="identifier[0].value" label="Aadhar card number" />
  <mb-input path="identifier[0].system" class="hidden" data="aadhar" />
  <mb-input label="Address" textarea path="address[0].text" />
  <label for="" class="font-bold">Attendant information</label>
  <div class="flex flex-col gap-4">
    <mb-input label="Attendant name" path="contact[0].name.given[0]" />
    <mb-select
      label="Attendant relationship"
      path="contact[0].relationship[0]"
      type="CodableConcept"
    >
      <mb-option value="mother" label="Mother" />
      <mb-option value="father" label="Father" />
    </mb-select>
    <mb-input
      label="Attendant contact number"
      path="contact[0].telecom[0].value"
    />
  </div>
  <mb-submit>
    <sl-button size="large" class="mt-4 w-full" {loading} type="info">
      Save
    </sl-button>
  </mb-submit>
</mb-fhir-form>
