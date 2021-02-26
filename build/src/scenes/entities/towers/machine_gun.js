import Turret from './turret.js';

const BASE_RANGE = 100;
const BASE_ATTACK_SPEED = 100;
const BASE_DAMAGE = 2;
class MachineGun extends Turret {
    constructor(scene) {
        super(scene, 0, 0, "machine_gun", BASE_RANGE, BASE_ATTACK_SPEED, BASE_DAMAGE);
    }
}

export default MachineGun;
//# sourceMappingURL=machine_gun.js.map
