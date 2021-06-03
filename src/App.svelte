<script>
  import PatientRegistration from "./components/PatientRegistration.svelte";
  import { Router, Link, Route } from "svelte-routing";
  import Layout from "./components/Layout.svelte";
  import AllPatientList from "./components/AllPatientList.svelte";
  import AdmissionList from "./components/AdmissionList.svelte";
  import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
  import Clinical from "./components/Clinical.svelte";
  setBasePath("/");
  console.log("Loaded App");
</script>

<Router>
  <Layout>
    <Route path="/" component={AllPatientList} />
    <Route path="admissions" component={AdmissionList} />
    <Route path="patient/" component={PatientRegistration} />
    <Route path="patient/:id" component={PatientRegistration} />
    <Route path="clinical/:ehrId/*" component={Clinical} />
  </Layout>
</Router>
