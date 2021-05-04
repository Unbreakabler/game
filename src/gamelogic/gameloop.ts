import { gameModel, GameModel, updateGameModel } from "./gamemodel";
import { sendMessage } from "./util/notifications";
import { formatWhole } from "./util/utils";
import { saveToStorage } from "./util/saveloadfunctions";

/**
 * Reference to the GameModel.
 * We use the subscribe function so if the store is updated our local instance will also update.
 */
let gameModelInstance: GameModel;
gameModel.subscribe((m) => (gameModelInstance = m));

/**
 * How often to auto save the game. 60_000 = 60 seconds.
 */
const autoSaveTime = 60_000;

// some datetime values we will be using to calculate how much time has passed
//let lastRunTime = Date.now();
let lastSaved = Date.now();
let time_since_last_update_ms = 0;

/**
 * The game loop function that runs multiple times per second in the background.
 */
export function svelte_game_loop(current_time: number, ms_delta_t: number): void {
  // const currentTime = Date.now();

  // if lastSaved was more than 60 seconds ago we should save the game
  if (current_time - lastSaved > autoSaveTime) {
    lastSaved = current_time;
    saveToStorage(gameModelInstance);
    sendMessage("Game auto-saved");
  }

  // calculate ms_delta_t based on the current time and the last run time
  // we are using Math.max and Math.min to make sure ms_delta_t is between 0 and 1 seconds
  // ms_delta_t = Math.max(Math.min((currentTime - lastRunTime) / 1000, 1), 0);
  // lastRunTime = currentTime;

  const seconds_delta_t = ms_delta_t / 1_000;
  time_since_last_update_ms += ms_delta_t
  if (time_since_last_update_ms > 16) {
    game_update(seconds_delta_t); 
    time_since_last_update_ms = 0;
  }
}

/**
 * Function to update all game data based on time.
 * This is where all idle calculations should start so they can be
 * used by the main loop and the offline progress function.
 * @param seconds_delta_t time in seconds since last update
 */
function game_update(seconds_delta_t: number): void {
  gameModelInstance.update(seconds_delta_t);
  updateGameModel(); // We could update the UI less frequently? maybe every 16ms at most?
}

/**
 * Function to calculate the offline progress
 */
export function calculateOfflineProgress(): void {
  // note how much we had before
  const moneyBefore = gameModelInstance.wallet.money;

  // calculate time in seconds since last saved
  const currentTime = Date.now();
  const offlineDeltaT = Math.max((currentTime - gameModelInstance.last_saved) / 1000, 0);

  console.log(`Offline for ${offlineDeltaT} seconds`);

  // perform the game update for the total time
  game_update(offlineDeltaT);

  // calculate total earned
  const moneyEarned = gameModelInstance.wallet.money - moneyBefore;

  console.log(`You have earned $${formatWhole(moneyEarned)} while offline!`);
  sendMessage(`You have earned $${formatWhole(moneyEarned)} while offline!`);
}
