<script lang='ts'>
  import { GameModel, gameModel } from "../gamelogic/gamemodel";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: waves = gameModelInstance.tower_defense.waves;

</script>

<div class="indicator">
  Next wave:
  {#each waves as wave}
    <div class="wave">
      <div class="wave_type wave_{wave.wave_type}">
        {wave.enemy_type} - <div class={wave.enemy_type} /> x {wave.mob_count}
      </div>
      <!-- <span class="mob_count">count: </span> -->
      {#if wave.modifiers.length}
        <span class="modifiers">
          mods:
          {#each wave.modifiers as mod}
            {mod.name} 
          {/each}
        </span>
      {/if}
      <div>
        <span class="modifiers">wave: {wave.wave_difficulty}</span>
        <span class="modifiers">mob: {wave.mob_difficulty}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .indicator {
    display: flex;
    flex-direction: column;
  }
  .wave_type {
    display: flex;
  }
  .wave {
    background: rgba(202, 202, 202, 0.521);
    padding: 5px;
    margin: 5px;
  }
  .wave_normal {
    color: #fff;
  }
  .wave_magic {
    color: blue;
  }
  .wave_rare {
    color: yellow;
  }

  .green_knight {
    display: inline-block;
    width: 20px;
    height: 32px;
    background-image: url('static/green_knight.png');
  }
</style>