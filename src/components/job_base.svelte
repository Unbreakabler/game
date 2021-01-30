<script>
import { count } from "../gamelogic/store";

import ProgressBar from "./progress_bar.svelte";

export let job_name;
export let base_income;
export let base_exp;
export let income_level_multiplier;
export let xp_level_multiplier;
export let max_level;
export let current_level;
export let current_exp;
export let exp_per_second;

let required_exp = base_exp;
let income = base_income;
$: if (current_level > 0) {
  required_exp = base_exp
  for(i = 0; i < current_level; i++){
    required_exp = required_exp*xp_level_multiplier;
    income = income*income_level_multiplier;
  }
}
</script>

<ProgressBar current={current_exp} total={required_exp} name={job_name} />
<div>level: {current_level}</div>
<div>income: {income}</div>
<div>Xp remaining: {required_exp - current_exp}</div>
<div>Max Level: {max_level}</div>