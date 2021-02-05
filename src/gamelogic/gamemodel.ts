import { writable } from "svelte/store";
import { loadSaveGame } from "./saveloadfunctions";

class SavedJob {
  public current_level: number = 0;
  public max_level_reached: number = 0;
  public current_exp: number = 0;
}

/**
 * This class holds any data that needs to be saved when the player saves their game.
 * It should only be used for values that must be saved. Anything transient should go directly on the GameModel.
 */
export class SaveData {
  // Used to hold the current money the player has, initialized at 0
  public money: number = 0;

  // Used to hold when the game was last saved, needed to calculate offline progress
  public lastSaved: number = 0;

  public jobs: { [job_id: number]: SavedJob } = {
    1: { current_level: 1, max_level_reached: 0, current_exp: 0 },
    2: { current_level: 1, max_level_reached: 0, current_exp: 0 },
  };
}

/**
 * This class holds the data the game needs to function.
 * It will be accessible from anywhere in the game using svelte stores.
 */
export class GameModel {
  public saveData: SaveData;

  public constructor() {
    // when we first create the game model we need to load any save data from localstorage
    this.saveData = loadSaveGame();
  }

  /**
   * Add money to the save data
   * @param value Amount of money to add
   */
  public addMoney(value: number): void {
    if (!isNaN(value)) {
      this.saveData.money += value;
    }
  }

  /**
   * Takes money from the save data.
   * Returns true if there was enough money, false if not.
   * @param value Amount of money to spend
   */
  public spendMoney(value: number): boolean {
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
export const gameModel = writable(new GameModel());

/**
 * A function that can be called anywhere to update the game model in the svelte store.
 * This will trigger the svelte components to re-evaluate and update their content.
 */
export function updateGameModel(): void {
  gameModel.update((m) => (m = m));
}
