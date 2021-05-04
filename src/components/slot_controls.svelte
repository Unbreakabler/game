<script lang='ts'>
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import type { TowerId } from "../gamelogic/td/tower_defense";
  import TowerSlot from "./tower_slot.svelte";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  const towerInfo = (tower_id: TowerId) => {
    return gameModelInstance.tower_defense.getTower(tower_id)
  }

  $: slots = gameModelInstance.tower_defense.slots
  $: slot_tower_info = slots.map(slot_id => slot_id ? towerInfo(slot_id): null)
  
  $: selected_tower_info = gameModelInstance.tower_defense.selection?.id ? towerInfo(gameModelInstance.tower_defense.selection?.id) : null;
</script>

<div class="container">
  {#if selected_tower_info}
    <div class="details">
      {selected_tower_info.status.id}
    </div>
  {/if}
  <div class="tower-container">
    {#each slots as tower_id, index}
      <div class="towers">
        <TowerSlot tower_id={tower_id} tower_info={slot_tower_info[index]} />
      </div> 
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .tower-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .towers {
    /* margin-top: 10px; */
    display: flex;
    flex-direction: row;
    justify-content: left;
    background: #ffffff;
  }
  .details {
    background-color: lightblue;
  }
</style>