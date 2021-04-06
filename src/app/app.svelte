<script lang="ts">
  import Tabs from "../components/tabs.svelte";
  import Resources from "../components/resources.svelte";

  import Game from "./game.svelte";

  let url = "/";
</script>

<div class="main-container ">
  <!-- <Resources /> -->
  <!-- <div class="game-container"> -->
    <!-- <div class="village-container">
      <Tabs />
    </div> -->
  <!-- </div> -->
  <Game />
</div>

<style>
  :global(html) {
    height: 100%;
    width: 100%;
  }
  :global(body) {
    --tw-bg-opacity: 1;
    height: 100%;
    width: 100%;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
  }
  .village-container {
    flex-direction: column;
    height: 100%;
    width: 100%;
    margin: auto;
  }
  .main-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .game-container {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
</style>
