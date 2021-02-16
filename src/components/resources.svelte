<script lang="ts">
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import { saveToStorage } from "../gamelogic/util/saveloadfunctions";
  import { formatNumber } from "../gamelogic/util/utils";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: money = formatNumber(gameModelInstance.wallet.money, 2);

  function saveGame() {
    saveToStorage(gameModelInstance);
  }
</script>

<div class="container">
  <div class="money">
    {money}
    <div class="coin" />
  </div>
  <button class="save" on:click={saveGame}>Save</button>
</div>

<style>
  .container {
    display: flex;
    background-color: rgb(33, 178, 166);
    padding: 5px;
  }
  .money {
    background-color: rgb(30, 161, 152);
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
