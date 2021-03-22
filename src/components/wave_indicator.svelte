<script lang='ts'>
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import { ENEMY_MODIFIERS, ModifierId } from "../gamelogic/td/enemy_wave_generator";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: waves = [...gameModelInstance.tower_defense.waves];
  $: if (waves) waves.splice(0, 1)
  $: current_wave = gameModelInstance.tower_defense.getCurrentWave();

  const getMod = (mod_id: string) => {
    return ENEMY_MODIFIERS[mod_id as ModifierId]
  }

</script>

<div class="main">
  Current wave:
  <div class="wave">
    <div class="wave_type wave_{current_wave.wave_type}">
      {current_wave.enemy_type} - <div class={current_wave.enemy_type} /> x {current_wave.mob_count}
    </div>
    {#if current_wave.modifier_ids.length}
      <span class="modifiers">
        mods:
        {#each current_wave.modifier_ids as mod_id}
          {getMod(mod_id)?.name} 
        {/each}
      </span>
    {/if}
    <div>
      <span class="modifiers">wave: {current_wave.wave_difficulty}</span>
      <span class="modifiers">mob: {current_wave.mob_difficulty}</span>
    </div>
  </div>
  Upcoming waves:
  <div class="indicator">
    {#each waves as wave}
      <div class="wave">
        <div class="wave_type wave_{wave.wave_type}">
          {wave.enemy_type} - <div class={wave.enemy_type} /> x {wave.mob_count}
        </div>
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
    height: 500px;
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