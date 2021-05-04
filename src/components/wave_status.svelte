<script lang='ts'>
  import { GameModel, gameModel } from "../gamelogic/gamemodel";

  let gameModelInstance: GameModel; 
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: total = gameModelInstance.tower_defense.current_wave_info.total
  $: spawned = gameModelInstance.tower_defense.current_wave_info.spawned
  $: alive = gameModelInstance.tower_defense.current_wave_info.alive
  $: killed = gameModelInstance.tower_defense.current_wave_info.killed
  $: leaked = gameModelInstance.tower_defense.current_wave_info.leaked
  $: wave = gameModelInstance.tower_defense.current_wave_info.level;
</script>

<div class="main">
  <div>S: {spawned}/{total}</div> 
  <div>A: {alive}</div> 
  <div>K: {killed}</div> 
  <div>L: {leaked}</div>
  <div>wave: {wave}</div>
</div>

<style lang='scss'>
  .main {
    display: flex;
    flex-direction: row;
    padding: 0 10px;
    background: rgba(63, 63, 63, 0.5);
    border: 4px solid #ffffff;
    border-radius: 8px;
    max-width: 400px;
    transform: skew(-25deg);
    :not(:first-child) {
      padding-left: 5px;
    }
    div {
      transform: skew(25deg);
    }
  }
</style>
