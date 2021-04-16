<script lang='ts'>
  import Button from "smelte/src/components/Button";
  import Mines from "../app/mines.svelte";
  import Modal from './modal.svelte'
  import { GameModel, gameModel } from "../gamelogic/gamemodel";
  import { resetSaveGame, saveToStorage } from "../gamelogic/util/saveloadfunctions";

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  const updateTimestep = (delta: number) => {
    gameModelInstance.tower_defense.time_multiplier += delta
    gameModelInstance.tower_defense.time_multiplier = Math.min(Math.max(gameModelInstance.tower_defense.time_multiplier, 0), 100);
  }

  let showModal: null | string = null;

  const saveGame = (): void => {
    saveToStorage(gameModelInstance);
  }

  const hardReset = (): void => {
    if (window.confirm("You will lose all progress. Are you sure?")) {
      resetSaveGame();
      saveGame();
    }
  }

</script>

<div class="menu">
  <div class="actions">
    <Button on:click={() => showModal = 'mine'}>MINE</Button>
    <Button on:click={() => showModal = 'inventory'}>INVENTORY</Button>
    <Button>DPS METER</Button>
    <Button color="secondary" on:click={() => showModal = 'settings'}>SETTINGS</Button>
  </div>
  <div class="time-controls">
    <Button on:click={() => updateTimestep(-1)} >dec</Button>
    <div>{gameModelInstance.tower_defense.time_multiplier}x</div>
    <Button on:click={() => updateTimestep(1)}>inc</Button>
  </div>
</div>
{#if showModal}
  <Modal on:close={() => showModal = null}>
    {#if showModal === 'mine'}
      <Mines />
    {:else if showModal === 'inventory'}
      INVENTORY OR SOMETHING
      <!-- <Inventory /> -->
    {:else if showModal === 'settings'}
      <div class="settings">
        <h4>Settings:</h4>
        <Button color="secondary" on:click={saveGame}>Save</Button>
        <Button color="secondary" on:click={hardReset}>Hard Reset</Button>
      </div>
    {/if}
  </Modal>
{/if}

<style lang='scss'>
  .menu {
    flex: 1;
    padding: 2px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .actions {
    display:flex;
    flex-direction: column;
  }
  .time-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .settings {
    display: flex;
    flex-direction: column;
  }
</style>