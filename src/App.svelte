<script>
  import PatientRegistration from "./components/PatientRegistration.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import Layout from "./components/Layout.svelte";
  import PatientList from "./components/PatientList.svelte";
  export let url = "";
  import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
  import Clinical from "./components/Clinical.svelte";
  setBasePath("/");
</script>

<Router {url}>
  <Layout>
    <Route path="patient/" component={PatientRegistration} />
    <Route path="patient/:id" component={PatientRegistration} />
    <Route path="clinical/:ehr" component={Clinical} />
    <Route path="/" component={PatientList} />
  </Layout>
</Router>
