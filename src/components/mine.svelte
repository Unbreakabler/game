<script lang='ts'>
  import type { Mine } from "../gamelogic/village/mine";
  import { gameModel, GameModel } from "../gamelogic/gamemodel";

  import { formatNumber } from "../gamelogic/util/utils";

  import ProgressBar from "./progress_bar.svelte";
  import type { MINE } from "../gamelogic/village/mines";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  export let mine: Mine;
  export let purchase_quantity: number = 0;

  const icon_class = mine.short_name as string

  const manuallyMine = () => {
    mine.manuallyMine()
  }

  const purchaseMine = () => {
    mine.requestLevelUp(gameModelInstance.wallet, purchase_amount)
  }

  $: is_active = mine.active;
  $: max_level_affordable = Math.max(mine.getMaxLevelAffordable(gameModelInstance.wallet.money), 1)
  $: purchase_amount = Math.min(purchase_quantity, max_level_affordable)
  $: purchase_cost = mine.getTotalMoneyToLevel(purchase_amount)

  $: button_text = is_active ? `Level Up x${purchase_amount}` : `Buy Lv. ${purchase_amount}`
  $: is_affordable = gameModelInstance.wallet.money >= purchase_cost
  $: button_class = is_affordable ? 'affordable' : 'non-affordable'

</script>

<div class="container">
  <row>
    <div on:click={manuallyMine} class={icon_class}></div>
    <column class="mine-info">
      <row>{mine.display_name} - Lv. {mine.level} - Produces: {mine.production}</row>
      <ProgressBar current={mine.current_timer_ms} total={mine.mine_timer_ms} name={mine.getDisplayName()} />
    </column>
    <button class={button_class} on:click={purchaseMine}>
      <div class="cost">
        <div class="coin" /> {formatNumber(purchase_cost, 0)}
      </div>
      <div class="purchase-info">
        {button_text}
      </div>
    </button>
  </row>
</div>

<style lang='scss'>
  .container {
    background-color: grey;
    margin: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  row {
    display: flex;
  }
  column {
    margin: 0px 10px;
  }

  button {
    width: 15rem;
    color: #fff;
    display: flex;
    flex-direction: column;
  }
  .affordable {
    background-color: #DE9B61;
    border: 2px solid #BD7639;
    .cost {
      background-color: #98541A;
    }
  }
  .non-affordable {
    background-color: #7a7a7a;
    border: 2px solid #c3c3c3;
    .cost {
      background-color: #414141;
    }
  }

  .mine-info {
    flex: 1;
    align-items: flex-end;
  }


  .purchase-info {
    flex: 1;
  }

  
  .dirt {
    background-image: url('static/ore.png');
    background-size: contain;
    background-color: rgba(167, 68, 29, 0.966);
    background-blend-mode: multiply;
    width: 4rem;
    height: 4rem;
  }
  .stone {
    background-image: url('static/ore.png');
    background-size: contain;
    background-color: rgba(197, 197, 197, 0.966);
    background-blend-mode: multiply;
    width: 4rem;
    height: 4rem;
  }
</style>