<script lang="ts">
  import "phaser";
  import { onMount } from "svelte";
  import Main from "../scenes/main";
  import TD from "../scenes/td";
  let canvas: HTMLCanvasElement, game, unsubscribe_store: any;

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
      },
      canvas: canvas,
      scene: [TD, Main],
    };

    game = new Phaser.Game(config);
  });
</script>

<div>
  <canvas bind:this={canvas} id="game-container" />
</div>

<style>
  canvas {
    width: 800px;
    height: 600px;
    z-index: 20;
  }
  div {
    display: flex;
    justify-content: center;
  }
</style>
