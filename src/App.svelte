<script>
  import PatientRegistration from "./components/PatientRegistration.svelte";
  import { Router, Route } from "svelte-routing";
  import ProtectedRoute from "./ProtectedRoute.svelte";
  import Layout from "./components/Layout.svelte";
  import Home from "./components/Home.svelte";
  import AdmissionList from "./components/AdmissionList.svelte";

  import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
  import "@shoelace-style/shoelace/dist/themes/light.css";
  import Clinical from "./components/Clinical.svelte";
  import SignIn from "./components/SignIn.svelte";
  import HomePageList from "./components/HomePageList.svelte";
  setBasePath("/");
</script>

<Router>
  <Layout>
    <Route path="/signin" component={SignIn} />
    <Route path="/signin/:state" component={SignIn} />
    <ProtectedRoute path="/" component={Home} />
    <ProtectedRoute path="list/" component={Home} />
    <ProtectedRoute path="list/:view" component={HomePageList} />
    <ProtectedRoute path="admissions" component={AdmissionList} />
    <ProtectedRoute path="patient/" component={PatientRegistration} />
    <ProtectedRoute path="patient/:id" component={PatientRegistration} />
    <ProtectedRoute path="clinical/:ehrId/*" component={Clinical} />
  </Layout>
</Router>
