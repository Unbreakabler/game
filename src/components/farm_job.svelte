<script lang="ts">
  import type { FarmJob } from "./../gamelogic/village/farmjob";
  import { gameModel, GameModel } from "../gamelogic/gamemodel";

  import { formatNumber } from "../gamelogic/util/utils";

  import ProgressBar from "./progress_bar.svelte";

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

<row on:click={handleClick}>
  <div><ProgressBar current={current_exp} total={total_exp_for_level} name={job.display_name} /></div>
  <div>{current_level}</div>
  <div>{formatNumber(current_income, 2)}</div>
  <div>{formatNumber(total_exp_for_level - current_exp, 2)}</div>
  <div>{max_level_reached}</div>
</row>

<style>
  row {
    display: flex;
  }
  div {
    flex: 1;
  }
</style>
