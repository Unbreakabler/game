import { SaveData } from './gamemodel.js';

// import { compress, decompress } from 'lz-string';
/**
 * This is the key the save data will be stored under inside localstorage
 */
const storageName = "sveltedata";
/**
 * Load the save data from localstorage.
 * If no data is found just return a new SaveData with default values.
 */
function loadSaveGame() {
    // using a try/catch in case this fails for some reason
    try {
        // see if data exists first
        const uncompressed_saved_data = localStorage.getItem(storageName);
        if (uncompressed_saved_data) {
            // get data from localstorage, decompress it using lz-string, then parse it back into a javascript object
            // const decompressed_state = decompress(uncompressed_saved_data)
            const decompressed_state = uncompressed_saved_data;
            if (decompressed_state) {
                const saveData = JSON.parse(decompressed_state);
                console.log("SaveData loaded:");
                console.log(saveData);
                // migrate the data so we know it is good to use
                dataMigrate(saveData);
                return saveData;
            }
        }
    }
    catch (error) {
        console.error(error); // log the error so at least we can see it
    }
    // if nothing in storage, or an error occurs, create a new state (for now)
    return new SaveData();
}
/**
 * Saves the data to localstorage
 * @param saveData SaveData
 */
function saveSaveGame(saveData) {
    // if save data exists
    if (saveData) {
        // set the last saved time
        saveData.lastSaved = Date.now();
        try {
            // Use JSON.stringify to turn the object into a string, then compress with lz-string,
            // before setting it in localstorage
            // localStorage.setItem(storageName, compress(JSON.stringify(saveData)));
            localStorage.setItem(storageName, JSON.stringify(saveData));
        }
        catch (error) {
            console.error(error); // log the error so at least we can see it
        }
    }
}
/**
 * This function will help to update any data that was saved before new variables were added.
 * Otherwise this can cause errors when something you expected to be there is not there.
 */
function dataMigrate(saveData) {
    // create a new saveData to use as a reference
    const master = new SaveData();
    // get an array of the properties of saveData
    const keys = Object.getOwnPropertyNames(master);
    // check each property to make sure it exists on the save data
    keys.forEach((prop) => {
        if (typeof saveData[prop] === "undefined") {
            console.log(`${prop} was undefined, adding it to saveData`);
            saveData[prop] = master[prop];
        }
    });
}

export { loadSaveGame, saveSaveGame };
//# sourceMappingURL=saveloadfunctions.js.map
