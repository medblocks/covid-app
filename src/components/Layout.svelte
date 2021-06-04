<script lang="ts">
  import { onMount } from "svelte";

  import { Link } from "svelte-routing";
  import { token } from "../stores";

  const logout = () => {
    localStorage.clear();
    token.set(localStorage.getItem("token"));
  };

  let isAuthenticated: boolean;
</script>

<div class="container mx-auto px-4 sm:px-8 max-w-7xl">
  <div class="py-8">
    <nav class="flex mb-5 justify-between">
      <div>
        <Link to="/">
          <sl-button type="info">Home</sl-button>
        </Link>
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
