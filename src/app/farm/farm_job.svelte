<script lang="ts">
  import type { FarmJob } from "../../gamelogic/village/farmjob";
  import { gameModel, GameModel } from "../../gamelogic/gamemodel";

  import { formatNumber } from "../../gamelogic/util/utils";

  import ProgressBar from "../../components/progress_bar.svelte";
  import Coin from "../../components/coin.svelte";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  export let job: FarmJob;

  let current_exp = 0;
  let max_level_reached = 0;
  let total_exp_for_level = 0;
  let current_income = 0;
  let current_level = 0;

  $: current_level = job.level;
  $: current_exp = job.current_exp;
  $: max_level_reached = job.max_level;
  $: total_exp_for_level = job.getTotalExpToNextLevel();
  $: current_income = job.getCurrentIncome();

  function handleClick() {
    gameModelInstance.setActiveFarmJob(job.getAchievableName());
  }
</script>

<tr class="w-full" on:click={handleClick}>
  <td><ProgressBar current={current_exp} total={total_exp_for_level} name={job.getDisplayName()} /></td>
  <td>{current_level}</td>
  <td>{formatNumber(current_income, 2)}<Coin /></td>
  <td>{formatNumber(total_exp_for_level - current_exp, 2)}</td>
  <td>{max_level_reached}</td>
</tr>

<style>
  tr {
    display: flex;
  }
  td {
    flex: 1;
    padding: 4px;
    border: none;
  }

  td:first-child {
    flex-basis: 25%;
  }

  td:nth-child(2) {
    flex-basis: 8%;
  }
</style>
