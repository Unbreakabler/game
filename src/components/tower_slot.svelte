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

<div class:selected={tower_id && selection_id === tower_id} class:selectable={tower_info} class="item" on:click={() => toggleTowerSelection(tower_id)}>
  {#if isTower(tower_info)}
    <button style="background-image: url(static/tower/turrets/{tower_info.status.type}.png)"></button>
  {:else if tower_info === null}
    X <!-- Empty slot - TODO(jon): use a "lock" icon -->
  {/if}
</div>

<style lang='scss'>
  $box-size: 75px;
  $unselected-colour: #fff;
  $selected-colour: lightblue;

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .selectable {
    cursor: pointer;
  }
  button {
    border: none;
    height: $box-size;
    width: $box-size;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .selected {
    background-color: $selected-colour;
  }

  .item {
    position: relative;
    width: $box-size;
    height: $box-size;
  }
</style>