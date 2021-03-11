<script lang="ts">
  import { Tabs, Tab } from "smelte/src/components/Tabs";
  import Laboratory from "./laboratory.svelte";
  import Blacksmith from "./blacksmith.svelte";
  import Farm from "./farm/farm.svelte";
  import Village from "./village/village.svelte";
  import Workshop from "./workshop.svelte";

  import { gameModel, GameModel } from "../gamelogic/gamemodel";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  let items = [
    { id: "village", component: Village, text: "Village", locked: false },
    { id: "farm", component: Farm, text: "Farm", name: "villagebuilding_farm", locked: false },
    { id: "workshop", component: Workshop, text: "Workshop", name: "villagebuilding_workshop", locked: false },
    { id: "blacksmith", component: Blacksmith, text: "Blacksmith", name: "villagebuilding_blacksmith", locked: false },
    { id: "laboratory", component: Laboratory, text: "Laboratory", name: "villagebuilding_laboratory", locked: false },
  ];

  let filtered = items;
  $: filtered = items.filter((item) => {
    if (!item.name) return true;
    const b = gameModelInstance.village_buildings.get(item.name);

    if (b === undefined) return true;
    if (b.level < 1) return false;
    return true;
  });

  let selected: string = items[0].id;
</script>

<Tabs bind:selected items={filtered} class="bg-primary-500 text-white">
  <div slot="content">
    {#each filtered as item}
      <Tab id={item.id} {selected}><svelte:component this={item.component} bind:selected /></Tab>
    {/each}
  </div>
</Tabs>
