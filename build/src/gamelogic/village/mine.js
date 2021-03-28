import { __decorate } from '../../../node_modules/tslib/tslib.es6.js';
import { Achievable } from './achievable.js';
import { Exclude } from '../../../node_modules/class-transformer/esm5/decorators/exclude.decorator.js';
import { Expose } from '../../../node_modules/class-transformer/esm5/decorators/expose.decorator.js';

class Mine extends Achievable {
    constructor(short_name, upgrades, display_name, description, production = 1, production_multiplier = 2) {
        super(short_name);
        this.difficulty_growth_factor = 1;
        this.base_gold_per_level = 10;
        //Saveable Members
        this.active = false; // Whether the mine is enabled or not.
        this.current_timer_ms = 0;
        this.mine_timer_ms = 4000; // time to complete a round of mining
        this.upgrades = upgrades;
        this.display_name = display_name;
        this.description = description;
        this.production = production;
        this.production_multiplier = production_multiplier;
    }
    getDisplayName() {
        return this.display_name;
    }
    getTotalMoneyToNextLevel() {
        //prettier-ignore
        return this.difficulty_growth_factor *
            (this.base_gold_per_level + 10 * Math.log(Math.pow(10, this.level / 10)));
    }
    requestLevelUp(wallet) {
        if (!this.active)
            return;
        if (wallet.money > this.getTotalMoneyToNextLevel()) {
            wallet.money -= this.getTotalMoneyToNextLevel();
            this.level++;
            this.production *= this.production_multiplier;
        }
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
