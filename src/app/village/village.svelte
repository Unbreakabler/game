<script lang="ts">
  import Card from "smelte/src/components/Card";

  import VillageBuildingComponent from "./village_building.svelte";
  import { GameModel, gameModel } from "../../gamelogic/gamemodel";
  import type { VillageBuilding } from "../../gamelogic/village/villagebuilding";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  let buildings: VillageBuilding[];
  $: buildings = Array.from(gameModelInstance.village_buildings.values());

  export let selected: string;
</script>

<div class="building-container mb-5">
  {#each buildings as building}
    <VillageBuildingComponent {building} bind:selected />
  {/each}
</div>

<style>
  /* https://stackoverflow.com/questions/34274552/evenly-distribute-elements-in-columns */
  .building-container {
    justify-content: space-around;
    align-items: center;

    display: flex;
    flex: 1;
    flex-flow: row wrap;
  }
</style>
