<script lang="ts">
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import { resetSaveGame, saveToStorage } from "../gamelogic/util/saveloadfunctions";
  import { formatNumber } from "../gamelogic/util/utils";
  import Button from "smelte/src/components/Button";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: money = formatNumber(gameModelInstance.wallet.money, 2);

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

<div class="resource-container bg-secondary-400">
  <div class="money bg-secondary-400">
    {money}
    <div class="coin" />
  </div>
  <div>
    <Button color="secondary" on:click={saveGame}>Save</Button>
    <Button color="secondary" on:click={hardReset}>Hard Reset</Button>
  </div>
</div>

<style>
  .resource-container {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }
  .money {
    width: 300px;
    padding: 10px;
  }
  .coin {
    width: 15px;
    height: 15px;
    background-color: rgb(221, 184, 67);
    display: inline-block;
    border-radius: 100px;
    box-shadow: 1px 1px;
  }
  .save {
    margin-left: auto;
  }
</style>
