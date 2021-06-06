<script lang="ts">
  import { onMount } from "svelte";

  import { Link } from "svelte-routing";
  import { token } from "../stores";

  import { logout } from "../auth";
</script>

<div class="container mx-auto px-4 sm:px-8 max-w-7xl">
  <div class="py-8">
    <nav class="flex mb-5 justify-between">
      <div>
        <Link to="/">
          <sl-button type="text"
            ><sl-icon name="house-door" slot="prefix" />Home</sl-button
          >
        </Link>
        <sl-button
          type="text"
          on:click={() => {
            history.back();
          }}><sl-icon name="arrow-left" slot="prefix" />Go back</sl-button
        >
      </div>
      <div>
        {#if $token}
          <Link to="/" on:click={logout}>
            <sl-button>Signout</sl-button>
          </Link>
        {:else}
          <Link to="signin" on:click={logout}>
            <sl-button>Sign in</sl-button>
          </Link>
        {/if}
      </div>
    </nav>
    <slot />
  </div>
</div>
