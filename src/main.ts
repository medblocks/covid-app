import "./tailwind.css";
import App from "./App.svelte";
import "@shoelace-style/shoelace/dist/components/tab/tab";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
