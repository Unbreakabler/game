<script lang="ts">
import { gameModel, GameModel } from "../gamelogic/gamemodel";
import type { Job } from '../gamelogic/jobs';
import { formatNumber } from "../gamelogic/utils";

import ProgressBar from "./progress_bar.svelte";

export let job: Job;

let gameModelInstance : GameModel;
gameModel.subscribe(m => gameModelInstance = m);

$: game_model_job = gameModelInstance.saveData.jobs[job.id];

let current_exp = 0
let max_level_reached = 0
let total_exp_for_level = 0
let current_income = 0
let current_level = 0;
$: if (game_model_job) {
  current_level = game_model_job.current_level
  current_exp = game_model_job.current_exp
  max_level_reached = game_model_job.max_level_reached
  // move this calculations into functions 
  total_exp_for_level = job.getTotalExpForLevel(job.base_exp, job.multiplier, current_level)
  current_income = job.base_income * Math.pow(job.multiplier, current_level)
}
</script>

<style>
  row {
    display: flex;
  }
  div {
    flex: 1;
  }
</style>

<row>
  <div><ProgressBar current={current_exp} total={total_exp_for_level} name={job.name} /></div>
  <div>{current_level}</div>
  <div>{formatNumber(current_income, 2)}</div>
  <div>{formatNumber(total_exp_for_level - current_exp, 2)}</div>
  <div>{max_level_reached}</div>
</row>