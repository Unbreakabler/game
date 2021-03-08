import { GameModel, gameModel } from "../../gamelogic/gamemodel";
import type { TowerInfo } from "../../gamelogic/td/tower_defense";

export default class Bullet extends Phaser.GameObjects.Image {
  public dx: number = 0;
  public dy: number = 0;
  public lifespan: number = 0;
  public speed: number = 0;
  public damage: number = 0;
  private tower_id!: string;
  private tower!: TowerInfo | undefined;

  public constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "small_bullet");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;
    this.speed = Phaser.Math.GetSpeed(600, 1);

    gameModel.subscribe((m) => {
      this.tower = m.tower_defense.getTower(this.tower_id)
      // TODO(jon): move this damage tracking into the tower state object
    });
  }

  public fire(tower_id: string, x: number, y: number, angle: number, range: number, damage: number): void {
    this.tower_id = tower_id;
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.setRotation(angle - Phaser.Math.PI2 / 4); // FIXME(jon): not necessary if proj is round
    this.dx = Math.cos(angle); //
    this.dy = Math.sin(angle);
    this.lifespan = range * 1.3;
    this.damage = damage;
  }

  public update(time: number, delta: number): void {
    this.lifespan -= delta;

    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);

    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  // returns damage
  public hit(): number {
    if (this.tower) {
      if (!this.tower.damage_dealt_this_prestige) {
        this.tower.damage_dealt_this_prestige = 0
      }
      this.tower.damage_dealt_this_prestige += this.damage;
    }
    this.destroy();
    return this.damage;
  }
}
