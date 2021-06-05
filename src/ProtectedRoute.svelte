<script>
  import { Route } from "svelte-routing";
  import accessDenied from "./components/accessDenied.svelte";
  import { token } from "./stores";
  export let path;
  export let component;
  import { onMount } from "svelte";
  import { registerAxios } from "./auth";
  onMount(() => {
    if ($token) {
      registerAxios($token);
    }
  });
</script>

{#if $token}
  <Route {path} {component} />
{:else}
  <Route {path} component={accessDenied} />
{/if}
