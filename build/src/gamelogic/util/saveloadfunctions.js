import { GameModel } from '../gamemodel.js';

// import { compress, decompress } from 'lz-string';
/**
 * This is the key the save data will be stored under inside localstorage
 */
const storageName = "sveltedata";
/**
 * Load the save data from localstorage.
 * If no data is found just return a new SaveData with default values.
 */
function loadFromStorage() {
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
    }
    catch (error) {
        console.error(error); // log the error so at least we can see it
    }
    // if nothing in storage, or an error occurs, create a new state (for now)
    return new GameModel();
}
/**
 * Saves the data to localstorage
 * @param saveData SaveData
 */
function saveToStorage(game_model) {
    try {
        // Use JSON.stringify to turn the object into a string, then compress with lz-string,
        // before setting it in localstorage
        // localStorage.setItem(storageName, compress(JSON.stringify(saveData)));
        localStorage.setItem(storageName, game_model.exportToSave());
    }
    catch (error) {
        console.error(error); // log the error so at least we can see it
    }
}

export { loadFromStorage, saveToStorage };
//# sourceMappingURL=saveloadfunctions.js.map
