<script lang="ts">
  import "medblocks-ui/dist/medblocks";
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
    console.log(data);
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

<h1 class="text-2xl mb-5 font-bold text-gray-700">Patient registration</h1>

<mb-fhir-form
  class="flex flex-col gap-3"
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
  <mb-buttons datatype="code" label="Gender" path="gender">
    <mb-option value="male" label="Male" />
    <mb-option value="female" label="Female" />
    <mb-option value="other" label="Other" />
  </mb-buttons>
  <mb-input
    type="number"
    min="1000000000"
    max="9999999999"
    label="Phone number"
    path="telecom[0].value"
  />
  <mb-select datatype="code" label="Identifier type" path="identifier[0].system">
    <mb-option value="aadhar" label="Aadhar" />
    <mb-option value="driving" label="Driving License" />
    <mb-option value="pan" label="PAN" />
    <mb-option value="voter" label="Voter ID" />
  </mb-select>
  <mb-input path="identifier[0].value" label="Identifier number" />
  <mb-input label="Address" textarea path="address[0].text" />
  <label for="" class="font-bold">Attendant information</label>
  <div class="flex flex-col gap-4">
    <mb-input label="Attendant name" path="contact[0].name.given[0]" />
    <mb-select
      label="Attendant relationship"
      path="contact[0].relationship[0]"
      datatype="CodableConcept"
    >
      <mb-option value="mother" label="Mother" />
      <mb-option value="father" label="Father" />
      <mb-option value="daughter" label="Daughter" />
      <mb-option value="son" label="Son" />
      <mb-option value="brother" label="Brother" />
      <mb-option value="sister" label="Sister" />
      <mb-option value="husband" label="Husband" />
      <mb-option value="wife" label="Wife" />
      <mb-option value="neighbor" label="Neighbor" />
      <mb-option value="other" label="Other" />
    </mb-select>
    <mb-input
      type="number"
      min="1000000000"
      max="9999999999"
      label="Attendant contact number"
      path="contact[0].telecom[0].value"
    />
  </div>
  <mb-submit>
    <sl-button size="large" class="mt-4 w-full" {loading} type="neutral">
      Save
    </sl-button>
  </mb-submit>
</mb-fhir-form>
