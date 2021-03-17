import Enemy from "./enemy";
import type TD from "../../td";

export default class GenericEnemy extends Enemy {
  public constructor(scene: TD) {
    super(scene, 0, 0, "green_knight");
  }
}
