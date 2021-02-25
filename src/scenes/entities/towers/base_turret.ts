import type TD from "../../td";
import Tower from "./turret";

const BASE_RANGE = 200;
const BASE_ATTACK_SPEED = 1000;
const BASE_DAMAGE = 50;

export default class BaseTurret extends Tower {
  public constructor(scene: TD) {
    super(scene, 0, 0, "turret", BASE_RANGE, BASE_ATTACK_SPEED, BASE_DAMAGE);
  }
}
