<script lang="ts">
  import { gameModel } from "../gamelogic/gamemodel";
  import { formatNumber } from "../gamelogic/utils";
  $: money = formatNumber($gameModel.saveData.money, 2);
</script>

<div class="container">
  <div class="money">
    {money}
    <div class="coin"></div>
  </div>
</div>

<style>
  .container {
    background-color: rgb(33,178,166);
    padding: 5px;
  }
  .money {
    background-color: rgb(30,161,152);
    width: 300px;
    padding: 10px;

  }
  .coin {
    width: 15px;
    height: 15px;
    background-color: rgb(221,184,67);
    display: inline-block;
    border-radius: 100px;
    box-shadow: 1px 1px;
  }
</style>