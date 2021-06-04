<script>
  import { Link, navigate } from "svelte-routing";
  import { token } from "../stores";
  let username = "";
  let password = "";
  const login = (username, password) => {
    console.log(username, password);
    localStorage.setItem("token", "1");
    token.set(localStorage.getItem("token"));
    navigate("/", { replace: true });
  };
</script>

<div class="flex flex-col justify-center items-center gap-2">
  <h1 class="text-lg font-bold">Sign in</h1>
  <sl-input
    value={username}
    placeholder="Username"
    on:sl-input={(e) => (username = e.target.value)}
  />
  <sl-input
    type="password"
    value={password}
    placeholder="Password"
    on:sl-input={(e) => (password = e.target.value)}
  /><sl-button on:click={() => login(username, password)} type="default"
    >Sign in</sl-button
  >
</div>
