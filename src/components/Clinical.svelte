<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Overview from "./Overview.svelte";
  import Assessment from "./Assessment.svelte";
  import Covid from "./CovidResult.svelte";
  import PatientBanner from "./PatientBanner.svelte";
  import Admission from "./Admission.svelte";
  import DischargeSteps from "./DischargeSteps.svelte";
  import Donation from "./Donation.svelte";
  export let ehrId;
  console.log("Loaded Clinical");
</script>

<Router>
  <PatientBanner {ehrId}>
    <Route path="/" component={Overview} />
    <Route path="/donation" component={Donation} />
    <Route path="daily" component={Assessment} />
    <Route path="daily/:compositionId" component={Assessment} />
    <Route path="covid" component={Covid} />
    <Route path="covid/:compositionId" component={Covid} />
    <Route path="admission" component={Admission} />
    <Route path="discharge/:step" component={DischargeSteps} />
  </PatientBanner>
</Router>
