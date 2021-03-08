<script lang="ts">
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
import type { TowerInfo } from "../gamelogic/td/tower_defense";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: selection = gameModelInstance.tower_defense.selection
  let tower_info: TowerInfo | undefined = undefined;
  $: if (selection) {
    tower_info = gameModelInstance.tower_defense.getTower(selection.id)
  } else {
    tower_info = undefined;
  }

  let dps: number = 0;
  $: if (tower_info) {
    dps = tower_info.damage * ((1000 / tower_info.attack_speed))
  }
</script>

{#if tower_info}
  <div class='details'>
    <div class='description'></div>
    <div>lifetime damage: {tower_info.damage_dealt_this_prestige}</div>
    <div>{tower_info.type}</div>
    <div>dps: {dps}</div>
    <div>damage per hit: {tower_info.damage}</div>
    <div>attack time: {tower_info.attack_speed/1000}s</div>
  </div>
{/if}

<style>
  .details {

  }
  .description {
    
  }
  .name {

  }
  .dps {

  }
  .attack_speed {

  }
</style>
