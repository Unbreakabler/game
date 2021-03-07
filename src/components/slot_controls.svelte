<script lang='ts'>
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import TowerSlot from "./tower_slot.svelte";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  const towerInfo = (tower_id: string) => gameModelInstance.tower_defense.getTower(tower_id)

  $: slots = gameModelInstance.tower_defense.slots || []
  $: slot_tower_info = slots.map(slot_id => slot_id ? towerInfo(slot_id): null)

</script>

<div class="towers">
  {#each slots as tower_id, index}
    <TowerSlot tower_id={tower_id} tower_info={slot_tower_info[index]} />
  {/each}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .towers {
    margin-top:10px;
    display: flex;
    flex-direction: row;
    justify-content: left;
  }
</style>