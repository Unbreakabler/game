import { gameModel, updateGameModel } from './gamemodel.js';
import { saveSaveGame } from './saveloadfunctions.js';

/**
 * Reference to the GameModel.
 * We use the subscribe function so if the store is updated our local instance will also update.
 */
let gameModelInstance;
gameModel.subscribe((m) => (gameModelInstance = m));
class Job {
    //prettier-ignore
    constructor(id, name, description, base_exp, base_income, base_exp_rate, multiplier) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.base_exp = base_exp;
        this.base_income = base_income;
        this.base_exp_rate = base_exp_rate;
        this.multiplier = multiplier;
    }
    getCurrentLevel() {
        return gameModelInstance.saveData.jobs[this.id].current_level;
    }
    getCurrentExp() {
        return gameModelInstance.saveData.jobs[this.id].current_exp;
    }
    getMaxLevelReached() {
        return gameModelInstance.saveData.jobs[this.id].max_level_reached;
    }
    /**
     * Get the current price to buy one of these upgrades.
     * Formula to calculate the price is base_exp * (multiplier ^ bought)
     */
    // Memoize these functions
    getTotalExpForLevel(base_exp, multiplier, current_level) {
        return base_exp * Math.pow(multiplier, current_level);
    }
    getCurrentIncome() {
        return this.base_exp * Math.pow(this.multiplier, this.getCurrentLevel());
    }
    getCurrentExpRate() {
        //prettier-ignore
        return this.base_exp_rate
            + (this.base_exp_rate * (0.5 * this.getCurrentLevel())
                + (this.base_exp_rate * (0.1 * (this.getMaxLevelReached() + 1))));
    }
    update(delta_t) {
        const current_level = this.getCurrentLevel();
        if (current_level > 0) {
            const exp_per_second = this.getCurrentExpRate();
            const income_per_second = this.getCurrentIncome();
            let current_exp = this.getCurrentExp();
            current_exp += exp_per_second * delta_t;
            const exp_for_level = this.getTotalExpForLevel(this.base_exp, this.multiplier, current_level);
            if (current_exp > exp_for_level) {
                gameModelInstance.saveData.jobs[this.id].current_level = current_level + 1;
                current_exp -= exp_for_level;
                saveSaveGame(gameModelInstance.saveData);
            }
            gameModelInstance.saveData.jobs[this.id].current_exp = current_exp;
            gameModelInstance.addMoney(income_per_second * delta_t);
            updateGameModel();
        }
    }
}
//prettier-ignore
const jobs = [
    new Job(1, "Starter", "Starting Job", 100, 1, 10, 1.1),
    new Job(2, "Starter2", "Starting Job", 1000, 10, 10, 2.0)
];

export { Job, jobs };
//# sourceMappingURL=jobs.js.map
