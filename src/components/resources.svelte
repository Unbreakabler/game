<script lang="ts">
  import { GameModel, gameModel, updateGameModel } from "../gamelogic/gamemodel";
  import { resetSaveGame, saveToStorage } from "../gamelogic/util/saveloadfunctions";
  import { formatNumber } from "../gamelogic/util/utils";
  import Button from "smelte/src/components/Button";
  import Coin from "./coin.svelte";

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
  <div class="money bg-secondary-400 whitespace-nowrap">
    {money}
    <Coin />
  </div>
  <div class="whitespace-nowrap mt-auto mb-auto">
    <Button color="secondary" on:click={saveGame}>Save</Button>
    <Button color="secondary" on:click={hardReset}>Hard Reset</Button>
  </div>
</div>

<style>
  .resource-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    padding: 5px;
  }
  .money {
    width: 300px;
    padding: 10px;
  }
  .save {
    margin-left: auto;
  }
</style>
