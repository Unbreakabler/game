<script lang="ts">
  import Card from "smelte/src/components/Card";
  import Button from "smelte/src/components/Button";
  import type { VillageBuilding } from "../gamelogic/village/villagebuilding";
  import { loop_guard } from "svelte/internal";
  import { gameModel, GameModel, updateGameModel, Wallet } from "../gamelogic/gamemodel";
  import type { Upgrade } from "../gamelogic/village/villagebuildings";

  export let building: VillageBuilding;

  $: subheader = `Lv. ${building.level}`;

  export let selected: string;

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  function upgrade(building: VillageBuilding) {
    building.upgrade(gameModelInstance.wallet);
    updateGameModel();
  }

  $: can_afford = () => {
    const next = building.getNextUpgrade();
    if (!next) return false;
    return gameModelInstance.wallet.money >= next.money_cost;
  };
</script>

<div class="my-card">
  <Card.Card class="bg-white">
    <div slot="title"><Card.Title title={building.getDisplayName()} {subheader} /></div>
    <div slot="text" class="pb-0 pt-0 p-5">Cost to upgrade: {building.getUpgradeMoneyCostAsString()}</div>
    <div slot="actions">
      <div class="p-2">
        <Button
          text
          disabled={building.level == 0}
          on:click={() => {
            selected = building.short_name;
          }}>Visit</Button
        >
        <Button disabled={!can_afford()} text on:click={upgrade(building)}>Upgrade</Button>
      </div>
    </div>
  </Card.Card>
</div>

<style>
</style>
