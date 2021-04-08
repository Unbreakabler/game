<script lang="ts">
  import Game from "./game.svelte";
</script>

<div class="main-container ">
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
  .main-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
