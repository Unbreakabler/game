<script lang="ts">
  import "phaser";
  import { onMount, onDestroy } from "svelte";
  import { count } from "../gamelogic/store";
  let canvas: any, game, unsubscribe_store: any;

  class Demo extends Phaser.Scene {
    constructor (){
      super('demo');
    }

    create(): void {
      const scoreboard: Phaser.GameObjects.Text = this.add.text(100, 100, "", {
        font: "64px Courier",
        backgroundColor: "#00ff00",
      });

      scoreboard.setDataEnabled();
      scoreboard.data.set("count", $count);
      scoreboard.on("changedata", (game_object: any, key: any, value: any) => {
        scoreboard.setText(["Count: " + scoreboard.data.get("count")]);
      });
      const inc_button = this.add.text(200, 200, "", {
        font: "64px Courier",
        backgroundColor: "#00ff00",
      });
      inc_button.setInteractive();
      inc_button.setText(["Increment"]);
      inc_button.on("pointerup", (pointer: any) => {
        count.increment();
      });
      unsubscribe_store = count.subscribe((c) => {
        scoreboard.data.set("count", c);
      });
    }
  }

  onMount(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      canvas: canvas,
      scene: Demo,
    };

    game = new Phaser.Game(config);
  });

  onDestroy(unsubscribe_store);
</script>

<canvas bind:this={canvas} id="game-container" />
<button on:click={count.increment}>Increment</button>
<div>count: {$count}</div>
