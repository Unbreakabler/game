<script lang="ts">
  import "phaser";
  import { onMount, onDestroy } from "svelte";
  import { count } from "../gamelogic/store";
  import Demo from "../scenes/demo";
  let canvas: HTMLCanvasElement, game;

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      canvas: canvas,
      scene: Demo,
    };

    game = new Phaser.Game(config);
  });

</script>

<canvas bind:this={canvas} id="game-container" />
<button on:click={count.increment}>Increment</button>
<div>count: {$count}</div>
