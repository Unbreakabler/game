import Enemy from "./enemy";
import type TD from "../../td";

export default class GreenKnight extends Enemy {
  public constructor(scene: TD) {
    super(scene, 0, 0, "green-knight");
    this.anims.play("green-knight-walking");
  }
}
