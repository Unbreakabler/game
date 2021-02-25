import { __decorate } from '../../../node_modules/tslib/tslib.es6.js';
import { formatNumber } from '../util/utils.js';
import { Achievable } from './achievable.js';
import { Expose } from '../../../node_modules/class-transformer/esm5/decorators/expose.decorator.js';

class VillageBuilding extends Achievable {
    constructor(short_name, upgrades, display_name, description) {
        super(short_name);
        this.active = false;
        this.current_build_time = 0;
        this.is_upgrading = false;
        this.upgrades = upgrades;
        this.display_name = display_name;
        this.description = description;
    }
    getDisplayName() {
        return this.display_name;
    }
    upgrade(wallet) {
        const next_upgrade = this.getNextUpgrade();
        if (!next_upgrade)
            return false;
        if (wallet.money >= next_upgrade.money_cost) {
            wallet.money -= next_upgrade.money_cost;
            this.level++;
            return true;
        }
        return false;
    }
    getNextUpgrade() {
        if (this.level > this.upgrades.length)
            return undefined;
        return this.upgrades[this.level];
    }
    getUpgradeMoneyCostAsString() {
        const next_upgrade = this.getNextUpgrade();
        if (!next_upgrade)
            return "Max Level Reached.";
        return formatNumber(next_upgrade.money_cost, 0);
    }
}
__decorate([
    Expose()
], VillageBuilding.prototype, "active", void 0);
__decorate([
    Expose()
], VillageBuilding.prototype, "current_build_time", void 0);
__decorate([
    Expose()
], VillageBuilding.prototype, "is_upgrading", void 0);

export { VillageBuilding };
//# sourceMappingURL=villagebuilding.js.map
