import "phaser";
import { gameModel, updateGameModel } from "../gamelogic/gamemodel";
import { calculateOfflineProgress, svelte_game_loop } from "../gamelogic/gameloop";
import { loadFromStorage, saveToStorage } from "../gamelogic/util/saveloadfunctions";

export default class Main extends Phaser.Scene {
  public constructor() {
    super({ key: 'main', active: true });
  }

  public create(): void {
    const model = loadFromStorage();
    gameModel.set(model);
    calculateOfflineProgress();
    saveToStorage(model);

    // GAME LOOP INTEGRATION TO SVELTE
    this.game.events.on("step", function (time: number, delta_t: number) {
      svelte_game_loop(time, delta_t);
    });
  }
}
