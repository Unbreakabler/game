import { gameModel } from './gamemodel.js';
import { sendMessage } from './notifications.js';
import { saveSaveGame } from './saveloadfunctions.js';
import { jobs } from './jobs.js';

/**
 * Reference to the GameModel.
 * We use the subscribe function so if the store is updated our local instance will also update.
 */
let gameModelInstance;
gameModel.subscribe(m => gameModelInstance = m);
/**
 * How often to auto save the game. 60_000 = 60 seconds.
 */
const autoSaveTime = 60000;
let lastSaved = Date.now();
/**
 * The game loop function that runs multiple times per second in the background.
 */
function svelte_game_loop(current_time, ms_delta_t) {
    // const currentTime = Date.now();
    // if lastSaved was more than 60 seconds ago we should save the game
    if (current_time - lastSaved > autoSaveTime) {
        lastSaved = current_time;
        saveSaveGame(gameModelInstance.saveData);
        sendMessage("Game auto-saved");
    }
    // calculate ms_delta_t based on the current time and the last run time
    // we are using Math.max and Math.min to make sure ms_delta_t is between 0 and 1 seconds
    // ms_delta_t = Math.max(Math.min((currentTime - lastRunTime) / 1000, 1), 0);
    // lastRunTime = currentTime;
    const seconds_delta_t = ms_delta_t / 1000;
    game_update(seconds_delta_t);
}
/**
 * Function to update all game data based on time.
 * This is where all idle calculations should start so they can be
 * used by the main loop and the offline progress function.
 * @param delta_t time in seconds since last update
 */
function game_update(delta_t) {
    jobs.forEach(job => job.update(delta_t));
}

export { svelte_game_loop };
//# sourceMappingURL=gameloop.js.map
