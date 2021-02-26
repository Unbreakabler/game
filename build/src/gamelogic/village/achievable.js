import { __decorate } from '../../../node_modules/tslib/tslib.es6.js';
import { Expose } from '../../../node_modules/class-transformer/esm5/decorators/expose.decorator.js';
import { Exclude } from '../../../node_modules/class-transformer/esm5/decorators/exclude.decorator.js';

/**
 * Achievables would be Jobs, Skills, Talents that have or are
 * a requirement before being unlocked
 **/
class Achievable {
    constructor(short_name, requirements = [], level = 0) {
        this.level = 0;
        //TODO: what  do we want to track to help with achievments??
        //  money earned? etc.
        // do we need to track per prestige level reset
        //public amount_earned: number = 0;
        this.requirements = [];
        this.short_name = short_name;
        this.requirements = requirements;
        this.level = level;
    }
    /**
     * Returns name in the form classname_shortname lowercase
     */
    getAchievableName() {
        return `${this.constructor.name}_${this.short_name}`.toLowerCase();
    }
    isAcquired() {
        return this.level >= 1;
    }
    areRequirementsMet(global_achievables) {
        for (const requirement of this.requirements) {
            const a = global_achievables.get(requirement.achievable_name);
            if (!a)
                throw new Error(`Missing achievable ${requirement.achievable_name}`);
            if (!a.isAcquired())
                return false;
            if (a.level < requirement.level_required)
                return false;
        }
        return true;
    }
}
__decorate([
    Expose()
], Achievable.prototype, "short_name", void 0);
__decorate([
    Expose()
], Achievable.prototype, "level", void 0);
__decorate([
    Exclude()
], Achievable.prototype, "requirements", void 0);

export { Achievable };
//# sourceMappingURL=achievable.js.map
