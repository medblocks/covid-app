<script>
  import PatientRegistration from "./components/PatientRegistration.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import Layout from "./components/Layout.svelte";
  import PatientList from "./components/PatientList.svelte";
  export let url = "";
  import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
  import Clinical from "./components/Clinical.svelte";
  import Assessment from "./components/Assessment.svelte";
  setBasePath("/");
</script>

<Router {url}>
  <Layout>
    <Route path="patient/" component={PatientRegistration} />
    <Route path="patient/:id" component={PatientRegistration} />
    <Route path="clinical/:ehrId" component={Clinical} />
    <Route path="clinical/:ehrId/daily" component={Assessment} />
    <Route path="clinical/:ehrId/daily/:compositionId" component={Assessment} />
    <Route path="/" component={PatientList} />
  </Layout>
</Router>
