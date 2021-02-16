import { __decorate } from '../../../node_modules/tslib/tslib.es6.js';
import { Achievable } from './achievable.js';
import { Expose } from '../../../node_modules/class-transformer/esm5/decorators/expose.decorator.js';
import { Exclude } from '../../../node_modules/class-transformer/esm5/decorators/exclude.decorator.js';

let FarmJob = class FarmJob extends Achievable {
    constructor(short_name, requirements, display_name, description, difficulty_growth_factor, base_exp_rate = 1, base_income = 1, base_time_per_level = 5, start_level = 0) {
        super(short_name, requirements, start_level);
        //Saveable Members
        this.active = false;
        this.current_exp = 0;
        this.max_level = 0;
        this.display_name = display_name;
        this.description = description;
        this.difficulty_growth_factor = difficulty_growth_factor;
        this.base_exp_rate = base_exp_rate;
        this.base_income = base_income;
        this.base_exp_per_level = base_time_per_level;
    }
    getDisplayName() {
        return this.display_name;
    }
    getCurrentLevel() {
        return this.level;
    }
    getMaxLevelReached() {
        return this.max_level;
    }
    /**
     * https://www.desmos.com/calculator/lor4dbrqdz
     * formula 5
     **/
    getTotalExpToNextLevel() {
        //prettier-ignore
        return this.difficulty_growth_factor *
            (this.base_exp_per_level + 10 * Math.log(Math.pow(10, this.level / 10))) *
            1 / ((this.max_level + 10) / 10);
    }
    /**
     *  https://www.desmos.com/calculator/lor4dbrqdz
     *  formula 2
     */
    getCurrentIncome() {
        const g = this.difficulty_growth_factor;
        //prettier-ignore
        const result = this.base_income * g +
            0.5 * Math.pow(Math.log(Math.pow(g, g) * this.level + 1), 2) +
            2 * g * Math.pow(g - 1, 2);
        return result / 10;
    }
    getCurrentExpRate() {
        return this.base_exp_rate;
    }
    update(delta_t_s) {
        if (!this.active)
            return;
        const exp_gained = delta_t_s * this.getCurrentExpRate();
        this.current_exp += exp_gained;
        //apply exp until no more level ups
        while (this.current_exp > this.getTotalExpToNextLevel()) {
            this.current_exp -= this.getTotalExpToNextLevel();
            this.level++;
        }
    }
    earnIncome(wallet, delta_t_s) {
        if (!this.active)
            return;
        wallet.money += this.getCurrentIncome() * delta_t_s;
    }
};
__decorate([
    Expose()
], FarmJob.prototype, "active", void 0);
__decorate([
    Expose()
], FarmJob.prototype, "current_exp", void 0);
__decorate([
    Expose()
], FarmJob.prototype, "max_level", void 0);
FarmJob = __decorate([
    Exclude()
], FarmJob);

export { FarmJob };
//# sourceMappingURL=farmjob.js.map
