<script lang="ts">
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import type { TargetingMode, TowerInfo } from "../gamelogic/td/tower_defense";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: selection = gameModelInstance.tower_defense.selection
  let tower_info: TowerInfo | undefined = undefined;
  $: if (selection) {
    tower_info = gameModelInstance.tower_defense.getTower(selection.id) || undefined;
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
    dps = tower_info.attributes.damage * (1000 / tower_info.attributes.attack_speed)
  }

  // TODO(jon): Once there are tower types with unique targeting modes this should be pulled from tower info
  const targeting_modes: TargetingMode[] = ['first', 'last', 'strongest', 'closest'];

  const changeTargetingMode = (x: number) => {
    // find index of targeting_mode
    // select next/prev item in list, or roll back to start (modulo)
    const cur_index = targeting_modes.findIndex(v => v === tower_info?.status.targeting_mode)
    const new_index = (cur_index + x) % targeting_modes.length;
    const new_targeting_mode = targeting_modes[new_index]
    if (tower_info) tower_info.status.targeting_mode = new_targeting_mode;
  }

</script>

{#if tower_info}
  <div class='details'>
    <div>
      <span>targeting: {tower_info.status.targeting_mode}</span>
      <button on:click={() => changeTargetingMode(1)}>Next</button>
      <button on:click={() => changeTargetingMode(-1)}>Prev</button>
    </div>
    <div>lifetime kills: {tower_stats.kills.lifetime + tower_stats.kills.prestige}</div>
    <div>prestige kills: {tower_stats.kills.prestige}</div>
    <div>lifetime damage: {tower_stats.damage.lifetime + tower_stats.damage.prestige}</div>
    <div>prestige damage: {tower_stats.damage.prestige}</div>
    <div>{tower_info.status.type}</div>
    <div>dps: {dps}</div>
    <div>damage per hit: {tower_info.attributes.damage}</div>
    <div>attack time: {tower_info.attributes.attack_speed/1000}s</div>
  </div>
{/if}

<style>
  .details {

  }
</style>
