<script lang='ts'>
  import { GameModel, gameModel } from "../gamelogic/gamemodel";

  let gameModelInstance: GameModel; 
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: total = gameModelInstance.tower_defense.current_wave_info.total
  $: spawned = gameModelInstance.tower_defense.current_wave_info.spawned
  $: alive = gameModelInstance.tower_defense.current_wave_info.alive
  $: killed = gameModelInstance.tower_defense.current_wave_info.killed
  $: leaked = gameModelInstance.tower_defense.current_wave_info.leaked
  $: lives = gameModelInstance.tower_defense.current_wave_info.lives
</script>

<div class="main">
  <div>Spawned: {spawned} / {total} </div> 
  <div>Alive: {alive} / {spawned} </div> 
  <div>Leaked: {leaked}</div>
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
  }
</style>
