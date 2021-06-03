<script>
  import PatientRegistration from "./components/PatientRegistration.svelte";
  import { Router, Route } from "svelte-routing";
  import ProtectedRoute from './ProtectedRoute.svelte';
  import Layout from "./components/Layout.svelte";
  import PatientList from "./components/PatientList.svelte";
  import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
  import Clinical from "./components/Clinical.svelte";
  import SignIn from './components/SignIn.svelte'
  setBasePath("/");
  console.log("Loaded App");
</script>

<Router>
  <Layout>
    <Route path='/signin' component={SignIn} />
    <ProtectedRoute path="/" component={PatientList} />
    <ProtectedRoute path="patient/" component={PatientRegistration} />
    <ProtectedRoute path="patient/:id" component={PatientRegistration} />
    <ProtectedRoute path="clinical/:ehrId/*" component={Clinical} />
  </Layout>
</Router>
