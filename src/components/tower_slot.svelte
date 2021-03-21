<script lang='ts'>
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import type { TowerInfo, TowerId } from "../gamelogic/td/tower_defense";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  const toggleTowerSelection = (tower_id: string | null) => {
    if (tower_id && gameModelInstance.tower_defense.selection?.id != tower_id) {
      gameModelInstance.tower_defense.setSelection(tower_id as TowerId)
    } else {
      gameModelInstance.tower_defense.selection = null  
    }
  }

  // Why doesn't this guard work on line 32?
  function isTower(tower: TowerInfo | undefined | null | string): tower is TowerInfo {
    return tower ? (tower as TowerInfo).status.tier !== undefined : false
  }

  export let tower_info: TowerInfo | null;
  export let tower_id: string | null;

  $: selection_id = gameModelInstance.tower_defense.selection?.id || null;
</script>

<div class:bb={tower_id && selection_id === tower_id} class="item" on:click={() => toggleTowerSelection(tower_id)}>
  {#if isTower(tower_info)}
    <span>Tier: {tower_info.status.tier}</span>
    <button class={tower_info.status.type}></button>
  {:else if tower_info === null}
    X <!-- Empty slot - TODO(jon): use a "lock" icon -->
  {/if}
</div>

<style lang='scss'>
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
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

  %full-fill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  $anime-time: 8s;

  $box-size: 75px;
  $clip-distance: .05;
  $clip-size: $box-size * (1 + $clip-distance * 2);
  $path-width: 2px;

  $selected-colour: #69ca62;
  $unselected-colour: #b9b9b9;

  .item {
    position: relative;
    width: $box-size;
    height: $box-size;
    margin: auto;
    color: $unselected-colour;
    box-shadow: inset 0 0 0 1px rgba($unselected-colour, .5);
  }

  .bb {
    color: $selected-colour;
    box-shadow: inset 0 0 0 1px rgba($selected-colour, .5);

    &::before,
    &::after {
      @extend %full-fill;
      content: '';
      z-index: -1;
      margin: -1 * $clip-distance * 100%;
      box-shadow: inset 0 0 0 $path-width; 
      animation: clipMe $anime-time linear infinite;
    }

    &::before {
      animation-delay: $anime-time * -.5;
    }
  }

  @keyframes clipMe {
    0%, 100% {clip: rect(0px, $clip-size, $path-width, 0px); }
    25% {clip: rect(0px, $path-width, $clip-size, 0px); }
    50% {clip: rect($clip-size - $path-width, $clip-size, $clip-size, 0px); }
    75% {clip: rect(0px, $clip-size, $clip-size, $clip-size - $path-width); }
  }
</style>