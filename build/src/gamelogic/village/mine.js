import { __decorate } from '../../../node_modules/tslib/tslib.es6.js';
import { Achievable } from './achievable.js';
import { Exclude } from '../../../node_modules/class-transformer/esm5/decorators/exclude.decorator.js';
import { Expose } from '../../../node_modules/class-transformer/esm5/decorators/expose.decorator.js';

class Mine extends Achievable {
    constructor(short_name, upgrades, display_name, description, difficulty_growth_factor = 1, active = false, production = 1, production_multiplier = 2) {
        super(short_name);
        this.base_gold_per_level = 10;
        this.current_timer_ms = 0;
        this.mine_timer_ms = 4000; // time to complete a round of mining
        this.upgrades = upgrades;
        this.display_name = display_name;
        this.description = description;
        this.difficulty_growth_factor = difficulty_growth_factor;
        this.active = active;
        this.production = production;
        this.production_multiplier = production_multiplier;
    }
    getDisplayName() {
        return this.display_name;
    }
    getTotalMoneyToLevel(levels_to_calc = 1) {
        //prettier-ignore
        let total = 0;
        let starting_level = this.level;
        while (levels_to_calc > 0) {
            total += this.difficulty_growth_factor *
                (this.base_gold_per_level + 10 * Math.log(Math.pow(10, starting_level / 10)));
            levels_to_calc--;
            starting_level++;
        }
        return total;
    }
    getMaxLevelAffordable(money) {
        let level = 0;
        while (money > this.getTotalMoneyToLevel(level)) {
            level++;
        }
        return level;
    }
    requestLevelUp(wallet, level = 1) {
        const cost = this.getTotalMoneyToLevel(level);
        console.log('requestLevelUp', wallet, cost);
        if (wallet.money >= cost) {
            wallet.money -= cost;
            this.level++;
            if (this.level > 1)
                this.production *= this.production_multiplier;
            this.active = true;
        }
    }
    manuallyMine() {
        if (!this.active)
            return;
        // TODO(jon): instead of adding 1 second every click this should be upgradeable
        this.current_timer_ms = this.current_timer_ms + 1000;
    }
    update(resources, delta_t_ms) {
        if (!this.active)
            return;
        this.current_timer_ms += delta_t_ms;
        while (this.current_timer_ms > this.mine_timer_ms) {
            // inc resource for the mine
            this.current_timer_ms -= this.mine_timer_ms;
            if (resources[this.short_name] !== undefined) {
                resources[this.short_name] = resources[this.short_name] + this.production;
            }
        }
    }
}
__decorate([
    Exclude()
], Mine.prototype, "display_name", void 0);
__decorate([
    Exclude()
], Mine.prototype, "description", void 0);
__decorate([
    Exclude()
], Mine.prototype, "upgrades", void 0);
__decorate([
    Exclude()
], Mine.prototype, "difficulty_growth_factor", void 0);
__decorate([
    Exclude()
], Mine.prototype, "base_gold_per_level", void 0);
__decorate([
    Expose()
], Mine.prototype, "active", void 0);
__decorate([
    Expose()
], Mine.prototype, "current_timer_ms", void 0);
__decorate([
    Expose()
], Mine.prototype, "mine_timer_ms", void 0);
__decorate([
    Expose()
], Mine.prototype, "production", void 0);
__decorate([
    Expose()
], Mine.prototype, "production_multiplier", void 0);

export { Mine };
//# sourceMappingURL=mine.js.map
