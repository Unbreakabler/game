<script lang="ts">
  import { Tabs, Tab } from "smelte/src/components/Tabs";

  import MineSkills from "./mine_skill_page.svelte";
  import FarmJobs from "./mine_mine_page.svelte";

  let items = [
    { id: "farm_jobs", component: FarmJobs, text: "Jobs" },
    { id: "mine_skill", component: MineSkills, text: "Skills" },
  ];

  let selected: string = items[0].id;
</script>

<Tabs bind:selected {items} class="bg-alert-300 text-white">
  <div slot="content" class="p-4">
    {#each items as item}
      <Tab id={item.id} bind:selected><svelte:component this={item.component} /></Tab>
    {/each}
  </div>
</Tabs>

<style>
</style>
