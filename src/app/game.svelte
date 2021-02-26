<script lang="ts">
  import "phaser";
  import { onMount } from "svelte";
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import type { TowerType } from "../gamelogic/td/tower_defense";
  import Main from "../scenes/main";
  import TD from "../scenes/td";
  let canvas: HTMLCanvasElement, game: any;

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
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

    game = new Phaser.Game(config);
  });

  const toggleTowerSelection = (tower_type: TowerType) => {
    if (gameModelInstance.tower_defense.selection == tower_type) {
      gameModelInstance.tower_defense.selection = null
    } else {
      gameModelInstance.tower_defense.selectForPlacement(tower_type);
    }
  }

  $: selection = gameModelInstance.tower_defense.selection;

</script>

<div>
  <canvas bind:this={canvas} id="game-container" />
  <button class:active={selection === 'basic'} class="base-turret" on:click={() => toggleTowerSelection('basic')}></button>
</div>

<style>
  canvas {
    width: 800px;
    height: 600px;
  }
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  button {
    border: none;
  }
  .base-turret {
    background-image: url('static/shotgun.png');
    height: 32px;
    width: 32px;
  }
  .active {
		background-color: green;
	}
</style>