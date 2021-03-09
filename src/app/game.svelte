<script lang="ts">
  import "phaser";
  import { onMount } from "svelte";
  import SlotControls from "../components/slot_controls.svelte";
  import TowerDetails from '../components/tower_details.svelte'
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import Main from "../scenes/main";
  import TD from "../scenes/td";
  let canvas: HTMLCanvasElement, game: any;

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  const contextCreationConfig = {
    alpha: false,
    depth: false,
    antialias: true,
    premultipliedAlpha: true,
    stencil: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default'
  };

  
  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade'
      },
      canvas: canvas,
      scene: [
        TD,
        Main,
      ]
    };

    const context = canvas.getContext('webgl', contextCreationConfig);
    if (context) config.context = context as CanvasRenderingContext2D;
    
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