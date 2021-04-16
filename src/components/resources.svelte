<script lang="ts">
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import { formatNumber } from "../gamelogic/util/utils";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  $: money = formatNumber(gameModelInstance.wallet.money, 2);

  $: resources = Object.entries(gameModelInstance.resources);
</script>

<div class="resource-container">
  <div class="money">
    <div>{money} </div>
    <div class="coin" />
    {#each resources as [key, val]}
      <div>{key.toLocaleUpperCase()}:{val} </div>
    {/each}
  </div>
</div>

<style lang='scss'>
  .resource-container {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    background: rgba(63, 63, 63, 0.5);
    border: 4px solid #ffffff;
    border-radius: 8px;
    max-width: 400px;
    transform: skew(-25deg);
  }
  .money {
    transform: skew(25deg);
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
