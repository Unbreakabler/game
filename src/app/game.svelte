<script lang="ts">
  import "phaser";
  import { onMount, onDestroy } from "svelte";
  import { count } from "../gamelogic/store";
  import Main from "../scenes/main";
  let canvas: any, game, unsubscribe_store: any;

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      canvas: canvas,
      scene: Main,
    };

    game = new Phaser.Game(config);
  });

  onDestroy(unsubscribe_store);
</script>

<canvas bind:this={canvas} id="game-container" />
<button on:click={count.increment}>Increment</button>
