import "virtual:windi.css";
import App from "./App.svelte";
import "@shoelace-style/shoelace/dist/shoelace";
const app = new App({
  target: document.getElementById("app"),
});

export default app;
