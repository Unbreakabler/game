import type { GameModel } from "../../gamelogic/gamemodel";
import type { SlotProjectileModifier } from "../../gamelogic/td/stats_tower_modifiers";
import type TD from "../td";
import type Enemy from "./enemies/enemy";

class BulletLine extends Phaser.GameObjects.Line {
  private parent!: Bullet;
}

export default class Bullet extends Phaser.GameObjects.Image {
  public dx: number = 0;
  public dy: number = 0;
  public lifespan: number = 0;
  public speed: number = 0;
  public damage: number = 0;
  public range: number = 600;
  public tower_id!: string;

  private td_scene: TD;
  private mods!: SlotProjectileModifier[];
  private chains: number = 0;
  private last_enemy_hit!: Enemy;
  private trail: any;
  private bullet_angle: number = 0;

  public constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "small_bullet");
    // this.width = 50;
    // this.height = 100;
    this.td_scene = scene as TD;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;
    this.speed = Phaser.Math.GetSpeed(this.range, 1);
    this.trail = new Phaser.GameObjects.Rectangle(scene, 0, 0, 0, 0, 0xff0000, 1.0);
    // this.trail.setOrigin(0, 0); 
    this.trail.setActive(true);
    this.trail.setVisible(true);
    this.trail.parent = this;
    scene.add.existing(this.trail);
    scene.physics.add.existing(this.trail);
    this.trail.body.setSize(15, 15);
    this.enableTrailCollision();
  }

  public preDestroy() {
    this.trail.setActive(false);
    this.trail.setVisible(false);
    this.trail.destroy();
  }

  public fire(tower_id: string, x: number, y: number, angle: number, range: number, damage: number, projectile_modifiers: SlotProjectileModifier[]): void {
    this.tower_id = tower_id;
    this.bullet_angle = angle;
    if (!this.mods) this.initialize_mods(projectile_modifiers)
    this.trail.setActive(true);
    this.trail.setVisible(true);

    this.setActive(true); 
    this.setVisible(true);
    this.setPosition(x, y);
    this.setRotation(angle - Phaser.Math.PI2 / 4); // FIXME(jon): not necessary if proj is round
    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);
    this.lifespan = 250;
    this.damage = damage;
    this.range = range;
    console.log('range?', range)
    this.speed = Phaser.Math.GetSpeed(this.range, this.lifespan/1000);
  }

  public update(time: number, delta: number): void {
    this.lifespan -= delta;

    const new_x = this.dx * (this.speed * delta);
    const new_y = this.dy * (this.speed * delta);
    // this.trail.setTo(this.x, this.y, this.x + new_x, this.y + new_y);
    this.trail.setPosition(this.x + new_x / 2, this.y + new_y / 2)
    this.trail.width = Math.max(new_x, new_y);
    this.trail.height = Math.max(new_x, new_y);
    // this.trail.setRotation(this.bullet_angle - Phaser.Math.PI2 / 4)
    this.trail.body.setSize(this.trail.width, this.trail.height);
    // console.log('new trail', this.lifespan, this.x + new_x / 2, this.y + new_y / 2, new_x, new_y);
    this.x += new_x;
    this.y += new_y;

    if (this.lifespan <= 0) {
      console.log('BULLET MISSED');
      this.setActive(false);
      this.setVisible(false);
      this.trail.setActive(false);
      this.trail.setVisible(false);
      this.destroy();
    }
  }
/**
 * Returns damage done by hit.
 * 
 * Retargets and refires projectile for certain modifiers (chain).
 */
  public hit(enemy: Enemy): number | null {
    if (enemy === this.last_enemy_hit) return null;

    let still_alive = false;
    if (this.chains > 0) {
      console.log("PROJ CHAINED")
      const e = this.findClosestEnemyInRange(this.range, enemy);
      if (e) {
        this.last_enemy_hit = enemy;
        still_alive = true
        this.chains--;
        this.bullet_angle = Phaser.Math.Angle.Between(this.x, this.y, e.x, e.y)
        this.fire(this.tower_id, this.x, this.y, this.bullet_angle, this.range, this.damage, this.mods)
      } else {
        this.chains = 0;
      }
    } 
    if (!still_alive) this.destroy();
    return this.damage;
  }

  private initialize_mods(projectile_modifiers: SlotProjectileModifier[] = []) {
    this.mods = projectile_modifiers;
    this.mods.forEach(mod => {
      if (mod.chains) this.chains += mod.chains
    })
  }

  private findClosestEnemyInRange(range: number = 0, current_target: Enemy): Enemy | undefined {
    const enemies = this.td_scene.wave_manager.enemies;
    let closest_enemy: Enemy | undefined;
    let closest_distance = Number.MAX_VALUE;
    for (const e of enemies.getChildren()) {
      if (e === current_target) continue;
      if (e === this.last_enemy_hit) {
        continue;
      };
      const d = Phaser.Math.Distance.Squared(this.x, this.y, e.x, e.y);
      if (d < range*range && d < closest_distance) {
        closest_distance = d;
        closest_enemy = e;
      }
    }
    return closest_enemy;
  }

  private enableTrailCollision() {
    this.td_scene.physics.add.overlap(this.td_scene.wave_manager.enemies, [this.trail], this.td_scene.lineCollision as ArcadePhysicsCallback);
  }
}
