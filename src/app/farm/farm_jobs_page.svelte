<script lang="ts">
  import FarmJobComponenent from "./farm_job.svelte";
  import { GameModel, gameModel } from "../../gamelogic/gamemodel";
  import type { FarmJob } from "../../gamelogic/village/farmjob";
  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));
  let jobs: FarmJob[];
  $: jobs = Array.from(gameModelInstance.farm_jobs.values());
  $: {
    let i = jobs.findIndex((job) => !job.areRequirementsMet(gameModelInstance.achievables));
    jobs = jobs.slice(0, i + 1);
  }
</script>

<div class="info-container">
  <div>Farm Status Here</div>
</div>
<div class="info-container mt-4">
  <div>Config settings here</div>
</div>

<table class="w-full mt-4 info-container">
  <tr class="w-full text-left bg-primary-500 text-white rounded-t">
    <th>Job</th>
    <th>Level</th>
    <th>Income/s</th>
    <th>Xp to level</th>
    <th>Max level</th>
  </tr>

  {#each jobs as job}
    {#if job.areRequirementsMet(gameModelInstance.achievables)}
      <FarmJobComponenent {job} />
    {:else}
      <tr class="w-full">
        <td>
          {#each job.requirements as r}
            <span>Requires {gameModelInstance.achievables.get(r.achievable_name).getDisplayName()} level {r.level_required}</span>
          {/each}
        </td>
        <td /> <td /><td /><td />
      </tr>
    {/if}
  {/each}
</table>

<style>
  .info-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    background-color: white;
    border-radius: 0.25rem;
    --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
  .info-container > div {
    justify-content: center;
    align-items: center;
  }
  th:first-child,
  td:first-child {
    flex-basis: 25%;
  }
  th:nth-child(2),
  td:nth-child(2) {
    flex-basis: 8%;
  }
  th {
    font-size: 110%;
    font-weight: normal;
  }
  tr {
    display: flex;
    flex-flow: row nowrap;
    padding: 2px;
  }
  td {
    margin: 4px;
  }
  th,
  td {
    flex: 1;
    border: none;
  }
</style>
