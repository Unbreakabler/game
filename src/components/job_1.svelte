<script>
import JobBase from "./job_base.svelte";

const job_name = 'job_1'
const base_income = 1
const base_exp = 100
const income_level_multiplier = 1.1;
const xp_level_multiplier = 1.1;
const max_level = 0;
const current_level = 10;
const current_exp = 0;
const exp_per_second = 10;

</script>

<JobBase 
  job_name={job_name} 
  base_income={base_income}
  base_exp={base_exp}
  income_level_multiplier={income_level_multiplier}
  xp_level_multiplier={xp_level_multiplier}
  max_level={max_level}
  current_level={current_level}
  current_exp={current_exp}
  exp_per_second={exp_per_second} />