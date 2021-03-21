<script lang='ts'>
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import { ENEMY_MODIFIERS, ModifierId } from "../gamelogic/td/enemy_wave_generator";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: waves = gameModelInstance.tower_defense.waves;

  const getMod = (mod_id: string) => {
    return ENEMY_MODIFIERS[mod_id as ModifierId]
  }

</script>

<div class="main">
  Next wave:
  <div class="indicator">
    {#each waves as wave}
      <div class="wave">
        <div class="wave_type wave_{wave.wave_type}">
          {wave.enemy_type} - <div class={wave.enemy_type} /> x {wave.mob_count}
        </div>
        <!-- <span class="mob_count">count: </span> -->
        {#if wave.modifier_ids.length}
          <span class="modifiers">
            mods:
            {#each wave.modifier_ids as mod_id}
              {getMod(mod_id)?.name} 
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
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
  }
  .indicator {
    display: flex;
    flex-direction: column;
    height: 600px;
    overflow-y: scroll;
    min-width: 200px;
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