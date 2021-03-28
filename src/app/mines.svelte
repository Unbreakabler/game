<script lang='ts'>
  /**
   * Each mine is made of few "components".
   * 1. The mine itselfs which creates resources on a timer, this timer can be upgraded to be reduced.
   * 2. The resource counter, which tracks the amount of the resource that is owned.
   * 3. The UI to upgrade the mine using gold gained from the TD (currently gained in the farm)
  */
  import MineComponent from "../components/mine.svelte";
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import type { Mine } from "../gamelogic/village/mine";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  let mines: Mine[];
  $: mines = Array.from(gameModelInstance.mines.values());

</script>

{#each mines as mine}
  {#if mine.areRequirementsMet(gameModelInstance.achievables)}
    <MineComponent {mine} />
  {:else}
    <div>
      {#each mine.requirements as r}
        Requires {gameModelInstance.achievables.get(r.achievable_name)?.getDisplayName()} level {r.level_required}
      {/each}
    </div>
  {/if}
{/each}

<style></style>