import '../../node_modules/phaser/dist/phaser.js';
import { gameModel } from '../gamelogic/gamemodel.js';
import { calculateOfflineProgress, svelte_game_loop } from '../gamelogic/gameloop.js';
import { loadFromStorage, saveToStorage } from '../gamelogic/util/saveloadfunctions.js';

class Main extends Phaser.Scene {
    constructor() {
        super({ key: 'main', active: true });
    }
    create() {
        const model = loadFromStorage();
        gameModel.set(model);
        calculateOfflineProgress();
        saveToStorage(model);
        // GAME LOOP INTEGRATION TO SVELTE
        this.game.events.on("step", function (time, delta_t) {
            svelte_game_loop(time, delta_t);
        });
    }
}

export default Main;
//# sourceMappingURL=main.js.map
