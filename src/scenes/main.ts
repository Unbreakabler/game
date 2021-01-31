import "phaser";

// import { count } from "../gamelogic/store";
// import { GameModel } from ''
import { gameModel } from "../gamelogic/gamemodel";
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

    const unsub = gameModel.subscribe((model) => {
      scoreboard.data.set("count", model.saveData.money);
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
    // GAME LOOP INTEGRATION TO SVELTE

    this.game.events.on("step", function (time: number, delta_t: number) {
      svelte_game_loop(time, delta_t);
    });
  }
}
