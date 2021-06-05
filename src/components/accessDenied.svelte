<script>
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  onMount(() => {
    navigate("/signin", { replace: true });
  });
</script>
