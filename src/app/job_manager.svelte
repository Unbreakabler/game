<script>
  // import { count } from "../gamelogic/store.ts";
  // import ProgressBar from "../components/progress_bar.svelte";
  // import Job1 from "../components/job_1.svelte";
  import JobBase from "../components/job_base.svelte"; 
  import { jobs } from '../gamelogic/jobs'
  
  $: job_list = jobs
</script>

<style>
  header {
    display: flex;
  }
  div {
    flex: 1
  }
</style>

<header>
  <div>Name</div>
  <div>Current Level</div>
  <div>Income</div>
  <div>Required Xp</div>
  <div>Max level Reached</div>
</header>

{#each job_list as job}
  <JobBase job={job} />
{/each}
