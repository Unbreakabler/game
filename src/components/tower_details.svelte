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
  let tower_stats: any = undefined;
  $: if (selection) {
    tower_stats = gameModelInstance.tower_defense.getTowerStats(selection.id)
  } else {
    tower_stats = undefined;
  }

  let dps: number = 0;
  $: if (tower_info) {
    dps = tower_info.damage * ((1000 / tower_info.attack_speed))
  }
</script>

{#if tower_info}
  <div class='details'>
    <div>lifetime kills: {tower_stats.kills.lifetime + tower_stats.kills.prestige}</div>
    <div>prestige kills: {tower_stats.kills.prestige}</div>
    <div>lifetime damage: {tower_stats.damage.lifetime + tower_stats.damage.prestige}</div>
    <div>prestige damage: {tower_stats.damage.prestige}</div>
    <div>{tower_info.type}</div>
    <div>dps: {dps}</div>
    <div>damage per hit: {tower_info.damage}</div>
    <div>attack time: {tower_info.attack_speed/1000}s</div>
  </div>
{/if}

<style>
  .details {

  }
</style>
