import { writable } from '../../node_modules/svelte/store/index.mjs.js';
import { loadSaveGame } from './saveloadfunctions.js';

/**
 * This class holds any data that needs to be saved when the player saves their game.
 * It should only be used for values that must be saved. Anything transient should go directly on the GameModel.
 */
class SaveData {
    constructor() {
        // Used to hold the current money the player has, initialized at 0
        this.money = 0;
        // Used to hold when the game was last saved, needed to calculate offline progress
        this.lastSaved = 0;
        this.jobs = {
            1: { current_level: 1, max_level_reached: 0, current_exp: 0 },
            2: { current_level: 1, max_level_reached: 0, current_exp: 0 },
        };
    }
}
/**
 * This class holds the data the game needs to function.
 * It will be accessible from anywhere in the game using svelte stores.
 */
class GameModel {
    constructor() {
        // when we first create the game model we need to load any save data from localstorage
        this.saveData = loadSaveGame();
    }
    /**
     * Add money to the save data
     * @param value Amount of money to add
     */
    addMoney(value) {
        if (!isNaN(value)) {
            this.saveData.money += value;
        }
    }
    /**
     * Takes money from the save data.
     * Returns true if there was enough money, false if not.
     * @param value Amount of money to spend
     */
    spendMoney(value) {
        if (!isNaN(value) && this.saveData.money >= value) {
            this.saveData.money -= value;
            return true;
        }
        return false;
    }
}
/**
 * A writable store of the gameModel that can be accessed from other parts of the application.
 */
const gameModel = writable(new GameModel());
/**
 * A function that can be called anywhere to update the game model in the svelte store.
 * This will trigger the svelte components to re-evaluate and update their content.
 */
function updateGameModel() {
    gameModel.update((m) => (m = m));
}

export { GameModel, SaveData, gameModel, updateGameModel };
//# sourceMappingURL=gamemodel.js.map
