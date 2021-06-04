<script>
  import { Route, Link } from "svelte-routing";
  import accessDenied from "./components/accessDenied.svelte";
  import { token } from "./stores";
  export let path;
  export let component;
</script>

{#if $token}
  <Route {path} {component} />
{:else}
  <Route {path} component={accessDenied} />
{/if}
