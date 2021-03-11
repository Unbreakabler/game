<script lang="ts">
  import "phaser";
  import { onMount } from "svelte";
  import SlotControls from "../components/slot_controls.svelte";
  import TowerDetails from "../components/tower_details.svelte";
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import Main from "../scenes/main";
  import TD from "../scenes/td";
  let canvas: HTMLCanvasElement, game: any;

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
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
  <SlotControls />
  <TowerDetails />
</div>

<style>
  canvas {
    width: 800px;
    height: 600px;
  }
  div {
    width: 800px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
