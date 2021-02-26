import { __decorate } from '../../node_modules/tslib/tslib.es6.js';
import { serialize, deserialize } from '../../node_modules/class-transformer/esm5/index.js';
import { writable } from '../../node_modules/svelte/store/index.mjs.js';
import { FarmJob } from './village/farmjob.js';
import { get_default_farm_jobs, farmJobTransformer } from './village/farmjobs.js';
import { VillageBuilding } from './village/villagebuilding.js';
import { villageBuildingTransformer, get_default_village_buildings } from './village/villagebuildings.js';
import { Type } from '../../node_modules/class-transformer/esm5/decorators/type.decorator.js';
import { Transform } from '../../node_modules/class-transformer/esm5/decorators/transform.decorator.js';
import { Exclude } from '../../node_modules/class-transformer/esm5/decorators/exclude.decorator.js';

class Wallet {
    constructor() {
        this.money = 0;
        this.money = 0;
    }
}
/**
 * This class holds the data the game needs to function.
 * It will be accessible from anywhere in the game using svelte stores.
 */
class GameModel {
    constructor() {
        this.farm_jobs = new Map();
        this.village_buildings = new Map();
        this.achievables = new Map();
        //Create new empty GameModel
        this.last_saved = Date.now();
        this.wallet = new Wallet();
        this.farm_jobs = get_default_farm_jobs();
        this.village_buildings = get_default_village_buildings();
        this.reloadAchievables();
    }
    reloadAchievables() {
        this.achievables = new Map([...this.farm_jobs]);
    }
    update(delta_t_s) {
        for (const [key, farm_job] of this.farm_jobs.entries()) {
            farm_job.update(delta_t_s);
            farm_job.earnIncome(this.wallet, delta_t_s);
        }
    }
    exportToSave() {
        this.last_saved = Date.now();
        return serialize(this);
    }
    static loadFromSave(data) {
        const model = deserialize(GameModel, data);
        model.reloadAchievables();
        return model;
    }
    setActiveFarmJob(achievable_name) {
        for (const [key, farm_job] of this.farm_jobs.entries()) {
            farm_job.active = false;
        }
        const job = this.farm_jobs.get(achievable_name);
        if (!job)
            throw new Error(`Missing FarmJob ${achievable_name}`);
        job.active = true;
    }
}
__decorate([
    Type(() => Wallet)
], GameModel.prototype, "wallet", void 0);
__decorate([
    Type(() => FarmJob),
    Transform(farmJobTransformer, { toClassOnly: true })
], GameModel.prototype, "farm_jobs", void 0);
__decorate([
    Type(() => VillageBuilding),
    Transform(villageBuildingTransformer, { toClassOnly: true })
], GameModel.prototype, "village_buildings", void 0);
__decorate([
    Exclude()
], GameModel.prototype, "achievables", void 0);
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

export { GameModel, Wallet, gameModel, updateGameModel };
//# sourceMappingURL=gamemodel.js.map
