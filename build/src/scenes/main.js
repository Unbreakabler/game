import '../../node_modules/phaser/dist/phaser.js';
import { gameModel } from '../gamelogic/gamemodel.js';
import { svelte_game_loop } from '../gamelogic/gameloop.js';

class Main extends Phaser.Scene {
    constructor() {
        super("main");
    }
    create() {
        const scoreboard = this.add.text(10, 10, "", {
            font: "64px Courier",
            backgroundColor: "#00ff00",
        });
        gameModel.subscribe((model) => {
            scoreboard.setText(["Count: " + model.saveData.money]);
        });
        const inc_button = this.add.text(10, 110, "", {
            font: "64px Courier",
            backgroundColor: "#00ff00",
        });
        inc_button.setInteractive();
        inc_button.setText(["Increment"]);
        // GAME LOOP INTEGRATION TO SVELTE
        this.game.events.on("step", function (time, delta_t) {
            svelte_game_loop(time, delta_t);
        });
    }
}

export default Main;
//# sourceMappingURL=main.js.map