import type TD from "../../td";
import Tower from "./turret";

const BASE_RANGE = 100;
const BASE_ATTACK_SPEED = 100;
const BASE_DAMAGE = 2;

export default class MachineGun extends Tower {
  public constructor(scene: TD) {
    super(scene, 0, 0, "machine_gun", BASE_RANGE, BASE_ATTACK_SPEED, BASE_DAMAGE);
  }
}
