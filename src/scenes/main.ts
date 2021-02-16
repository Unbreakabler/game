import "phaser";
import { gameModel, updateGameModel } from "../gamelogic/gamemodel";
import { calculateOfflineProgress, svelte_game_loop } from "../gamelogic/gameloop";
import { loadFromStorage } from "../gamelogic/util/saveloadfunctions";

export default class Main extends Phaser.Scene {
  public constructor() {
    super("main");
  }

  public create(): void {
    const scoreboard: Phaser.GameObjects.Text = this.add.text(10, 10, "", {
      font: "64px Courier",
      backgroundColor: "#00ff00",
    });

    const model = loadFromStorage();
    gameModel.set(model);
    calculateOfflineProgress();

    const unsubscribe_store = gameModel.subscribe((model) => {
      scoreboard.setText(["Money: " + model.wallet.money]);
    });
    this.events.on("destroy", function () {
      unsubscribe_store();
    });

    // GAME LOOP INTEGRATION TO SVELTE
    this.game.events.on("step", function (time: number, delta_t: number) {
      svelte_game_loop(time, delta_t);
    });
  }
}
