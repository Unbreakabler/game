import { GameModel, gameModel, updateGameModel } from "../gamemodel";
// import { compress, decompress } from 'lz-string';

/**
 * This is the key the save data will be stored under inside localstorage
 */
const storageName = "sveltedata";

/**
 * Load the save data from localstorage.
 * If no data is found just return a new SaveData with default values.
 */
export function loadFromStorage(): GameModel {
  // using a try/catch in case this fails for some reason
  try {
    // see if data exists first
    const uncompressed_saved_data = localStorage.getItem(storageName);
    if (uncompressed_saved_data) {
      // get data from localstorage, decompress it using lz-string, then parse it back into a javascript object
      // const decompressed_state = decompress(uncompressed_saved_data)
      const decompressed_state = uncompressed_saved_data;
      if (decompressed_state) {
        const game_model = GameModel.loadFromSave(decompressed_state);
        console.log("Save loaded:");
        console.log(game_model);

        return game_model;
      }
    }
  } catch (error) {
    console.error(error); // log the error so at least we can see it
  }
  // if nothing in storage, or an error occurs, create a new state (for now)
  return new GameModel();
}

/**
 * Saves the data to localstorage
 * @param saveData SaveData
 */
export function saveToStorage(game_model: GameModel): void {
  try {
    // Use JSON.stringify to turn the object into a string, then compress with lz-string,
    // before setting it in localstorage
    // localStorage.setItem(storageName, compress(JSON.stringify(saveData)));
    localStorage.setItem(storageName, game_model.exportToSave());
  } catch (error) {
    console.error(error); // log the error so at least we can see it
  }
}

/**
 * Resets save game in localstorage and resets the gameModel
 */
export function resetSaveGame(): void {
  // remove from local storage
  localStorage.removeItem(storageName);

  // update the stored gameModel with a new one
  gameModel.update((g) => (g = new GameModel()));
}
