<script lang="ts">
  import { Tabs, Tab } from "smelte/src/components/Tabs";

  import FarmSkills from "./farm_skill_page.svelte";
  import FarmJobs from "./farm_jobs_page.svelte";

  let items = [
    { id: "farm_jobs", component: FarmJobs, text: "Jobs" },
    { id: "farm_skill", component: FarmSkills, text: "Skills" },
  ];

  let selected: string = items[0].id;
</script>

<Tabs bind:selected {items} class="bg-alert-300 text-white">
  <div slot="content">
    {#each items as item}
      <Tab id={item.id} bind:selected><svelte:component this={item.component} /></Tab>
    {/each}
  </div>
</Tabs>

<style>
</style>
