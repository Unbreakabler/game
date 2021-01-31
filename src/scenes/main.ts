import "phaser";
import { count } from "../gamelogic/store";
import { svelte_game_loop } from "../gamelogic/gameloop";

export default class Main extends Phaser.Scene {
  public constructor() {
    super("main");
  }

  public create(): void {
    const scoreboard: Phaser.GameObjects.Text = this.add.text(10, 10, "", {
      font: "64px Courier",
      backgroundColor: "#00ff00",
    });

    scoreboard.setDataEnabled();
    scoreboard.data.set("count", 0);

    scoreboard.on("changedata", (sb: Phaser.GameObjects.Text, key: string, value: number) => {
      sb.setText([`Count: ${value}`]);
    });

    // This is a memory leak, we need to destroy this subscription when the scene unmounts
    const unsub = count.subscribe((c) => {
      scoreboard.data.set("count", c);
    });

    this.events.addListener("destroy", () => {
      unsub();
    });

    const inc_button = this.add.text(10, 110, "", {
      font: "64px Courier",
      backgroundColor: "#00ff00",
    });
    inc_button.setInteractive();
    inc_button.setText(["Increment"]);
    inc_button.on("pointerup", () => {
      count.increment();
    });

    // GAME LOOP INTEGRATION TO SVELTE
    this.game.events.on("step", function (time: number, delta_t: number) {
      svelte_game_loop(time, delta_t);
      // console.log(time, delta)
      // call update in svelte land
    });
  }
}
