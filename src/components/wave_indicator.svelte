<script lang='ts'>
import { beforeUpdate } from "svelte";

  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import { ENEMY_MODIFIERS } from "../gamelogic/td/enemy_wave_generator";
  import type { ModifierId } from '../gamelogic/td/enemy_wave_generator'
  import { EnemyType } from '../gamelogic/td/stats_base_enemies'

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: waves = [...gameModelInstance.tower_defense.waves];
  $: if (waves) waves.splice(0, 1)
  $: current_wave = gameModelInstance.tower_defense.getCurrentWave();
  $: current_enemy_image = `static/${EnemyType[current_wave.enemy_type]}.png`

  const getMod = (mod_id: string) => {
    return ENEMY_MODIFIERS[mod_id as ModifierId]
  }


</script>

<div class="main">
  Current wave:
  <div class="wave">
    <div class="wave_type wave_{current_wave.wave_type}">
      <div class='enemy' style="background-image: url({current_enemy_image})" /> x {current_wave.mob_count}
    </div>
    {#if current_wave.modifier_ids.length}
      <span class="modifiers">
        {#each current_wave.modifier_ids as mod_id}
          {getMod(mod_id)?.name} 
        {/each}
      </span>
    {/if}
    <div>
      <span class="modifiers">wave difficulty: {Math.floor(current_wave.wave_difficulty)}</span>
    </div>
  </div>
  Upcoming waves:
  <div class="indicator">
    {#each waves as wave}
      <div class="wave">
        <div class="wave_type wave_{wave.wave_type}">
         <div class='enemy' style="background-image: url({`static/${EnemyType[wave.enemy_type]}.png`})" /> x {wave.mob_count}
        </div>
        {#if wave.modifier_ids.length}
          <span class="modifiers">
            {#each wave.modifier_ids as mod_id}
              {getMod(mod_id)?.name} 
            {/each}
          </span>
        {/if}
        <div>
          <span class="modifiers">wave difficulty: {Math.floor(wave.wave_difficulty)}</span>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .main {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 200px;
  }
  .indicator {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
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

  .enemy {
    display: inline-block;
    width: 20px;
    height: 32px;
  }
</style>