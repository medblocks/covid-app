<script>
  import PatientRegistration from "./components/PatientRegistration.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import Layout from "./components/Layout.svelte";
  import PatientList from "./components/PatientList.svelte";
  export let url = "";
  import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
  import Clinical from "./components/Clinical.svelte";
  import Assessment from "./components/Assessment.svelte";
  import Covid from "./components/CovidResult.svelte";
  setBasePath("/");
</script>

<Router {url}>
  <Layout>
    <Route path="/" component={PatientList} />
    <Route path="patient/" component={PatientRegistration} />
    <Route path="patient/:id" component={PatientRegistration} />
    <Route path="clinical/:ehrId" component={Clinical} />
    <Route path="clinical/:ehrId/daily" component={Assessment} />
    <Route path="clinical/:ehrId/daily/:compositionId" component={Assessment} />
    <Route path="clinical/:ehrId/covid" component={Covid} />
    <Route path="clinical/:ehrId/covid/:compositionId" component={Covid} />
  </Layout>
</Router>
