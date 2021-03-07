<script lang="ts">
  import Tabs from "./app_tabs.svelte";
  import Resources from "../components/resources.svelte";

  import Game from "./game.svelte";

  let url = "/";
</script>

<div class="main-container">
  <Resources />
  <div class="game-container">
    <div class="village-container">
      <Tabs />
    </div>
    <Game />
  </div>
</div>

<style>
  :global(body) {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .village-container {
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  .main-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .game-container {
    display: flex;
    flex: 1;
  }
  @media only screen and (max-width: 1600px) {
    .game-container {
      flex-direction: column;
    }
    .village-container {
      /* max-width: 1200px; */
      margin: auto;
    }
  }
  .menu {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>
