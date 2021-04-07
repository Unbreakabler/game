<script lang="ts">
  import { GameModel, gameModel, updateGameModel } from "../gamelogic/gamemodel";
  import { resetSaveGame, saveToStorage } from "../gamelogic/util/saveloadfunctions";
  import { formatNumber } from "../gamelogic/util/utils";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: money = formatNumber(gameModelInstance.wallet.money, 2);

  $: resources = Object.entries(gameModelInstance.resources);

  function saveGame() {
    saveToStorage(gameModelInstance);
  }
  function hardReset() {
    if (window.confirm("You will lose all progress. Are you sure?")) {
      resetSaveGame();
      saveGame();

    }
  }
</script>

<div class="resource-container">
  <div class="money">
    <div>{money} </div>
    <div class="coin" />
    {#each resources as [key, val]}
      <div>{key.toLocaleUpperCase()}:{val} </div>
    {/each}
  </div>
  <!-- <Button color="secondary" on:click={saveGame}>Save</Button>
  <Button color="secondary" on:click={hardReset}>Hard Reset</Button> -->
</div>

<style lang='scss'>
  .resource-container {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    color: black;
    -webkit-text-fill-color: white; /* Will override color (regardless of order) */
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: black;
    font-weight: 900;
    font-size: 24px;
    font-family: 'Courier New', Courier, monospace;
  }
  .money {
    width: 400px;
    padding: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    div {
      margin-right: 5px;
    }
  }
  :global(.coin) {
    width: 15px;
    height: 15px;
    background-color: rgb(221, 184, 67);
    display: inline-block;
    border-radius: 100px;
    box-shadow: 1px 1px;
  }
</style>
