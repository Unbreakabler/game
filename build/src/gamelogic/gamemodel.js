import { __decorate } from '../../node_modules/tslib/tslib.es6.js';
import { serialize, deserialize } from '../../node_modules/class-transformer/esm5/index.js';
import { writable } from '../../node_modules/svelte/store/index.mjs.js';
import { TowerDefense } from './td/tower_defense.js';
import { FarmJob } from './village/farmjob.js';
import { get_default_farm_jobs, farmJobTransformer } from './village/farmjobs.js';
import { Mine } from './village/mine.js';
import { MineTransformer, get_default_mines } from './village/mines.js';
import { VillageBuilding } from './village/villagebuilding.js';
import { villageBuildingTransformer, get_default_village_buildings } from './village/villagebuildings.js';
import { Type } from '../../node_modules/class-transformer/esm5/decorators/type.decorator.js';
import { Transform } from '../../node_modules/class-transformer/esm5/decorators/transform.decorator.js';
import { Exclude } from '../../node_modules/class-transformer/esm5/decorators/exclude.decorator.js';

class Wallet {
    constructor() {
        this.money = 10000;
        this.money = 10000;
    }
}
class Resources {
    constructor() {
        this.dirt = 0;
        this.stone = 0;
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
        this.mines = new Map();
        this.achievables = new Map();
        //Create new empty GameModel
        this.last_saved = Date.now();
        this.wallet = new Wallet();
        this.resources = new Resources();
        this.farm_jobs = get_default_farm_jobs();
        this.village_buildings = get_default_village_buildings();
        this.mines = get_default_mines();
        this.tower_defense = new TowerDefense();
        this.reloadAchievables();
    }
    reloadAchievables() {
        this.achievables = new Map([...this.farm_jobs, ...this.mines]);
    }
    update(delta_t_s) {
        const delta_t_ms = delta_t_s * 1000;
        for (const [key, farm_job] of this.farm_jobs.entries()) {
            farm_job.update(delta_t_s);
            farm_job.earnIncome(this.wallet, delta_t_s);
        }
        for (const [key, mine] of this.mines.entries()) {
            mine.update(this.resources, delta_t_ms);
        }
    }
    exportToSave() {
        this.last_saved = Date.now();
        console.log('saving', this);
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
    activateMine(achievable_name) {
        const mine = this.mines.get(achievable_name);
        if (!mine)
            throw new Error(`Missing mine ${achievable_name}`);
        mine.active = true;
    }
    levelMine(achievable_name) {
        const mine = this.mines.get(achievable_name);
        if (!mine)
            throw new Error(`Missing mine ${achievable_name}`);
        mine.requestLevelUp(this.wallet);
    }
}
__decorate([
    Type(() => Wallet)
], GameModel.prototype, "wallet", void 0);
__decorate([
    Type(() => Resources)
], GameModel.prototype, "resources", void 0);
__decorate([
    Type(() => FarmJob),
    Transform(farmJobTransformer, { toClassOnly: true })
], GameModel.prototype, "farm_jobs", void 0);
__decorate([
    Type(() => VillageBuilding),
    Transform(villageBuildingTransformer, { toClassOnly: true })
], GameModel.prototype, "village_buildings", void 0);
__decorate([
    Type(() => Mine),
    Transform(MineTransformer, { toClassOnly: true })
], GameModel.prototype, "mines", void 0);
__decorate([
    Exclude()
], GameModel.prototype, "achievables", void 0);
__decorate([
    Type(() => TowerDefense)
], GameModel.prototype, "tower_defense", void 0);
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

export { GameModel, Resources, Wallet, gameModel, updateGameModel };
//# sourceMappingURL=gamemodel.js.map
