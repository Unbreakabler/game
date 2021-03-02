<script lang="ts">
  import "phaser";
  import { onMount } from "svelte";
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import type { TowerType, TowerInfo } from "../gamelogic/td/tower_defense";
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
    if (gameModelInstance.tower_defense.selection?.type == tower_type) {
      gameModelInstance.tower_defense.selection = null
    } else {
      gameModelInstance.tower_defense.selectHighestTierForPlacement(tower_type);
    }
  }

  function isTower(tower: TowerInfo | undefined | null | string): tower is TowerInfo {
    return tower ? (tower as TowerInfo).tier !== undefined : false
  }

  const towerInfo = (tower_id: string) => gameModelInstance.tower_defense.getTower(tower_id)

  $: selection_id = gameModelInstance.tower_defense.selection?.id || null;
  $: slots = gameModelInstance.tower_defense.slots || []
  $: slot_tower_info = slots.map(slot_id => slot_id ? towerInfo(slot_id): null)

  type ZippedTowerInfo = [string, TowerInfo | undefined | null]
  // idk how to define this type but the inferred type is incorrect it seems.
  $: zipped_slot_id_tower_info = slots.map((s, i) => [s, slot_tower_info[i]])

</script>

<!-- Need to update this. 
Should show a button for each slot, 
if the slot has an id show the associated image for the tower type,
if the slot does not have an id show an X or something.
When the tower is placed grey out the icon and make it non interactive
When the tower is not placed make the button normal white
when the tower is select highlight the slot with a border.

-->

<div>
  <canvas bind:this={canvas} id="game-container" />
  <div class="towers">
    {#each zipped_slot_id_tower_info as [tower_id, tower_info]}
      {#if isTower(tower_info)}
        {tower_info.tier}
        <button class:active={selection_id === tower_id} class={tower_info.type} on:click={() => toggleTowerSelection(tower_info.type)}></button>
      {:else if tower_info === null}
        X <!-- Empty slot -->
      {:else}
        BUSTED REEQUIP <!-- Something broke with the ID look up, error state. -->
      {/if}
    {/each}
    <!-- <button class:active={selection === 'basic'} class="basic" on:click={() => toggleTowerSelection('basic')}></button>
    <button class:active={selection === 'machine_gun'} class="machine-gun" on:click={() => toggleTowerSelection('machine_gun')}></button> -->
  </div>
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
    height: 32px;
    width: 32px;
  }
  .basic {
    background-image: url('static/shotgun.png');
  }
  .machine_gun {
    background-image: url('static/machine_gun.png');
  }
  .active {
		background-color: green;
	}
  .towers {
    display: flex;
    flex-direction: row;
    justify-content: left;
  }
</style>