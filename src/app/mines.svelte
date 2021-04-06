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

  let buy_index = 0;
  const buy_values = [1, 5, 10, 25];
  $: purchase_quantity = buy_values[buy_index % buy_values.length]

</script>

<button on:click={() => buy_index++}>BUY {purchase_quantity}</button>
{#each mines as mine}
  {#if mine.areRequirementsMet(gameModelInstance.achievables)}
    <MineComponent {mine} purchase_quantity={purchase_quantity} />
  {:else}
    <div>
      {#each mine.requirements as r}
        Requires {gameModelInstance.achievables.get(r.achievable_name)?.getDisplayName()} level {r.level_required}
      {/each}
    </div>
  {/if}
{/each}

<style>
  button {
    /* width: 10rem; */
    margin: 5px;
    padding: 5px 15px;
    font-size: 30px;
    color: #fff;
    background-color: rgb(95, 95, 95);
    border: 3px solid rgb(184, 184, 184);
  }
</style>