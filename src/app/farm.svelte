<script lang="ts">
  import FarmJobComponenent from "../components/farm_job.svelte";
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import type { FarmJob } from "../gamelogic/village/farmjob";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  let jobs: FarmJob[];
  $: jobs = Array.from(gameModelInstance.farm_jobs.values());
</script>

<header>
  <div>Name</div>
  <div>Current Level</div>
  <div>Income</div>
  <div>Required Xp</div>
  <div>Max level Reached</div>
</header>

{#each jobs as job}
  {#if job.areRequirementsMet(gameModelInstance.achievables)}
    <FarmJobComponenent {job} />
  {:else}
    <row>
      <div>
        {#each job.requirements as r}
          Requires {gameModelInstance.achievables.get(r.achievable_name)?.getDisplayName()} level {r.level_required}
        {/each}
      </div>
    </row>
  {/if}
{/each}

<style>
  header {
    display: flex;
  }
  div {
    flex: 1;
  }
</style>
