import { __decorate } from '../../../node_modules/tslib/tslib.es6.js';
import { Achievable } from './achievable.js';
import { Exclude } from '../../../node_modules/class-transformer/esm5/decorators/exclude.decorator.js';

let Job = class Job extends Achievable {
    static transformer(object) {
        throw new Error("Method not implemented.");
    }
};
Job = __decorate([
    Exclude()
], Job);

export { Job };
//# sourceMappingURL=job.js.map
