<script lang="ts">
  import Resources from "../components/resources.svelte";
  import Tabs from "../components/tabs.svelte";
  import Blacksmith from "./blacksmith.svelte";
  import Game from "./game.svelte";
  import Farm from "./farm.svelte";
  import Village from "./village.svelte";
  import Workshop from "./workshop.svelte";

  let url = '/';

  const goto = (path: string) => {
    url = path
  }

  const routes = {
    '/': Village,
    '/farm': Farm,
    '/workshop': Workshop,
    '/blacksmith': Blacksmith,
  }
</script>

<div class="main-container">
  <Resources />
  <div class="game-container">
    <div class="menu">
      <Tabs goto={goto} />
      {#each Object.entries(routes) as [key, val] (key)}
        {#if url === key}
          <svelte:component this="{val}" class="tab" />
        {/if}
      {/each}
    </div>
    <Game />
  </div>
</div>

<style>
  .main-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .game-container {
    display: flex;
    flex: 1;
  }
  @media only screen and (max-width: 1200px) {
    .game-container {
      flex-direction: column;
    }
  }
  .menu {
    display: flex;
    flex-direction: column;
    flex: 1
  }
</style>