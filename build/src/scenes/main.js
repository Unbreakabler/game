import '../../node_modules/phaser/dist/phaser.js';
import { gameModel, updateGameModel } from '../gamelogic/gamemodel.js';
import { calculateOfflineProgress, svelte_game_loop } from '../gamelogic/gameloop.js';
import { loadFromStorage } from '../gamelogic/util/saveloadfunctions.js';

class Main extends Phaser.Scene {
    constructor() {
        super("main");
    }
    create() {
        const scoreboard = this.add.text(10, 10, "", {
            font: "64px Courier",
            backgroundColor: "#00ff00",
        });
        const model = loadFromStorage();
        gameModel.set(model);
        calculateOfflineProgress();
        updateGameModel();
        const unsubscribe_store = gameModel.subscribe((model) => {
            scoreboard.setText(["Money: " + model.wallet.money]);
        });
        this.events.on("destroy", function () {
            unsubscribe_store();
        });
        // GAME LOOP INTEGRATION TO SVELTE
        this.game.events.on("step", function (time, delta_t) {
            svelte_game_loop(time, delta_t);
        });
    }
}

export default Main;
//# sourceMappingURL=main.js.map
