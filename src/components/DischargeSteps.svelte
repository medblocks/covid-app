<script lang="ts">
  import Admission from "./Admission.svelte";
  import Assessment from "./Assessment.svelte";
  import Donation from "./Donation.svelte";
  import { Link } from "svelte-routing";
  export let step: string;
  $: stepInt = parseInt(step);
  console.log(step + 1);
  export let ehrId: string;
  const steps = [
    {
      component: Donation,
      name: "Donations",
      icon: "wallet-fill",
    },
    {
      component: Assessment,
      name: "Final Monitoring",
      icon: "calendar2-check-fill",
    },
    { component: Admission, name: "Discharge", icon: "door-closed-fill" },
  ];
</script>

<div class="w-full pb-6 pt-8">
  <div class="flex">
    {#each steps as s, i}
      <div class="w-1/3">
        <div class="relative mb-2">
          {#if i > 0 && i !== steps.length}
            <div
              class="absolute flex align-center items-center align-middle content-center"
              style="width: calc(100% - 2.5rem - 1rem); top: 50%; transform: translate(-50%, -50%)"
            >
              <div
                class="w-full bg-gray-200 rounded items-center align-middle align-center flex-1 "
              >
                <div
                  class="bg-green-200 py-1 rounded w-0 w-full"
                  class:w-full={stepInt > i}
                  class:w-0={stepInt <= i}
                />
              </div>
            </div>
          {/if}
          <div
            class="w-10 h-10 mx-auto rounded-full text-lg text-white flex items-center bg-green-500"
            class:bg-green-500={stepInt > i}
          >
            <span class="text-center w-full" class:text-gray-600={stepInt <= i}>
              <sl-icon name={s.icon} />
            </span>
          </div>
        </div>

        <div class="text-xs text-center md:text-base">{s.name}</div>
      </div>
    {/each}
  </div>
</div>
<Link to={`discharge/${stepInt + 1}`}>
  <sl-button>Skip for now</sl-button>
</Link>
<svelte:component
  this={steps[stepInt - 1].component}
  {ehrId}
  redirectUrl={stepInt >= 3 ? `/admissions` : `${stepInt + 1}`}
/>
