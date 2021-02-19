import Turret from './turret.js';

const BASE_RANGE = 200;
const BASE_ATTACK_SPEED = 1000;
const BASE_DAMAGE = 50;
class BaseTurret extends Turret {
    constructor(scene) {
        super(scene, 0, 0, 'turret', BASE_RANGE, BASE_ATTACK_SPEED, BASE_DAMAGE);
    }
}

export default BaseTurret;
//# sourceMappingURL=base_turret.js.map
