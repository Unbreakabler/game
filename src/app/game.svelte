<script lang="ts">
  import "phaser";
  import { onMount } from "svelte";
  import SlotControls from "../components/slot_controls.svelte";
  import TowerDetails from "../components/tower_details.svelte";
  import Frames from '../components/frames.svelte';
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import Main from "../scenes/main";
  import TD from "../scenes/td";
  import WaveIndicator from '../components/wave_indicator.svelte'
  import { OutlinePipeline } from '../plugins/outline'
  import Resources from "../components/resources.svelte";

  let canvas: HTMLCanvasElement, game: any;

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.WEBGL,
      width: 1920,
      height: 1080,
      scale: {
        parent: 'parent',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.NO_CENTER,
      },
      physics: {
        default: "arcade",
      },
      canvas: canvas,
      scene: [TD, Main],
      pipeline: [OutlinePipeline]
    };

    game = new Phaser.Game(config);
  });

</script>

<div class="main">
  <div class="indicator">
    <WaveIndicator />
  </div>
  <div class="parent" id="parent">
    <canvas bind:this={canvas} id="game-container" />
    <div class="resources">
      <Resources />
    </div>
    <div class="details">
      <TowerDetails />
    </div>
    <div class="inventory">
      <div class="column">
        <SlotControls />
      </div>
    </div>
  </div>
  <div class="frames">
    <Frames />
  </div>
</div>

<style lang='scss'>
  .main {
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) minmax(100px, 0.5fr);
    grid-template-areas: 
      "indicator parent"
      "frames parent";
  }
  .indicator {
    display: flex;
    grid-area: indicator;
    overflow-y: hidden;
  }
  .parent {
    grid-area: parent;
    position: relative;
  }
  .inventory {
    grid-area: inventory;
    position: absolute;
    bottom: 0px;
    left: 0px;
  }
  .frames {
    grid-area: frames;
  }
  canvas {
    z-index: -1;
  }
  .resources {
    position: absolute;
    right: 250px;
    top: 0px;
  }
  .details {
    position: absolute;
    right: 0px;
    top: 0px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>