<script>
  import "phaser";
  import { onMount, onDestroy } from "svelte";
  import { count } from "../gamelogic/store.ts";
  let canvas, game, unsubscribe_store;
  onMount(() => {
    config = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      canvas: canvas,
      scene: {
        create: create,
      },
    };
    function create() {
      const scoreboard = this.add.text(100, 100, "", {
        font: "64px Courier",
        fill: "#00ff00",
      });

      scoreboard.setDataEnabled();
      scoreboard.data.set("count", $count);
      scoreboard.on("changedata", (game_object, key, value) => {
        scoreboard.setText(["Count: " + scoreboard.data.get("count")]);
      });
      const inc_button = this.add.text(200, 200, "", {
        font: "64px Courier",
        fill: "#00ff00",
      });
      inc_button.setInteractive();
      inc_button.setText(["Increment"]);
      inc_button.on("pointerup", (pointer) => {
        count.increment();
      });
      unsubscribe_store = count.subscribe((c) => {
        scoreboard.data.set("count", c);
      });
    }

    game = new Phaser.Game(config);
  });
  onDestroy(unsubscribe_store);
</script>

<canvas bind:this={canvas} id="game-container" />
<button on:click={count.increment}>Increment</button>
<div>count: {$count}</div>
