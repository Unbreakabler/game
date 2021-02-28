<script lang="ts">
  import { Tabs, Tab } from "smelte/src/components/Tabs";

  import FarmSkills from "../components/farm_skills.svelte";
  import FarmJobs from "../components/farm_jobs.svelte";

  import { gameModel, GameModel } from "../gamelogic/gamemodel";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  let items = [
    { id: "farm_jobs", component: FarmJobs, text: "Jobs" },
    { id: "farm_skill", component: FarmSkills, text: "Skills" },
  ];

  let selected: string = items[0].id;
</script>

<Tabs bind:selected {items} class="bg-primary-300 text-white z-10">
  <div slot="content">
    {#each items as item}
      <Tab id={item.id} bind:selected><svelte:component this={item.component} bind:selected /></Tab>
    {/each}
  </div>
</Tabs>
