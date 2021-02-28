<script lang="ts">
  import Button from "smelte/src/components/Button";
  import Card from "smelte/src/components/Card";
  import { gameModel, GameModel, updateGameModel } from "../../gamelogic/gamemodel";
  import type { VillageBuilding } from "../../gamelogic/village/villagebuilding";

  export let building: VillageBuilding;

  $: subheader = `Lv. ${building.level}`;

  export let selected: unknown;

  let gameModelInstance: GameModel;
  gameModel.subscribe((m) => (gameModelInstance = m));

  function upgrade(building: VillageBuilding) {
    building.upgrade(gameModelInstance.wallet);
    updateGameModel();
  }

  $: display_name = building.getDisplayName();
  $: can_afford = building.canAffordNextUpgrade(gameModelInstance.wallet);
  $: cost = building.getUpgradeMoneyCostAsString();
  $: if (Number.isFinite(cost)) {
    cost = `Cost to upgrade: ${cost}`;
  }
</script>

<div class="my-card">
  <Card.Card class="bg-white mt-5 min-w-max">
    <div slot="title"><Card.Title title={display_name} {subheader} /></div>
    <div slot="text" class="pb-0 pt-0 p-5">{cost}</div>
    <div slot="actions">
      <div class="p-2 whitespace-nowrap">
        <Button
          text
          disabled={building.level == 0}
          on:click={() => {
            selected = building.short_name;
          }}>Visit</Button
        >
        <Button disabled={!can_afford} text on:click={() => upgrade(building)}>Upgrade</Button>
      </div>
    </div>
  </Card.Card>
</div>

<style>
  .my-card {
    flex-basis: 50%;
    display: inline-flex;
    justify-content: center;
  }
  @media only screen and (min-width: 1200px) and (max-width: 1600px) {
    .my-card {
      flex-basis: 25%;
    }
  }
</style>
